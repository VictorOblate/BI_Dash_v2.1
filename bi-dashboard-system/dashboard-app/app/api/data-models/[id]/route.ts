// dashboard-app/app/api/data-models/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const modelId = parseInt(params.id);

    const dataModel = await prisma.dataModel.findUnique({
      where: { id: modelId },
      include: {
        sourceRelationships: {
          include: {
            targetModel: true,
          },
        },
        targetRelationships: {
          include: {
            sourceModel: true,
          },
        },
      },
    });

    if (!dataModel) {
      return NextResponse.json(
        { error: 'Data model not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ dataModel });
  } catch (error) {
    console.error('Error fetching data model:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data model' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const modelId = parseInt(params.id);
    const body = await request.json();

    const dataModel = await prisma.dataModel.update({
      where: { id: modelId },
      data: {
        displayName: body.displayName,
        description: body.description,
        schemaJson: body.schemaJson,
        isActive: body.isActive !== undefined ? (body.isActive ? 1 : 0) : undefined,
        version: body.schemaJson ? { increment: 1 } : undefined,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'update',
        resource: 'data_model',
        resourceId: modelId,
        details: JSON.stringify(body),
        status: 'success',
      },
    });

    return NextResponse.json({ dataModel });
  } catch (error) {
    console.error('Error updating data model:', error);
    return NextResponse.json(
      { error: 'Failed to update data model' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const modelId = parseInt(params.id);

    // Soft delete
    await prisma.dataModel.update({
      where: { id: modelId },
      data: { isActive: 0 },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'delete',
        resource: 'data_model',
        resourceId: modelId,
        status: 'success',
      },
    });

    return NextResponse.json({ message: 'Data model deleted' });
  } catch (error) {
    console.error('Error deleting data model:', error);
    return NextResponse.json(
      { error: 'Failed to delete data model' },
      { status: 500 }
    );
  }
}
// dashboard-app/app/api/data-models/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dataModels = await prisma.dataModel.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ dataModels });
  } catch (error) {
    console.error('Error fetching data models:', error);
    return NextResponse.json({ error: 'Failed to fetch data models' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, displayName, description, schemaJson } = body;

    // Create data model
    const dataModel = await prisma.dataModel.create({
      data: {
        name,
        displayName,
        description,
        schemaJson,
        tableName: `dm_${name.toLowerCase().replace(/\s+/g, '_')}`,
        createdBy: parseInt(session.user.id),
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'create',
        resource: 'data_model',
        resourceId: dataModel.id,
        details: JSON.stringify({ name: dataModel.name }),
        status: 'success',
      },
    });

    return NextResponse.json({ dataModel }, { status: 201 });
  } catch (error) {
    console.error('Error creating data model:', error);
    return NextResponse.json({ error: 'Failed to create data model' }, { status: 500 });
  }
}
// dashboard-app/app/api/dashboards/[id]/route.ts

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

    const dashboardId = parseInt(params.id);

    const dashboard = await prisma.dashboard.findUnique({
      where: { id: dashboardId },
      include: {
        tabs: {
          include: {
            visualizations: true,
          },
          orderBy: { order: 'asc' },
        },
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        permissions: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!dashboard) {
      return NextResponse.json(
        { error: 'Dashboard not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ dashboard });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard' },
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

    const dashboardId = parseInt(params.id);
    const body = await request.json();

    const dashboard = await prisma.dashboard.update({
      where: { id: dashboardId },
      data: {
        name: body.name,
        description: body.description,
        layout: body.layout,
      },
      include: {
        tabs: {
          include: {
            visualizations: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'update',
        resource: 'dashboard',
        resourceId: dashboard.id,
        details: JSON.stringify(body),
        status: 'success',
      },
    });

    return NextResponse.json({ dashboard });
  } catch (error) {
    console.error('Error updating dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to update dashboard' },
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

    const dashboardId = parseInt(params.id);

    // Soft delete
    await prisma.dashboard.update({
      where: { id: dashboardId },
      data: { isActive: 0 },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'delete',
        resource: 'dashboard',
        resourceId: dashboardId,
        status: 'success',
      },
    });

    return NextResponse.json({ message: 'Dashboard deleted' });
  } catch (error) {
    console.error('Error deleting dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to delete dashboard' },
      { status: 500 }
    );
  }
}
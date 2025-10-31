// dashboard-app/app/api/dashboards/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextAuth';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/utils';
import { z } from 'zod';

const dashboardSchema = z.object({
  name: z.string().min(1, 'Dashboard name is required'),
  description: z.string().optional(),
  layout: z.any().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's roles
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      include: {
        roles: {
          include: {
            role: {
              include: {
                dashboardPermissions: {
                  include: {
                    dashboard: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If admin, return all dashboards
    if (isAdmin(session.user.roles)) {
      const dashboards = await prisma.dashboard.findMany({
        where: { isActive: 1 },
        include: {
          tabs: {
            include: {
              visualizations: true,
            },
          },
          creator: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ dashboards });
    }

    // For non-admin users, return only dashboards they have access to
    const accessibleDashboardIds = new Set<number>();
    user.roles.forEach((userRole) => {
      userRole.role.dashboardPermissions.forEach((perm) => {
        const permissions = perm.permissionsJson as any;
        if (permissions.view) {
          accessibleDashboardIds.add(perm.dashboardId);
        }
      });
    });

    const dashboards = await prisma.dashboard.findMany({
      where: {
        id: { in: Array.from(accessibleDashboardIds) },
        isActive: 1,
      },
      include: {
        tabs: {
          include: {
            visualizations: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ dashboards });
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = dashboardSchema.parse(body);

    // Create dashboard
    const dashboard = await prisma.dashboard.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        layout: validatedData.layout || {},
        createdBy: parseInt(session.user.id),
      },
      include: {
        tabs: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'create',
        resource: 'dashboard',
        resourceId: dashboard.id,
        details: JSON.stringify({ name: dashboard.name }),
        status: 'success',
      },
    });

    return NextResponse.json({ dashboard }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating dashboard:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create dashboard' },
      { status: 500 }
    );
  }
}
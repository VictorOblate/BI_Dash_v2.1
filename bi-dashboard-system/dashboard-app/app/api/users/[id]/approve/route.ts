// dashboard-app/app/api/users/[id]/approve/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/utils';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userId = parseInt(params.id);

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.status !== 'pending') {
      return NextResponse.json(
        { error: 'User is not pending approval' },
        { status: 400 }
      );
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: 'active' },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'approve',
        resource: 'user',
        resourceId: userId,
        details: JSON.stringify({ approvedUserEmail: user.email }),
        status: 'success',
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error approving user:', error);
    return NextResponse.json({ error: 'Failed to approve user' }, { status: 500 });
  }
}
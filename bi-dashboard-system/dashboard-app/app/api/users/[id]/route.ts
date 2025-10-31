// dashboard-app/app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextAuth';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/utils';
import { hash } from 'bcryptjs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
  const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        organizationalUnits: {
          include: {
            organizationalUnit: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove sensitive data
    const { passwordHash, resetToken, verificationToken, ...userWithoutSensitiveData } = user;

    return NextResponse.json({ user: userWithoutSensitiveData });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
  const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(params.id);
    const body = await request.json();

    // Check if user is updating their own profile or is admin
    if (parseInt(session.user.id) !== userId && !isAdmin(session.user.roles)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData: any = {};

    if (body.fullName) updateData.fullName = body.fullName;
    if (body.email) {
      // Check if email is already taken
      const existingUser = await prisma.user.findFirst({
        where: {
          email: body.email,
          id: { not: userId },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }

      updateData.email = body.email;
    }

    // Only admins can update status
    if (body.status && isAdmin(session.user.roles)) {
      updateData.status = body.status;
    }

    // Handle password update
    if (body.password) {
      updateData.passwordHash = await hash(body.password, 12);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'update',
        resource: 'user',
        resourceId: userId,
        details: JSON.stringify({ updated: Object.keys(updateData) }),
        status: 'success',
      },
    });

    // Remove sensitive data
    const { passwordHash, resetToken, verificationToken, ...userWithoutSensitiveData } = user;

    return NextResponse.json({ user: userWithoutSensitiveData });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userId = parseInt(params.id);

    // Don't allow deleting self
    if (parseInt(session.user.id) === userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'delete',
        resource: 'user',
        resourceId: userId,
        status: 'success',
      },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
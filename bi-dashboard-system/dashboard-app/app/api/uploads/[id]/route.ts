// dashboard-app/app/api/uploads/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const uploadId = parseInt(params.id);

    const upload = await prisma.uploadHistory.findUnique({
      where: { id: uploadId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        dataModel: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
      },
    });

    if (!upload) {
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 });
    }

    return NextResponse.json({ upload });
  } catch (error) {
    console.error('Error fetching upload:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upload' },
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

    const uploadId = parseInt(params.id);
    const body = await request.json();

    const upload = await prisma.uploadHistory.update({
      where: { id: uploadId },
      data: {
        status: body.status,
        recordsCount: body.recordsCount,
        recordsSuccess: body.recordsSuccess,
        recordsFailed: body.recordsFailed,
        errorLog: body.errorLog,
        completedAt: body.status === 'completed' ? new Date() : null,
      },
    });

    return NextResponse.json({ upload });
  } catch (error) {
    console.error('Error updating upload:', error);
    return NextResponse.json(
      { error: 'Failed to update upload' },
      { status: 500 }
    );
  }
}
// dashboard-app/app/api/uploads/[id]/rollback/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextAuth';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/utils';

export async function POST(
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

    const uploadId = parseInt(params.id);

    const upload = await prisma.uploadHistory.findUnique({
      where: { id: uploadId },
      include: {
        dataModel: true,
      },
    });

    if (!upload) {
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 });
    }

    if (upload.status !== 'completed') {
      return NextResponse.json(
        { error: 'Can only rollback completed uploads' },
        { status: 400 }
      );
    }

    // Update upload status to reverted
    const updatedUpload = await prisma.uploadHistory.update({
      where: { id: uploadId },
      data: { status: 'reverted' },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'rollback',
        resource: 'upload',
        resourceId: uploadId,
        details: JSON.stringify({ fileName: upload.fileName }),
        status: 'success',
      },
    });

    return NextResponse.json({ upload: updatedUpload });
  } catch (error) {
    console.error('Error rolling back upload:', error);
    return NextResponse.json(
      { error: 'Failed to rollback upload' },
      { status: 500 }
    );
  }
}
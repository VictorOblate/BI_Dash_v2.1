// dashboard-app/app/api/uploads/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextAuth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
  const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get('modelId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    if (modelId) where.modelId = parseInt(modelId);
    if (status) where.status = status;

    const uploads = await prisma.uploadHistory.findMany({
      where,
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
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ uploads });
  } catch (error) {
    console.error('Error fetching uploads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch uploads' },
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

    // Note: File upload handling would typically be done through a form with multipart/form-data
    // This is a placeholder for the upload creation endpoint
    const body = await request.json();
    const { modelId, fileName, fileSize } = body;

    const upload = await prisma.uploadHistory.create({
      data: {
        userId: parseInt(session.user.id),
        modelId: modelId ? parseInt(modelId) : null,
        fileName,
        fileSize: fileSize ? BigInt(fileSize) : null,
        status: 'pending',
      },
    });

    return NextResponse.json({ upload }, { status: 201 });
  } catch (error) {
    console.error('Error creating upload:', error);
    return NextResponse.json(
      { error: 'Failed to create upload' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const churchInfo = await prisma.churchInfo.findFirst({
      include: {
        socialMedia: true,
        contactInfo: true,
      },
    });

    return NextResponse.json({ churchInfo });
  } catch (error) {
    console.error('Error fetching church info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const existingInfo = await prisma.churchInfo.findFirst();

    let churchInfo;
    if (existingInfo) {
      churchInfo = await prisma.churchInfo.update({
        where: { id: existingInfo.id },
        data: body,
      });
    } else {
      churchInfo = await prisma.churchInfo.create({
        data: body,
      });
    }

    return NextResponse.json({ churchInfo });
  } catch (error) {
    console.error('Error updating church info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

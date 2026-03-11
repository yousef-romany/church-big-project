import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.PARENT) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { childEmail } = body;

    if (!childEmail) {
      return NextResponse.json({ 
        error: 'childEmail is required' 
      }, { status: 400 });
    }

    const child = await prisma.user.findUnique({
      where: { email: childEmail },
      include: {
        childProfile: true,
      },
    });

    if (!child || child.role !== UserRole.CHILD) {
      return NextResponse.json({ 
        error: 'Child not found or role is not CHILD' 
      }, { status: 404 });
    }

    if (child.childProfile) {
      return NextResponse.json({ 
        error: 'Child already has a profile' 
      }, { status: 400 });
    }

    await prisma.childProfile.create({
      data: {
        userId: child.id,
      },
    });

    return NextResponse.json({ success: true, child });
  } catch (error) {
    console.error('Error linking child:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

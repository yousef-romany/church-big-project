import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = {
      pointsPerAttendance: 10,
      pointsPerEvent: 20,
      allowGuestRegistration: true,
      requireEmailVerification: true,
      maintenanceMode: false,
      maxFileSize: 10485760,
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching system settings:', error);
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
    const settings = body;

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error updating system settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

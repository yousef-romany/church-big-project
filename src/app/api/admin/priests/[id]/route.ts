import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { logAuditEvent } from '@/lib/audit-log';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, address, specialization, experience, education, biography, status } = body;

    const priest = await prisma.user.findUnique({
      where: { id: params.id },
      include: { priestProfile: true },
    });

    if (!priest || priest.role !== UserRole.PRIEST) {
      return NextResponse.json({ error: 'Priest not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone && priest.priestProfile) {
      updateData.priestProfile = {
        update: {
          phone
        }
      };
    }
    if (address && priest.priestProfile) {
      updateData.priestProfile = {
        ...updateData.priestProfile,
        update: {
          address
        }
      };
    }
    if (specialization && priest.priestProfile) {
      updateData.priestProfile = {
        ...updateData.priestProfile,
        update: {
          specialization
        }
      };
    }
    if (experience && priest.priestProfile) {
      updateData.priestProfile = {
        ...updateData.priestProfile,
        update: {
          experience: experience ? parseInt(experience) : null
        }
      };
    }
    if (education && priest.priestProfile) {
      updateData.priestProfile = {
        ...updateData.priestProfile,
        update: {
          education
        }
      };
    }
    if (biography && priest.priestProfile) {
      updateData.priestProfile = {
        ...updateData.priestProfile,
        update: {
          biography
        }
      };
    }

    const updatedPriest = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
    });

    await logAuditEvent({
      userId: session.user.id,
      email: session.user.email || undefined,
      action: 'PRIEST_UPDATED',
      resource: 'PRIEST',
      success: true,
      details: { priestId: params.id, updates: Object.keys(updateData) }
    });

    return NextResponse.json({ 
      priest: {
        id: updatedPriest.id,
        name: updatedPriest.name,
        email: updatedPriest.email,
      }
    });
  } catch (error) {
    console.error('Error updating priest:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const priest = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!priest || priest.role !== UserRole.PRIEST) {
      return NextResponse.json({ error: 'Priest not found' }, { status: 404 });
    }

    await prisma.priestProfile.deleteMany({
      where: { userId: params.id },
    });

    await prisma.user.delete({
      where: { id: params.id },
    });

    await logAuditEvent({
      userId: session.user.id,
      email: session.user.email || undefined,
      action: 'PRIEST_DELETED',
      resource: 'PRIEST',
      success: true,
      details: { priestId: params.id, priestName: priest.name }
    });

    return NextResponse.json({ message: 'Priest deleted successfully' });
  } catch (error) {
    console.error('Error deleting priest:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

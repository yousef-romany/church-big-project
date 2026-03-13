import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.PRIEST) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const priestProfile = await prisma.priestProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!priestProfile) {
      return NextResponse.json({ error: 'Priest profile not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';

    const visitationTasks = await prisma.visitationTask.findMany({
      where: {
        priestId: session.user.id,
      },
      distinct: ['familyId'],
      select: {
        familyId: true,
      },
    });

    const familyIds = visitationTasks.map(t => t.familyId);

    const where: any = {
      id: {
        in: familyIds.length > 0 ? familyIds : undefined,
      },
    };

    if (search) {
      where.OR = [
        { familyName: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const families = await prisma.family.findMany({
      where,
      include: {
        familyMembers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { familyName: 'asc' },
      take: 50,
    });

    const familiesWithCounts = families.map(f => ({
      id: f.id,
      familyName: f.familyName,
      address: f.address,
      phone: f.phone,
      memberCount: f.familyMembers.length,
      members: f.familyMembers.map(fm => ({
        id: fm.user.id,
        name: fm.user.name,
        email: fm.user.email,
        role: fm.role,
      })),
    }));

    const familyStats = {
      total: familiesWithCounts.length,
      totalMembers: familiesWithCounts.reduce(
        (sum, f) => sum + f.memberCount,
        0
      ),
    };

    return NextResponse.json({
      families: familiesWithCounts,
      stats: familyStats,
    });
  } catch (error) {
    console.error('Error fetching priest families:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.PRIEST) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { familyName, address, phone } = body;

    if (!familyName || !address) {
      return NextResponse.json({ 
        error: 'familyName and address are required' 
      }, { status: 400 });
    }

    const family = await prisma.family.create({
      data: {
        familyName,
        address,
        phone,
      },
    });

    return NextResponse.json({ family });
  } catch (error) {
    console.error('Error creating family:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
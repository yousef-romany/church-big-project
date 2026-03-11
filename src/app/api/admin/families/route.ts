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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    const search = searchParams.get('search');

    const where: any = {};
    if (search) {
      where.OR = [
        { familyName: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [families, total] = await Promise.all([
      prisma.family.findMany({
        where,
        skip,
        take: limit,
        orderBy: { familyName: 'asc' },
        include: {
          familyMembers: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
        },
      }),
      prisma.family.count({ where }),
    ]);

    return NextResponse.json({
      families,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching families:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { familyName, address, city, phone, email, notes } = body;

    if (!familyName) {
      return NextResponse.json({ 
        error: 'familyName is required' 
      }, { status: 400 });
    }

    const family = await prisma.family.create({
      data: {
        familyName,
        address,
        city,
        phone,
        email,
        notes,
      },
    });

    return NextResponse.json({ family });
  } catch (error) {
    console.error('Error creating family:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

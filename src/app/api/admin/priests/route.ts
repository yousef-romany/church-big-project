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

    const priests = await prisma.user.findMany({
      where: { role: UserRole.PRIEST },
      include: {
        priestProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ 
      priests: priests.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.priestProfile?.phone,
        address: p.priestProfile?.address,
        specialization: p.priestProfile?.specialization,
        experience: p.priestProfile?.experience,
        education: p.priestProfile?.education,
        biography: p.priestProfile?.biography,
        createdAt: p.createdAt,
      }))
    });
  } catch (error) {
    console.error('Error fetching priests:', error);
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
    const { name, email, password, phone, address, specialization, experience, education, biography } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ 
        error: 'name, email, and password are required' 
      }, { status: 400 });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.PRIEST,
        emailVerified: new Date(),
        priestProfile: {
          create: {
            phone,
            address,
            specialization,
            experience: experience ? parseInt(experience) : null,
            education,
            biography,
          },
        },
      },
      include: {
        priestProfile: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error creating priest:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

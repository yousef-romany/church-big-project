import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'غير مصرح: الوصول للمسؤولين فقط' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const success = searchParams.get('success');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (action) {
      where.action = {
        contains: action,
        mode: 'insensitive'
      };
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate);
      }
    }
    
    if (success !== null && success !== undefined) {
      where.success = success === 'true';
    }

    // Get audit logs with pagination
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            }
          }
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where })
    ]);

    // Get summary statistics
    const [
      totalLogs,
      successCount,
      failureCount,
      uniqueUsers,
      recentLogins
    ] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.count({ where: { success: true } }),
      prisma.auditLog.count({ where: { success: false } }),
      prisma.auditLog.groupBy({
        by: ['userId'],
        where: { 
          timestamp: { 
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      }).then((result: any[]) => result.length),
      prisma.auditLog.count({
        where: {
          action: { contains: 'LOGIN', mode: 'insensitive' },
          success: true,
          timestamp: { 
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      })
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit
      },
      stats: {
        totalLogs,
        successCount,
        failureCount,
        successRate: totalLogs > 0 ? ((successCount / totalLogs) * 100).toFixed(1) : '0',
        uniqueUsers,
        recentLogins
      }
    });
  } catch (error) {
    console.error('Audit Logs Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب سجلات التدقيق' },
      { status: 500 }
    );
  }
}
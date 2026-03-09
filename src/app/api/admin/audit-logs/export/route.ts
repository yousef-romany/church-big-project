import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const success = searchParams.get('success');

    // Build where clause (same as main endpoint)
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

    // Get all matching logs (no pagination for export)
    const logs = await prisma.auditLog.findMany({
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
    });

    // Convert to CSV
    const headers = [
      'ID',
      'Timestamp',
      'Action',
      'Resource',
      'User ID',
      'User Name',
      'User Email',
      'User Role',
      'IP Address',
      'Success',
      'Error Message'
    ];

    const csvRows = logs.map((log: any) => [
      log.id,
      log.timestamp.toISOString(),
      log.action,
      log.resource || '',
      log.userId || '',
      log.user?.name || '',
      log.user?.email || '',
      log.user?.role || '',
      log.ipAddress || '',
      log.success.toString(),
      log.errorMessage || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(','))
    ].join('\n');

    // Return as CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error('Export Audit Logs Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تصدير سجلات التدقيق' },
      { status: 500 }
    );
  }
}
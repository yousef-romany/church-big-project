import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { validateTemplate, extractTemplateVariables } from '@/lib/notifications/template-renderer';

// Validation schemas
const createTemplateSchema = z.object({
  name: z.string().min(1, 'اسم القالب مطلوب'),
  titleTemplate: z.string().min(1, 'قالب العنوان مطلوب'),
  bodyTemplate: z.string().min(1, 'قالب المحتوى مطلوب'),
  type: z.enum(['URGENT', 'INFO', 'REMINDER', 'EVENT', 'APPOINTMENT', 'ANNOUNCEMENT', 'SYSTEM']).default('INFO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  description: z.string().optional(),
});

const updateTemplateSchema = createTemplateSchema.partial();

// GET /api/notifications/templates
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    // Only admins can view templates
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'غير مصرح لك بعرض القوالب' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const where = activeOnly ? { isActive: true } : {};

    const templates = await prisma.notificationTemplate.findMany({
      where,
      orderBy: [
        { isActive: 'desc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('List templates error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب القوالب' },
      { status: 500 }
    );
  }
}

// POST /api/notifications/templates
export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'غير مصرح لك بإنشاء القوالب' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = createTemplateSchema.parse(body);

    // Validate template syntax
    const titleValidation = validateTemplate(data.titleTemplate);
    const bodyValidation = validateTemplate(data.bodyTemplate);

    if (!titleValidation.isValid || !bodyValidation.isValid) {
      return NextResponse.json(
        { 
          message: 'خطأ في صياغة القالب',
          errors: [...titleValidation.errors, ...bodyValidation.errors],
        },
        { status: 400 }
      );
    }

    // Create template
    const template = await prisma.notificationTemplate.create({
      data,
    });

    // Extract variables for documentation
    const titleVars = extractTemplateVariables(data.titleTemplate);
    const bodyVars = extractTemplateVariables(data.bodyTemplate);
    const allVars = [...new Set([...titleVars, ...bodyVars])];

    console.log(`Created notification template: ${template.name}`);

    return NextResponse.json(
      { 
        message: 'تم إنشاء القالب بنجاح',
        template,
        variables: allVars,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create template error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'حدث خطأ أثناء إنشاء القالب' },
      { status: 500 }
    );
  }
}

// PUT /api/notifications/templates/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'غير مصرح لك بتعديل القوالب' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const data = updateTemplateSchema.parse(body);

    // Validate template syntax if provided
    if (data.titleTemplate) {
      const titleValidation = validateTemplate(data.titleTemplate);
      if (!titleValidation.isValid) {
        return NextResponse.json(
          { 
            message: 'خطأ في صياغة قالب العنوان',
            errors: titleValidation.errors,
          },
          { status: 400 }
        );
      }
    }

    if (data.bodyTemplate) {
      const bodyValidation = validateTemplate(data.bodyTemplate);
      if (!bodyValidation.isValid) {
        return NextResponse.json(
          { 
            message: 'خطأ في صياغة قالب المحتوى',
            errors: bodyValidation.errors,
          },
          { status: 400 }
        );
      }
    }

    // Update template
    const template = await prisma.notificationTemplate.update({
      where: { id },
      data,
    });

    console.log(`Updated notification template: ${template.name}`);

    // Extract variables if templates were updated
    let variables: string[] = [];
    if (data.titleTemplate || data.bodyTemplate) {
      const titleVars = data.titleTemplate ? extractTemplateVariables(data.titleTemplate) : [];
      const bodyVars = data.bodyTemplate ? extractTemplateVariables(data.bodyTemplate) : [];
      variables = [...new Set([...titleVars, ...bodyVars])];
    }

    return NextResponse.json(
      { 
        message: 'تم تحديث القالب بنجاح',
        template,
        variables: variables.length > 0 ? variables : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update template error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'حدث خطأ أثناء تحديث القالب' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/templates/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'غير مصرح لك بحذف القوالب' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Check if template exists
    const template = await prisma.notificationTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json(
        { message: 'القالب غير موجود' },
        { status: 404 }
      );
    }

    // Soft delete by deactivating
    await prisma.notificationTemplate.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    console.log(`Deactivated notification template: ${template.name}`);

    return NextResponse.json(
      { message: 'تم حذف القالب بنجاح' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete template error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء حذف القالب' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

async function generateDevotionalMessage(config: {
  priestName: string;
  theme: string;
  duration: string;
  customNotes?: string;
}) {
  const { priestName, theme, duration, customNotes } = config;
  
  const themes: Record<string, any> = {
    daily: {
      title: 'كلمة اليوم',
      message: 'يا إلهي، أنا أؤمن بحبك لي، ساعدني لأعيش في حضرتك كل يوم.',
    },
    hope: {
      title: 'كلمة الرجاء',
      message: 'الرجاء هو منارة تضيء في ظلامنا، نثق في وعودك الصالحة.',
    },
    faith: {
      title: 'كلمة الإيمان',
      message: 'الإيمان هو الثقة في ما لا نرى، ويتأكد من حضورك في كل لحظة.',
    },
    love: {
      title: 'كلمة المحبة',
      message: 'المحبة هي أعظم فضيلة، ونور يضيء في العالم من خلالنا.',
    },
    patience: {
      title: 'كلمة الصبر',
      message: 'الصبر يفتح أبوابًا لا نهاية لها، ويعلمنا من كل هول.',
    },
  };

  const selectedTheme = themes[theme] || themes.daily;
  const selectedDuration = duration === 'long' 
    ? 'اطلع كلمتك مع الشرح الكامل'
    : 'اقرأ كلمتك في دقيقة';

  const devotionalContent = `
${selectedTheme.title}

${selectedTheme.message}

${customNotes ? `ملاحظات خاصة: ${customNotes}` : ''}

${selectedDuration}

صلواتك من أجلي
  `.trim();

  return {
    title: selectedTheme.title,
    content: devotionalContent,
    theme,
    duration,
  };
}

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
    const theme = searchParams.get('theme') || 'daily';
    const duration = searchParams.get('duration') || 'short';

    const message = await generateDevotionalMessage({
      priestName: session.user.name || 'القس',
      theme,
      duration,
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error generating devotional message:', error);
    return NextResponse.json({ 
      error: 'Failed to generate devotional message',
      message: 'حدث خطأ أثناء إنشاء الرسالة التأملية. يرجى المحاولة مرة أخرى.'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.PRIEST) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { customTopic, notes } = body;

    const message = await generateDevotionalMessage({
      priestName: session.user.name || 'القس',
      theme: customTopic || 'daily',
      duration: 'medium',
      customNotes: notes,
    });

    return NextResponse.json({ 
      message,
      generatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error generating custom devotional message:', error);
    return NextResponse.json({ 
      error: 'Failed to generate devotional message',
      message: 'حدث خطأ أثناء إنشاء الرسالة التأملية. يرجى المحاولة مرة أخرى.'
    }, { status: 500 });
  }
}
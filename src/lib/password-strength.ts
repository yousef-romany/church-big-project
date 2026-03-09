export interface PasswordStrengthResult {
  score: number;
  level: 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
  suggestions: string[];
  passed: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    special: boolean;
  };
}

export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  // Check length
  const hasLength = password.length >= 8;
  if (!hasLength) {
    suggestions.push('استخدم 8 أحرف على الأقل');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }

  // Check uppercase
  const hasUppercase = /[A-Z]/.test(password);
  if (!hasUppercase) {
    suggestions.push('أضف حروف كبيرة (A-Z)');
  } else {
    score += 1;
  }

  // Check lowercase
  const hasLowercase = /[a-z]/.test(password);
  if (!hasLowercase) {
    suggestions.push('أضف حروف صغيرة (a-z)');
  } else {
    score += 1;
  }

  // Check numbers
  const hasNumbers = /[0-9]/.test(password);
  if (!hasNumbers) {
    suggestions.push('أضف أرقام (0-9)');
  } else {
    score += 1;
  }

  // Check special characters
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  if (!hasSpecial) {
    suggestions.push('أضف رموز خاصة (!@#$%)');
  } else {
    score += 2;
  }

  // Check for common patterns
  const commonPatterns = [
    /^123456/,
    /^password/i,
    /^qwerty/i,
    /123456$/,
    /password$/i,
    /(.)\1{2,}/, // Repeated characters
  ];

  const hasCommonPattern = commonPatterns.some(pattern => pattern.test(password));
  if (hasCommonPattern) {
    score -= 2;
    feedback.push('تجنب استخدام كلمات شائعة أو أنماط متكررة');
  }

  // Check for personal info (would need user data in real implementation)
  // This is a placeholder
  const personalPatterns = [
    /^[a-z]+$/i, // All letters only
    /^[0-9]+$/, // All numbers only
  ];

  const hasPersonalPattern = personalPatterns.some(pattern => pattern.test(password));
  if (hasPersonalPattern) {
    score -= 1;
    feedback.push('استخدم مزيج من أنواع مختلفة من الأحرف');
  }

  // Determine strength level
  let level: 'weak' | 'fair' | 'good' | 'strong';
  if (score <= 2) {
    level = 'weak';
    feedback.push('كلمة المرور ضعيفة جدًا');
  } else if (score <= 4) {
    level = 'fair';
    feedback.push('كلمة المرور مقبولة');
  } else if (score <= 6) {
    level = 'good';
    feedback.push('كلمة المرور جيدة');
  } else {
    level = 'strong';
    feedback.push('كلمة المرور قوية');
  }

  return {
    score: Math.max(0, Math.min(8, score)),
    level,
    feedback,
    suggestions,
    passed: {
      length: hasLength,
      uppercase: hasUppercase,
      lowercase: hasLowercase,
      numbers: hasNumbers,
      special: hasSpecial,
    }
  };
}

export function getPasswordStrengthColor(level: 'weak' | 'fair' | 'good' | 'strong'): string {
  switch (level) {
    case 'weak':
      return 'bg-red-500';
    case 'fair':
      return 'bg-orange-500';
    case 'good':
      return 'bg-yellow-500';
    case 'strong':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}

export function getPasswordStrengthText(level: 'weak' | 'fair' | 'good' | 'strong'): string {
  switch (level) {
    case 'weak':
      return 'ضعيفة';
    case 'fair':
      return 'مقبولة';
    case 'good':
      return 'جيدة';
    case 'strong':
      return 'قوية';
    default:
      return 'غير معروفة';
  }
}
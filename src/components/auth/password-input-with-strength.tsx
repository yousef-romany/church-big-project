'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Check, 
  X,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX
} from 'lucide-react';
import { calculatePasswordStrength, getPasswordStrengthColor, getPasswordStrengthText } from '@/lib/password-strength';

interface PasswordInputWithStrengthProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  showStrength?: boolean;
}

export default function PasswordInputWithStrength({
  value,
  onChange,
  placeholder = 'كلمة المرور',
  id = 'password',
  className = '',
  showStrength = true,
}: PasswordInputWithStrengthProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(calculatePasswordStrength(''));

  useEffect(() => {
    if (showStrength) {
      setStrength(calculatePasswordStrength(value));
    }
  }, [value, showStrength]);

  const getStrengthIcon = () => {
    switch (strength.level) {
      case 'strong':
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case 'good':
        return <Shield className="h-5 w-5 text-yellow-500" />;
      case 'fair':
        return <ShieldAlert className="h-5 w-5 text-orange-500" />;
      case 'weak':
        return <ShieldX className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStrengthBarWidth = () => {
    return `${(strength.score / 8) * 100}%`;
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {showStrength && value && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          {/* Strength indicator with icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStrengthIcon()}
              <span className="text-sm font-medium">
                قوة كلمة المرور: {getPasswordStrengthText(strength.level)}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {strength.score}/8
            </span>
          </div>

          {/* Strength bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full transition-all duration-300 ${getPasswordStrengthColor(strength.level)}`}
              style={{ width: getStrengthBarWidth() }}
              initial={{ width: 0 }}
            />
          </div>

          {/* Password requirements */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">المتطلبات:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              <RequirementItem
                label="8 أحرف على الأقل"
                passed={strength.passed.length}
              />
              <RequirementItem
                label="حرف كبير (A-Z)"
                passed={strength.passed.uppercase}
              />
              <RequirementItem
                label="حرف صغير (a-z)"
                passed={strength.passed.lowercase}
              />
              <RequirementItem
                label="رقم (0-9)"
                passed={strength.passed.numbers}
              />
              <RequirementItem
                label="رمز خاص (!@#$%)"
                passed={strength.passed.special}
                className="sm:col-span-2"
              />
            </div>
          </div>

          {/* Feedback */}
          {strength.feedback.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">ملاحظات:</p>
              {strength.feedback.map((feedback, index) => (
                <p key={index} className="text-xs text-muted-foreground">
                  • {feedback}
                </p>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {strength.suggestions.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">اقتراحات:</p>
              {strength.suggestions.map((suggestion, index) => (
                <p key={index} className="text-xs text-blue-600">
                  • {suggestion}
                </p>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

interface RequirementItemProps {
  label: string;
  passed: boolean;
  className?: string;
}

function RequirementItem({ label, passed, className = '' }: RequirementItemProps) {
  return (
    <div className={`flex items-center gap-2 text-xs ${className}`}>
      {passed ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <X className="h-3 w-3 text-gray-400" />
      )}
      <span className={passed ? 'text-green-600' : 'text-muted-foreground'}>
        {label}
      </span>
    </div>
  );
}
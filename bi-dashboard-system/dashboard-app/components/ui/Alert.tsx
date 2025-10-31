// dashboard-app/components/ui/Alert.tsx

import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
}: AlertProps) {
  const variants = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-600',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-600',
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'p-4 rounded-lg border',
        config.bg,
        config.border,
        'animate-slide-down'
      )}
    >
      <div className="flex items-start">
        <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor)} />
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={cn('text-sm font-semibold mb-1', config.text)}>
              {title}
            </h3>
          )}
          <div className={cn('text-sm', config.text)}>{children}</div>
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              'ml-3 flex-shrink-0 hover:opacity-70 transition-opacity',
              config.iconColor
            )}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
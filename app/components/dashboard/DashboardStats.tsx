'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  icon: React.ReactNode;
  description?: string;
  progress?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  description,
  progress
}) => {
  const getChangeIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return <TrendingUp className="h-3 w-3" />;
      case 'decrease':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getChangeColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'text-green-600 dark:text-green-400';
      case 'decrease':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        
        {change && (
          <div className={`flex items-center text-xs ${getChangeColor(change.type)}`}>
            {getChangeIcon(change.type)}
            <span className="ml-1">
              {change.type === 'increase' ? '+' : change.type === 'decrease' ? '-' : ''}
              {Math.abs(change.value)}% from {change.period}
            </span>
          </div>
        )}
        
        {description && !change && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        
        {progress !== undefined && (
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {progress}% of capacity
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary';
}

export const QuickActionCard: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  onClick,
  variant = 'default'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'border-primary/20 bg-primary/5 hover:bg-primary/10';
      case 'secondary':
        return 'border-secondary/20 bg-secondary/5 hover:bg-secondary/10';
      default:
        return 'hover:bg-muted/50';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${getVariantStyles()}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
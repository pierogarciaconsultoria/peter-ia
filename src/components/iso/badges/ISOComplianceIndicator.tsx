
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Clock, XCircle } from 'lucide-react';

type ComplianceStatus = 'compliant' | 'partial' | 'pending' | 'non-compliant';

interface ISOComplianceIndicatorProps {
  status: ComplianceStatus;
  percentage?: number;
  className?: string;
}

export const ISOComplianceIndicator: React.FC<ISOComplianceIndicatorProps> = ({
  status,
  percentage,
  className = ''
}) => {
  const getStatusConfig = (status: ComplianceStatus) => {
    switch (status) {
      case 'compliant':
        return {
          icon: CheckCircle,
          label: 'Conforme',
          color: 'bg-green-100 text-green-800 border-green-200',
          iconColor: 'text-green-600'
        };
      case 'partial':
        return {
          icon: AlertTriangle,
          label: 'Parcialmente Conforme',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          iconColor: 'text-yellow-600'
        };
      case 'pending':
        return {
          icon: Clock,
          label: 'Pendente',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          iconColor: 'text-blue-600'
        };
      case 'non-compliant':
        return {
          icon: XCircle,
          label: 'Não Conforme',
          color: 'bg-red-100 text-red-800 border-red-200',
          iconColor: 'text-red-600'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} ${className} flex items-center gap-1.5`}>
      <Icon className={`h-3 w-3 ${config.iconColor}`} />
      <span className="text-xs font-medium">
        {config.label}
        {percentage !== undefined && ` (${percentage}%)`}
      </span>
    </Badge>
  );
};

import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  subValue?: string;
  utilization: number;
  color?: 'emerald' | 'yellow' | 'cyan' | 'pink';
  showDonut?: boolean;
}

const colorMap = {
  emerald: { stroke: 'stroke-chart-emerald', bg: 'bg-chart-emerald/20' },
  yellow: { stroke: 'stroke-chart-yellow', bg: 'bg-chart-yellow/20' },
  cyan: { stroke: 'stroke-chart-cyan', bg: 'bg-chart-cyan/20' },
  pink: { stroke: 'stroke-chart-pink', bg: 'bg-chart-pink/20' },
};

export function MetricCard({ 
  title, 
  value, 
  subValue, 
  utilization, 
  color = 'emerald',
  showDonut = true 
}: MetricCardProps) {
  const { stroke, bg } = colorMap[color];
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const cappedUtil = Math.min(utilization, 100);
  const offset = circumference - (cappedUtil / 100) * circumference;

  const getUtilColor = () => {
    if (utilization > 100) return 'text-util-over';
    if (utilization > 80) return 'text-util-high';
    if (utilization > 50) return 'text-util-medium';
    return 'text-util-low';
  };

  return (
    <div className={cn("metric-card flex items-center gap-4", bg)}>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-foreground mb-1 truncate">{title}</h3>
        <p className="text-xl font-semibold text-foreground">{value}</p>
        {subValue && (
          <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>
        )}
      </div>
      
      {showDonut && (
        <div className="relative w-20 h-20 shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 88 88">
            {/* Background circle */}
            <circle
              cx="44"
              cy="44"
              r={radius}
              fill="none"
              className="stroke-border"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="44"
              cy="44"
              r={radius}
              fill="none"
              className={stroke}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn("text-lg font-bold", getUtilColor())}>
              {utilization}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

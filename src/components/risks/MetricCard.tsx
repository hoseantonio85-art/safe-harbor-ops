import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  subValue?: string;
  utilization: number;
  showDonut?: boolean;
}

export function MetricCard({ 
  title, 
  value, 
  subValue, 
  utilization, 
  showDonut = true 
}: MetricCardProps) {
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

  const getStrokeColor = () => {
    if (utilization > 100) return 'stroke-util-over';
    if (utilization > 80) return 'stroke-util-high';
    if (utilization > 50) return 'stroke-util-medium';
    return 'stroke-util-low';
  };

  return (
    <div className="rounded-xl p-5 border border-border bg-card">
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-medium text-muted-foreground mb-1.5 truncate">{title}</h3>
          <p className="text-lg font-semibold text-foreground">{value}</p>
          {subValue && (
            <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>
          )}
        </div>
        
        {showDonut && (
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 88 88">
              <circle
                cx="44"
                cy="44"
                r={radius}
                fill="none"
                className="stroke-border"
                strokeWidth="6"
              />
              <circle
                cx="44"
                cy="44"
                r={radius}
                fill="none"
                className={getStrokeColor()}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn("text-sm font-bold", getUtilColor())}>
                {utilization}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

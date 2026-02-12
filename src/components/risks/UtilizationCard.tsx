import { cn } from '@/lib/utils';
import { LossLimit } from '@/types/risk';

interface UtilizationCardProps {
  title: string;
  lossLimit: LossLimit;
  incidentCount: number;
  onClick: () => void;
}

export function UtilizationCard({ title, lossLimit, incidentCount, onClick }: UtilizationCardProps) {
  const { limit = 0, value, utilization } = lossLimit;
  const hasLimit = limit > 0;
  const isOver = utilization > 100;
  const barWidth = Math.min(utilization, 100);

  return (
    <button
      onClick={onClick}
      className="text-left w-full p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors space-y-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <span className="text-xs text-primary hover:underline shrink-0">
          Инциденты: {incidentCount} →
        </span>
      </div>

      {hasLimit ? (
        <>
          {/* Numbers */}
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Лимит</span>
              <span className="text-sm font-medium">{limit} млн</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Факт</span>
              <span className="text-xl font-bold">{value} млн</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Утилизация</span>
              <span className={cn(
                "text-sm font-semibold",
                utilization <= 70 && "text-[hsl(var(--util-low))]",
                utilization > 70 && utilization <= 100 && "text-[hsl(var(--util-medium))]",
                isOver && "text-[hsl(var(--util-over))]"
              )}>
                {utilization}%
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Прогноз</span>
              <span className="text-sm text-muted-foreground">{lossLimit.forecast2025 ?? '-'} млн</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                utilization <= 70 && "bg-[hsl(var(--util-low))]",
                utilization > 70 && utilization <= 100 && "bg-[hsl(var(--util-medium))]",
                isOver && "bg-[hsl(var(--util-over))] animate-pulse"
              )}
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Лимит не установлен</p>
      )}
    </button>
  );
}

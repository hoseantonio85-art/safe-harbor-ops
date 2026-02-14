import { useState } from 'react';
import { ChevronDown, ChevronUp, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LossLimit } from '@/types/risk';

interface UtilizationCardProps {
  title: string;
  lossLimit: LossLimit;
  onExpand: () => void;
}

export function UtilizationCard({ title, lossLimit, onExpand }: UtilizationCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { limit = 0, value, utilization } = lossLimit;
  const hasLimit = limit > 0;
  const isOver = utilization > 100;
  const barWidth = Math.min(utilization, 100);

  return (
    <div className="w-full rounded-xl border border-border bg-card flex flex-col">
      {/* Compact view */}
      <div className="p-5 flex flex-col gap-3">
        {/* Title + expand icon */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium text-foreground">{title}</h4>
          <button
            onClick={onExpand}
            className="text-muted-foreground hover:text-primary transition-colors shrink-0 p-0.5"
            title="Развернуть"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {hasLimit ? (
          <>
            {/* Fact — main visual anchor */}
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold">{value} млн</span>
              <span className={cn(
                "text-sm font-semibold",
                utilization <= 70 && "text-[hsl(var(--util-low))]",
                utilization > 70 && utilization <= 100 && "text-[hsl(var(--util-medium))]",
                isOver && "text-[hsl(var(--util-over))]"
              )}>
                {utilization}%
              </span>
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

            {/* Inline details toggle */}
            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors self-start"
            >
              {detailsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              Детали
            </button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Лимит не установлен</p>
        )}
      </div>

      {/* Inline expanded details */}
      {detailsOpen && hasLimit && (
        <div className="px-5 pb-5 pt-0 border-t border-border/50 space-y-1.5">
          <div className="flex items-baseline justify-between pt-3">
            <span className="text-xs text-muted-foreground">Лимит</span>
            <span className="text-sm font-medium">{limit} млн</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Факт</span>
            <span className="text-sm font-medium">{value} млн</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Прогноз</span>
            <span className="text-sm text-muted-foreground">{lossLimit.forecast2025 ?? '—'} млн</span>
          </div>
          {lossLimit.fact2024 != null && (
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Факт 2024</span>
              <span className="text-sm text-muted-foreground">{lossLimit.fact2024} млн</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

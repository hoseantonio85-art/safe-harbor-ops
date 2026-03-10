import { useState } from 'react';
import { Risk } from '@/types/risk';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PROBABILITY_LABELS = ['Очень высокая', 'Высокая', 'Средняя', 'Низкая', 'Несущественная'] as const;
const DAMAGE_LABELS = ['Низкий', 'Средний', 'Высокий', 'Очень высокий'] as const;

type Probability = typeof PROBABILITY_LABELS[number];
type Damage = typeof DAMAGE_LABELS[number];

// Map risk level to probability row (simplified mapping from existing data)
function getRiskProbability(risk: Risk): Probability {
  const util = risk.cleanOpRisk.utilization;
  if (util > 100) return 'Очень высокая';
  if (util > 80) return 'Высокая';
  if (util > 50) return 'Средняя';
  if (util > 20) return 'Низкая';
  return 'Несущественная';
}

// Map risk to damage level
function getRiskDamage(risk: Risk): Damage {
  const total = risk.cleanOpRisk.value + risk.creditOpRisk.value + risk.indirectLosses.value;
  if (total > 50) return 'Очень высокий';
  if (total > 10) return 'Высокий';
  if (total > 3) return 'Средний';
  return 'Низкий';
}

// Severity zone color based on grid position
function getCellSeverity(probIdx: number, dmgIdx: number): 'critical' | 'high' | 'medium' | 'low' {
  const score = (4 - probIdx) + dmgIdx; // 0-7 scale
  if (score >= 6) return 'critical';
  if (score >= 4) return 'high';
  if (score >= 2) return 'medium';
  return 'low';
}

const severityStyles: Record<string, { bg: string; bgHover: string; text: string; border: string }> = {
  critical: {
    bg: 'bg-red-500/20',
    bgHover: 'hover:bg-red-500/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-500',
  },
  high: {
    bg: 'bg-red-400/12',
    bgHover: 'hover:bg-red-400/20',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-400',
  },
  medium: {
    bg: 'bg-amber-400/15',
    bgHover: 'hover:bg-amber-400/25',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-400',
  },
  low: {
    bg: 'bg-muted/60',
    bgHover: 'hover:bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
  },
};

interface SelectedCell {
  probability: Probability;
  damage: Damage;
}

interface RiskHeatMapProps {
  risks: Risk[];
  selectedCell: SelectedCell | null;
  onCellSelect: (cell: SelectedCell | null) => void;
  compact?: boolean;
}

export function RiskHeatMap({ risks, selectedCell, onCellSelect, compact }: RiskHeatMapProps) {
  // Build matrix data
  const matrix = new Map<string, Risk[]>();
  risks.forEach(risk => {
    const prob = getRiskProbability(risk);
    const dmg = getRiskDamage(risk);
    const key = `${prob}|${dmg}`;
    if (!matrix.has(key)) matrix.set(key, []);
    matrix.get(key)!.push(risk);
  });

  const isSelected = (prob: Probability, dmg: Damage) =>
    selectedCell?.probability === prob && selectedCell?.damage === dmg;

  const hasSelection = selectedCell !== null;

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Матрица рисков</h3>
        {selectedCell && !compact && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs gap-1.5 pr-1">
              Матрица: {selectedCell.probability} вероятность × {selectedCell.damage} ущерб
              <button
                onClick={() => onCellSelect(null)}
                className="ml-1 p-0.5 rounded-full hover:bg-foreground/10 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          </div>
        )}
      </div>

      <div className={cn("rounded-lg border border-border bg-card", compact ? "p-3" : "p-4")}>
        <div className="flex">
          {/* Y-axis label */}
          <div className="flex items-center mr-2">
            <span className="text-[10px] font-medium text-muted-foreground writing-mode-vertical -rotate-180"
              style={{ writingMode: 'vertical-rl' }}>
              Вероятность
            </span>
          </div>

          <div className="flex-1">
            {/* Grid */}
            <div className={cn("grid", compact ? "gap-0.5" : "gap-1")} style={{ gridTemplateColumns: `80px repeat(${DAMAGE_LABELS.length}, 1fr)` }}>
              {/* Empty corner */}
              <div />
              {/* X-axis headers */}
              {DAMAGE_LABELS.map(dmg => (
                <div key={dmg} className="text-center text-[10px] font-medium text-muted-foreground pb-1 truncate px-0.5">
                  {dmg}
                </div>
              ))}

              {/* Rows */}
              {PROBABILITY_LABELS.map((prob, probIdx) => (
                <>
                  {/* Row label */}
                  <div key={`label-${prob}`} className="flex items-center text-[10px] font-medium text-muted-foreground pr-2 truncate">
                    {prob}
                  </div>
                  {/* Cells */}
                  {DAMAGE_LABELS.map((dmg, dmgIdx) => {
                    const key = `${prob}|${dmg}`;
                    const cellRisks = matrix.get(key) || [];
                    const count = cellRisks.length;
                    const severity = getCellSeverity(probIdx, dmgIdx);
                    const styles = severityStyles[severity];
                    const selected = isSelected(prob, dmg);
                    const totalLosses = cellRisks.reduce((s, r) => s + r.cleanOpRisk.value + r.creditOpRisk.value + r.indirectLosses.value, 0);
                    const top3 = [...cellRisks].sort((a, b) =>
                      (b.cleanOpRisk.value + b.creditOpRisk.value + b.indirectLosses.value) -
                      (a.cleanOpRisk.value + a.creditOpRisk.value + a.indirectLosses.value)
                    ).slice(0, 3);

                    return (
                      <TooltipProvider key={`${prob}-${dmg}`} delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => onCellSelect(selected ? null : { probability: prob, damage: dmg })}
                              className={cn(
                                "relative aspect-square rounded-md flex items-center justify-center text-sm font-semibold transition-all duration-150 border-2 min-h-[40px]",
                                styles.bg,
                                styles.bgHover,
                                styles.text,
                                selected
                                  ? `${styles.border} ring-2 ring-offset-1 ring-primary/30 scale-105`
                                  : 'border-transparent',
                                hasSelection && !selected && 'opacity-40'
                              )}
                            >
                              {count > 0 ? count : ''}
                            </button>
                          </TooltipTrigger>
                          {count > 0 && (
                            <TooltipContent side="right" className="max-w-[280px] p-3 space-y-2">
                              <div className="text-xs space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Количество рисков:</span>
                                  <span className="font-semibold">{count}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Суммарные потери:</span>
                                  <span className="font-semibold">{totalLosses.toFixed(1)} млн ₽</span>
                                </div>
                              </div>
                              {top3.length > 0 && (
                                <div className="border-t border-border pt-1.5">
                                  <div className="text-[10px] text-muted-foreground mb-1">Топ рисков по сумме:</div>
                                  {top3.map(r => {
                                    const rLoss = r.cleanOpRisk.value + r.creditOpRisk.value + r.indirectLosses.value;
                                    return (
                                      <div key={r.id} className="text-[11px] truncate">
                                        • {r.riskName} — {rLoss.toFixed(1)} млн ₽
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </>
              ))}
            </div>

            {/* X-axis label */}
            <div className="text-center text-[10px] font-medium text-muted-foreground mt-2">
              Уровень ущерба
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { getRiskProbability, getRiskDamage };
export type { SelectedCell };

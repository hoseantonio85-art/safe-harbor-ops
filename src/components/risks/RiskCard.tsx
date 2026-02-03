import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Risk, LossLimit } from '@/types/risk';
import { Input } from '@/components/ui/input';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

type ScreenMode = 'view' | 'edit' | 'draft';

interface RiskCardProps {
  risk: Risk;
  mode: ScreenMode;
  draftLimits?: {
    cleanOpRisk: number;
    creditOpRisk: number;
    indirectLosses: number;
  };
  onLimitChange?: (riskId: string, field: 'cleanOpRisk' | 'creditOpRisk' | 'indirectLosses', value: number) => void;
  onRiskClick: (risk: Risk) => void;
}

function LossTypeDisplay({
  label,
  data,
  mode,
  draftValue,
  originalValue,
  onValueChange,
  showUtilization = true,
}: {
  label: string;
  data: LossLimit;
  mode: ScreenMode;
  draftValue?: number;
  originalValue?: number;
  onValueChange?: (value: number) => void;
  showUtilization?: boolean;
}) {
  const displayValue = mode === 'draft' && draftValue !== undefined ? draftValue : (data.limit || 0);
  const utilization = data.utilization || 0;
  const hasChange = mode === 'draft' && draftValue !== undefined && draftValue !== originalValue;

  const getUtilizationColor = () => {
    if (utilization > 100) return 'text-util-over bg-util-over/10';
    if (utilization > 80) return 'text-util-high bg-util-high/10';
    if (utilization > 50) return 'text-util-medium bg-util-medium/10';
    return 'text-util-low bg-util-low/10';
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {mode === 'edit' && onValueChange ? (
          <Input
            type="number"
            value={displayValue}
            onChange={(e) => onValueChange(parseFloat(e.target.value) || 0)}
            className="h-8 w-24 text-sm font-medium"
            step="0.1"
          />
        ) : (
          <HoverCard openDelay={200}>
            <HoverCardTrigger asChild>
              <span className={cn(
                "font-medium text-sm cursor-help",
                hasChange && "text-primary"
              )}>
                {displayValue > 0 ? `${displayValue.toLocaleString('ru-RU')} млн` : '—'}
                {hasChange && originalValue !== undefined && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    (было {originalValue.toLocaleString('ru-RU')})
                  </span>
                )}
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-64" side="top">
              <div className="space-y-2">
                <p className="text-xs font-medium">{label}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Лимит:</span>
                    <span className="ml-1 font-medium">{(data.limit || 0).toLocaleString('ru-RU')} млн</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Факт 2025:</span>
                    <span className="ml-1 font-medium">{(data.fact2025 || 0).toLocaleString('ru-RU')} млн</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Прогноз 2025:</span>
                    <span className="ml-1 font-medium">{(data.forecast2025 || 0).toLocaleString('ru-RU')} млн</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Утилизация:</span>
                    <span className="ml-1 font-medium">{utilization}%</span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
        {showUtilization && utilization > 0 && mode !== 'edit' && (
          <span className={cn(
            "text-xs font-medium px-1.5 py-0.5 rounded",
            getUtilizationColor()
          )}>
            {utilization}%
          </span>
        )}
      </div>
    </div>
  );
}

export function RiskCard({ 
  risk, 
  mode, 
  draftLimits,
  onLimitChange,
  onRiskClick 
}: RiskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasWarning = risk.cleanOpRisk.utilization > 100 || 
                     risk.creditOpRisk.utilization > 100 || 
                     risk.indirectLosses.utilization > 100;

  const hasChanges = mode === 'draft' && draftLimits && (
    draftLimits.cleanOpRisk !== (risk.cleanOpRisk.limit || 0) ||
    draftLimits.creditOpRisk !== (risk.creditOpRisk.limit || 0) ||
    draftLimits.indirectLosses !== (risk.indirectLosses.limit || 0)
  );

  const getStatusStyle = () => {
    switch (risk.status) {
      case 'Утверждён':
        return 'bg-status-approved/10 text-status-approved';
      case 'В работе':
        return 'bg-status-pending/10 text-status-pending';
      case 'На согласовании':
        return 'bg-amber-500/10 text-amber-600';
      case 'Черновик':
        return 'bg-status-draft/10 text-status-draft';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className={cn(
      "border border-border rounded-xl bg-card transition-all",
      hasChanges && "ring-2 ring-primary/20 border-primary/30",
      mode === 'edit' && "shadow-sm"
    )}>
      {/* Card Header */}
      <div className="flex items-start gap-4 p-4 pb-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-medium text-primary">{risk.id}</span>
          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", getStatusStyle())}>
            {risk.status}
          </span>
          {hasWarning && (
            <AlertTriangle className="w-4 h-4 text-util-over" />
          )}
          {hasChanges && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              Изменено
            </span>
          )}
        </div>

        <button
          onClick={() => onRiskClick(risk)}
          className="flex-1 text-left group"
        >
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {risk.riskName}
          </span>
        </button>

        <button
          onClick={() => onRiskClick(risk)}
          className="shrink-0 p-1.5 hover:bg-accent rounded-md transition-colors"
          title="Открыть карточку риска"
        >
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Loss Types Grid */}
      <div className="grid grid-cols-4 gap-4 px-4 pb-4">
        <LossTypeDisplay
          label="Чистый опрриск"
          data={risk.cleanOpRisk}
          mode={mode}
          draftValue={draftLimits?.cleanOpRisk}
          originalValue={risk.cleanOpRisk.limit || 0}
          onValueChange={mode === 'edit' ? (v) => onLimitChange?.(risk.id, 'cleanOpRisk', v) : undefined}
        />
        <LossTypeDisplay
          label="Опрриск в кредитовании"
          data={risk.creditOpRisk}
          mode={mode}
          draftValue={draftLimits?.creditOpRisk}
          originalValue={risk.creditOpRisk.limit || 0}
          onValueChange={mode === 'edit' ? (v) => onLimitChange?.(risk.id, 'creditOpRisk', v) : undefined}
        />
        <LossTypeDisplay
          label="Косвенные потери"
          data={risk.indirectLosses}
          mode={mode}
          draftValue={draftLimits?.indirectLosses}
          originalValue={risk.indirectLosses.limit || 0}
          onValueChange={mode === 'edit' ? (v) => onLimitChange?.(risk.id, 'indirectLosses', v) : undefined}
        />
        <LossTypeDisplay
          label="Потенциальные потери"
          data={{ value: risk.potentialLosses, utilization: 0 }}
          mode="view"
          showUtilization={false}
        />
      </div>

      {/* Expandable Details (for historical data) */}
      {mode !== 'edit' && (
        <div className="border-t border-border">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-1 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Скрыть детали
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                Показать детали
              </>
            )}
          </button>

          {isExpanded && (
            <div className="px-4 pb-4 pt-2 grid grid-cols-4 gap-4 bg-muted/30">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Блок</span>
                <p className="text-sm">{risk.block}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Подразделение</span>
                <p className="text-sm">{risk.subdivision}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Процесс</span>
                <p className="text-sm">{risk.process}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Уровень риска</span>
                <p className={cn(
                  "text-sm font-medium",
                  risk.riskLevel === 'Высокий' && "text-util-over",
                  risk.riskLevel === 'Средний' && "text-util-medium",
                  risk.riskLevel === 'Низкий' && "text-util-low"
                )}>
                  {risk.riskLevel}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

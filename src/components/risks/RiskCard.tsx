import { AlertTriangle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Risk, LossLimit } from '@/types/risk';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { RetroDataTable } from './RetroDataTable';

type ScreenMode = 'view' | 'edit';

interface RiskCardProps {
  risk: Risk;
  mode: ScreenMode;
  draftLimits?: {
    cleanOpRisk: number;
    creditOpRisk: number;
    indirectLosses: number;
    potentialLosses: number;
  };
  onLimitChange?: (riskId: string, field: 'cleanOpRisk' | 'creditOpRisk' | 'indirectLosses' | 'potentialLosses', value: number) => void;
  onRiskClick: (risk: Risk) => void;
}

function LossTypeDisplay({
  label,
  data,
  draftValue,
  originalValue,
  showDraft = false,
  showUtilization = true,
}: {
  label: string;
  data: LossLimit;
  draftValue?: number;
  originalValue?: number;
  showDraft?: boolean;
  showUtilization?: boolean;
}) {
  const displayValue = showDraft && draftValue !== undefined ? draftValue : (data.limit || 0);
  const utilization = data.utilization || 0;
  const hasChange = showDraft && draftValue !== undefined && draftValue !== originalValue;

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
        {showUtilization && utilization > 0 && (
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
  const hasWarning = risk.cleanOpRisk.utilization > 100 || 
                     risk.creditOpRisk.utilization > 100 || 
                     risk.indirectLosses.utilization > 100;

  const showDraft = draftLimits !== undefined && (
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
      showDraft && "ring-2 ring-primary/20 border-primary/30",
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
          {showDraft && (
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

      {/* Loss Types Summary Grid */}
      <div className="grid grid-cols-4 gap-4 px-4 pb-4">
        <LossTypeDisplay
          label="Чистый опрриск"
          data={risk.cleanOpRisk}
          draftValue={draftLimits?.cleanOpRisk}
          originalValue={risk.cleanOpRisk.limit || 0}
          showDraft={showDraft}
        />
        <LossTypeDisplay
          label="Опрриск в кредитовании"
          data={risk.creditOpRisk}
          draftValue={draftLimits?.creditOpRisk}
          originalValue={risk.creditOpRisk.limit || 0}
          showDraft={showDraft}
        />
        <LossTypeDisplay
          label="Косвенные потери"
          data={risk.indirectLosses}
          draftValue={draftLimits?.indirectLosses}
          originalValue={risk.indirectLosses.limit || 0}
          showDraft={showDraft}
        />
        <LossTypeDisplay
          label="Потенциальные потери"
          data={{ value: risk.potentialLosses, utilization: 0 }}
          showUtilization={false}
        />
      </div>

      {/* Retro Data Accordion — only in edit mode */}
      {mode === 'edit' && (
        <RetroDataTable
          risk={risk}
          draftLimits={draftLimits}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
}

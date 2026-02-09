import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Risk } from '@/types/risk';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RiskRowAccordion } from './RiskRowAccordion';

type ScreenMode = 'view' | 'edit';

interface RiskRowProps {
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
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (riskId: string) => void;
}

function StatusTag({ status }: { status: Risk['status'] }) {
  const colorMap: Record<Risk['status'], string> = {
    'Черновик': 'text-muted-foreground border-muted-foreground/40',
    'В работе': 'text-foreground border-border',
    'На согласовании': 'text-orange-500 border-orange-300',
    'Утверждён': 'text-primary border-primary/40',
  };

  return (
    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium border bg-transparent", colorMap[status])}>
      {status}
    </span>
  );
}

function UtilBadge({ utilization }: { utilization: number }) {
  if (!utilization || utilization === 0) return null;
  
  const color = utilization > 100
    ? 'text-util-over'
    : utilization > 80
    ? 'text-util-high'
    : utilization > 50
    ? 'text-util-medium'
    : 'text-util-low';

  return (
    <span className={cn("text-xs font-medium", color)}>
      {utilization}%
    </span>
  );
}

function LimitCell({
  value,
  utilization,
  isEditing,
  draftValue,
  onChange,
}: {
  value: number;
  utilization?: number;
  isEditing: boolean;
  draftValue?: number;
  onChange?: (val: number) => void;
}) {
  if (isEditing && onChange) {
    return (
      <div className="flex items-center justify-end gap-2">
        <Input
          type="number"
          value={draftValue ?? value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="h-7 w-20 text-right text-sm font-medium"
          step="0.1"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <span className="text-sm font-medium text-foreground">
        {value > 0 ? value.toLocaleString('ru-RU') : '—'}
      </span>
      <UtilBadge utilization={utilization || 0} />
    </div>
  );
}

export function RiskRow({
  risk,
  mode,
  draftLimits,
  onLimitChange,
  onRiskClick,
  selectionMode,
  isSelected,
  onToggleSelect,
}: RiskRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditing = mode === 'edit';

  return (
    <div className={cn(
      "border border-border rounded-lg bg-card",
      isSelected && "ring-2 ring-primary/30 border-primary/30",
    )}>
      {/* Main row */}
      <div className="grid grid-cols-[minmax(160px,1fr)_minmax(220px,2fr)_repeat(4,minmax(120px,1fr))] items-center gap-0">
        {/* Col 1: ID + Status */}
        <div className="flex items-start gap-2 px-3 py-2.5 min-w-0">
          {selectionMode && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelect?.(risk.id)}
              className="shrink-0 mt-0.5"
            />
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="shrink-0 p-0.5 mt-0.5 hover:bg-accent rounded transition-colors"
          >
            {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-xs font-medium text-primary">{risk.id}</span>
            <StatusTag status={risk.status} />
          </div>
        </div>

        {/* Col 2: Name + Block + Subdivision */}
        <div className="px-3 py-2.5 border-l border-border min-w-0">
          <button
            onClick={() => onRiskClick(risk)}
            className="text-sm text-foreground hover:text-primary transition-colors text-left truncate block w-full"
            title={risk.riskName}
          >
            {risk.riskName}
          </button>
          <div className="text-xs text-muted-foreground truncate mt-0.5">{risk.block}</div>
          <div className="text-xs text-muted-foreground truncate">{risk.subdivision}</div>
        </div>

        {/* Col 3: Clean OpRisk */}
        <div className="px-3 py-2.5 border-l border-border">
          <LimitCell
            value={risk.cleanOpRisk.limit || 0}
            utilization={risk.cleanOpRisk.utilization}
            isEditing={isEditing}
            draftValue={draftLimits?.cleanOpRisk}
            onChange={isEditing ? (v) => onLimitChange?.(risk.id, 'cleanOpRisk', v) : undefined}
          />
        </div>

        {/* Col 4: Credit OpRisk */}
        <div className="px-3 py-2.5 border-l border-border">
          <LimitCell
            value={risk.creditOpRisk.limit || 0}
            utilization={risk.creditOpRisk.utilization}
            isEditing={isEditing}
            draftValue={draftLimits?.creditOpRisk}
            onChange={isEditing ? (v) => onLimitChange?.(risk.id, 'creditOpRisk', v) : undefined}
          />
        </div>

        {/* Col 5: Indirect Losses */}
        <div className="px-3 py-2.5 border-l border-border">
          <LimitCell
            value={risk.indirectLosses.limit || 0}
            utilization={risk.indirectLosses.utilization}
            isEditing={isEditing}
            draftValue={draftLimits?.indirectLosses}
            onChange={isEditing ? (v) => onLimitChange?.(risk.id, 'indirectLosses', v) : undefined}
          />
        </div>

        {/* Col 6: Potential Losses */}
        <div className="px-3 py-2.5 border-l border-border">
          <LimitCell
            value={risk.potentialLosses || 0}
            isEditing={isEditing}
            draftValue={draftLimits?.potentialLosses}
            onChange={isEditing ? (v) => onLimitChange?.(risk.id, 'potentialLosses', v) : undefined}
          />
        </div>
      </div>

      {/* Accordion */}
      {isOpen && (
        <RiskRowAccordion risk={risk} />
      )}
    </div>
  );
}

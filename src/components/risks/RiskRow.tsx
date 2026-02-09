import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
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

const statusStyles: Record<string, string> = {
  'Утверждён': 'bg-status-approved/10 text-status-approved',
  'В работе': 'bg-status-pending/10 text-status-pending',
  'На согласовании': 'bg-amber-500/10 text-amber-600',
  'Черновик': 'bg-status-draft/10 text-status-draft',
};

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

  const hasWarning =
    risk.cleanOpRisk.utilization > 100 ||
    risk.creditOpRisk.utilization > 100 ||
    risk.indirectLosses.utilization > 100;

  return (
    <div className={cn(
      "border border-border rounded-lg bg-card",
      isSelected && "ring-2 ring-primary/30 border-primary/30",
    )}>
      {/* Main row */}
      <div className="grid grid-cols-[minmax(280px,2fr)_minmax(140px,1fr)_repeat(4,minmax(120px,1fr))] items-center gap-0">
        {/* Col 1: Risk */}
        <div className="flex items-center gap-2 px-3 py-2.5 min-w-0">
          {selectionMode && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelect?.(risk.id)}
              className="shrink-0"
            />
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="shrink-0 p-0.5 hover:bg-accent rounded transition-colors"
          >
            {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>
          <span className="text-xs font-medium text-primary shrink-0">{risk.id}</span>
          <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0", statusStyles[risk.status] || 'bg-muted text-muted-foreground')}>
            {risk.status}
          </span>
          {hasWarning && <AlertTriangle className="w-3.5 h-3.5 text-util-over shrink-0" />}
          <button
            onClick={() => onRiskClick(risk)}
            className="text-sm text-foreground hover:text-primary transition-colors text-left truncate min-w-0"
            title={risk.riskName}
          >
            {risk.riskName}
          </button>
        </div>

        {/* Col 2: Context */}
        <div className="px-3 py-2.5 border-l border-border">
          <div className="text-xs text-muted-foreground truncate">{risk.block}</div>
          <div className="text-xs font-medium text-foreground truncate">{risk.subdivision}</div>
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

      {/* Accordion: Retro data (read-only context) */}
      {isOpen && (
        <RiskRowAccordion risk={risk} />
      )}
    </div>
  );
}

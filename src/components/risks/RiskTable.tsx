import { Risk } from '@/types/risk';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface RiskTableProps {
  risks: Risk[];
  onRiskClick: (risk: Risk) => void;
  isManageMode?: boolean;
  selectedRisks?: string[];
  onSelectRisk?: (riskId: string) => void;
}

function UtilBadge({ value, utilization }: { value: number; utilization: number }) {
  if (!value) return <span className="text-muted-foreground">-</span>;
  
  const getColor = () => {
    if (utilization > 100) return 'text-util-over';
    if (utilization > 80) return 'text-util-high';
    if (utilization > 50) return 'text-util-medium';
    return 'text-util-low';
  };

  return (
    <div className="text-right">
      <span className="font-medium">{value.toLocaleString('ru-RU')}</span>
      {utilization > 0 && (
        <span className={cn("ml-1 text-xs font-medium", getColor())}>
          {utilization}%
        </span>
      )}
    </div>
  );
}

export function RiskTable({ 
  risks, 
  onRiskClick, 
  isManageMode = false,
  selectedRisks = [],
  onSelectRisk 
}: RiskTableProps) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {isManageMode && (
              <th className="w-12 px-4 py-3"></th>
            )}
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Статус</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Блок</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Подразделение</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Процесс</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground min-w-[300px]">Риск</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">
              <div>Чистый опрриск,</div>
              <div>млн / % утилизации</div>
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">
              <div>Опрриск в</div>
              <div>кредитовании, млн</div>
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">
              <div>Косвенные потери,</div>
              <div>млн / % утилизации</div>
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">
              <div>Потенциальные</div>
              <div>потери, млн</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {risks.map((risk) => (
            <tr 
              key={risk.id} 
              className="border-b border-border last:border-0 risk-row"
              onClick={() => !isManageMode && onRiskClick(risk)}
            >
              {isManageMode && (
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <Checkbox 
                    checked={selectedRisks.includes(risk.id)}
                    onCheckedChange={() => onSelectRisk?.(risk.id)}
                  />
                </td>
              )}
              <td className="px-4 py-3">
                <span className="text-primary font-medium text-sm">{risk.id}</span>
              </td>
              <td className="px-4 py-3">
                <span className={cn(
                  "text-sm",
                  risk.status === 'Утверждён' && "text-status-approved",
                  risk.status === 'В работе' && "text-status-pending",
                  risk.status === 'Черновик' && "text-status-draft"
                )}>
                  {risk.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">{risk.block}</td>
              <td className="px-4 py-3 text-sm max-w-[200px] truncate">{risk.subdivision}</td>
              <td className="px-4 py-3 text-sm">{risk.process}</td>
              <td className="px-4 py-3 text-sm">{risk.riskName}</td>
              <td className="px-4 py-3">
                <UtilBadge value={risk.cleanOpRisk.value} utilization={risk.cleanOpRisk.utilization} />
              </td>
              <td className="px-4 py-3 text-right text-sm text-muted-foreground">-</td>
              <td className="px-4 py-3 text-right text-sm text-muted-foreground">-</td>
              <td className="px-4 py-3 text-right text-sm">
                {risk.potentialLosses > 0 ? risk.potentialLosses.toLocaleString('ru-RU') : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

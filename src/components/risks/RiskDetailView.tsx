import { useState } from 'react';
import { Edit2, Maximize2, FileText, History, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FullscreenLightbox } from '@/components/ui/fullscreen-lightbox';
import { UtilizationDrawer } from './UtilizationDrawer';
import { Risk } from '@/types/risk';
import { cn } from '@/lib/utils';
import { mockMeasures } from '@/data/mockRisks';

interface RiskDetailViewProps {
  risk: Risk | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (risk: Risk) => void;
}

function LimitCard({ 
  title, 
  limit, 
  fact, 
  forecast, 
  utilization,
  isExpanded,
  onExpand,
  riskCapacity
}: { 
  title: string; 
  limit?: number;
  fact?: number;
  forecast?: number;
  utilization?: number;
  isExpanded?: boolean;
  onExpand?: () => void;
  riskCapacity?: number;
}) {
  const hasData = limit !== undefined && limit > 0;
  
  return (
    <div className={cn(
      "p-4 rounded-xl border transition-colors",
      isExpanded ? "bg-accent border-primary/30" : "bg-card border-border"
    )}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium">{title}</h4>
        {onExpand && (
          <button 
            onClick={onExpand}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
      {hasData ? (
        <div className="space-y-1 text-sm">
          <p>Лимит 2026: <span className="font-medium">{limit} млн</span></p>
          <p className="text-muted-foreground">
            Факт 2026: {fact !== undefined ? `${fact} млн (утилизация ${utilization}%)` : '-'}
          </p>
          <p className="text-muted-foreground">
            Прогноз 2026: {forecast !== undefined ? `${forecast} млн` : '-'}
          </p>
        </div>
      ) : (
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Лимит 2026: -</p>
          <p>Факт 2026: -</p>
          <p>Прогноз 2026: -</p>
          {riskCapacity !== undefined && (
            <p className="text-foreground">Рискоемкость: <span className="font-medium">{riskCapacity.toLocaleString('ru-RU')} млн</span></p>
          )}
        </div>
      )}
    </div>
  );
}

export function RiskDetailView({ risk, isOpen, onClose, onEdit }: RiskDetailViewProps) {
  const [utilizationOpen, setUtilizationOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  if (!risk) return null;

  const handleExpandCard = (cardId: string) => {
    setExpandedCard(cardId);
    setUtilizationOpen(true);
  };

  return (
    <>
      <FullscreenLightbox
        isOpen={isOpen}
        onClose={onClose}
        title=""
      >
        <div className="space-y-6">
          {/* Header with title and edit button */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">
                {risk.id}: {risk.riskName} ({risk.process})
              </h1>
              <p className="text-sm">
                Уровень риска:<span className={cn(
                  "ml-1 font-medium",
                  risk.riskLevel === 'Высокий' && "text-destructive",
                  risk.riskLevel === 'Средний' && "text-chart-yellow",
                  risk.riskLevel === 'Низкий' && "text-primary"
                )}>{risk.riskLevel}</span>
              </p>
            </div>
            <Button onClick={() => onEdit(risk)} className="gap-2">
              Редактирование
            </Button>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-[1fr,320px] gap-6">
            {/* Left column - Main content */}
            <div className="space-y-6">
              {/* Limit Cards */}
              <div className="p-4 bg-accent/50 rounded-xl border border-border">
                <div className="flex items-center justify-end mb-3">
                  <button className="p-1.5 hover:bg-muted rounded">
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <LimitCard 
                    title="Чистый операционный риск"
                    limit={risk.cleanOpRisk.limit}
                    fact={risk.cleanOpRisk.fact2025}
                    forecast={risk.cleanOpRisk.forecast2025}
                    utilization={risk.cleanOpRisk.utilization}
                    isExpanded={expandedCard === 'cleanOp'}
                    onExpand={() => handleExpandCard('cleanOp')}
                  />
                  <LimitCard 
                    title="Опрриск в кредитовании"
                    limit={risk.creditOpRisk.limit}
                    fact={risk.creditOpRisk.fact2025}
                    forecast={risk.creditOpRisk.forecast2025}
                    utilization={risk.creditOpRisk.utilization}
                    onExpand={() => handleExpandCard('creditOp')}
                  />
                  <LimitCard 
                    title="Косвенные потери"
                    limit={risk.indirectLosses.limit}
                    fact={risk.indirectLosses.fact2025}
                    forecast={risk.indirectLosses.forecast2025}
                    utilization={risk.indirectLosses.utilization}
                    onExpand={() => handleExpandCard('indirect')}
                  />
                  <LimitCard 
                    title="Потенциальные потери"
                    riskCapacity={1250}
                  />
                </div>
              </div>

              {/* Scenarios Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Сценарии реализации риска</h2>
                {risk.scenarios.length > 0 ? (
                  risk.scenarios.map((scenario) => (
                    <div 
                      key={scenario.id}
                      className="p-4 bg-accent/50 rounded-xl border border-border"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm mb-1">
                            Групповой сценарий: {scenario.groupScenario}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {scenario.description}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-muted-foreground mb-1">Доля оценки, %</p>
                          <p className="text-2xl font-bold">{scenario.percentage}%</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">Сценарии не добавлены</p>
                )}
              </div>

              {/* Mirroring Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Зеркалирование</h2>
                {risk.mirrors.length > 0 ? (
                  <div className="space-y-3">
                    {risk.mirrors.map((mirror) => (
                      <div 
                        key={mirror.id}
                        className="p-4 bg-accent/50 rounded-xl border border-border flex items-center gap-4"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">Подразделение</p>
                          <p className="text-muted-foreground">{mirror.subdivision}</p>
                        </div>
                        <div className="text-center px-4">
                          <p className="text-xs text-muted-foreground mb-1">Факт</p>
                          <p className="font-medium">{mirror.fact} млн ({mirror.factPercentage}%)</p>
                        </div>
                        <div className="text-center px-4">
                          <p className="text-xs text-muted-foreground mb-1">% зеркала</p>
                          <p className="font-medium">{mirror.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Зеркала не добавлены</p>
                )}
              </div>

              {/* Measures Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Меры</h2>
                <div className="space-y-3">
                  {mockMeasures.map((measure) => (
                    <div 
                      key={measure.id}
                      className="p-4 bg-card rounded-xl border border-border flex items-center gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{measure.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {measure.id} • Плановая дата: {measure.plannedDate}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="bg-primary/10 text-primary border-primary"
                      >
                        {measure.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - Details sidebar */}
            <div className="space-y-4">
              <div className="p-4 bg-card rounded-xl border border-border space-y-3">
                <h3 className="font-semibold">Детали</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Статус:</span>
                    <span className={cn(
                      "font-medium",
                      risk.status === 'Утверждён' && "text-primary",
                      risk.status === 'В работе' && "text-chart-yellow"
                    )}>{risk.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Источник:</span>
                    <span>{risk.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Дата создания:</span>
                    <span>{risk.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Автор:</span>
                    <span className="text-right">{risk.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Подразделение:</span>
                    <span className="text-right max-w-[180px]">{risk.subdivision}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-card rounded-xl border border-border space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Стратегия:</span>
                  <span className="font-medium">{risk.responseStrategy}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full gap-2">
                <History className="w-4 h-4" />
                История изменений
              </Button>

              <Button variant="outline" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Мера
              </Button>
            </div>
          </div>
        </div>
      </FullscreenLightbox>

      <UtilizationDrawer 
        isOpen={utilizationOpen}
        onClose={() => {
          setUtilizationOpen(false);
          setExpandedCard(null);
        }}
      />
    </>
  );
}

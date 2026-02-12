import { useState } from 'react';
import { History, Plus, FileText, Sparkles, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FullscreenLightbox } from '@/components/ui/fullscreen-lightbox';
import { UtilizationDrawer } from './UtilizationDrawer';
import { HistoryDrawer } from './HistoryDrawer';
import { UtilizationCard } from './UtilizationCard';
import { Risk } from '@/types/risk';
import { cn } from '@/lib/utils';
import { mockMeasures } from '@/data/mockRisks';

interface RiskDetailViewProps {
  risk: Risk | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (risk: Risk) => void;
}

function StatusTag({ status }: { status: Risk['status'] }) {
  const colorMap: Record<Risk['status'], string> = {
    'Черновик': 'text-muted-foreground border-muted-foreground/40',
    'В работе': 'text-foreground border-border',
    'На согласовании': 'text-orange-500 border-orange-300',
    'Утверждён': 'text-primary border-primary/40',
  };
  return (
    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium border bg-transparent", colorMap[status])}>
      {status}
    </span>
  );
}

function RiskLevelBadge({ level }: { level: Risk['riskLevel'] }) {
  const map: Record<Risk['riskLevel'], string> = {
    'Высокий': 'bg-destructive/10 text-destructive border-destructive/30',
    'Средний': 'bg-[hsl(var(--chart-yellow))]/10 text-[hsl(var(--chart-yellow))] border-[hsl(var(--chart-yellow))]/30',
    'Низкий': 'bg-primary/10 text-primary border-primary/30',
  };
  return (
    <span className={cn("text-xs px-2 py-0.5 rounded font-medium border", map[level])}>
      {level}
    </span>
  );
}

// Sticky nav chips
const sections = [
  { id: 'utilization', label: 'Утилизация' },
  { id: 'potential', label: 'Потенциальные потери' },
  { id: 'scenarios', label: 'Сценарии' },
  { id: 'connections', label: 'Связи' },
];

export function RiskDetailView({ risk, isOpen, onClose, onEdit }: RiskDetailViewProps) {
  const [utilizationOpen, setUtilizationOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  if (!risk) return null;

  const potentialDelta = 12; // mock: % change from last period

  return (
    <>
      <FullscreenLightbox isOpen={isOpen} onClose={onClose} title="">
        <div className="grid grid-cols-[1fr,300px] gap-6">
          {/* Main content */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-xl font-semibold">
                {risk.id}: {risk.riskName}
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-sm text-muted-foreground">{risk.process}</span>
                <RiskLevelBadge level={risk.riskLevel} />
                <StatusTag status={risk.status} />
              </div>
            </div>

            {/* AI Alert */}
            <div className="flex items-start gap-3 p-4 rounded-xl border" style={{
              backgroundColor: 'hsl(var(--ai-alert))',
              borderColor: 'hsl(var(--ai-alert-border))',
            }}>
              <Sparkles className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'hsl(var(--ai-alert-foreground))' }} />
              <div className="space-y-1">
                <p className="text-sm font-medium" style={{ color: 'hsl(var(--ai-alert-foreground))' }}>
                  Рекомендация AI-ассистента
                </p>
                <p className="text-sm text-muted-foreground">
                  Обнаружен новый сценарий реализации риска на основе инцидента EVE-171185. 
                  Рекомендуется пересмотреть стратегию реагирования.
                </p>
              </div>
            </div>

            {/* Nav chips */}
            <div className="sticky top-0 z-10 bg-background py-2 -mx-1 px-1 flex gap-2">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/40 hover:text-primary transition-colors text-muted-foreground"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Potential Losses */}
            <section id="potential" className="space-y-3">
              <h2 className="text-base font-semibold">Потенциальные потери</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-xs text-muted-foreground mb-1">Рискоемкость</p>
                  <p className="text-lg font-bold">{risk.potentialLosses > 0 ? `${risk.potentialLosses.toLocaleString('ru-RU')} млн` : '—'}</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-xs text-muted-foreground mb-1">Вероятность</p>
                  <p className="text-lg font-bold">0.3%</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-xs text-muted-foreground mb-1">Динамика к пред. периоду</p>
                  <div className="flex items-center gap-1.5">
                    {potentialDelta > 0 ? (
                      <TrendingUp className="w-4 h-4 text-destructive" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-primary" />
                    )}
                    <span className={cn("text-lg font-bold", potentialDelta > 0 ? "text-destructive" : "text-primary")}>
                      {potentialDelta > 0 ? '+' : ''}{potentialDelta}%
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Utilization */}
            <section id="utilization" className="space-y-3">
              <h2 className="text-base font-semibold">Утилизация лимитов</h2>
              <div className="grid grid-cols-3 gap-4">
                <UtilizationCard
                  title="Чистый операционный риск"
                  lossLimit={risk.cleanOpRisk}
                  incidentCount={14}
                  onClick={() => setUtilizationOpen(true)}
                />
                <UtilizationCard
                  title="Оперриск в кредитовании"
                  lossLimit={risk.creditOpRisk}
                  incidentCount={3}
                  onClick={() => setUtilizationOpen(true)}
                />
                <UtilizationCard
                  title="Косвенные потери"
                  lossLimit={risk.indirectLosses}
                  incidentCount={5}
                  onClick={() => setUtilizationOpen(true)}
                />
              </div>
            </section>

            {/* Scenarios */}
            <section id="scenarios" className="space-y-3">
              <h2 className="text-base font-semibold">Сценарии реализации риска</h2>
              {risk.scenarios.length > 0 ? (
                <div className="space-y-3">
                  {risk.scenarios.map((scenario) => (
                    <div key={scenario.id} className="p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{scenario.groupScenario}</h4>
                            <Badge variant="outline" className="text-[10px] bg-[hsl(var(--ai-alert))] text-[hsl(var(--ai-alert-foreground))] border-[hsl(var(--ai-alert-border))]">
                              Новый
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{scenario.description}</p>
                          <div className="flex items-center gap-3 pt-1">
                            <span className="text-xs text-muted-foreground">Доля оценки:</span>
                            <span className="text-sm font-semibold">{scenario.percentage}%</span>
                            {mockMeasures.length > 0 && (
                              <span className="text-xs text-primary">Мера назначена</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Сценарии не добавлены</p>
              )}
            </section>

            {/* Connections */}
            <section id="connections" className="space-y-4">
              <h2 className="text-base font-semibold">Связи</h2>
              
              {/* Measures */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Меры</h3>
                {mockMeasures.map((measure) => (
                  <div key={measure.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{measure.title}</p>
                      <p className="text-xs text-muted-foreground">{measure.id} • {measure.plannedDate}</p>
                    </div>
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/40 shrink-0">
                      {measure.status}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Risk Decisions */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Решения по рискам</h3>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Пересмотр стратегии реагирования</p>
                    <p className="text-xs text-muted-foreground">RSK-001 • 10.02.2026</p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">В работе</Badge>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
              <h3 className="font-semibold text-sm">Детали</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Статус</span>
                  <StatusTag status={risk.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Источник</span>
                  <span>{risk.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Стратегия</span>
                  <span className="font-medium">{risk.responseStrategy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Подразделение</span>
                  <span className="text-right max-w-[160px] text-xs">{risk.subdivision}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Автор</span>
                  <span className="text-right text-xs">{risk.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Согласующие</span>
                  <span className="text-right text-xs">Петров П.П.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Создан</span>
                  <span>{risk.createdAt}</span>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full gap-2" onClick={() => setHistoryOpen(true)}>
              <History className="w-4 h-4" />
              История изменений
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </Button>

            <Button variant="outline" className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Добавить меру
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
              disabled
              title="Удаление запрещено: риск утверждён"
            >
              Удалить риск
            </Button>
          </div>
        </div>
      </FullscreenLightbox>

      <UtilizationDrawer
        isOpen={utilizationOpen}
        onClose={() => setUtilizationOpen(false)}
      />
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </>
  );
}

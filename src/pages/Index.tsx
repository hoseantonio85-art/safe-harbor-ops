import { useState } from 'react';
import { Filter, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/MainLayout';
import { MetricCard } from '@/components/risks/MetricCard';
import { RiskTable } from '@/components/risks/RiskTable';
import { CreateRiskForm } from '@/components/risks/CreateRiskForm';
import { RiskDetailView } from '@/components/risks/RiskDetailView';
import { Badge } from '@/components/ui/badge';
import { mockRisks, summaryMetrics } from '@/data/mockRisks';
import { Risk } from '@/types/risk';

const Index = () => {
  const [risks, setRisks] = useState<Risk[]>(mockRisks);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  
  // Manage mode
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedRiskIds, setSelectedRiskIds] = useState<string[]>([]);

  const handleRiskClick = (risk: Risk) => {
    setSelectedRisk(risk);
    setIsDetailOpen(true);
  };

  const handleCreateRisk = (newRisk: Partial<Risk>) => {
    const fullRisk: Risk = {
      ...newRisk,
      id: newRisk.id || `QNR-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'В работе',
      block: 'Блок Сеть продаж',
      subdivision: newRisk.subdivision || 'Управление продаж и обслуживания',
      process: newRisk.process || '',
      riskName: newRisk.riskProfile || '',
      riskLevel: newRisk.riskLevel || 'Низкий',
      riskProfile: newRisk.riskProfile || '',
      cleanOpRisk: newRisk.cleanOpRisk || { value: 0, utilization: 0 },
      creditOpRisk: newRisk.creditOpRisk || { value: 0, utilization: 0 },
      indirectLosses: newRisk.indirectLosses || { value: 0, utilization: 0 },
      potentialLosses: newRisk.potentialLosses || 0,
      responseStrategy: newRisk.responseStrategy || '',
      qualitativeLosses: newRisk.qualitativeLosses || '',
      scenarios: newRisk.scenarios || [],
      mirrors: newRisk.mirrors || [],
      author: 'Садыков Илья',
      createdAt: new Date().toLocaleDateString('ru-RU'),
      source: 'Ручное создание'
    };
    setRisks([...risks, fullRisk]);
  };

  const handleEditRisk = (risk: Risk) => {
    setEditingRisk(risk);
    setIsDetailOpen(false);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (updatedRisk: Partial<Risk>) => {
    setRisks(risks.map(r => 
      r.id === editingRisk?.id 
        ? { ...r, ...updatedRisk } 
        : r
    ));
    setIsEditOpen(false);
    setEditingRisk(null);
  };

  const handleSelectRisk = (riskId: string) => {
    setSelectedRiskIds(prev => 
      prev.includes(riskId) 
        ? prev.filter(id => id !== riskId)
        : [...prev, riskId]
    );
  };

  const handleToggleManageMode = () => {
    if (isManageMode) {
      setSelectedRiskIds([]);
    }
    setIsManageMode(!isManageMode);
  };

  const handleSendForApproval = () => {
    // Update selected risks status
    setRisks(risks.map(r => 
      selectedRiskIds.includes(r.id) 
        ? { ...r, status: 'На согласовании' as const }
        : r
    ));
    setSelectedRiskIds([]);
    setIsManageMode(false);
  };

  const handleCancelChanges = () => {
    setSelectedRiskIds([]);
    setIsManageMode(false);
  };

  // Calculate new limits when in manage mode
  const getNewLimits = () => {
    const selected = risks.filter(r => selectedRiskIds.includes(r.id));
    return {
      cleanOp: {
        current: 149,
        new: 175,
        diff: 26
      },
      creditOp: {
        current: 420,
        new: 400,
        diff: -20
      },
      indirect: {
        current: 54,
        new: 60,
        diff: 6
      },
      potential: {
        current: 1250,
        new: 1500,
        diff: 250
      }
    };
  };

  const newLimits = getNewLimits();

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Top Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
              <span className="w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {risks.filter(r => r.status === 'В работе' || r.status === 'На согласовании').length}
              </span>
              Задачи
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="outline">Подразделение</Button>
            <Button variant="outline">Период — 2026</Button>
            {!isManageMode ? (
              <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Создать риск
              </Button>
            ) : (
              <Button 
                onClick={handleSendForApproval}
                disabled={selectedRiskIds.length === 0}
                className="gap-2"
              >
                Отправить на согласование
              </Button>
            )}
          </div>
        </div>

        {/* Metric Cards */}
        {!isManageMode ? (
          <div className="grid grid-cols-4 gap-4">
            <MetricCard 
              title="Чистый операционный риск"
              value={`${summaryMetrics.cleanOpRisk.total} млн руб.`}
              subValue={`из ${summaryMetrics.cleanOpRisk.limit} млн руб.`}
              utilization={summaryMetrics.cleanOpRisk.utilization}
              color="emerald"
            />
            <MetricCard 
              title="Опрриск в кредитовании"
              value={`${summaryMetrics.creditOpRisk.total} млн руб.`}
              subValue={`из ${summaryMetrics.creditOpRisk.limit} млн руб.`}
              utilization={summaryMetrics.creditOpRisk.utilization}
              color="cyan"
            />
            <MetricCard 
              title="Косвенные потери"
              value={`${summaryMetrics.indirectLosses.total} млн руб.`}
              subValue={`из ${summaryMetrics.indirectLosses.limit} млн руб.`}
              utilization={summaryMetrics.indirectLosses.utilization}
              color="yellow"
            />
            <MetricCard 
              title="Потенциальные потери"
              value={`${summaryMetrics.potentialLosses.total.toLocaleString('ru-RU')} млн руб.`}
              utilization={0}
              showDonut={false}
              color="pink"
            />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {/* Manage mode metric cards with diffs */}
            <div className="metric-card bg-accent/50 flex items-center gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-1">Чистый операционный риск</h3>
                <p className="text-sm text-muted-foreground">Текущий лимит: {newLimits.cleanOp.current} млн</p>
                <p className="text-sm">
                  Новый лимит: {newLimits.cleanOp.new} млн{' '}
                  <span className="text-primary font-medium">+{newLimits.cleanOp.diff} млн</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="metric-card bg-accent/50 flex items-center gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-1">Опрриск в кредитовании</h3>
                <p className="text-sm text-muted-foreground">Текущий лимит: {newLimits.creditOp.current} млн</p>
                <p className="text-sm">
                  Новый лимит: {newLimits.creditOp.new} млн{' '}
                  <span className="text-destructive font-medium">{newLimits.creditOp.diff} млн</span>
                </p>
              </div>
            </div>
            <div className="metric-card bg-accent/50 flex items-center gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-1">Косвенные потери</h3>
                <p className="text-sm text-muted-foreground">Текущий лимит: {newLimits.indirect.current} млн</p>
                <p className="text-sm">
                  Новый лимит: {newLimits.indirect.new} млн{' '}
                  <span className="text-primary font-medium">+{newLimits.indirect.diff} млн</span>
                </p>
              </div>
            </div>
            <div className="metric-card bg-accent/50 flex items-center gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-1">Потенциальные потери</h3>
                <p className="text-sm text-muted-foreground">Текущая оценка: {newLimits.potential.current} млн</p>
                <p className="text-sm">
                  Новая оценка: {newLimits.potential.new} млн{' '}
                  <span className="text-muted-foreground font-medium">+{newLimits.potential.diff} млн</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Table Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Всего рисков {risks.length}
          </span>
          {!isManageMode ? (
            <Button variant="outline" onClick={handleToggleManageMode}>
              Управление рисками
            </Button>
          ) : (
            <Button variant="outline" onClick={handleCancelChanges}>
              Отменить изменения
            </Button>
          )}
        </div>

        {/* Risk Table */}
        <RiskTable 
          risks={risks}
          onRiskClick={handleRiskClick}
          isManageMode={isManageMode}
          selectedRisks={selectedRiskIds}
          onSelectRisk={handleSelectRisk}
        />
      </div>

      {/* Create Risk Form */}
      <CreateRiskForm 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreateRisk}
      />

      {/* Edit Risk Form */}
      <CreateRiskForm 
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingRisk(null);
        }}
        onSave={handleSaveEdit}
        editRisk={editingRisk}
      />

      {/* Risk Detail View */}
      <RiskDetailView 
        risk={selectedRisk}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedRisk(null);
        }}
        onEdit={handleEditRisk}
      />
    </MainLayout>
  );
};

export default Index;

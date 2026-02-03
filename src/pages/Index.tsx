import { useState, useMemo } from 'react';
import { Filter, Plus, Pencil, Save, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/MainLayout';
import { MetricCard } from '@/components/risks/MetricCard';
import { RiskCard } from '@/components/risks/RiskCard';
import { CreateRiskForm } from '@/components/risks/CreateRiskForm';
import { RiskDetailView } from '@/components/risks/RiskDetailView';
import { Badge } from '@/components/ui/badge';
import { mockRisks } from '@/data/mockRisks';
import { Risk } from '@/types/risk';

type ScreenMode = 'view' | 'edit' | 'draft';

interface DraftLimits {
  [riskId: string]: {
    cleanOpRisk: number;
    creditOpRisk: number;
    indirectLosses: number;
  };
}

const Index = () => {
  const [risks, setRisks] = useState<Risk[]>(mockRisks);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  
  // Screen mode state
  const [screenMode, setScreenMode] = useState<ScreenMode>('view');
  const [draftLimits, setDraftLimits] = useState<DraftLimits>({});
  const [savedDraftLimits, setSavedDraftLimits] = useState<DraftLimits>({});

  // Calculate aggregates based on current mode
  const aggregates = useMemo(() => {
    const limitsToUse = screenMode === 'draft' ? savedDraftLimits : 
                        screenMode === 'edit' ? draftLimits : {};

    let cleanOpTotal = 0;
    let cleanOpLimit = 0;
    let creditOpTotal = 0;
    let creditOpLimit = 0;
    let indirectTotal = 0;
    let indirectLimit = 0;
    let potentialTotal = 0;

    risks.forEach(risk => {
      const draft = limitsToUse[risk.id];
      
      cleanOpTotal += risk.cleanOpRisk.value || 0;
      cleanOpLimit += draft?.cleanOpRisk ?? (risk.cleanOpRisk.limit || 0);
      
      creditOpTotal += risk.creditOpRisk.value || 0;
      creditOpLimit += draft?.creditOpRisk ?? (risk.creditOpRisk.limit || 0);
      
      indirectTotal += risk.indirectLosses.value || 0;
      indirectLimit += draft?.indirectLosses ?? (risk.indirectLosses.limit || 0);
      
      potentialTotal += risk.potentialLosses || 0;
    });

    return {
      cleanOpRisk: {
        total: cleanOpTotal,
        limit: cleanOpLimit,
        utilization: cleanOpLimit > 0 ? Math.round((cleanOpTotal / cleanOpLimit) * 100) : 0
      },
      creditOpRisk: {
        total: creditOpTotal,
        limit: creditOpLimit,
        utilization: creditOpLimit > 0 ? Math.round((creditOpTotal / creditOpLimit) * 100) : 0
      },
      indirectLosses: {
        total: indirectTotal,
        limit: indirectLimit,
        utilization: indirectLimit > 0 ? Math.round((indirectTotal / indirectLimit) * 100) : 0
      },
      potentialLosses: {
        total: potentialTotal
      }
    };
  }, [risks, screenMode, draftLimits, savedDraftLimits]);

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

  const handleLimitChange = (riskId: string, field: 'cleanOpRisk' | 'creditOpRisk' | 'indirectLosses', value: number) => {
    setDraftLimits(prev => ({
      ...prev,
      [riskId]: {
        cleanOpRisk: prev[riskId]?.cleanOpRisk ?? (risks.find(r => r.id === riskId)?.cleanOpRisk.limit || 0),
        creditOpRisk: prev[riskId]?.creditOpRisk ?? (risks.find(r => r.id === riskId)?.creditOpRisk.limit || 0),
        indirectLosses: prev[riskId]?.indirectLosses ?? (risks.find(r => r.id === riskId)?.indirectLosses.limit || 0),
        [field]: value
      }
    }));
  };

  const handleStartEdit = () => {
    // Initialize draft with current or saved values
    const initialDraft: DraftLimits = {};
    risks.forEach(risk => {
      initialDraft[risk.id] = savedDraftLimits[risk.id] || {
        cleanOpRisk: risk.cleanOpRisk.limit || 0,
        creditOpRisk: risk.creditOpRisk.limit || 0,
        indirectLosses: risk.indirectLosses.limit || 0
      };
    });
    setDraftLimits(initialDraft);
    setScreenMode('edit');
  };

  const handleSaveDraft = () => {
    setSavedDraftLimits(draftLimits);
    setScreenMode('draft');
  };

  const handleCancelEdit = () => {
    setDraftLimits({});
    setScreenMode(Object.keys(savedDraftLimits).length > 0 ? 'draft' : 'view');
  };

  const handleDiscardDraft = () => {
    setSavedDraftLimits({});
    setDraftLimits({});
    setScreenMode('view');
  };

  const handleSendForApproval = () => {
    // Apply draft limits to risks and change status
    const changedRiskIds = Object.keys(savedDraftLimits);
    setRisks(risks.map(r => {
      if (changedRiskIds.includes(r.id)) {
        return {
          ...r,
          status: 'На согласовании' as const,
          cleanOpRisk: { ...r.cleanOpRisk, limit: savedDraftLimits[r.id].cleanOpRisk },
          creditOpRisk: { ...r.creditOpRisk, limit: savedDraftLimits[r.id].creditOpRisk },
          indirectLosses: { ...r.indirectLosses, limit: savedDraftLimits[r.id].indirectLosses }
        };
      }
      return r;
    }));
    setSavedDraftLimits({});
    setDraftLimits({});
    setScreenMode('view');
  };

  const changedRisksCount = Object.keys(
    screenMode === 'draft' ? savedDraftLimits : draftLimits
  ).filter(id => {
    const risk = risks.find(r => r.id === id);
    const draft = screenMode === 'draft' ? savedDraftLimits[id] : draftLimits[id];
    if (!risk || !draft) return false;
    return (
      draft.cleanOpRisk !== (risk.cleanOpRisk.limit || 0) ||
      draft.creditOpRisk !== (risk.creditOpRisk.limit || 0) ||
      draft.indirectLosses !== (risk.indirectLosses.limit || 0)
    );
  }).length;

  const getModeLabel = () => {
    switch (screenMode) {
      case 'edit':
        return 'Редактирование лимитов';
      case 'draft':
        return 'Черновик изменений';
      default:
        return null;
    }
  };

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
            {getModeLabel() && (
              <Badge 
                variant={screenMode === 'edit' ? 'default' : 'secondary'} 
                className="gap-1.5 px-3 py-1.5 text-sm"
              >
                {getModeLabel()}
                {changedRisksCount > 0 && (
                  <span className="ml-1 text-xs opacity-80">
                    ({changedRisksCount} изм.)
                  </span>
                )}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="outline">Подразделение</Button>
            <Button variant="outline">Период — 2026</Button>
            
            {screenMode === 'view' && (
              <>
                <Button variant="outline" onClick={handleStartEdit} className="gap-2">
                  <Pencil className="w-4 h-4" />
                  Редактировать
                </Button>
                <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Создать риск
                </Button>
              </>
            )}

            {screenMode === 'edit' && (
              <>
                <Button variant="outline" onClick={handleCancelEdit} className="gap-2">
                  <X className="w-4 h-4" />
                  Отмена
                </Button>
                <Button onClick={handleSaveDraft} className="gap-2">
                  <Save className="w-4 h-4" />
                  Сохранить черновик
                </Button>
              </>
            )}

            {screenMode === 'draft' && (
              <>
                <Button variant="outline" onClick={handleDiscardDraft}>
                  Отменить изменения
                </Button>
                <Button variant="outline" onClick={handleStartEdit} className="gap-2">
                  <Pencil className="w-4 h-4" />
                  Продолжить редактирование
                </Button>
                <Button onClick={handleSendForApproval} className="gap-2">
                  <Send className="w-4 h-4" />
                  Отправить на согласование
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard 
            title="Чистый операционный риск"
            value={`${aggregates.cleanOpRisk.total.toLocaleString('ru-RU')} млн руб.`}
            subValue={`из ${aggregates.cleanOpRisk.limit.toLocaleString('ru-RU')} млн руб.`}
            utilization={aggregates.cleanOpRisk.utilization}
            color="emerald"
          />
          <MetricCard 
            title="Опрриск в кредитовании"
            value={`${aggregates.creditOpRisk.total.toLocaleString('ru-RU')} млн руб.`}
            subValue={`из ${aggregates.creditOpRisk.limit.toLocaleString('ru-RU')} млн руб.`}
            utilization={aggregates.creditOpRisk.utilization}
            color="cyan"
          />
          <MetricCard 
            title="Косвенные потери"
            value={`${aggregates.indirectLosses.total.toLocaleString('ru-RU')} млн руб.`}
            subValue={`из ${aggregates.indirectLosses.limit.toLocaleString('ru-RU')} млн руб.`}
            utilization={aggregates.indirectLosses.utilization}
            color="yellow"
          />
          <MetricCard 
            title="Потенциальные потери"
            value={`${aggregates.potentialLosses.total.toLocaleString('ru-RU')} млн руб.`}
            utilization={0}
            showDonut={false}
            color="pink"
          />
        </div>

        {/* List Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Всего рисков {risks.length}
          </span>
        </div>

        {/* Risk Cards List */}
        <div className="space-y-3">
          {risks.map((risk) => (
            <RiskCard
              key={risk.id}
              risk={risk}
              mode={screenMode}
              draftLimits={screenMode === 'draft' ? savedDraftLimits[risk.id] : draftLimits[risk.id]}
              onLimitChange={handleLimitChange}
              onRiskClick={handleRiskClick}
            />
          ))}
        </div>
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

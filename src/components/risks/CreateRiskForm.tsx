import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FullscreenLightbox } from '@/components/ui/fullscreen-lightbox';
import { Risk, Scenario, Mirror } from '@/types/risk';

interface CreateRiskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (risk: Partial<Risk>) => void;
  editRisk?: Risk | null;
}

const processes = [
  'П871 Обслуживание клиента в канале Супербанк Онлайн',
  'П868 Выдача потребительского кредита',
  'П2878 Управление продаж и обслуживания',
  'П1243 Кассовые операции',
  'П1034 Инкассация и хранение ценностей',
];

const riskProfiles = [
  'Внутреннее мошенничество с целью получения выгоды',
  'Кредитный риск',
  'Операционный риск',
  'Регуляторный риск',
  'Имущественный риск',
];

const strategies = ['Принять', 'Минимизировать', 'Передать', 'Избежать'];
const qualitativeLossTypes = ['Нет', 'Репутационные', 'Регуляторные', 'Стратегические'];

export function CreateRiskForm({ isOpen, onClose, onSave, editRisk }: CreateRiskFormProps) {
  const [process, setProcess] = useState(editRisk?.process || '');
  const [riskProfile, setRiskProfile] = useState(editRisk?.riskProfile || '');
  const [riskLevel, setRiskLevel] = useState<'Высокий' | 'Средний' | 'Низкий'>(editRisk?.riskLevel || 'Низкий');
  const [strategy, setStrategy] = useState(editRisk?.responseStrategy || '');
  const [qualitativeLosses, setQualitativeLosses] = useState(editRisk?.qualitativeLosses || '');
  
  // Risk capacity and limits
  const [cleanOpRisk, setCleanOpRisk] = useState(editRisk?.cleanOpRisk?.value?.toString() || '0');
  const [cleanOpProb, setCleanOpProb] = useState('');
  const [cleanOpLimit, setCleanOpLimit] = useState(editRisk?.cleanOpRisk?.limit?.toString() || '0');
  
  const [creditOpRisk, setCreditOpRisk] = useState(editRisk?.creditOpRisk?.value?.toString() || '0');
  const [creditOpProb, setCreditOpProb] = useState('');
  const [creditOpLimit, setCreditOpLimit] = useState(editRisk?.creditOpRisk?.limit?.toString() || '0');
  
  const [indirectLosses, setIndirectLosses] = useState(editRisk?.indirectLosses?.value?.toString() || '0');
  const [indirectProb, setIndirectProb] = useState('');
  const [indirectLimit, setIndirectLimit] = useState(editRisk?.indirectLosses?.limit?.toString() || '0');

  // Scenarios
  const [scenarios, setScenarios] = useState<Scenario[]>(editRisk?.scenarios || []);
  
  // Mirrors
  const [mirrors, setMirrors] = useState<Mirror[]>(editRisk?.mirrors || []);

  const addScenario = () => {
    setScenarios([...scenarios, {
      id: Date.now().toString(),
      description: '',
      percentage: 0,
      groupScenario: ''
    }]);
  };

  const removeScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  const updateScenario = (id: string, field: keyof Scenario, value: string | number) => {
    setScenarios(scenarios.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addMirror = () => {
    setMirrors([...mirrors, {
      id: Date.now().toString(),
      subdivision: '',
      percentage: 0
    }]);
  };

  const removeMirror = (id: string) => {
    setMirrors(mirrors.filter(m => m.id !== id));
  };

  const updateMirror = (id: string, field: keyof Mirror, value: string | number) => {
    setMirrors(mirrors.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleSubmit = () => {
    const newRisk: Partial<Risk> = {
      id: editRisk?.id || `QNR-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'В работе',
      block: 'Блок Сеть продаж',
      subdivision: 'Управление продаж и обслуживания',
      process,
      riskProfile,
      riskName: riskProfile,
      riskLevel,
      responseStrategy: strategy,
      qualitativeLosses,
      cleanOpRisk: { value: parseFloat(cleanOpRisk) || 0, utilization: 0, limit: parseFloat(cleanOpLimit) || 0 },
      creditOpRisk: { value: parseFloat(creditOpRisk) || 0, utilization: 0, limit: parseFloat(creditOpLimit) || 0 },
      indirectLosses: { value: parseFloat(indirectLosses) || 0, utilization: 0, limit: parseFloat(indirectLimit) || 0 },
      potentialLosses: 0,
      scenarios,
      mirrors,
      author: 'Садыков Илья',
      createdAt: new Date().toLocaleDateString('ru-RU'),
      source: 'Ручное создание'
    };
    
    onSave(newRisk);
    onClose();
  };

  const getRiskLevelColor = () => {
    switch (riskLevel) {
      case 'Высокий': return 'text-destructive';
      case 'Средний': return 'text-chart-yellow';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <FullscreenLightbox
      isOpen={isOpen}
      onClose={onClose}
      title={editRisk ? 'Редактирование риска' : 'Создание риска'}
      actions={
        <>
          <Button variant="outline" onClick={onClose}>Отмена</Button>
          <Button onClick={handleSubmit}>Сохранить</Button>
        </>
      }
    >
      {/* Risk Level Badge */}
      <div className="flex justify-end mb-6">
        <div className="px-4 py-2 border border-border rounded-lg bg-muted/30">
          <span className="text-sm text-muted-foreground">Уровень риска - </span>
          <span className={`text-sm font-medium ${getRiskLevelColor()}`}>{riskLevel}</span>
        </div>
      </div>

      {/* Risk Parameters Section */}
      <div className="form-section">
        <h2 className="text-lg font-semibold mb-4">Параметры риска</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Процесс<span className="text-destructive">*</span></Label>
            <Select value={process} onValueChange={setProcess}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {processes.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Профиль риска<span className="text-destructive">*</span></Label>
            <Select value={riskProfile} onValueChange={setRiskProfile}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {riskProfiles.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Risk Capacity Section */}
      <div className="form-section">
        <h2 className="text-lg font-semibold mb-4">Рискоемкость и лимит</h2>
        <div className="space-y-4">
          {/* Clean Op Risk */}
          <div className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Чистый операционный риск</Label>
              <Input value={cleanOpRisk} onChange={e => setCleanOpRisk(e.target.value)} placeholder="0 руб." />
            </div>
            <div className="space-y-2 w-24">
              <Label className="text-muted-foreground">Вероятность</Label>
              <Input value={cleanOpProb} onChange={e => setCleanOpProb(e.target.value)} placeholder="%" />
            </div>
            <div className="space-y-2 w-32">
              <Label className="text-muted-foreground">Лимит</Label>
              <Input value={cleanOpLimit} onChange={e => setCleanOpLimit(e.target.value)} placeholder="0 руб." />
            </div>
            {editRisk && (
              <>
                <div className="space-y-2 w-32">
                  <Label className="text-muted-foreground">Лимит прошлого года</Label>
                  <Input disabled value="500 руб." className="bg-muted" />
                </div>
                <div className="space-y-2 w-32">
                  <Label className="text-muted-foreground">Утилизация прошлого года</Label>
                  <Input disabled value="75%" className="bg-chart-yellow/10 text-chart-yellow" />
                </div>
              </>
            )}
          </div>
          
          {/* Credit Op Risk */}
          <div className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Операционный риск в кредитовании</Label>
              <Input value={creditOpRisk} onChange={e => setCreditOpRisk(e.target.value)} placeholder="0 руб." />
            </div>
            <div className="space-y-2 w-24">
              <Label className="text-muted-foreground">Вероятность</Label>
              <Input value={creditOpProb} onChange={e => setCreditOpProb(e.target.value)} placeholder="%" />
            </div>
            <div className="space-y-2 w-32">
              <Label className="text-muted-foreground">Лимит</Label>
              <Input value={creditOpLimit} onChange={e => setCreditOpLimit(e.target.value)} placeholder="0 руб." />
            </div>
            {editRisk && (
              <>
                <div className="space-y-2 w-32">
                  <Input disabled value="0 руб." className="bg-muted" />
                </div>
                <div className="space-y-2 w-32">
                  <Input disabled value="N/A" className="bg-muted" />
                </div>
              </>
            )}
          </div>
          
          {/* Indirect Losses */}
          <div className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Косвенные потери</Label>
              <Input value={indirectLosses} onChange={e => setIndirectLosses(e.target.value)} placeholder="0 руб." />
            </div>
            <div className="space-y-2 w-24">
              <Label className="text-muted-foreground">Вероятность</Label>
              <Input value={indirectProb} onChange={e => setIndirectProb(e.target.value)} placeholder="%" />
            </div>
            <div className="space-y-2 w-32">
              <Label className="text-muted-foreground">Лимит</Label>
              <Input value={indirectLimit} onChange={e => setIndirectLimit(e.target.value)} placeholder="0 руб." />
            </div>
            {editRisk && (
              <>
                <div className="space-y-2 w-32">
                  <Input disabled value="0 руб." className="bg-muted" />
                </div>
                <div className="space-y-2 w-32">
                  <Input disabled value="N/Ф" className="bg-muted" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Strategy Section */}
      <div className="form-section">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Стратегия реагирование<span className="text-destructive">*</span></Label>
            <Select value={strategy} onValueChange={setStrategy}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Выбрать" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {strategies.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Качественные потери</Label>
            <Select value={qualitativeLosses} onValueChange={setQualitativeLosses}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Выбрать" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {qualitativeLossTypes.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Scenarios Section */}
      <div className="form-section">
        <h2 className="text-lg font-semibold mb-4">Сценарии реализации риска</h2>
        <div className="space-y-4">
          {scenarios.map((scenario, index) => (
            <div key={scenario.id} className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <Label>Сценарий {index + 1}{index === 0 && <span className="text-destructive">*</span>}</Label>
                  <Textarea 
                    value={scenario.description}
                    onChange={e => updateScenario(scenario.id, 'description', e.target.value)}
                    placeholder="Описание сценария..."
                    className="min-h-[100px]"
                  />
                  <p className="text-sm text-primary">
                    Групповой сценарий: {scenario.groupScenario || 'Предоставление недостоверных сведений клиентом'}
                  </p>
                </div>
                <div className="space-y-2 w-28">
                  <Label>% оценки</Label>
                  <Input 
                    value={scenario.percentage}
                    onChange={e => updateScenario(scenario.id, 'percentage', parseInt(e.target.value) || 0)}
                    placeholder="0 %"
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="mt-7"
                  onClick={() => removeScenario(scenario.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <Button variant="ghost" className="gap-2 text-primary hover:text-primary hover:bg-primary/10" onClick={addScenario}>
            <Plus className="w-5 h-5 bg-primary text-primary-foreground rounded-full p-0.5" />
            Добавить сценарий
          </Button>
        </div>
      </div>

      {/* Mirroring Section */}
      <div className="form-section">
        <h2 className="text-lg font-semibold mb-4">Зеркалирование</h2>
        <div className="space-y-4">
          {mirrors.map((mirror) => (
            <div key={mirror.id} className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 items-end">
              <div className="space-y-2">
                <Label>Подразделение<span className="text-destructive">*</span></Label>
                <Input 
                  value={mirror.subdivision}
                  onChange={e => updateMirror(mirror.id, 'subdivision', e.target.value)}
                  placeholder="Дивизион «Кошечки и собачки»"
                />
              </div>
              <div className="space-y-2 w-24">
                <Label>% зеркала<span className="text-destructive">*</span></Label>
                <Input 
                  value={mirror.percentage}
                  onChange={e => updateMirror(mirror.id, 'percentage', parseInt(e.target.value) || 0)}
                  placeholder="30 %"
                />
              </div>
              {editRisk && (
                <>
                  <div className="space-y-2 w-32">
                    <Label className="text-muted-foreground">Лимит прошлого года</Label>
                    <Input disabled value={mirror.limitLastYear || '200 руб.'} className="bg-muted" />
                  </div>
                  <div className="space-y-2 w-40">
                    <Label className="text-muted-foreground">Факт/утилизация прошлого года</Label>
                    <Input disabled value={mirror.utilizationLastYear || '150 руб. / 75%'} className="bg-muted" />
                  </div>
                </>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => removeMirror(mirror.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <Button variant="ghost" className="gap-2 text-primary hover:text-primary hover:bg-primary/10" onClick={addMirror}>
            <Plus className="w-5 h-5 bg-primary text-primary-foreground rounded-full p-0.5" />
            Добавить зеркало
          </Button>
        </div>
      </div>
    </FullscreenLightbox>
  );
}

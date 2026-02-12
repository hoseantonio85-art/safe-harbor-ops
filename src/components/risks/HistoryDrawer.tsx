import { ChevronLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface HistoryEntry {
  id: string;
  date: string;
  author: string;
  action: string;
  comment?: string;
}

const mockHistory: HistoryEntry[] = [
  { id: '1', date: '10.02.2026', author: 'Иванов И.И.', action: 'Изменён уровень риска: Средний → Высокий', comment: 'По результатам анализа инцидентов за январь' },
  { id: '2', date: '05.02.2026', author: 'Система', action: 'Добавлен новый сценарий', comment: 'Автоматическое добавление на основе инцидента EVE-171185' },
  { id: '3', date: '28.01.2026', author: 'Петров П.П.', action: 'Утверждён лимит на 2026', },
  { id: '4', date: '20.01.2026', author: 'Иванов И.И.', action: 'Изменена стратегия реагирования: Минимизировать → Принять' },
  { id: '5', date: '15.01.2026', author: 'Иванов И.И.', action: 'Риск создан' },
];

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryDrawer({ isOpen, onClose }: HistoryDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[420px] sm:max-w-[420px] p-0 bg-card">
        <div className="h-full flex flex-col">
          <SheetHeader className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="hover:bg-muted p-1 rounded">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <SheetTitle className="text-lg font-semibold">История изменений</SheetTitle>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-auto px-6 py-4">
            <div className="relative pl-6">
              {/* Timeline line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

              <div className="space-y-6">
                {mockHistory.map((entry) => (
                  <div key={entry.id} className="relative">
                    {/* Dot */}
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-primary bg-card" />
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{entry.date}</span>
                        <span>•</span>
                        <span>{entry.author}</span>
                      </div>
                      <p className="text-sm font-medium">{entry.action}</p>
                      {entry.comment && (
                        <p className="text-xs text-muted-foreground">{entry.comment}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

import { Search, HelpCircle, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function AppHeader() {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shrink-0">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Поиск по идентификатору" 
          className="pl-10 bg-background border-border"
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              СИ
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <div className="font-medium">Садыков Илья</div>
            <div className="text-muted-foreground text-xs">Руководитель направления</div>
          </div>
        </div>

        <button className="p-2 hover:bg-muted rounded-lg transition-colors ml-2">
          <LogOut className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}

import { Flame, ShieldAlert, ChevronRight, LayoutGrid, ClipboardCheck } from 'lucide-react';
import { Projeto } from '../types';

interface HeaderProps {
  activeProject: Projeto | null;
  activeView: string;
  onNavigate: (view: string) => void;
  onCloseProject: () => void;
}

export default function Header({ activeProject, activeView, onNavigate, onCloseProject }: HeaderProps) {
  const getStepNumber = (view: string) => {
    switch (view) {
      case 'project': return 1;
      case 'blocks': return 2;
      case 'environment_form': return 3;
      case 'device_selector': return 4;
      case 'environment_summary': return 5;
      case 'general_summary': return 6;
      default: return 0;
    }
  };

  const stepNumber = getStepNumber(activeView);

  return (
    <header id="app-header" className="sticky top-0 z-50 w-full bg-slate-900 text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and App Title */}
          <div 
            id="app-logo-container"
            className="flex items-center space-x-2 cursor-pointer select-none"
            onClick={() => {
              if (activeProject) {
                if (confirm('Deseja voltar ao painel principal? O progresso do projeto atual está salvo.')) {
                  onCloseProject();
                }
              } else {
                onNavigate('dashboard');
              }
            }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-900 shadow-inner">
              <Flame className="h-6 w-6 animate-pulse text-slate-950" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">
                Rio<span className="text-amber-400"> Sistemas</span>
              </span>
              <span className="ml-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">
                SURVEY
              </span>
            </div>
          </div>

          {/* Active Project & Navigation */}
          {activeProject && (
            <div id="active-project-info" className="hidden sm:flex items-center space-x-2 text-sm text-slate-300">
              <span className="font-medium text-slate-100">{activeProject.cliente}</span>
              <ChevronRight className="h-4 w-4 text-slate-500" />
              <span className="text-amber-400 font-medium truncate max-w-[150px]">
                {activeProject.nome}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div id="header-actions" className="flex items-center space-x-3">
            {activeProject ? (
              <button
                id="btn-back-dashboard"
                onClick={() => {
                  if (confirm('Deseja voltar ao painel principal? Seu projeto está salvo.')) {
                    onCloseProject();
                  }
                }}
                className="flex items-center space-x-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 active:scale-95 transition-all"
              >
                <LayoutGrid className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden md:inline">Painel Geral</span>
              </button>
            ) : (
              <div className="flex items-center text-xs text-slate-400 font-mono">
                <ShieldAlert className="mr-1 h-3.5 w-3.5 text-amber-500" />
                <span>Normas NBR 17240 / 5410</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Wizard Bar (Only when inside a project survey) */}
      {activeProject && stepNumber > 0 && (
        <div id="progress-bar-container" className="h-1.5 w-full bg-slate-800">
          <div
            id="progress-bar-fill"
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
            style={{ width: `${(stepNumber / 6) * 100}%` }}
          />
        </div>
      )}

      {/* Mobile Breadcrumb / Step Indicator */}
      {activeProject && stepNumber > 0 && (
        <div id="mobile-step-indicator" className="flex items-center justify-between bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 sm:hidden">
          <div className="truncate max-w-[60%]">
            <span className="text-slate-400">Projeto: </span>
            <span className="font-semibold text-slate-200">{activeProject.nome}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 font-mono text-amber-400 font-bold">
              Etapa {stepNumber}/6
            </span>
            <span className="font-semibold text-slate-100">
              {stepNumber === 1 && 'Projeto'}
              {stepNumber === 2 && 'Edificações'}
              {stepNumber === 3 && 'Ambiente'}
              {stepNumber === 4 && 'Dispositivos'}
              {stepNumber === 5 && 'Resumo'}
              {stepNumber === 6 && 'Conclusão'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}

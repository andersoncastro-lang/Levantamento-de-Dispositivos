import React from 'react';
import { Ambiente } from '../types';
import { Edit3, Plus, CheckCircle, ArrowRight, Layers, Ruler, FileText, ClipboardCheck, LayoutGrid } from 'lucide-react';

interface EnvironmentSummaryProps {
  environment: Ambiente;
  blockName: string;
  onEdit: () => void;
  onAddNewEnvironment: () => void;
  onFinalize: () => void;
}

export default function EnvironmentSummary({ environment, blockName, onEdit, onAddNewEnvironment, onFinalize }: EnvironmentSummaryProps) {
  const totalDevices = environment.dispositivos?.reduce((acc, d) => acc + d.quantidade, 0) || 0;

  return (
    <div id="environment-summary-container" className="max-w-xl mx-auto space-y-6">
      {/* Success Badge */}
      <div id="summary-success-badge" className="flex flex-col items-center justify-center text-center p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3 shadow-inner">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Ambiente Cadastrado!
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          O ambiente <span className="font-semibold text-slate-800">"{environment.nome}"</span> foi salvo com sucesso.
        </p>
      </div>

      {/* Info Card Sheet */}
      <div id="summary-spec-card" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="inline-block rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 uppercase">
              {blockName}
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1.5 flex items-center space-x-1.5">
              <span className="text-amber-500 font-mono">[{environment.codigo}]</span>
              <span>{environment.nome}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Tipo: {environment.tipo}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-slate-900">{totalDevices}</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dispositivos</p>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-3 rounded-xl bg-slate-50 p-3">
            <div className="text-slate-500 shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Área total</p>
              <p className="font-bold text-slate-800 mt-0.5">{environment.area} m²</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 rounded-xl bg-slate-50 p-3">
            <div className="text-slate-500 shrink-0">
              <Ruler className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pé-direito</p>
              <p className="font-bold text-slate-800 mt-0.5">{environment.peDireito} m</p>
            </div>
          </div>
        </div>

        {/* Detailed device list inside */}
        {environment.dispositivos && environment.dispositivos.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lista de Itens Cadastrados</span>
            <div className="divide-y divide-slate-100 max-h-[150px] overflow-y-auto pr-1">
              {environment.dispositivos.map((dev) => (
                <div key={dev.id} className="flex justify-between py-2 text-xs">
                  <div className="truncate pr-4">
                    <span className="font-semibold text-slate-800">{dev.nome}</span>
                    <span className="ml-1.5 text-[9px] text-slate-400 bg-slate-100 px-1 rounded uppercase">
                      {dev.categoria}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-700 shrink-0">x{dev.quantidade}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Observations */}
        {environment.observacoes && (
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs text-slate-600">
            <span className="font-bold text-slate-700 block mb-0.5">Observações:</span>
            <p className="italic">"{environment.observacoes}"</p>
          </div>
        )}
      </div>

      {/* Large Big Action Buttons (Touch friendly) */}
      <div id="summary-actions" className="grid gap-3 pt-2">
        {/* Adicionar novo ambiente (Primary/CTA) */}
        <button
          id="btn-add-another-environment"
          onClick={onAddNewEnvironment}
          className="flex w-full items-center justify-center space-x-2 rounded-xl bg-amber-500 py-4 text-base font-bold text-slate-950 shadow-md hover:bg-amber-400 active:scale-98 transition-all"
        >
          <Plus className="h-5 w-5" />
          <span>Cadastrar Outro Ambiente</span>
        </button>

        {/* Finalizar Projeto */}
        <button
          id="btn-finalize-project-summary"
          onClick={onFinalize}
          className="flex w-full items-center justify-center space-x-2 rounded-xl bg-slate-900 py-3.5 text-base font-bold text-white shadow-sm hover:bg-slate-800 active:scale-98 transition-all"
        >
          <ClipboardCheck className="h-5 w-5 text-amber-400" />
          <span>Finalizar Projeto e Ver Resumo Geral</span>
        </button>

        {/* Editar */}
        <button
          id="btn-edit-current-environment"
          onClick={onEdit}
          className="flex w-full items-center justify-center space-x-2 rounded-xl border border-slate-300 bg-white py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 active:scale-98 transition-all"
        >
          <Edit3 className="h-4.5 w-4.5 text-slate-500" />
          <span>Editar Este Ambiente</span>
        </button>
      </div>
    </div>
  );
}

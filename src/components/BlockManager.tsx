import React, { useState } from 'react';
import { Bloco, Projeto } from '../types';
import { Plus, Trash2, ArrowRight, ArrowLeft, Lightbulb, Building2, Layers } from 'lucide-react';

interface BlockManagerProps {
  project: Projeto;
  onSaveBlocks: (blocks: Bloco[]) => void;
  onNavigate: (view: string) => void;
  onAddFirstEnvironment: (blockId: string) => void;
}

export const SUGGESTED_BLOCKS = [
  'CD-01',
  'CD-02',
  'Administrativo',
  'Produção',
  'Utilidades',
  'Almoxarifado'
];

export default function BlockManager({ project, onSaveBlocks, onNavigate, onAddFirstEnvironment }: BlockManagerProps) {
  const [blocks, setBlocks] = useState<Bloco[]>(project.blocos || []);
  const [newBlockName, setNewBlockName] = useState('');
  const [error, setError] = useState('');

  const handleAddBlock = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('O nome do bloco não pode ser vazio');
      return;
    }

    if (blocks.some((b) => b.nome.toLowerCase() === trimmedName.toLowerCase())) {
      setError('Um bloco com este nome já existe');
      return;
    }

    const newBlock: Bloco = {
      id: `bloco_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nome: trimmedName
    };

    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    onSaveBlocks(updatedBlocks);
    setNewBlockName('');
    setError('');
  };

  const handleRemoveBlock = (id: string) => {
    const blockHasEnvironments = project.ambientes?.some((env) => env.blocoId === id);
    
    if (blockHasEnvironments) {
      if (!confirm('Este bloco possui ambientes cadastrados! Se você remover este bloco, as referências de bloco desses ambientes serão afetadas. Deseja continuar?')) {
        return;
      }
    }

    const updatedBlocks = blocks.filter((b) => b.id !== id);
    setBlocks(updatedBlocks);
    onSaveBlocks(updatedBlocks);
  };

  const handleNext = () => {
    if (blocks.length === 0) {
      setError('Adicione pelo menos um bloco/edificação para prosseguir');
      return;
    }
    // Navigate to cadastrar ambiente
    onNavigate('environment_form');
  };

  return (
    <div id="block-manager-container" className="max-w-2xl mx-auto space-y-6">
      {/* Step Header */}
      <div>
        <button
          id="btn-back-to-project"
          onClick={() => onNavigate('project')}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar para Dados do Projeto</span>
        </button>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Blocos / Edificações
        </h2>
        <p className="text-sm text-slate-500">
          Cadastre as principais estruturas físicas ou blocos da edificação onde o levantamento será feito.
        </p>
      </div>

      {/* Add Block Form Card */}
      <div id="add-block-card" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="new-block-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Nome do Bloco / Setor
          </label>
          <div className="flex space-x-2">
            <input
              id="new-block-name"
              type="text"
              placeholder="Ex: CD-01, Administrativo, Almoxarifado..."
              value={newBlockName}
              onChange={(e) => {
                setNewBlockName(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddBlock(newBlockName);
                }
              }}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-400"
            />
            <button
              id="btn-add-block"
              onClick={() => handleAddBlock(newBlockName)}
              className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 active:scale-95 transition-all flex items-center space-x-1 shrink-0"
            >
              <Plus className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">Adicionar</span>
            </button>
          </div>
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>

        {/* Suggested Chips */}
        <div id="block-suggestions" className="space-y-2">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            <span>Sugestões rápidas (toque para adicionar):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_BLOCKS.map((name) => {
              const exists = blocks.some((b) => b.nome.toLowerCase() === name.toLowerCase());
              return (
                <button
                  id={`chip-suggested-block-${name}`}
                  key={name}
                  onClick={() => handleAddBlock(name)}
                  disabled={exists}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all active:scale-95 ${
                    exists
                      ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900'
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Blocks List Display */}
      <div id="blocks-list" className="space-y-3">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          Blocos Cadastrados ({blocks.length})
        </h3>

        {blocks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-slate-400">
            <Building2 className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm font-medium">Nenhum bloco adicionado ainda.</p>
            <p className="text-xs text-slate-400 mt-0.5">Use o formulário acima ou as sugestões para começar.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {blocks.map((block) => {
              const envs = project.ambientes?.filter((env) => env.blocoId === block.id) || [];
              const devCount = envs.reduce((sum, env) => sum + (env.dispositivos?.reduce((dSum, d) => dSum + d.quantidade, 0) || 0), 0);

              return (
                <div
                  id={`block-item-${block.id}`}
                  key={block.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{block.nome}</h4>
                      <div className="flex items-center space-x-2.5 mt-0.5 text-xs text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Layers className="h-3 w-3 text-slate-400" />
                          <span>{envs.length} {envs.length === 1 ? 'ambiente' : 'ambientes'}</span>
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span>{devCount} dispositivos</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Quick Add Environment to this specific block */}
                    <button
                      id={`btn-add-env-to-block-${block.id}`}
                      onClick={() => onAddFirstEnvironment(block.id)}
                      className="rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs py-1.5 px-2.5 transition-colors"
                      title="Adicionar ambiente neste bloco"
                    >
                      + Add Ambiente
                    </button>
                    
                    {/* Delete Block */}
                    <button
                      id={`btn-delete-block-${block.id}`}
                      onClick={() => handleRemoveBlock(block.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 active:scale-90 transition-all"
                      title="Remover Bloco"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Large Navigation Button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          id="btn-next-to-environments"
          onClick={handleNext}
          className="flex w-full items-center justify-center space-x-2 rounded-xl bg-amber-500 py-3.5 text-base font-bold text-slate-950 shadow-md hover:bg-amber-400 active:scale-98 transition-all"
        >
          <span>Avançar para Ambientes</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

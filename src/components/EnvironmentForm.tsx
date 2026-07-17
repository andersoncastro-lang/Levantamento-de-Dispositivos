import React, { useState, useEffect } from 'react';
import { Ambiente, Bloco, Projeto } from '../types';
import { TIPOS_AMBIENTE } from '../data/predefined';
import { ArrowRight, ArrowLeft, Layers, Ruler, HelpCircle, Shield, Plus, Minus } from 'lucide-react';

interface EnvironmentFormProps {
  project: Projeto;
  editingEnvironment: Partial<Ambiente> | null;
  onSave: (data: Partial<Ambiente>) => void;
  onCancel: () => void;
  initialBlockId?: string;
}

export default function EnvironmentForm({ project, editingEnvironment, onSave, onCancel, initialBlockId }: EnvironmentFormProps) {
  const blocks = project.blocos || [];

  // Auto-generate code if new environment
  const getSuggestedCode = () => {
    if (editingEnvironment?.codigo) return editingEnvironment.codigo;
    const count = project.ambientes?.length || 0;
    const num = String(count + 1).padStart(2, '0');
    return `AMB-${num}`;
  };

  const [codigo, setCodigo] = useState(editingEnvironment?.codigo || '');
  const [blocoId, setBlocoId] = useState(editingEnvironment?.blocoId || initialBlockId || (blocks[0]?.id || ''));
  const [tipo, setTipo] = useState(editingEnvironment?.tipo || 'Escritório');
  const [nome, setNome] = useState(editingEnvironment?.nome || '');
  const [area, setArea] = useState<number>(editingEnvironment?.area || 20); // default 20m²
  const [peDireito, setPeDireito] = useState<number>(editingEnvironment?.peDireito || 3.0); // default 3.0m
  const [observacoes, setObservacoes] = useState(editingEnvironment?.observacoes || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // When new is created or suggested code shifts, set defaults
  useEffect(() => {
    if (!editingEnvironment?.id) {
      setCodigo(getSuggestedCode());
    }
  }, [project.ambientes?.length, editingEnvironment?.id]);

  // When Tipo de Ambiente changes, auto-populate the Name if empty or if name equals previous tipo
  const handleTipoChange = (newTipo: string) => {
    setTipo(newTipo);
    if (!nome || TIPOS_AMBIENTE.includes(nome) || nome === tipo) {
      setNome(newTipo);
    }
  };

  // If name is still empty, default to Selected Tipo on load
  useEffect(() => {
    if (!nome) {
      setNome(tipo);
    }
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!codigo.trim()) newErrors.codigo = 'Código do ambiente é obrigatório';
    if (!blocoId) newErrors.blocoId = 'Selecione um bloco';
    if (!nome.trim()) newErrors.nome = 'Nome do ambiente é obrigatório';
    if (area <= 0) newErrors.area = 'Área deve ser maior que zero';
    if (peDireito <= 0) newErrors.peDireito = 'Pé-direito deve ser maior que zero';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: editingEnvironment?.id, // Keep ID if editing
      codigo: codigo.trim(),
      blocoId,
      tipo,
      nome: nome.trim(),
      area,
      peDireito,
      observacoes: observacoes.trim(),
      dispositivos: editingEnvironment?.dispositivos || [] // Keep devices if editing
    });
  };

  if (blocks.length === 0) {
    return (
      <div id="no-blocks-warning" className="max-w-md mx-auto rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center shadow-sm">
        <Shield className="mx-auto h-12 w-12 text-amber-500 mb-3" />
        <h3 className="text-lg font-bold text-slate-900">Nenhum bloco cadastrado</h3>
        <p className="text-sm text-slate-600 mt-2">
          Antes de cadastrar ambientes, você precisa registrar pelo menos um Bloco ou Edificação.
        </p>
        <button
          id="btn-go-to-blocks"
          onClick={onCancel}
          className="mt-5 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 active:scale-95 transition-all"
        >
          Cadastrar Blocos
        </button>
      </div>
    );
  }

  return (
    <div id="environment-form-container" className="max-w-2xl mx-auto">
      {/* Title Header */}
      <div className="mb-6">
        <button
          id="btn-back-to-last-screen"
          onClick={onCancel}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar</span>
        </button>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {editingEnvironment?.id ? 'Editar Ambiente' : 'Cadastro de Ambiente'}
        </h2>
        <p className="text-sm text-slate-500">
          Defina as características do ambiente físico para o levantamento de dispositivos.
        </p>
      </div>

      {/* Main Form Card */}
      <form id="environment-form" onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        
        {/* Código, Bloco & Tipo Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Código */}
          <div className="space-y-1.5">
            <label htmlFor="codigo" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Código <span className="text-red-500">*</span>
            </label>
            <input
              id="codigo"
              type="text"
              placeholder="Ex: AMB-01"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className={`w-full rounded-xl border py-2.5 px-3.5 text-sm text-slate-900 outline-none transition-all ${
                errors.codigo ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
              }`}
            />
            {errors.codigo && <p className="text-xs text-red-500 font-medium">{errors.codigo}</p>}
          </div>

          {/* Bloco */}
          <div className="space-y-1.5">
            <label htmlFor="blocoId" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Bloco / Edificação <span className="text-red-500">*</span>
            </label>
            <select
              id="blocoId"
              value={blocoId}
              onChange={(e) => setBlocoId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm text-slate-900 bg-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            >
              <option value="" disabled>Selecione um bloco</option>
              {blocks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nome}
                </option>
              ))}
            </select>
            {errors.blocoId && <p className="text-xs text-red-500 font-medium">{errors.blocoId}</p>}
          </div>

          {/* Tipo de Ambiente */}
          <div className="space-y-1.5">
            <label htmlFor="tipo" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Tipo de Ambiente <span className="text-red-500">*</span>
            </label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => handleTipoChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm text-slate-900 bg-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            >
              {TIPOS_AMBIENTE.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Nome do Ambiente */}
        <div className="space-y-1.5">
          <label htmlFor="nome" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Nome Descritivo do Ambiente <span className="text-red-500">*</span>
          </label>
          <input
            id="nome"
            type="text"
            placeholder="Ex: CPD da Administração, Sala Elétrica Principal"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={`w-full rounded-xl border py-2.5 px-3.5 text-sm text-slate-900 outline-none transition-all ${
              errors.nome ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
            }`}
          />
          {errors.nome && <p className="text-xs text-red-500 font-medium">{errors.nome}</p>}
        </div>

        {/* Dimensionamentos (Área e Pé-direito) with quick steppers */}
        <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-100">
          
          {/* Área (m²) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="area" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Área Estimada (m²) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-400 font-mono flex items-center">
                <Layers className="h-3 w-3 mr-0.5" /> m²
              </span>
            </div>
            
            <div className="flex rounded-xl border border-slate-300 overflow-hidden bg-white">
              <button
                id="btn-area-minus"
                type="button"
                onClick={() => setArea(Math.max(1, area - 5))}
                className="flex items-center justify-center w-12 bg-slate-50 border-r border-slate-300 hover:bg-slate-100 text-slate-600 active:scale-95 transition-all shrink-0"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                id="area"
                type="number"
                step="any"
                min="0.1"
                placeholder="Ex: 25.5"
                value={area || ''}
                onChange={(e) => setArea(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full border-none py-2.5 px-3 text-center text-sm font-semibold text-slate-900 focus:outline-none"
              />
              <button
                id="btn-area-plus"
                type="button"
                onClick={() => setArea((area || 0) + 5)}
                className="flex items-center justify-center w-12 bg-slate-50 border-l border-slate-300 hover:bg-slate-100 text-slate-600 active:scale-95 transition-all shrink-0"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {errors.area && <p className="text-xs text-red-500 font-medium">{errors.area}</p>}
          </div>

          {/* Pé-direito (m) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="peDireito" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pé-direito (m) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-400 font-mono flex items-center">
                <Ruler className="h-3 w-3 mr-0.5" /> metros
              </span>
            </div>

            <div className="flex rounded-xl border border-slate-300 overflow-hidden bg-white">
              <button
                id="btn-pe-minus"
                type="button"
                onClick={() => setPeDireito(Math.max(0.5, Math.round((peDireito - 0.5) * 10) / 10))}
                className="flex items-center justify-center w-12 bg-slate-50 border-r border-slate-300 hover:bg-slate-100 text-slate-600 active:scale-95 transition-all shrink-0"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                id="peDireito"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="Ex: 3.5"
                value={peDireito || ''}
                onChange={(e) => setPeDireito(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full border-none py-2.5 px-3 text-center text-sm font-semibold text-slate-900 focus:outline-none"
              />
              <button
                id="btn-pe-plus"
                type="button"
                onClick={() => setPeDireito(Math.round((peDireito + 0.5) * 10) / 10)}
                className="flex items-center justify-center w-12 bg-slate-50 border-l border-slate-300 hover:bg-slate-100 text-slate-600 active:scale-95 transition-all shrink-0"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {errors.peDireito && <p className="text-xs text-red-500 font-medium">{errors.peDireito}</p>}
          </div>

        </div>

        {/* Observações */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label htmlFor="env-observacoes" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Observações do Ambiente (Opcional)
          </label>
          <textarea
            id="env-observacoes"
            placeholder="Ex: Presença de forro mineral removível. Obstáculo de vigas de concreto a cada 2.5m..."
            rows={2}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full rounded-xl border border-slate-300 py-2 px-3 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            id="btn-next-to-devices"
            type="submit"
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-amber-500 py-3.5 text-base font-bold text-slate-950 shadow-md hover:bg-amber-400 active:scale-98 transition-all"
          >
            <span>Adicionar Dispositivos</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

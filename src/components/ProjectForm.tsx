import React, { useState } from 'react';
import { Projeto } from '../types';
import { ESTADOS_BR } from '../data/predefined';
import { ArrowRight, FileText, User, Calendar, MapPin, Building, ArrowLeft } from 'lucide-react';

interface ProjectFormProps {
  project: Partial<Projeto> | null;
  onSave: (data: Partial<Projeto>) => void;
  onCancel: () => void;
}

export default function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  // Use todays date (e.g. 2026-07-17) as default
  const todayStr = new Date().toISOString().split('T')[0];

  const [cliente, setCliente] = useState(project?.cliente || '');
  const [nome, setNome] = useState(project?.nome || '');
  const [endereco, setEndereco] = useState(project?.endereco || '');
  const [cidade, setCidade] = useState(project?.cidade || '');
  const [estado, setEstado] = useState(project?.estado || 'SP');
  const [dataVisita, setDataVisita] = useState(project?.dataVisita || todayStr);
  const [tecnico, setTecnico] = useState(project?.tecnico || '');
  const [observacoes, setObservacoes] = useState(project?.observacoes || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!cliente.trim()) newErrors.cliente = 'Cliente é obrigatório';
    if (!nome.trim()) newErrors.nome = 'Nome do projeto é obrigatório';
    if (!tecnico.trim()) newErrors.tecnico = 'Técnico responsável é obrigatório';
    if (!dataVisita) newErrors.dataVisita = 'Data da visita é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      cliente: cliente.trim(),
      nome: nome.trim(),
      endereco: endereco.trim(),
      cidade: cidade.trim(),
      estado,
      dataVisita,
      tecnico: tecnico.trim(),
      observacoes: observacoes.trim(),
    });
  };

  return (
    <div id="project-form-container" className="max-w-2xl mx-auto">
      {/* Title Header */}
      <div className="mb-6">
        <button
          id="btn-back-to-dashboard-form"
          onClick={onCancel}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar ao painel</span>
        </button>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {project?.id ? 'Editar Dados do Projeto' : 'Iniciar Novo Levantamento'}
        </h2>
        <p className="text-sm text-slate-500">
          Preencha as informações básicas do cliente e da visita técnica.
        </p>
      </div>

      {/* Main Form Card */}
      <form id="project-form" onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Cliente & Projeto Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Cliente */}
          <div className="space-y-1.5">
            <label htmlFor="cliente" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Cliente <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Building className="h-4 w-4" />
              </span>
              <input
                id="cliente"
                type="text"
                placeholder="Ex: Rio Alarme Ltda"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all ${
                  errors.cliente ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                }`}
              />
            </div>
            {errors.cliente && <p className="text-xs text-red-500 font-medium">{errors.cliente}</p>}
          </div>

          {/* Nome do Projeto */}
          <div className="space-y-1.5">
            <label htmlFor="nome" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nome do Projeto / Obra <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <FileText className="h-4 w-4" />
              </span>
              <input
                id="nome"
                type="text"
                placeholder="Ex: Galpão Logístico CD-01"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all ${
                  errors.nome ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                }`}
              />
            </div>
            {errors.nome && <p className="text-xs text-red-500 font-medium">{errors.nome}</p>}
          </div>
        </div>

        {/* Técnico & Data Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Técnico */}
          <div className="space-y-1.5">
            <label htmlFor="tecnico" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Técnico Responsável <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User className="h-4 w-4" />
              </span>
              <input
                id="tecnico"
                type="text"
                placeholder="Ex: Anderson Castro"
                value={tecnico}
                onChange={(e) => setTecnico(e.target.value)}
                className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all ${
                  errors.tecnico ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                }`}
              />
            </div>
            {errors.tecnico && <p className="text-xs text-red-500 font-medium">{errors.tecnico}</p>}
          </div>

          {/* Data da Visita */}
          <div className="space-y-1.5">
            <label htmlFor="dataVisita" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Data da Visita <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Calendar className="h-4 w-4" />
              </span>
              <input
                id="dataVisita"
                type="date"
                value={dataVisita}
                onChange={(e) => setDataVisita(e.target.value)}
                className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all ${
                  errors.dataVisita ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                }`}
              />
            </div>
            {errors.dataVisita && <p className="text-xs text-red-500 font-medium">{errors.dataVisita}</p>}
          </div>
        </div>

        {/* Localização Group */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Endereço da Obra</span>
          
          {/* Endereço */}
          <div className="space-y-1.5">
            <label htmlFor="endereco" className="block text-xs font-semibold text-slate-600">
              Rua, Número e Bairro
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <MapPin className="h-4 w-4" />
              </span>
              <input
                id="endereco"
                type="text"
                placeholder="Ex: Av. das Indústrias, 1500 - Distrito Industrial"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Cidade & Estado */}
          <div className="grid gap-4 grid-cols-3">
            <div className="col-span-2 space-y-1.5">
              <label htmlFor="cidade" className="block text-xs font-semibold text-slate-600">
                Cidade
              </label>
              <input
                id="cidade"
                type="text"
                placeholder="Ex: São Paulo"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="estado" className="block text-xs font-semibold text-slate-600">
                Estado
              </label>
              <select
                id="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm text-slate-900 bg-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              >
                {ESTADOS_BR.map((est) => (
                  <option key={est.sigla} value={est.sigla}>
                    {est.sigla}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Observações Gerais */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label htmlFor="observacoes" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Observações Gerais do Levantamento
          </label>
          <textarea
            id="observacoes"
            placeholder="Ex: Obra em andamento, pé-direito elevado no galpão principal. Exige cabeamento blindado e plataformas elevatórias para instalação dos detectores lineares..."
            rows={3}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full rounded-xl border border-slate-300 py-2 px-3 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
        </div>

        {/* Big Submit Button */}
        <div className="pt-4">
          <button
            id="btn-submit-project"
            type="submit"
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-amber-500 py-3.5 text-base font-bold text-slate-950 shadow-md hover:bg-amber-400 active:scale-98 transition-all"
          >
            <span>Iniciar Levantamento</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

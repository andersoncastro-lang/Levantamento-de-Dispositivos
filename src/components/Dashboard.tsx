import React, { useState } from 'react';
import { Projeto } from '../types';
import { Plus, Search, Calendar, User, MapPin, Building2, Layers, AlertCircle, FileSpreadsheet, Trash2, Edit3, ArrowRight } from 'lucide-react';

interface DashboardProps {
  projects: Projeto[];
  onSelectProject: (project: Projeto, view: string) => void;
  onDeleteProject: (id: string) => void;
  onNewProject: () => void;
}

export default function Dashboard({ projects, onSelectProject, onDeleteProject, onNewProject }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(
    (p) =>
      p.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tecnico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalProjects = projects.length;
  const totalEnvironments = projects.reduce((acc, p) => acc + (p.ambientes?.length || 0), 0);
  const totalDevices = projects.reduce((acc, p) => {
    return acc + (p.ambientes?.reduce((sum, env) => {
      return sum + (env.dispositivos?.reduce((dSum, d) => dSum + d.quantidade, 0) || 0);
    }, 0) || 0);
  }, 0);

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Visual Welcome Banner */}
      <div 
        id="dashboard-welcome" 
        className="relative overflow-hidden rounded-2xl bg-slate-900 px-6 py-8 text-white shadow-lg md:px-10 md:py-12"
      >
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Rio<span className="text-amber-400"> Sistemas</span> Survey
          </h1>
          <p className="mt-3 text-base text-slate-300">
            Simplifique a coleta de dados de SDAI em visitas de campo. Cadastre edificações, organize ambientes e quantifique dispositivos rapidamente para acelerar a criação de orçamentos.
          </p>
          <div className="mt-6">
            <button
              id="btn-new-survey-banner"
              onClick={onNewProject}
              className="inline-flex items-center space-x-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-md hover:bg-amber-400 active:scale-95 transition-all"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Levantamento</span>
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 hidden w-1/3 opacity-10 lg:block">
          {/* Subtle design element */}
          <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-amber-400 blur-3xl" />
          <div className="absolute top-10 right-20 h-40 w-40 rounded-full bg-red-500 blur-2xl" />
        </div>
      </div>

      {/* Stats Board */}
      <div id="dashboard-stats" className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Projetos</span>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-bold text-slate-900">{totalProjects}</span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ambientes</span>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-bold text-slate-900">{totalEnvironments}</span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dispositivos</span>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-bold text-slate-900">{totalDevices}</span>
          </div>
        </div>
      </div>

      {/* Search & Header */}
      <div id="dashboard-list-controls" className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Seus Levantamentos</h2>
          <p className="text-sm text-slate-500">Histórico de vistorias salvas no dispositivo</p>
        </div>
        
        {projects.length > 0 && (
          <div className="relative w-full md:w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              id="search-projects"
              type="text"
              placeholder="Buscar por cliente, projeto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-sm placeholder:text-slate-400"
            />
          </div>
        )}
      </div>

      {/* Project Cards Grid */}
      {projects.length === 0 ? (
        <div 
          id="dashboard-empty-state" 
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900">Nenhum levantamento cadastrado</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Inicie um novo projeto para registrar a infraestrutura de detecção e alarme de incêndio de seu cliente.
          </p>
          <div className="mt-6">
            <button
              id="btn-new-survey-empty"
              onClick={onNewProject}
              className="inline-flex items-center space-x-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm hover:bg-amber-400 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Criar Primeiro Levantamento</span>
            </button>
          </div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div id="dashboard-no-results" className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-md font-bold text-slate-900">Nenhum resultado encontrado</h3>
          <p className="mt-2 text-sm text-slate-500">
            Nenhum projeto coincide com o termo de pesquisa "{searchTerm}".
          </p>
        </div>
      ) : (
        <div id="projects-grid" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const devCount = project.ambientes?.reduce((sum, env) => {
              return sum + (env.dispositivos?.reduce((dSum, d) => dSum + d.quantidade, 0) || 0);
            }, 0) || 0;

            return (
              <div
                id={`project-card-${project.id}`}
                key={project.id}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-amber-400 hover:shadow-md transition-all duration-200"
              >
                {/* Card Header */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                        Levantamento Técnico
                      </span>
                      <h3 className="mt-2 text-lg font-bold text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">
                        {project.cliente}
                      </h3>
                      <p className="text-sm font-medium text-slate-600 mt-0.5">{project.nome}</p>
                    </div>
                    
                    <button
                      id={`btn-delete-project-${project.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Tem certeza que deseja excluir o levantamento do cliente "${project.cliente}"? Esta ação é irreversível.`)) {
                          onDeleteProject(project.id);
                        }
                      }}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 active:scale-90 transition-all"
                      title="Excluir Levantamento"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  {/* Details List */}
                  <div className="mt-4 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{new Date(project.dataVisita).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{project.tecnico || 'Não informado'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 truncate" />
                      <span className="truncate">{project.cidade} - {project.estado}</span>
                    </div>
                  </div>
                </div>

                {/* Info Bar and Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {/* Quick stats indicators */}
                  <div className="flex space-x-3 text-xs font-semibold text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Layers className="h-3.5 w-3.5 text-amber-500" />
                      <span>{project.ambientes?.length || 0} amb</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-3.5 w-3.5 text-amber-500" />
                      <span>{project.blocos?.length || 0} blc</span>
                    </div>
                    <div className="flex items-center space-x-1" title="Total de dispositivos">
                      <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-amber-700 font-mono text-[10px]">
                        {devCount} itens
                      </span>
                    </div>
                  </div>

                  {/* Resume survey button */}
                  <button
                    id={`btn-resume-project-${project.id}`}
                    onClick={() => onSelectProject(project, 'general_summary')}
                    className="inline-flex items-center space-x-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors"
                  >
                    <span>Abrir</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

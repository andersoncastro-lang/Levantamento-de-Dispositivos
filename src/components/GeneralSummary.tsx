import React, { useState } from 'react';
import { Projeto, Ambiente, Dispositivo } from '../types';
import { Share2, FileDown, Plus, Edit3, Trash2, Calendar, User, MapPin, Layers, Building2, ChevronDown, ChevronUp, Copy, Check, LayoutGrid, CheckCircle2, ShieldAlert } from 'lucide-react';

interface GeneralSummaryProps {
  project: Projeto;
  onEditProject: () => void;
  onEditEnvironment: (env: Ambiente) => void;
  onDeleteEnvironment: (envId: string) => void;
  onAddNewEnvironment: () => void;
  onCloseProject: () => void;
}

export default function GeneralSummary({
  project,
  onEditProject,
  onEditEnvironment,
  onDeleteEnvironment,
  onAddNewEnvironment,
  onCloseProject,
}: GeneralSummaryProps) {
  const [copied, setCopied] = useState(false);
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({});

  // Helper to toggle block collapse
  const toggleBlock = (blockId: string) => {
    setExpandedBlocks((prev) => ({
      ...prev,
      [blockId]: !prev[blockId],
    }));
  };

  // 1. Aggregate Devices by exact name
  const aggregatedDevices: Record<string, { nome: string; categoria: string; quantidade: number }> = {};
  
  project.ambientes?.forEach((env) => {
    env.dispositivos?.forEach((dev) => {
      const key = `${dev.categoria}::${dev.nome}`;
      if (aggregatedDevices[key]) {
        aggregatedDevices[key].quantidade += dev.quantidade;
      } else {
        aggregatedDevices[key] = {
          nome: dev.nome,
          categoria: dev.categoria,
          quantidade: dev.quantidade,
        };
      }
    });
  });

  const deviceTotalsList = Object.values(aggregatedDevices).sort((a, b) => b.quantidade - a.quantidade);

  // Group environments by block ID
  const environmentsByBlock: Record<string, Ambiente[]> = {};
  project.ambientes?.forEach((env) => {
    if (!environmentsByBlock[env.blocoId]) {
      environmentsByBlock[env.blocoId] = [];
    }
    environmentsByBlock[env.blocoId].push(env);
  });

  // Calculate project-wide totals
  const totalEnvironments = project.ambientes?.length || 0;
  const totalDevices = project.ambientes?.reduce(
    (acc, env) => acc + (env.dispositivos?.reduce((sum, d) => sum + d.quantidade, 0) || 0),
    0
  );

  // 2. Generate structured text report for copy/sharing
  const generateReportText = () => {
    let report = `=========================================\n`;
    report += `🔥 RIO SISTEMAS SURVEY - RELATÓRIO TÉCNICO 🔥\n`;
    report += `=========================================\n\n`;
    report += `📝 DADOS DO PROJETO\n`;
    report += `-----------------------------------------\n`;
    report += `Cliente: ${project.cliente}\n`;
    report += `Projeto: ${project.nome}\n`;
    report += `Técnico Responsável: ${project.tecnico}\n`;
    report += `Data da Visita: ${new Date(project.dataVisita).toLocaleDateString('pt-BR')}\n`;
    report += `Cidade/Estado: ${project.cidade} - ${project.estado}\n`;
    if (project.endereco) report += `Endereço: ${project.endereco}\n`;
    if (project.observacoes) report += `Observações Gerais: ${project.observacoes}\n`;
    report += `\n`;

    report += `📊 RESUMO GERAL DE DISPOSITIVOS\n`;
    report += `-----------------------------------------\n`;
    if (deviceTotalsList.length === 0) {
      report += `Nenhum dispositivo cadastrado.\n`;
    } else {
      deviceTotalsList.forEach((item) => {
        const dotsCount = Math.max(3, 40 - item.nome.length);
        const dots = '.'.repeat(dotsCount);
        report += `${item.nome} ${dots} ${item.quantidade} un [${item.categoria}]\n`;
      });
    }
    report += `\n`;

    report += `🏢 INFRAESTRUTURA POR BLOCOS E AMBIENTES\n`;
    report += `-----------------------------------------\n`;
    
    project.blocos.forEach((block) => {
      const envs = environmentsByBlock[block.id] || [];
      report += `📍 Bloco: ${block.nome} (${envs.length} ambientes)\n`;
      if (envs.length === 0) {
        report += `   Sem ambientes cadastrados neste bloco.\n`;
      } else {
        envs.forEach((env) => {
          report += `   └─ Ambiente: [${env.codigo}] ${env.nome} (${env.area}m², h=${env.peDireito}m)\n`;
          if (env.observacoes) {
            report += `      Obs: ${env.observacoes}\n`;
          }
          if (env.dispositivos && env.dispositivos.length > 0) {
            env.dispositivos.forEach((dev) => {
              report += `      • ${dev.nome} x${dev.quantidade} [${dev.categoria}]\n`;
            });
          } else {
            report += `      • Sem dispositivos cadastrados\n`;
          }
        });
      }
      report += `\n`;
    });

    report += `-----------------------------------------\n`;
    report += `Total de Ambientes: ${totalEnvironments}\n`;
    report += `Total de Dispositivos: ${totalDevices} unidades\n`;
    report += `Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}\n`;
    report += `=========================================`;

    return report;
  };

  const handleCopyToClipboard = () => {
    const text = generateReportText();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShareOnWhatsApp = () => {
    const reportText = generateReportText();
    const encodedText = encodeURIComponent(reportText);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Rio_Sistemas_Survey_${project.cliente.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="general-summary-view" className="max-w-3xl mx-auto space-y-6">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Resumo Geral</h2>
          <p className="text-sm text-slate-500">
            Levantamento final do projeto de SDAI.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Back to Dashboard */}
          <button
            id="btn-summary-to-dashboard"
            onClick={onCloseProject}
            className="inline-flex items-center space-x-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
          >
            <LayoutGrid className="h-4 w-4 text-slate-500" />
            <span>Ver Todos Projetos</span>
          </button>

          {/* Edit Project Info */}
          <button
            id="btn-edit-project-info"
            onClick={onEditProject}
            className="inline-flex items-center space-x-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
          >
            <Edit3 className="h-4 w-4 text-slate-500" />
            <span>Editar Dados do Projeto</span>
          </button>
        </div>
      </div>

      {/* Project Meta Details Card */}
      <div id="summary-meta-card" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-block rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wide">
              Levantamento Concluído
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">{project.cliente}</h3>
            <p className="text-sm text-slate-600 font-medium">{project.nome}</p>
          </div>
          <div className="flex space-x-4 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="text-center px-1">
              <span className="block text-slate-400 uppercase tracking-wider text-[9px] font-bold">Ambientes</span>
              <span className="text-base font-bold text-slate-800">{totalEnvironments}</span>
            </div>
            <div className="w-px bg-slate-200 self-stretch" />
            <div className="text-center px-1">
              <span className="block text-slate-400 uppercase tracking-wider text-[9px] font-bold">Dispositivos</span>
              <span className="text-base font-bold text-slate-800">{totalDevices}</span>
            </div>
          </div>
        </div>

        {/* Informational Sub-List */}
        <div className="grid gap-2 sm:grid-cols-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>Visita: <strong>{new Date(project.dataVisita).toLocaleDateString('pt-BR')}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <User className="h-4 w-4 text-slate-400" />
            <span>Técnico: <strong>{project.tecnico}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span>Local: <strong>{project.cidade} - {project.estado}</strong></span>
          </div>
        </div>

        {project.observacoes && (
          <div className="rounded-xl bg-slate-50/70 border border-slate-100 p-3 text-xs text-slate-600">
            <strong>Observações do Levantamento:</strong>
            <p className="mt-1 italic">"{project.observacoes}"</p>
          </div>
        )}
      </div>

      {/* Section 1: Aggregated totals of devices */}
      <div id="aggregated-devices-card" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-md font-bold text-slate-900">Lista Geral de Materiais</h3>
          <p className="text-xs text-slate-500">Quantidades consolidadas de todos os ambientes cadastrados</p>
        </div>

        {deviceTotalsList.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-sm">
            <ShieldAlert className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            Nenhum dispositivo cadastrado no projeto.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {deviceTotalsList.map((item, index) => (
              <div id={`summary-aggregated-item-${index}`} key={index} className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-2.5 min-w-0 pr-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 font-mono text-[10px] font-bold text-amber-800">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{item.nome}</p>
                    <span className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500 uppercase mt-0.5">
                      {item.categoria}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-sm font-extrabold text-slate-900 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg font-mono">
                    {item.quantidade} un
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Environments grouped by Block */}
      <div id="environments-grouped-card" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-md font-bold text-slate-900">Layout por Blocos e Ambientes</h3>
            <p className="text-xs text-slate-500">Detalhamento técnico de cada setor da edificação</p>
          </div>
          <button
            id="btn-add-env-from-summary"
            onClick={onAddNewEnvironment}
            className="inline-flex items-center space-x-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Ambiente</span>
          </button>
        </div>

        <div className="space-y-3">
          {project.blocos.map((block) => {
            const blockEnvs = environmentsByBlock[block.id] || [];
            const isCollapsed = expandedBlocks[block.id] === true;
            
            return (
              <div
                id={`block-summary-group-${block.id}`}
                key={block.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
              >
                {/* Block Header */}
                <div
                  id={`block-summary-header-${block.id}`}
                  onClick={() => toggleBlock(block.id)}
                  className="flex items-center justify-between bg-slate-50 p-4 border-b border-slate-100 cursor-pointer select-none hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <Building2 className="h-5 w-5 text-amber-500" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{block.nome}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {blockEnvs.length} {blockEnvs.length === 1 ? 'ambiente cadastrado' : 'ambientes cadastrados'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-600">
                      {blockEnvs.reduce((acc, env) => acc + (env.dispositivos?.reduce((sum, d) => sum + d.quantidade, 0) || 0), 0)} itens
                    </span>
                    {isCollapsed ? (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Environments List inside Block */}
                {!isCollapsed && (
                  <div className="divide-y divide-slate-100 bg-white p-2">
                    {blockEnvs.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-400">
                        Nenhum ambiente cadastrado para este bloco.
                      </p>
                    ) : (
                      blockEnvs.map((env) => {
                        const envDevCount = env.dispositivos?.reduce((acc, d) => acc + d.quantidade, 0) || 0;
                        return (
                          <div
                            id={`env-summary-row-${env.id}`}
                            key={env.id}
                            className="p-3 hover:bg-slate-50/50 transition-colors rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0"
                          >
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                  {env.codigo}
                                </span>
                                <h5 className="font-bold text-slate-800 text-sm">{env.nome}</h5>
                              </div>
                              
                              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                                <span>Área: {env.area} m²</span>
                                <span className="h-1 w-1 bg-slate-200 rounded-full" />
                                <span>Pé-direito: {env.peDireito} m</span>
                                <span className="h-1 w-1 bg-slate-200 rounded-full" />
                                <span className="text-slate-500 font-semibold">{envDevCount} dispositivos</span>
                              </div>

                              {env.observacoes && (
                                <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 border-l-2 border-slate-300 pl-2 py-0.5 italic">
                                  "{env.observacoes}"
                                </p>
                              )}
                            </div>

                            {/* Actions on this environment */}
                            <div className="flex items-center space-x-1 justify-end shrink-0">
                              <button
                                id={`btn-edit-env-summary-${env.id}`}
                                onClick={() => onEditEnvironment(env)}
                                className="inline-flex items-center space-x-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-2.5 text-xs font-bold transition-colors"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                                <span>Editar</span>
                              </button>
                              
                              <button
                                id={`btn-delete-env-summary-${env.id}`}
                                onClick={() => {
                                  if (confirm(`Tem certeza que deseja remover o ambiente [${env.codigo}] ${env.nome}? Todos os dispositivos deste ambiente serão removidos.`)) {
                                    onDeleteEnvironment(env.id);
                                  }
                                }}
                                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 active:scale-90 transition-all"
                                title="Excluir ambiente"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* EXPORT & SHARING ACTIONS (TOUCH-FRIENDLY & LARGE) */}
      <div id="export-actions-section" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-md font-bold text-slate-900">Exportar Levantamento</h3>
          <p className="text-xs text-slate-500">Compartilhe o levantamento em formato texto ou faça o download da base técnica.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          
          {/* Copy Report Button */}
          <button
            id="btn-copy-report"
            onClick={handleCopyToClipboard}
            className={`flex items-center justify-center space-x-2 rounded-xl py-3.5 px-4 text-sm font-bold shadow-sm transition-all active:scale-95 ${
              copied
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4.5 w-4.5" />
                <span>Copiado para Área!</span>
              </>
            ) : (
              <>
                <Copy className="h-4.5 w-4.5" />
                <span>Copiar Relatório Texto</span>
              </>
            )}
          </button>

          {/* Share on WhatsApp */}
          <button
            id="btn-share-whatsapp"
            onClick={handleShareOnWhatsApp}
            className="flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-4 text-sm font-bold shadow-sm transition-all active:scale-95"
          >
            <Share2 className="h-4.5 w-4.5" />
            <span>Compartilhar WhatsApp</span>
          </button>

          {/* Export JSON */}
          <button
            id="btn-download-json"
            onClick={handleDownloadJSON}
            className="flex items-center justify-center space-x-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 py-3.5 px-4 text-sm font-bold shadow-sm transition-all active:scale-95"
          >
            <FileDown className="h-4.5 w-4.5 text-slate-500" />
            <span>Baixar Arquivo JSON</span>
          </button>

        </div>
      </div>

      {/* Bottom Footer Back to Dashboard */}
      <div className="pt-4 border-t border-slate-100 flex justify-center">
        <button
          id="btn-finalize-survey-back-dashboard"
          onClick={onCloseProject}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-amber-500 py-3.5 px-8 text-base font-bold text-slate-950 shadow-md hover:bg-amber-400 active:scale-95 transition-all"
        >
          <CheckCircle2 className="h-5 w-5 text-slate-950" />
          <span>Finalizar e Voltar ao Painel</span>
        </button>
      </div>

    </div>
  );
}

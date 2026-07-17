import React, { useState, useEffect } from 'react';
import { Projeto, Bloco, Ambiente, Dispositivo } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProjectForm from './components/ProjectForm';
import BlockManager from './components/BlockManager';
import EnvironmentForm from './components/EnvironmentForm';
import DeviceSelector from './components/DeviceSelector';
import EnvironmentSummary from './components/EnvironmentSummary';
import GeneralSummary from './components/GeneralSummary';

const STORAGE_KEY = 'rio_sistemas_surveys_data';
const OLD_STORAGE_KEY = 'firebee_surveys_data';

export default function App() {
  const [projects, setProjects] = useState<Projeto[]>([]);
  const [activeProject, setActiveProject] = useState<Projeto | null>(null);
  const [activeView, setActiveView] = useState<string>('dashboard');
  
  // Work-in-progress state during environment creation/edit
  const [editingEnvironment, setEditingEnvironment] = useState<Partial<Ambiente> | null>(null);
  const [justSavedEnvironment, setJustSavedEnvironment] = useState<Ambiente | null>(null);
  const [initialBlockId, setInitialBlockId] = useState<string | undefined>(undefined);

  // 1. Load data from localStorage on mount
  useEffect(() => {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(OLD_STORAGE_KEY);
      if (raw) {
        localStorage.setItem(STORAGE_KEY, raw);
      }
    }
    if (raw) {
      try {
        setProjects(JSON.parse(raw));
      } catch (err) {
        console.error('Erro ao ler do localStorage', err);
      }
    }
  }, []);

  // 2. Save projects list to localStorage on any change
  const saveProjectsToStorage = (updatedProjects: Projeto[]) => {
    setProjects(updatedProjects);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
  };

  // 3. Navigation helper
  const handleNavigate = (view: string) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Action: Start a brand new project/survey
  const handleNewProject = () => {
    const newProj: Projeto = {
      id: `proj_${Date.now()}`,
      cliente: '',
      nome: '',
      endereco: '',
      cidade: '',
      estado: 'SP',
      dataVisita: new Date().toISOString().split('T')[0],
      tecnico: '',
      observacoes: '',
      blocos: [],
      ambientes: [],
      createdAt: new Date().toISOString(),
    };
    setActiveProject(newProj);
    handleNavigate('project');
  };

  // 5. Action: Select an existing project
  const handleSelectProject = (project: Projeto, targetView: string) => {
    setActiveProject(project);
    handleNavigate(targetView);
  };

  // 6. Action: Delete a project from dashboard
  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    saveProjectsToStorage(updated);
    if (activeProject?.id === id) {
      setActiveProject(null);
      handleNavigate('dashboard');
    }
  };

  // 7. Action: Save basic project metadata (Screen 1)
  const handleSaveProjectMeta = (meta: Partial<Projeto>) => {
    if (!activeProject) return;

    const updatedProject: Projeto = {
      ...activeProject,
      ...meta,
    };

    setActiveProject(updatedProject);

    // Save to the list
    const exists = projects.some((p) => p.id === updatedProject.id);
    let updatedList: Projeto[];
    if (exists) {
      updatedList = projects.map((p) => (p.id === updatedProject.id ? updatedProject : p));
    } else {
      updatedList = [updatedProject, ...projects];
    }
    saveProjectsToStorage(updatedList);

    // If they have no blocks yet, go to Screen 2. Otherwise go directly to summary or wherever
    if (updatedProject.blocos.length === 0) {
      handleNavigate('blocks');
    } else {
      handleNavigate('general_summary');
    }
  };

  // 8. Action: Save blocks list (Screen 2)
  const handleSaveBlocks = (blocks: Bloco[]) => {
    if (!activeProject) return;

    const updatedProject: Projeto = {
      ...activeProject,
      blocos: blocks,
    };

    setActiveProject(updatedProject);

    const updatedList = projects.map((p) => (p.id === updatedProject.id ? updatedProject : p));
    saveProjectsToStorage(updatedList);
  };

  // 9. Quick Action: Add first environment to a specific block directly
  const handleAddFirstEnvironment = (blockId: string) => {
    setInitialBlockId(blockId);
    setEditingEnvironment(null); // start fresh
    handleNavigate('environment_form');
  };

  // 10. Action: Save partial environment from Screen 3
  const handleSaveEnvironmentMeta = (envMeta: Partial<Ambiente>) => {
    setEditingEnvironment(envMeta);
    handleNavigate('device_selector'); // Move to Screen 4
  };

  // 11. Action: Save final environment after configuring devices (Screen 4)
  const handleSaveEnvironmentWithDevices = (devices: Dispositivo[]) => {
    if (!activeProject || !editingEnvironment) return;

    // Build the final environment object
    const finalEnv: Ambiente = {
      id: editingEnvironment.id || `env_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      codigo: editingEnvironment.codigo || 'AMB',
      blocoId: editingEnvironment.blocoId || '',
      tipo: editingEnvironment.tipo || 'Outro',
      nome: editingEnvironment.nome || 'Ambiente',
      area: editingEnvironment.area || 0,
      peDireito: editingEnvironment.peDireito || 0,
      observacoes: editingEnvironment.observacoes || '',
      dispositivos: devices,
    };

    // Update active project
    const isEdit = activeProject.ambientes.some((e) => e.id === finalEnv.id);
    let updatedAmbientes: Ambiente[];
    if (isEdit) {
      updatedAmbientes = activeProject.ambientes.map((e) => (e.id === finalEnv.id ? finalEnv : e));
    } else {
      updatedAmbientes = [...activeProject.ambientes, finalEnv];
    }

    const updatedProject: Projeto = {
      ...activeProject,
      ambientes: updatedAmbientes,
    };

    setActiveProject(updatedProject);

    // Update projects list & persist
    const updatedList = projects.map((p) => (p.id === updatedProject.id ? updatedProject : p));
    saveProjectsToStorage(updatedList);

    // Keep reference to show in the summary
    setJustSavedEnvironment(finalEnv);
    setEditingEnvironment(null);
    setInitialBlockId(undefined);

    // Navigate to Screen 5 (Environment Summary)
    handleNavigate('environment_summary');
  };

  // 12. Action: Delete an environment from general summary
  const handleDeleteEnvironment = (envId: string) => {
    if (!activeProject) return;

    const updatedAmbientes = activeProject.ambientes.filter((e) => e.id !== envId);
    const updatedProject: Projeto = {
      ...activeProject,
      ambientes: updatedAmbientes,
    };

    setActiveProject(updatedProject);

    const updatedList = projects.map((p) => (p.id === updatedProject.id ? updatedProject : p));
    saveProjectsToStorage(updatedList);
  };

  // 13. Close Project & Return to dashboard
  const handleCloseProject = () => {
    setActiveProject(null);
    setEditingEnvironment(null);
    setJustSavedEnvironment(null);
    setInitialBlockId(undefined);
    handleNavigate('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Universal Header */}
      <Header
        activeProject={activeProject}
        activeView={activeView}
        onNavigate={handleNavigate}
        onCloseProject={handleCloseProject}
      />

      {/* Main Container */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
        {activeView === 'dashboard' && (
          <Dashboard
            projects={projects}
            onSelectProject={handleSelectProject}
            onDeleteProject={handleDeleteProject}
            onNewProject={handleNewProject}
          />
        )}

        {activeView === 'project' && activeProject && (
          <ProjectForm
            project={activeProject}
            onSave={handleSaveProjectMeta}
            onCancel={() => {
              // If it's a completely new, unsaved project, go back to dashboard
              if (!activeProject.cliente && activeProject.ambientes.length === 0) {
                handleCloseProject();
              } else {
                handleNavigate('general_summary');
              }
            }}
          />
        )}

        {activeView === 'blocks' && activeProject && (
          <BlockManager
            project={activeProject}
            onSaveBlocks={handleSaveBlocks}
            onNavigate={handleNavigate}
            onAddFirstEnvironment={handleAddFirstEnvironment}
          />
        )}

        {activeView === 'environment_form' && activeProject && (
          <EnvironmentForm
            project={activeProject}
            editingEnvironment={editingEnvironment}
            initialBlockId={initialBlockId}
            onSave={handleSaveEnvironmentMeta}
            onCancel={() => {
              // Decide where to go back
              if (editingEnvironment?.id) {
                // Was editing an existing one, return to general summary
                setEditingEnvironment(null);
                handleNavigate('general_summary');
              } else if (justSavedEnvironment) {
                // Had just saved one, return to Screen 5
                handleNavigate('environment_summary');
              } else {
                // Return to Block manager
                handleNavigate('blocks');
              }
            }}
          />
        )}

        {activeView === 'device_selector' && activeProject && editingEnvironment && (
          <DeviceSelector
            environment={editingEnvironment}
            onSaveEnvironment={handleSaveEnvironmentWithDevices}
            onCancel={() => {
              // Return to editing environment details
              handleNavigate('environment_form');
            }}
          />
        )}

        {activeView === 'environment_summary' && activeProject && justSavedEnvironment && (
          <EnvironmentSummary
            environment={justSavedEnvironment}
            blockName={
              activeProject.blocos.find((b) => b.id === justSavedEnvironment.blocoId)?.nome || 'Bloco'
            }
            onEdit={() => {
              // Reload into editing state
              setEditingEnvironment(justSavedEnvironment);
              handleNavigate('environment_form');
            }}
            onAddNewEnvironment={() => {
              setEditingEnvironment(null);
              setJustSavedEnvironment(null);
              handleNavigate('environment_form');
            }}
            onFinalize={() => {
              handleNavigate('general_summary');
            }}
          />
        )}

        {activeView === 'general_summary' && activeProject && (
          <GeneralSummary
            project={activeProject}
            onEditProject={() => {
              handleNavigate('project');
            }}
            onEditEnvironment={(env) => {
              setEditingEnvironment(env);
              handleNavigate('environment_form');
            }}
            onDeleteEnvironment={handleDeleteEnvironment}
            onAddNewEnvironment={() => {
              setEditingEnvironment(null);
              handleNavigate('environment_form');
            }}
            onCloseProject={handleCloseProject}
          />
        )}

      </main>

      {/* Subtle footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400 font-medium">
        <p>© {new Date().getFullYear()} Rio Sistemas Survey. Coletor Inteligente de SDAI para vistoria técnica de campo.</p>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import { Ambiente, Dispositivo } from '../types';
import { CATEGORIAS_DISPOSITIVOS, DISPOSITIVOS_POR_CATEGORIA } from '../data/predefined';
import { Plus, Minus, Trash2, Save, ArrowLeft, ShieldAlert, ListPlus, Edit3 } from 'lucide-react';

interface DeviceSelectorProps {
  environment: Partial<Ambiente>;
  onSaveEnvironment: (devices: Dispositivo[]) => void;
  onCancel: () => void;
}

export default function DeviceSelector({ environment, onSaveEnvironment, onCancel }: DeviceSelectorProps) {
  const [devicesList, setDevicesList] = useState<Dispositivo[]>(environment.dispositivos || []);
  
  // Selection States
  const [selectedCategory, setSelectedCategory] = useState<string>('Detectores');
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [customDeviceName, setCustomDeviceName] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string>('');

  // Get devices for current category
  const availableDevices = DISPOSITIVOS_POR_CATEGORIA[selectedCategory] || [];

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let deviceName = selectedDevice;
    if (selectedDevice === 'outro') {
      deviceName = customDeviceName.trim();
    }

    if (!deviceName) {
      setError('Por favor, selecione ou digite o nome do dispositivo');
      return;
    }

    if (quantity <= 0) {
      setError('A quantidade deve ser de pelo menos 1 item');
      return;
    }

    // Check if device already exists in the list (same category and name)
    const existingIndex = devicesList.findIndex(
      (d) => d.categoria === selectedCategory && d.nome.toLowerCase() === deviceName.toLowerCase()
    );

    if (existingIndex !== -1) {
      // Update quantity of existing
      const updatedList = [...devicesList];
      updatedList[existingIndex].quantidade += quantity;
      setDevicesList(updatedList);
    } else {
      // Add new
      const newDevice: Dispositivo = {
        id: `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        categoria: selectedCategory,
        nome: deviceName,
        quantidade: quantity,
      };
      setDevicesList([...devicesList, newDevice]);
    }

    // Reset selection
    setSelectedDevice('');
    setCustomDeviceName('');
    setQuantity(1);
  };

  const handleRemoveDevice = (id: string) => {
    setDevicesList(devicesList.filter((d) => d.id !== id));
  };

  const handleUpdateDeviceQty = (id: string, delta: number) => {
    setDevicesList(
      devicesList.map((d) => {
        if (d.id === id) {
          const newQty = d.quantidade + delta;
          return { ...d, quantidade: Math.max(1, newQty) };
        }
        return d;
      })
    );
  };

  const handleSaveAll = () => {
    onSaveEnvironment(devicesList);
  };

  return (
    <div id="device-selector-container" className="max-w-2xl mx-auto space-y-6">
      {/* Title Header */}
      <div>
        <button
          id="btn-back-to-env-form"
          onClick={onCancel}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar para Detalhes do Ambiente</span>
        </button>
        <div className="flex items-center space-x-2">
          <span className="rounded-md bg-amber-500/10 px-2 py-1 text-xs font-mono font-bold text-amber-700">
            {environment.codigo}
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Dispositivos em {environment.nome}
          </h2>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Selecione a categoria e adicione os dispositivos instalados neste ambiente.
        </p>
      </div>

      {/* Add Device Sub-Form */}
      <div id="add-device-subform" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
          <ListPlus className="h-4 w-4 text-amber-500" />
          <span>Adicionar Novo Dispositivo</span>
        </h3>

        <form onSubmit={handleAddDevice} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            
            {/* Categoria Select */}
            <div className="space-y-1.5">
              <label htmlFor="device-category" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Categoria
              </label>
              <select
                id="device-category"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedDevice('');
                  setCustomDeviceName('');
                  setError('');
                }}
                className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm text-slate-900 bg-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              >
                {CATEGORIAS_DISPOSITIVOS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Dispositivo Select */}
            <div className="space-y-1.5">
              <label htmlFor="device-type" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Dispositivo
              </label>
              <select
                id="device-type"
                value={selectedDevice}
                onChange={(e) => {
                  setSelectedDevice(e.target.value);
                  setError('');
                }}
                className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm text-slate-900 bg-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              >
                <option value="" disabled>Selecione um dispositivo</option>
                {availableDevices.map((dev) => (
                  <option key={dev} value={dev}>
                    {dev}
                  </option>
                ))}
                <option value="outro">-- Outro (Digitar personalizado) --</option>
              </select>
            </div>

          </div>

          {/* Custom Name input shown only if "outro" selected */}
          {selectedDevice === 'outro' && (
            <div className="space-y-1.5 animate-fadeIn">
              <label htmlFor="custom-device-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nome do Dispositivo Personalizado
              </label>
              <input
                id="custom-device-name"
                type="text"
                placeholder="Digite o nome do dispositivo técnico"
                value={customDeviceName}
                onChange={(e) => setCustomDeviceName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-400"
              />
            </div>
          )}

          {/* Quantity & Add Action Grid */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0 pt-2">
            
            {/* Quantity Stepper */}
            <div className="space-y-1.5 shrink-0 w-full sm:w-40">
              <label htmlFor="device-quantity" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quantidade
              </label>
              <div className="flex rounded-xl border border-slate-300 overflow-hidden bg-white">
                <button
                  id="btn-qty-minus"
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex items-center justify-center w-12 bg-slate-50 border-r border-slate-300 hover:bg-slate-100 text-slate-600 active:scale-95 transition-all"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  id="device-quantity"
                  type="number"
                  min="1"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full border-none py-2.5 text-center text-sm font-semibold text-slate-900 focus:outline-none"
                />
                <button
                  id="btn-qty-plus"
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex items-center justify-center w-12 bg-slate-50 border-l border-slate-300 hover:bg-slate-100 text-slate-600 active:scale-95 transition-all"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to list button */}
            <button
              id="btn-add-device-to-list"
              type="submit"
              className="flex-1 w-full rounded-xl border-2 border-dashed border-amber-500 text-amber-800 hover:bg-amber-50 bg-white py-2.5 text-sm font-bold active:scale-98 transition-all flex items-center justify-center space-x-1.5"
            >
              <Plus className="h-4.5 w-4.5 text-amber-600" />
              <span>Adicionar Dispositivo</span>
            </button>
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </form>
      </div>

      {/* Added Devices List Summary */}
      <div id="added-devices-section" className="space-y-3">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          Dispositivos Adicionados ({devicesList.reduce((acc, d) => acc + d.quantidade, 0)} itens)
        </h3>

        {devicesList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-slate-400">
            <ShieldAlert className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm font-medium">Nenhum dispositivo cadastrado neste ambiente.</p>
            <p className="text-xs text-slate-400 mt-0.5">Selecione e adicione itens no painel acima.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {devicesList.map((dev) => (
              <div
                id={`device-item-${dev.id}`}
                key={dev.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className="inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 uppercase">
                      {dev.categoria}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-1 truncate">{dev.nome}</h4>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Stepper qty controls */}
                  <div className="flex items-center space-x-1 rounded-lg border border-slate-200 bg-slate-50 px-1 py-0.5">
                    <button
                      id={`btn-dev-qty-dec-${dev.id}`}
                      onClick={() => handleUpdateDeviceQty(dev.id, -1)}
                      className="p-1 text-slate-500 hover:text-slate-800 active:scale-90 transition-all"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-mono text-xs font-bold text-slate-800 w-6 text-center">
                      {dev.quantidade}
                    </span>
                    <button
                      id={`btn-dev-qty-inc-${dev.id}`}
                      onClick={() => handleUpdateDeviceQty(dev.id, 1)}
                      className="p-1 text-slate-500 hover:text-slate-800 active:scale-90 transition-all"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    id={`btn-remove-device-item-${dev.id}`}
                    onClick={() => handleRemoveDevice(dev.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 active:scale-90 transition-all shrink-0"
                    title="Excluir item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Large Navigation Action Button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          id="btn-save-environment"
          onClick={handleSaveAll}
          className="flex w-full items-center justify-center space-x-2 rounded-xl bg-amber-500 py-3.5 text-base font-bold text-slate-950 shadow-md hover:bg-amber-400 active:scale-98 transition-all"
        >
          <Save className="h-5 w-5" />
          <span>Salvar Ambiente</span>
        </button>
      </div>
    </div>
  );
}

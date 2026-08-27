import React, { useState } from 'react';
import { ServerConfig } from '../types';
import { 
  X, 
  Save, 
  RotateCcw, 
  Server, 
  MessageSquare, 
  Activity, 
  Sparkles, 
  Settings, 
  HelpCircle,
  Check
} from 'lucide-react';
import { DEFAULT_CONFIG } from '../data/defaultConfig';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ServerConfig;
  onSave: (newConfig: ServerConfig) => void;
  onSetSimulationState: (state: 'online' | 'offline' | 'starting') => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  onSetSimulationState
}) => {
  const [formData, setFormData] = useState<ServerConfig>({ ...config });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof ServerConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    setFormData({ ...DEFAULT_CONFIG });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        id="config-settings-modal"
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 text-zinc-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Server & Portal Configuration</h2>
              <p className="text-xs text-zinc-400">Customize connection IPs, Discord channels, and panel settings</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Server Identity */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              1. Server Identity & Branding
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Server Name</label>
                <input
                  type="text"
                  value={formData.serverName}
                  onChange={(e) => handleChange('serverName', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Version Subtitle</label>
                <input
                  type="text"
                  value={formData.mcVersion}
                  onChange={(e) => handleChange('mcVersion', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Server Tagline / Description</label>
              <input
                type="text"
                value={formData.serverTagline}
                onChange={(e) => handleChange('serverTagline', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section 2: Connection Addresses */}
          <div className="space-y-4 pt-4 border-t border-zinc-850">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              2. Connection Addresses (Java & Bedrock)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Java Server IP</label>
                <input
                  type="text"
                  value={formData.javaIp}
                  onChange={(e) => handleChange('javaIp', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Java Port</label>
                <input
                  type="number"
                  value={formData.javaPort}
                  onChange={(e) => handleChange('javaPort', parseInt(e.target.value) || 25565)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Bedrock / Geyser IP</label>
                <input
                  type="text"
                  value={formData.bedrockIp}
                  onChange={(e) => handleChange('bedrockIp', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-sky-300 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Bedrock Port</label>
                <input
                  type="number"
                  value={formData.bedrockPort}
                  onChange={(e) => handleChange('bedrockPort', parseInt(e.target.value) || 19132)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: My-MC.Link & Discord Setup */}
          <div className="space-y-4 pt-4 border-t border-zinc-850">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              3. Discord Bot & My-MC.Link Panel
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Server ID on Panel</label>
                <select
                  value={formData.serverId}
                  onChange={(e) => handleChange('serverId', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Minecraft">Minecraft</option>
                  <option value="Bedrock">Bedrock</option>
                  <option value="SFTP">SFTP</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Discord Bot Channel Name</label>
                <input
                  type="text"
                  value={formData.discordChannelName}
                  onChange={(e) => handleChange('discordChannelName', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Discord Server Invite URL</label>
              <input
                type="url"
                value={formData.discordInviteUrl}
                onChange={(e) => handleChange('discordInviteUrl', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#5865F2]"
              />
            </div>
          </div>

          {/* Section 4: Live Simulation Testing Controls */}
          <div className="space-y-4 pt-4 border-t border-zinc-850 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Status Simulator & Live Mode</span>
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Toggle between high-fidelity demo simulation or direct live API ping
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableSimulation}
                  onChange={(e) => handleChange('enableSimulation', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {formData.enableSimulation && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs text-zinc-400">Force State:</span>
                <button
                  type="button"
                  onClick={() => onSetSimulationState('online')}
                  className="px-3 py-1 bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold hover:bg-emerald-600/50 cursor-pointer"
                >
                  🟢 Online
                </button>
                <button
                  type="button"
                  onClick={() => onSetSimulationState('offline')}
                  className="px-3 py-1 bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold hover:bg-rose-600/50 cursor-pointer"
                >
                  🔴 Offline (Sleep)
                </button>
                <button
                  type="button"
                  onClick={() => onSetSimulationState('starting')}
                  className="px-3 py-1 bg-amber-600/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold hover:bg-amber-600/50 cursor-pointer"
                >
                  🟡 Booting
                </button>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium border border-zinc-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                id="btn-save-settings"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

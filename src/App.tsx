import React, { useState, useEffect, useCallback } from 'react';
import { ServerConfig, ServerStats } from './types';
import { DEFAULT_CONFIG, BOT_COMMANDS, SERVER_RULES, FAQS } from './data/defaultConfig';
import { ServerStatusService } from './services/serverStatusService';
import { Navbar } from './components/Navbar';
import { StatusBanner } from './components/StatusBanner';
import { WakeUpGuide } from './components/WakeUpGuide';
import { ConnectionCards } from './components/ConnectionCards';
import { OnlinePlayers } from './components/OnlinePlayers';
import { DiscordBotPanel } from './components/DiscordBotPanel';
import { RulesAndFaq } from './components/RulesAndFaq';
import { ConfigModal } from './components/ConfigModal';
import { Toast } from './components/Toast';
import { 
  Gamepad2, 
  MessageSquare, 
  Terminal, 
  ShieldCheck, 
  ExternalLink, 
  Heart,
  ChevronRight,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';

export default function App() {
  // Load stored config or default
  const [config, setConfig] = useState<ServerConfig>(() => {
    try {
      const saved = localStorage.getItem('mymc_portal_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_CONFIG;
  });

  const [stats, setStats] = useState<ServerStats>({
    isOnline: true,
    motdClean: "Loading server status...",
    playersOnline: 6,
    maxPlayers: 20,
    playersList: [],
    version: config.mcVersion,
    lastChecked: "Just now"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [secondsUntilNextRefresh, setSecondsUntilNextRefresh] = useState(config.autoRefreshInterval);
  const [activeSection, setActiveSection] = useState('connect');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const refreshStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const updated = await ServerStatusService.fetchStatus(config);
      setStats(updated);
    } catch (e) {
      console.error("Failed to fetch status:", e);
    } finally {
      setIsLoading(false);
      setSecondsUntilNextRefresh(config.autoRefreshInterval);
    }
  }, [config]);

  // Initial load
  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  // Auto-refresh countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilNextRefresh((prev) => {
        if (prev <= 1) {
          refreshStatus();
          return config.autoRefreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [config.autoRefreshInterval, refreshStatus]);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    showToast(`Copied to clipboard: ${text}`);
    setTimeout(() => {
      setCopiedLabel(null);
    }, 2000);
  };

  // Save config
  const handleSaveConfig = (newConfig: ServerConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('mymc_portal_config', JSON.stringify(newConfig));
    } catch {
      // ignore
    }
    showToast("Settings updated successfully");
  };

  // Force simulation state
  const handleSetSimulationState = (state: 'online' | 'offline' | 'starting') => {
    ServerStatusService.setSimulatedState(state);
    refreshStatus();
    showToast(`Server state switched to ${state.toUpperCase()}`);
  };

  // Web wake request simulation handler
  const handleWakeRequest = () => {
    ServerStatusService.setSimulatedState('starting');
    refreshStatus();
    showToast("⚡ Power signal sent! Server is booting up...");

    // Simulate boot completion in 12 seconds
    setTimeout(() => {
      ServerStatusService.setSimulatedState('online');
      refreshStatus();
      showToast("🚀 Server is now ONLINE! Java & Bedrock ports open.");
    }, 12000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950">
      {/* Navigation */}
      <Navbar
        config={config}
        stats={stats}
        onOpenSettings={() => setIsConfigOpen(true)}
        onCopyIp={handleCopy}
        copiedLabel={copiedLabel}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Real-time Server Status & Metrics Banner */}
        <StatusBanner
          stats={stats}
          config={config}
          isLoading={isLoading}
          onRefresh={refreshStatus}
          secondsUntilNextRefresh={secondsUntilNextRefresh}
          onWakeRequest={handleWakeRequest}
          onToggleSimulatedState={(state) => handleSetSimulationState(state)}
          showUptimeChart={activeSection === 'connect'}
        />

        {/* If server is offline or starting: Show the 3-step Wake Up Guide */}
        {(!stats.isOnline || stats.isStarting) && (
          <WakeUpGuide
            config={config}
            onSimulateStart={handleWakeRequest}
            isStarting={stats.isStarting}
          />
        )}

        {/* Section: Connect & Join (Default) */}
        {activeSection === 'connect' && (
          <div className="space-y-8 animate-fade-in">
            <ConnectionCards
              config={config}
              stats={stats}
              onCopy={handleCopy}
              copiedLabel={copiedLabel}
            />

            {/* Online players roster preview */}
            <OnlinePlayers stats={stats} />

            {/* Quick Bot Commands preview row */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Discord Bot Commands</span>
                </h3>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Use <code className="text-emerald-300 font-mono">/status</code>, <code className="text-emerald-300 font-mono">/start</code>, and <code className="text-emerald-300 font-mono">/my-mc-link</code> inside <strong className="text-zinc-300 font-mono">{config.discordChannelName}</strong>
                </p>
              </div>

              <button
                id="btn-view-all-bot-commands"
                onClick={() => setActiveSection('bot')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer self-start md:self-auto"
              >
                <span>View Command Cheatsheet</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Section: Players */}
        {activeSection === 'players' && (
          <div className="animate-fade-in">
            <OnlinePlayers stats={stats} />
          </div>
        )}

        {/* Section: Discord Bot */}
        {activeSection === 'bot' && (
          <div className="animate-fade-in">
            <DiscordBotPanel
              commands={BOT_COMMANDS}
              config={config}
              onCopy={handleCopy}
              copiedLabel={copiedLabel}
            />
          </div>
        )}

        {/* Section: Rules & FAQ */}
        {activeSection === 'rules' && (
          <div className="animate-fade-in">
            <RulesAndFaq rules={SERVER_RULES} faqs={FAQS} config={config} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800 bg-zinc-950/80 py-8 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Gamepad2 className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono font-bold text-zinc-200">{config.serverName}</span>
            <span className="text-zinc-600">•</span>
            <span>24/7 Always-On Community Web Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={config.discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#5865F2]" />
              <span>Discord Community</span>
            </a>
            <button
              onClick={() => setIsConfigOpen(true)}
              className="hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Portal Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSave={handleSaveConfig}
        onSetSimulationState={handleSetSimulationState}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}

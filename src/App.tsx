import React, { useState, useEffect, useCallback } from 'react';
import { ServerConfig, ServerStats } from './types';
import { DEFAULT_CONFIG, BOT_COMMANDS, SERVER_RULES, FAQS } from './data/defaultConfig';
import { ServerStatusService } from './services/serverStatusService';
import { Navbar } from './components/Navbar';
import { HeaderIntro } from './components/HeaderIntro';
import { ServerStatusDashboard } from './components/ServerStatusDashboard';
import { UptimeGraph } from './components/UptimeGraph';
import { OnlinePlayers } from './components/OnlinePlayers';
import { RulesBentoGrid } from './components/RulesBentoGrid';
import { DiscordBotPanel } from './components/DiscordBotPanel';
import { BackgroundBeams } from './components/ui/background-beams';
import { ConfigModal } from './components/ConfigModal';
import { ShareModal } from './components/ShareModal';
import { Toast } from './components/Toast';
import { sounds } from './utils/audio';
import { 
  Gamepad2, 
  MessageSquare, 
  Share2, 
  Settings
} from 'lucide-react';

export default function App() {
  // Load stored config or default
  const [config, setConfig] = useState<ServerConfig>(() => {
    try {
      const saved = localStorage.getItem('mymc_portal_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch {
      // ignore
    }
    return DEFAULT_CONFIG;
  });

  // Sound preference (stored in localStorage)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mymc_sound_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Sync sound manager enabled state
  useEffect(() => {
    sounds.setEnabled(soundEnabled);
    try {
      localStorage.setItem('mymc_sound_enabled', JSON.stringify(soundEnabled));
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      if (next) sounds.playPop();
      showToast(next ? "Interactive Audio unmuted" : "Interactive Audio muted");
      return next;
    });
  };

  const [stats, setStats] = useState<ServerStats>({
    isOnline: true,
    motdClean: "Connecting to server...",
    playersOnline: 0,
    maxPlayers: 20,
    playersList: [],
    version: config.mcVersion || "1.21.11",
    lastChecked: "Just now"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  // Fetch real server telemetry via api.mcsrvstat.us/3
  const refreshStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const updated = await ServerStatusService.fetchStatus(config);
      setStats(updated);
    } catch (e) {
      console.error("Failed to fetch server status:", e);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  // Initial load
  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  // Periodic refresh (every 25s)
  useEffect(() => {
    const timer = setInterval(() => {
      refreshStatus();
    }, (config.autoRefreshInterval || 25) * 1000);

    return () => clearInterval(timer);
  }, [config.autoRefreshInterval, refreshStatus]);

  // Direct IP Copy helper
  const handleCopy = (text: string, label: string) => {
    sounds.playPop();
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    showToast(`Copied ${text}`);
    setTimeout(() => {
      setCopiedLabel(null);
    }, 2500);
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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-400 selection:text-zinc-950 relative overflow-x-hidden">
      {/* Aceternity UI Background Beams component over deep dark bg-zinc-950 canvas */}
      <div className="absolute top-0 inset-x-0 h-[850px] w-full overflow-hidden pointer-events-none z-0">
        <BackgroundBeams />
        {/* Soft gradient mask ensuring pristine foreground text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-zinc-950/60 to-zinc-950 pointer-events-none" />
      </div>

      {/* 1. Floating Navbar: Compact glassmorphism pill with Home, Players, Rules, Discord */}
      <Navbar
        config={config}
        stats={stats}
        onOpenSettings={() => {
          sounds.playClick();
          setIsConfigOpen(true);
        }}
        onCopyIp={handleCopy}
        copiedLabel={copiedLabel}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full space-y-8 sm:space-y-10 relative z-10 pb-16 overflow-x-hidden">
        {/* 2. Headline Intro with Direct IP Copy Action Buttons */}
        <HeaderIntro 
          config={config} 
          stats={stats} 
          onCopyIp={handleCopy}
          copiedLabel={copiedLabel}
        />

        {/* 3. Central Server Status Dashboard Section */}
        <ServerStatusDashboard
          config={config}
          stats={stats}
          onCopyIp={handleCopy}
          copiedLabel={copiedLabel}
          onRefresh={refreshStatus}
          isLoading={isLoading}
        />

        {/* 4. Dedicated Server Uptime & Latency Graph */}
        <UptimeGraph 
          stats={stats} 
          config={config} 
        />

        {/* 5. Live Online Players with Real Crafatar Heads */}
        <OnlinePlayers stats={stats} />

        {/* 6. Bento Rules & FAQ Grid */}
        <RulesBentoGrid
          rules={SERVER_RULES}
          faqs={FAQS}
        />

        {/* 7. Discord Bot Telemetry Integration */}
        <div className="max-w-5xl mx-auto px-4">
          <DiscordBotPanel
            commands={BOT_COMMANDS}
            config={config}
            onCopy={handleCopy}
            copiedLabel={copiedLabel}
          />
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-8 text-xs text-zinc-400 relative z-10 font-mono">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
              <Gamepad2 className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-zinc-200">{config.serverName}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">Live Status Portal</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => {
                sounds.playClick();
                setIsShareOpen(true);
              }}
              className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Share Portal</span>
            </button>

            <a
              href={config.discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playClick()}
              className="hover:text-[#8ea1ff] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#5865F2]" />
              <span>Discord</span>
            </a>

            <button
              onClick={() => {
                sounds.playClick();
                setIsConfigOpen(true);
              }}
              className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-zinc-400" />
              <span>Settings</span>
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
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        config={config}
        onCopy={handleCopy}
        copiedLabel={copiedLabel}
      />

      {/* Global Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}

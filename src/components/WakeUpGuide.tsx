import React, { useState } from 'react';
import { ServerConfig } from '../types';
import { 
  Zap, 
  Terminal, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Info, 
  Sparkles,
  ShieldAlert,
  Bot
} from 'lucide-react';

interface WakeUpGuideProps {
  config: ServerConfig;
  onSimulateStart: () => void;
  isStarting?: boolean;
}

export const WakeUpGuide: React.FC<WakeUpGuideProps> = ({
  config,
  onSimulateStart,
  isStarting = false
}) => {
  const [hasRequested, setHasRequested] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleWebWakeRequest = () => {
    if (cooldown > 0 || isStarting) return;
    setHasRequested(true);
    setCooldown(30);
    onSimulateStart();

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div 
      id="wake-up-guide-container"
      className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
    >
      {/* Background ambient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>24/7 Always-On Portal • Instant Server Wake-Up</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
            Server is currently resting in Sleep Mode
          </h2>
          <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
            To conserve resources on Heaven Cloud / My-MC.Link, our server turns off when empty. 
            Follow the 3 quick steps below to boot it up in under 30 seconds!
          </p>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          <button
            id="btn-web-wake-trigger"
            onClick={handleWebWakeRequest}
            disabled={cooldown > 0 || isStarting}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer ${
              isStarting
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait'
                : cooldown > 0
                ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/60 active:scale-95'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isStarting ? 'animate-spin' : ''}`} />
            <span>
              {isStarting 
                ? 'Server is Booting (~25s)...' 
                : cooldown > 0 
                ? `Wait Cooldown (${cooldown}s)` 
                : '⚡ Request Instant Boot'}
            </span>
          </button>
        </div>
      </div>

      {/* 3 Step Interactive Walkthrough */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Step 1 */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-5 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-lg bg-zinc-800 text-emerald-400 font-mono text-sm font-bold flex items-center justify-center border border-zinc-700">
                1
              </span>
              <MessageSquare className="w-5 h-5 text-[#5865F2]" />
            </div>
            <h3 className="font-semibold text-zinc-200 text-sm mb-1">
              Join our Discord Server
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Connect to our official Discord community to access player chat and the automated bot commands.
            </p>
          </div>

          <a
            id="btn-step1-discord-join"
            href={config.discordInviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-[#8ea1ff] border border-[#5865F2]/40 text-xs font-semibold transition-colors"
          >
            <span>Open Discord</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Step 2 */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-5 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-lg bg-zinc-800 text-emerald-400 font-mono text-sm font-bold flex items-center justify-center border border-zinc-700">
                2
              </span>
              <Terminal className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-semibold text-zinc-200 text-sm mb-1">
              Go to Bot Command Channel
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Find the dedicated command channel in Discord:
            </p>
            <div className="mt-2 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-700/70 font-mono text-xs text-amber-300 font-semibold truncate">
              {config.discordChannelName}
            </div>
          </div>

          <div className="mt-4 text-[11px] text-zinc-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
            <span>Channel restricts spam from main chat</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-5 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-lg bg-zinc-800 text-emerald-400 font-mono text-sm font-bold flex items-center justify-center border border-zinc-700">
                3
              </span>
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-zinc-200 text-sm mb-1">
              Type <code className="text-emerald-400 bg-zinc-900 px-1.5 py-0.5 rounded">/start</code> or <code className="text-emerald-400 bg-zinc-900 px-1.5 py-0.5 rounded">!start</code>
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Our bot will call the My-MC.Link panel API and boot the server. Works with both slash and prefix commands!
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400/90 font-mono bg-emerald-950/30 border border-emerald-800/40 p-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Auto-boots in ~30s</span>
          </div>
        </div>
      </div>

      {/* Cloudflare Fallback Note */}
      <div className="flex items-start gap-3 bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-400">
        <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-zinc-200">Cloudflare Fallback Built-In:</span> If Discord shows a temporary "Thinking..." delay during slash commands, our bot's automated fallback routes responses directly via WebSocket to ensure your commands always execute reliably.
        </div>
      </div>
    </div>
  );
};

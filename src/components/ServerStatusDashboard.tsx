import React, { useState } from 'react';
import { ServerConfig, ServerStats } from '../types';
import { sounds } from '../utils/audio';
import { 
  Users, 
  Server, 
  RefreshCw, 
  Check, 
  Copy, 
  ExternalLink,
  Shield,
  Smartphone,
  Coffee
} from 'lucide-react';

interface ServerStatusDashboardProps {
  config: ServerConfig;
  stats: ServerStats;
  onCopyIp: (ip: string, label: string) => void;
  copiedLabel: string | null;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const ServerStatusDashboard: React.FC<ServerStatusDashboardProps> = ({
  config,
  stats,
  onCopyIp,
  copiedLabel,
  onRefresh,
  isLoading = false,
}) => {
  const fullJavaIp = config.javaPort === 25565 ? config.javaIp : `${config.javaIp}:${config.javaPort}`;
  const fullBedrockIp = `${config.bedrockIp}:${config.bedrockPort}`;

  const isJavaCopied = copiedLabel === 'dash-java-ip';
  const isBedrockCopied = copiedLabel === 'dash-bedrock-ip';

  const playerPercentage = stats.maxPlayers > 0 
    ? Math.min(100, Math.round((stats.playersOnline / stats.maxPlayers) * 100))
    : 0;

  return (
    <section id="dashboard" className="relative max-w-5xl mx-auto px-4 scroll-mt-24">
      <div 
        id="central-dashboard-container"
        className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 sm:p-7 shadow-xl space-y-6"
      >
        {/* Top Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5 shrink-0">
                {stats.isOnline && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span 
                  className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                    stats.isOnline ? 'bg-emerald-400' : 'bg-rose-500'
                  }`} 
                />
              </span>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
                {stats.isOnline ? 'Server Online' : 'Server Offline'}
              </h2>

              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-xs font-mono font-semibold">
                Live Data
              </span>
            </div>

            <p className="text-xs text-zinc-400 font-mono">
              MOTD: <span className="text-zinc-200">{stats.motdClean || 'A Minecraft Server'}</span>
            </p>
          </div>

          {/* Refresh Action */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block font-mono text-[11px] text-zinc-500">
              <span>Updated: {stats.lastChecked}</span>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                onRefresh();
              }}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-mono font-medium transition-colors cursor-pointer disabled:opacity-50"
              title="Fetch latest server ping"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Real Live Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Player Count Metric */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                Players Online
              </span>
              <span className="text-emerald-400 font-bold">
                {stats.playersOnline} / {stats.maxPlayers}
              </span>
            </div>

            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${playerPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-500">
              <span>Capacity</span>
              <span>{playerPercentage}% occupied</span>
            </div>
          </div>

          {/* Version Metric */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                Minecraft Version
              </span>
            </div>
            <div className="text-lg font-bold text-white">
              v{stats.version || config.mcVersion}
            </div>
            <div className="text-[11px] text-zinc-500">
              Vanilla & Paper Compatible
            </div>
          </div>

          {/* Crossplay Status */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Server className="w-4 h-4 text-emerald-400" />
                Protocol Support
              </span>
            </div>
            <div className="text-lg font-bold text-white">
              GeyserMC Crossplay
            </div>
            <div className="text-[11px] text-zinc-500">
              Java Edition + Bedrock clients
            </div>
          </div>
        </div>

        {/* Real Connection Details Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Java Bar */}
          <div className="bg-zinc-950/40 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between gap-3 font-mono">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                <Coffee className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-zinc-400">Java Edition Address</div>
                <div className="text-xs sm:text-sm font-bold text-white truncate select-all">
                  {fullJavaIp}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playPop();
                onCopyIp(fullJavaIp, 'dash-java-ip');
              }}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              {isJavaCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Bedrock Bar */}
          <div className="bg-zinc-950/40 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between gap-3 font-mono">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-zinc-400">Bedrock Edition Address</div>
                <div className="text-xs sm:text-sm font-bold text-white truncate select-all">
                  {fullBedrockIp}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playPop();
                onCopyIp(fullBedrockIp, 'dash-bedrock-ip');
              }}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              {isBedrockCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

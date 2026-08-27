import React, { useState } from 'react';
import { BotCommandInfo, ServerConfig } from '../types';
import { 
  Terminal, 
  Bot, 
  ShieldAlert, 
  Copy, 
  Check, 
  Play, 
  Sparkles, 
  Lock, 
  Layers, 
  ChevronRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface DiscordBotPanelProps {
  commands: BotCommandInfo[];
  config: ServerConfig;
  onCopy: (text: string, label: string) => void;
  copiedLabel: string | null;
}

export const DiscordBotPanel: React.FC<DiscordBotPanelProps> = ({
  commands,
  config,
  onCopy,
  copiedLabel
}) => {
  const [selectedCommand, setSelectedCommand] = useState<BotCommandInfo>(commands[0]);
  const [activeTab, setActiveTab] = useState<'commands' | 'architecture' | 'simulator'>('commands');

  return (
    <div id="discord-bot-section" className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#8ea1ff]">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
                Discord Bot Integration
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5865F2]/20 text-[#8ea1ff] border border-[#5865F2]/30 text-xs font-mono font-bold">
                discord.py 3.13
              </span>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
              Hybrid slash & prefix control panel connected to My-MC.Link panel API.
            </p>
          </div>
        </div>

        {/* Discord Link */}
        <a
          id="btn-bot-join-discord"
          href={config.discordInviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Join Bot Channel</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('commands')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'commands'
              ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Bot Command Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'simulator'
              ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Discord Embed Preview</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'architecture'
              ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
          <span>Fail-Safe System & Cloudflare Shield</span>
        </button>
      </div>

      {/* Tab 1: Command Directory */}
      {activeTab === 'commands' && (
        <div className="space-y-4">
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between gap-2 text-xs text-zinc-400">
            <span className="font-mono">
              Restricted Channel: <strong className="text-amber-300 font-semibold">{config.discordChannelName}</strong>
            </span>
            <span className="text-[11px] text-zinc-500 hidden sm:inline">
              Supports both <code className="text-zinc-300">/slash</code> & <code className="text-zinc-300">!prefix</code>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {commands.map((cmd) => (
              <div
                key={cmd.name}
                id={`command-card-${cmd.name.replace('/', '')}`}
                onClick={() => setSelectedCommand(cmd)}
                className={`bg-zinc-950/80 border rounded-xl p-4 transition-all cursor-pointer ${
                  selectedCommand.name === cmd.name
                    ? 'border-emerald-500/60 bg-zinc-950 shadow-md'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-emerald-400 font-bold text-sm bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      {cmd.name}
                    </span>
                    <span className="text-zinc-500 text-xs">or</span>
                    <span className="text-amber-400 text-xs bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                      {cmd.prefixAlias}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {cmd.adminOnly ? (
                      <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                        <Lock className="w-2.5 h-2.5" />
                        Admin Only
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        Public
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopy(cmd.name, `cmd-${cmd.name}`);
                      }}
                      className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                      title="Copy Command"
                    >
                      {copiedLabel === `cmd-${cmd.name}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-zinc-400 text-xs leading-relaxed mb-3">
                  {cmd.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-2 border-t border-zinc-800/80">
                  <span>Cooldown: {cmd.cooldownSec}s</span>
                  <span className="text-zinc-400 flex items-center gap-1">
                    Click to view embed <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Discord Simulator */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Command selector list */}
          <div className="lg:col-span-4 space-y-2">
            <label className="text-xs font-semibold text-zinc-400 block mb-1">
              Select Command to Test:
            </label>
            {commands.map((cmd) => (
              <button
                key={cmd.name}
                onClick={() => setSelectedCommand(cmd)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs font-mono transition-all cursor-pointer ${
                  selectedCommand.name === cmd.name
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <span>{cmd.name}</span>
                <span className="text-[10px] text-zinc-500">{cmd.adminOnly ? 'Admin' : 'Public'}</span>
              </button>
            ))}
          </div>

          {/* Discord UI Mockup Box */}
          <div className="lg:col-span-8 bg-[#313338] rounded-2xl p-5 border border-zinc-700/60 shadow-2xl font-sans text-zinc-200">
            {/* Discord Channel Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-700/60 text-zinc-300 text-xs font-semibold mb-4">
              <span className="text-zinc-400 text-base font-normal">#</span>
              <span className="font-mono">{config.discordChannelName}</span>
            </div>

            {/* Message Group */}
            <div className="space-y-4">
              {/* User Command Invocation */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white text-xs shrink-0">
                  MC
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Player_One</span>
                    <span className="text-[10px] text-zinc-400">Today at 12:45 PM</span>
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#383a40] text-emerald-400 font-mono text-xs">
                    <span>{selectedCommand.name}</span>
                  </div>
                </div>
              </div>

              {/* Bot Response Embed */}
              <div className="flex items-start gap-3 pl-2 sm:pl-4">
                <div className="w-9 h-9 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  BOT
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">MyMC Server Guard</span>
                    <span className="bg-[#5865F2] text-white text-[9px] font-bold px-1 py-0.2 rounded">BOT</span>
                    <span className="text-[10px] text-zinc-400">Today at 12:45 PM</span>
                  </div>

                  {/* Embed Card */}
                  <div className="mt-2 bg-[#2b2d31] border-l-4 border-emerald-500 rounded-r-lg p-3.5 space-y-2 text-xs">
                    <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
                      My-MC.Link Server Panel • {config.serverId}
                    </div>
                    <div className="text-sm font-bold text-zinc-100">
                      Command Executed: {selectedCommand.name}
                    </div>
                    <div className="text-zinc-300 font-mono whitespace-pre-line text-xs bg-[#1e1f22] p-2.5 rounded border border-zinc-800">
                      {selectedCommand.responsePreview}
                    </div>
                    <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-1">
                      <span>Latency: 28ms • WebSocket Guard</span>
                      <span>Safe Defer Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Fail-Safe Architecture */}
      {activeTab === 'architecture' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>Cloudflare HTTP Block Fallback</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              On free tier hosting (Heaven Cloud), Discord HTTP API requests for slash commands can encounter Cloudflare rate limits (HTTP 1015/429), causing indefinite "Thinking..." states.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-300 space-y-1">
              <div className="text-emerald-400"># Solution implemented in bot:</div>
              <div>1. <code className="text-sky-300">safe_defer()</code> tries interaction HTTP</div>
              <div>2. If HTTP fails &rarr; redirects to <code className="text-amber-300">ctx.channel.send()</code> (WebSocket)</div>
              <div>3. 100% visible delivery guaranteed</div>
            </div>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Layers className="w-4 h-4" />
              <span>Smart API Cache & Sleep Handler</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              When the Minecraft server is powered down, My-MC.Link panel returns HTTP 404 for cache files. The bot intercepts 404 as an expected <strong className="text-zinc-200">Server Offline</strong> state instead of an unhandled exception.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-300 space-y-1">
              <div className="text-emerald-400"># Async Threading & Reconnect:</div>
              <div>• <code className="text-sky-300">asyncio.to_thread()</code> for synchronous API safety</div>
              <div>• <code className="text-amber-300">heartbeat_timeout=60.0</code> for network drops</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

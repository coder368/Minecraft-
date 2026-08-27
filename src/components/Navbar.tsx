import React from 'react';
import { ServerConfig, ServerStats } from '../types';
import { 
  Gamepad2, 
  Copy, 
  Check, 
  MessageSquare, 
  Settings, 
  Activity, 
  ShieldCheck, 
  Terminal
} from 'lucide-react';

interface NavbarProps {
  config: ServerConfig;
  stats: ServerStats;
  onOpenSettings: () => void;
  onCopyIp: (ip: string, label: string) => void;
  copiedLabel: string | null;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  stats,
  onOpenSettings,
  onCopyIp,
  copiedLabel,
  activeSection,
  setActiveSection
}) => {
  const navItems = [
    { id: 'connect', label: 'Join Server', icon: Gamepad2 },
    { id: 'players', label: 'Online Players', icon: Activity, badge: stats.isOnline ? `${stats.playersOnline}` : undefined },
    { id: 'bot', label: 'Discord Bot', icon: Terminal },
    { id: 'rules', label: 'Rules & FAQ', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-0.5 shadow-lg shadow-emerald-950/50 flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg sm:text-xl text-zinc-100 tracking-tight font-mono">
                  {config.serverName}
                </h1>
                {/* Real-time Status Badge */}
                <div 
                  id="navbar-status-badge"
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    stats.isStarting
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : stats.isOnline
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    stats.isStarting
                      ? 'bg-amber-400 animate-ping'
                      : stats.isOnline
                      ? 'bg-emerald-400 animate-pulse'
                      : 'bg-rose-400'
                  }`} />
                  <span className="capitalize">
                    {stats.isStarting ? 'Booting...' : stats.isOnline ? `${stats.playersOnline} Online` : 'Sleeping'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block truncate max-w-xs md:max-w-md">
                {config.serverTagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions: Quick Copy & Discord */}
          <div className="flex items-center gap-2">
            <button
              id="btn-quick-copy-ip"
              onClick={() => onCopyIp(config.javaIp, 'quick-java')}
              className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-zinc-800 text-xs font-mono transition-colors cursor-pointer"
              title="Copy Java IP"
            >
              {copiedLabel === 'quick-java' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">IP Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{config.javaIp}</span>
                </>
              )}
            </button>

            <a
              id="btn-navbar-discord"
              href={config.discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Discord</span>
            </a>

            <button
              id="btn-open-settings"
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 transition-colors cursor-pointer"
              title="Server & Web Portal Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-zinc-800/80 overflow-x-auto gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={`mob-${item.id}`}
                id={`mob-nav-btn-${item.id}`}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

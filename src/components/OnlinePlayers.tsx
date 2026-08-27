import React, { useState } from 'react';
import { PlayerInfo, ServerStats } from '../types';
import { Users, Search, Wifi, Clock, Shield, Sparkles, User, ExternalLink } from 'lucide-react';

interface OnlinePlayersProps {
  stats: ServerStats;
}

export const OnlinePlayers: React.FC<OnlinePlayersProps> = ({ stats }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const players = stats.playersList || [];
  const filteredPlayers = players.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.rank && p.rank.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRankBadgeStyle = (rank?: string) => {
    switch (rank?.toLowerCase()) {
      case 'staff':
      case 'admin':
      case 'mod':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40';
      case 'champion':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'vip':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/40';
      default:
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div id="online-players-section" className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
              Online Players
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
              {stats.isOnline ? `${stats.playersOnline} / ${stats.maxPlayers}` : '0 / 20'}
            </span>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Real-time player roster currently active in the survival realm.
          </p>
        </div>

        {stats.isOnline && players.length > 0 && (
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-player-search"
              placeholder="Search player or rank..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        )}
      </div>

      {!stats.isOnline ? (
        <div className="text-center py-12 px-4 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/40">
          <Users className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-zinc-300 font-semibold text-sm">Server is currently sleeping</h3>
          <p className="text-zinc-500 text-xs max-w-md mx-auto mt-1">
            No players are currently connected. Wake up the server via our Discord bot command <code className="text-emerald-400">/start</code> to begin playing!
          </p>
        </div>
      ) : filteredPlayers.length === 0 ? (
        <div className="text-center py-10 px-4 border border-zinc-800 rounded-xl bg-zinc-950/40">
          <p className="text-zinc-400 text-xs">
            {searchTerm ? `No players found matching "${searchTerm}".` : 'No players currently online. Be the first to join!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPlayers.map((player) => (
            <div
              key={player.name}
              id={`player-card-${player.name}`}
              className="bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3.5 flex items-center justify-between gap-3 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Skin Face Avatar */}
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 relative">
                  <img
                    src={`https://mc-heads.net/avatar/${player.name}/64`}
                    alt={player.name}
                    className="w-full h-full object-cover rendering-pixelated"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to Minotar or generic Steve
                      (e.target as HTMLImageElement).src = `https://minotar.net/avatar/${player.name}/64`;
                    }}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-zinc-200 text-sm truncate font-mono">
                      {player.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    {player.rank && (
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold border uppercase tracking-wider ${getRankBadgeStyle(player.rank)}`}>
                        {player.rank}
                      </span>
                    )}

                    {player.playtimeHours && (
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-600" />
                        {player.playtimeHours}h
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Ping Meter */}
              <div className="flex items-center gap-1 text-xs font-mono text-zinc-400 shrink-0">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>{player.ping || 32}ms</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

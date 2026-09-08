import React, { useState } from 'react';
import { PlayerInfo, ServerStats } from '../types';
import { Users, Search, UserCheck } from 'lucide-react';

interface OnlinePlayersProps {
  stats: ServerStats;
}

export const OnlinePlayers: React.FC<OnlinePlayersProps> = ({ stats }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const players = stats.playersList || [];
  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="players" className="relative py-6 px-4 scroll-mt-24">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold tracking-tight text-white uppercase font-mono">
                Online Players
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-mono font-bold">
                {stats.isOnline ? `${stats.playersOnline} / ${stats.maxPlayers}` : 'Offline'}
              </span>
            </div>
            <p className="text-zinc-400 text-xs font-mono">
              Live roster from server query endpoint.
            </p>
          </div>

          {/* Search bar (only if players are listed) */}
          {stats.isOnline && players.length > 0 && (
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                id="input-player-search"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/50 font-mono transition-colors"
              />
            </div>
          )}
        </div>

        {/* Players Grid / Honest State */}
        {!stats.isOnline ? (
          <div className="text-center py-10 px-4 border border-zinc-800 rounded-xl bg-zinc-900/50 font-mono">
            <Users className="w-7 h-7 text-zinc-600 mx-auto mb-2" />
            <h3 className="text-zinc-300 font-semibold text-xs">Server is currently offline</h3>
            <p className="text-zinc-500 text-xs max-w-md mx-auto mt-1">
              Start the server via Discord or check back shortly.
            </p>
          </div>
        ) : stats.playersOnline === 0 ? (
          <div className="text-center py-10 px-4 border border-zinc-800 rounded-xl bg-zinc-900/50 font-mono">
            <Users className="w-7 h-7 text-zinc-600 mx-auto mb-2" />
            <h3 className="text-zinc-300 font-semibold text-xs">0 Players Currently Online</h3>
            <p className="text-zinc-500 text-xs max-w-md mx-auto mt-1">
              The server is active and waiting. Join now and be the first in the realm!
            </p>
          </div>
        ) : players.length === 0 ? (
          <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-900/50 font-mono text-center space-y-2">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-400/10 text-emerald-400 mb-1">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="text-zinc-200 text-xs font-semibold">
              {stats.playersOnline} {stats.playersOnline === 1 ? 'Player' : 'Players'} Exploring the World
            </h3>
            <p className="text-zinc-500 text-xs max-w-lg mx-auto">
              Player count is verified live via server ping. Individual username rosters are hidden when player query is disabled on the server.
            </p>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="text-center py-8 px-4 border border-zinc-800 rounded-xl bg-zinc-900/50 font-mono">
            <p className="text-zinc-400 text-xs">
              No players found matching "{searchTerm}".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredPlayers.map((player) => {
              // Fetch real player head via Crafatar by UUID (or name fallback)
              const crafatarUrl = player.uuid && player.uuid !== player.name
                ? `https://crafatar.com/avatars/${player.uuid}?size=64&overlay=true`
                : `https://crafatar.com/avatars/${player.name}?size=64&overlay=true`;

              return (
                <div
                  key={player.name}
                  id={`player-card-${player.name}`}
                  className="rounded-xl p-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center gap-3 font-mono"
                >
                  {/* Crafatar Real Avatar */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                    <img
                      src={crafatarUrl}
                      alt={player.name}
                      className="w-full h-full object-cover [image-rendering:pixelated]"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to Minotar if Crafatar UUID not cached
                        (e.target as HTMLImageElement).src = `https://minotar.net/avatar/${player.name}/64`;
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-zinc-100 text-xs truncate">
                      {player.name}
                    </div>
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      <span>Online</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

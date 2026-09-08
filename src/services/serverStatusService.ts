import { ServerConfig, ServerStats, PlayerInfo } from '../types';

interface McSrvStatV3Response {
  online: boolean;
  ip?: string;
  port?: number;
  hostname?: string;
  version?: string;
  software?: string;
  protocol?: {
    version?: number;
    name?: string;
  } | number;
  motd?: {
    raw?: string[];
    clean?: string[];
    html?: string[];
  };
  players?: {
    online?: number;
    max?: number;
    list?: Array<string | { name: string; uuid?: string }>;
    uuid?: Record<string, string>;
  };
  debug?: {
    ping?: boolean;
    query?: boolean;
  };
}

export class ServerStatusService {
  public static async fetchStatus(config: ServerConfig): Promise<ServerStats> {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Target address (default Java address with port: my-mc.link:40891)
    let address = config.javaIp ? config.javaIp.trim() : 'my-mc.link';
    if (!address.includes(':') && config.javaPort && config.javaPort !== 25565) {
      address = `${address}:${config.javaPort}`;
    } else if (!address.includes(':') && config.javaPort === 40891) {
      address = `${address}:40891`;
    }

    try {
      // Primary real endpoint: api.mcsrvstat.us/3/
      const res = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(address)}?t=${Date.now()}`, {
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data: McSrvStatV3Response = await res.json();

      const isOnline = Boolean(data.online);
      const playersOnline = data.players?.online ?? 0;
      const maxPlayers = data.players?.max ?? 20;
      const version = data.version || (typeof data.protocol === 'object' ? data.protocol?.name : undefined) || config.mcVersion || '1.21.11';

      // Parse MOTD
      let motdClean = 'A Minecraft Server';
      if (data.motd?.clean && Array.isArray(data.motd.clean) && data.motd.clean.length > 0) {
        motdClean = data.motd.clean.join(' ').trim();
      }

      // Parse real player roster if returned
      const playersList: PlayerInfo[] = [];
      if (data.players?.list && Array.isArray(data.players.list)) {
        data.players.list.forEach((item) => {
          const name = typeof item === 'string' ? item : item?.name;
          if (name && typeof name === 'string' && name.trim()) {
            const cleanName = name.trim();
            const uuid = (typeof item === 'object' && item?.uuid)
              ? item.uuid
              : (data.players?.uuid && data.players.uuid[cleanName])
              ? data.players.uuid[cleanName]
              : cleanName;

            playersList.push({
              name: cleanName,
              uuid: uuid,
            });
          }
        });
      }

      return {
        isOnline,
        motdClean,
        playersOnline,
        maxPlayers,
        playersList,
        version,
        lastChecked: now,
      };
    } catch (err) {
      console.warn('Primary mcsrvstat.us/3 check failed, trying fallback to /2:', err);
      try {
        // Fallback to mcsrvstat.us/2
        const fallbackRes = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(address)}?t=${Date.now()}`);
        if (fallbackRes.ok) {
          const fbData = await fallbackRes.json();
          return {
            isOnline: Boolean(fbData.online),
            motdClean: fbData.motd?.clean?.join(' ').trim() || 'A Minecraft Server',
            playersOnline: fbData.players?.online ?? 0,
            maxPlayers: fbData.players?.max ?? 20,
            playersList: (fbData.players?.list || []).map((p: any) => ({
              name: typeof p === 'string' ? p : p.name,
              uuid: typeof p === 'object' ? p.uuid : p,
            })),
            version: fbData.version || config.mcVersion,
            lastChecked: now,
          };
        }
      } catch (fbErr) {
        console.error('All live status checks failed:', fbErr);
      }

      // If network unreachable, return offline state
      return {
        isOnline: false,
        motdClean: 'Server unreachable or offline',
        playersOnline: 0,
        maxPlayers: 20,
        playersList: [],
        version: config.mcVersion,
        lastChecked: now,
      };
    }
  }
}

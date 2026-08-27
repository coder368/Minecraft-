import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ServerConfig, ServerStats } from '../types';
import { 
  Laptop, 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Wifi,
  Sparkles
} from 'lucide-react';

interface ConnectionCardsProps {
  config: ServerConfig;
  stats: ServerStats;
  onCopy: (text: string, label: string) => void;
  copiedLabel: string | null;
}

export const ConnectionCards: React.FC<ConnectionCardsProps> = ({
  config,
  stats,
  onCopy,
  copiedLabel
}) => {
  const [showJavaGuide, setShowJavaGuide] = useState(false);
  const [showBedrockGuide, setShowBedrockGuide] = useState(false);

  const fullJavaAddress = config.javaPort && config.javaPort !== 25565
    ? `${config.javaIp}:${config.javaPort}`
    : config.javaIp;

  return (
    <motion.div 
      id="connection-cards-section"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Connect & Play</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Crossplay enabled — play seamlessly with Java Edition and Bedrock Edition (Mobile, Console, Windows 10/11).
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="flex items-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GeyserMC Crossplay Active</span>
          </span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Java Edition Card */}
        <motion.div 
          id="java-connection-card"
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-6 shadow-xl transition-colors flex flex-col justify-between relative overflow-hidden group"
        >
          {/* Subtle pulse/glow accent responsive to online state */}
          <motion.div 
            animate={{ 
              opacity: stats.isOnline ? [0.08, 0.18, 0.08] : 0.04,
              scale: stats.isOnline ? [1, 1.08, 1] : 1
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-36 h-36 bg-emerald-500 rounded-full blur-2xl pointer-events-none" 
          />

          <div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 text-emerald-400 flex items-center justify-center border border-zinc-700">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-zinc-100">Java Edition</h3>
                  <span className="text-xs text-zinc-400 font-mono">PC / Mac / Linux</span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-xs font-semibold">
                v1.21.x
              </span>
            </div>

            <p className="text-zinc-400 text-xs mb-4 relative z-10">
              Standard Minecraft Java client. Direct connection via hostname with automatic port resolution.
            </p>

            {/* IP Box */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 mb-4 relative z-10">
              <div className="text-[11px] text-zinc-400 mb-1 font-mono">SERVER ADDRESS</div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-emerald-400 font-bold text-base sm:text-lg select-all">
                  {fullJavaAddress}
                </span>
                <motion.button
                  id="btn-copy-java-ip"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => onCopy(fullJavaAddress, 'java-ip')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
                >
                  {copiedLabel === 'java-ip' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy IP</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Quick instructions toggle */}
          <div className="relative z-10">
            <button
              onClick={() => setShowJavaGuide(!showJavaGuide)}
              className="flex items-center justify-between w-full text-xs text-zinc-400 hover:text-zinc-200 py-1 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                <span>How to join on Java</span>
              </span>
              {showJavaGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {showJavaGuide && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2.5 p-3 rounded-lg bg-zinc-950/90 border border-zinc-800 text-xs text-zinc-400 space-y-1.5 font-sans overflow-hidden"
                >
                  <p>1. Open Minecraft Java Edition.</p>
                  <p>2. Click <strong>Multiplayer</strong> &rarr; <strong>Add Server</strong>.</p>
                  <p>3. Name it <strong>{config.serverName}</strong> and enter Server Address: <code className="text-emerald-400">{fullJavaAddress}</code>.</p>
                  <p>4. Click <strong>Done</strong>, select the server, and click <strong>Join Server</strong>.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Bedrock Edition Card */}
        <motion.div 
          id="bedrock-connection-card"
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="bg-zinc-900/90 border border-zinc-800 hover:border-sky-500/40 rounded-2xl p-6 shadow-xl transition-colors flex flex-col justify-between relative overflow-hidden group"
        >
          {/* Subtle pulse/glow accent responsive to online state */}
          <motion.div 
            animate={{ 
              opacity: stats.isOnline ? [0.08, 0.18, 0.08] : 0.04,
              scale: stats.isOnline ? [1, 1.08, 1] : 1
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-0 right-0 w-36 h-36 bg-sky-500 rounded-full blur-2xl pointer-events-none" 
          />

          <div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 text-sky-400 flex items-center justify-center border border-zinc-700">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-zinc-100">Bedrock Edition</h3>
                  <span className="text-xs text-zinc-400 font-mono">Mobile / Xbox / PS5 / Switch / Win10</span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/30 font-mono text-xs font-semibold">
                Port {config.bedrockPort}
              </span>
            </div>

            <p className="text-zinc-400 text-xs mb-4 relative z-10">
              GeyserMC Floodgate crossplay allows Bedrock players to join using their Xbox gamertag.
            </p>

            {/* IP and Port Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 relative z-10">
              {/* Server Address */}
              <div className="sm:col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                <div className="text-[10px] text-zinc-400 mb-0.5 font-mono">SERVER IP</div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-sky-400 font-bold text-sm truncate select-all">
                    {config.bedrockIp}
                  </span>
                  <motion.button
                    id="btn-copy-bedrock-ip"
                    whileTap={{ scale: 0.92 }}
                    onClick={() => onCopy(config.bedrockIp, 'bedrock-ip')}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                    title="Copy Bedrock IP"
                  >
                    {copiedLabel === 'bedrock-ip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </motion.button>
                </div>
              </div>

              {/* Port */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                <div className="text-[10px] text-zinc-400 mb-0.5 font-mono">PORT</div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-zinc-200 font-bold text-sm select-all">
                    {config.bedrockPort}
                  </span>
                  <motion.button
                    id="btn-copy-bedrock-port"
                    whileTap={{ scale: 0.92 }}
                    onClick={() => onCopy(config.bedrockPort.toString(), 'bedrock-port')}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                    title="Copy Bedrock Port"
                  >
                    {copiedLabel === 'bedrock-port' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick instructions toggle */}
          <div className="relative z-10">
            <button
              onClick={() => setShowBedrockGuide(!showBedrockGuide)}
              className="flex items-center justify-between w-full text-xs text-zinc-400 hover:text-zinc-200 py-1 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                <span>How to join on Bedrock</span>
              </span>
              {showBedrockGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {showBedrockGuide && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2.5 p-3 rounded-lg bg-zinc-950/90 border border-zinc-800 text-xs text-zinc-400 space-y-1.5 font-sans overflow-hidden"
                >
                  <p>1. Launch Minecraft Bedrock Edition (Pocket, Windows, or Console).</p>
                  <p>2. Tap <strong>Play</strong> &rarr; <strong>Servers</strong> tab &rarr; scroll down to <strong>Add Server</strong>.</p>
                  <p>3. Server Address: <code className="text-sky-400">{config.bedrockIp}</code> | Port: <code className="text-sky-400">{config.bedrockPort}</code>.</p>
                  <p>4. Save and tap to connect directly.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};


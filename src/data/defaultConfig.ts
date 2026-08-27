import { ServerConfig, BotCommandInfo, ServerRule, FaqItem } from '../types';

export const DEFAULT_CONFIG: ServerConfig = {
  serverName: "My-MC SMP",
  serverTagline: "Crossplay Survival Server with automated Discord Bot Integration",
  javaIp: "my-mc.link",
  javaPort: 38171,
  bedrockIp: "my-mc.link",
  bedrockPort: 45049,
  mcVersion: "1.21.11",
  serverId: "Minecraft",
  discordInviteUrl: "https://discord.gg/AxDVukJdgR",
  discordChannelName: "〢💻⪼『-ᴄᴏᴍᴍᴀɴᴅ÷ʟɪɴᴇ』",
  discordChannelId: "123456789012345678",
  myMcApiUrl: "https://api.my-mc.link",
  myMcApiKey: "",
  autoRefreshInterval: 15,
  enableSimulation: false, // Default to REAL-TIME live querying!
};

export const BOT_COMMANDS: BotCommandInfo[] = [
  {
    name: "/status",
    prefixAlias: "!status",
    description: "Displays modern server status, RAM, and CPU usage with online player count.",
    adminOnly: false,
    cooldownSec: 10,
    example: "/status",
    responsePreview: "🟢 **Server is Online**\n⚡ CPU Usage: `18.4%`\n💾 RAM Usage: `1.85 GB (46.2%)`\n👥 Players: `6 / 20`\n☕ Java IP: `my-mc.link:38171`\n📱 Bedrock IP: `my-mc.link:45049`"
  },
  {
    name: "/start",
    prefixAlias: "!start",
    description: "Sends power signal to start the server when it is offline or sleeping.",
    adminOnly: true,
    cooldownSec: 10,
    example: "/start",
    responsePreview: "🚀 **Server start command sent!**\nCheck `/status` in a few minutes."
  },
  {
    name: "/stop",
    prefixAlias: "!stop",
    description: "Safely shuts down the server container.",
    adminOnly: true,
    cooldownSec: 10,
    example: "/stop",
    responsePreview: "🛑 **Server stop command sent!**\nShutting down..."
  },
  {
    name: "/restart",
    prefixAlias: "!restart",
    description: "Restarts the server container.",
    adminOnly: true,
    cooldownSec: 15,
    example: "/restart",
    responsePreview: "🔄 **Server restart command sent!**\nBooting up..."
  },
  {
    name: "/my-mc-link",
    prefixAlias: "!my-mc-link",
    description: "Generates or retrieves the server's direct Java connection link.",
    adminOnly: true,
    cooldownSec: 10,
    example: "/my-mc-link",
    responsePreview: "🌐 **Java Network Link**\nAddress: `my-mc.link:38171`"
  },
  {
    name: "/my-mc-geyser",
    prefixAlias: "!my-mc-geyser",
    description: "Generates or retrieves the Geyser (Bedrock) connection link and port.",
    adminOnly: true,
    cooldownSec: 10,
    example: "/my-mc-geyser",
    responsePreview: "🌐 **Bedrock Network Link**\nAddress: `my-mc.link`\nPort: `45049`"
  },
  {
    name: "/serverhelp",
    prefixAlias: "!serverhelp",
    description: "Displays available server-management commands in the command channel.",
    adminOnly: false,
    cooldownSec: 5,
    example: "/serverhelp",
    responsePreview: "🛠️ **Minecraft Server Commands**\n`/status` - Shows if server is online, player count, and usage stats\n`/start` - Starts the server if it is offline\n`/stop` - Safely shuts down the server\n`/restart` - Restarts the server container\n`/my-mc-link` - Gets Java connection link\n`/my-mc-geyser` - Gets Bedrock connection link"
  }
];

export const SERVER_RULES: ServerRule[] = [
  {
    id: "rule-1",
    category: "Griefing & Theft",
    title: "No Griefing or Unclaimed Stealing",
    description: "Do not destroy or modify other players' builds or containers within or near claimed areas. Respect community builds.",
    punishment: "Warning -> Temporary Ban -> Permanent Ban"
  },
  {
    id: "rule-2",
    category: "Cheating & Exploits",
    title: "No X-Ray, Hacked Clients or Automation Macros",
    description: "Any client modifications providing unfair advantages (X-Ray texture packs, Baritone, fly/speed hacks, auto-clickers) are strictly forbidden.",
    punishment: "Immediate Permanent Ban"
  },
  {
    id: "rule-3",
    category: "Chat & Respect",
    title: "Family-Friendly & Respectful Communication",
    description: "No hate speech, harassment, toxicity, excessive spam, or advertising other servers in game chat or Discord channels.",
    punishment: "Mute -> Temp Ban"
  },
  {
    id: "rule-4",
    category: "Economy & Duplication",
    title: "No Item Duplication or Lag Machines",
    description: "Do not intentionally build redstone loops designed to lower TPS or duplicate items/rails/tnt.",
    punishment: "Inventory Wipe + Ban"
  }
];

export const FAQS: FaqItem[] = [
  {
    id: "faq-1",
    category: "server",
    question: "Why does the server go into sleep/offline mode?",
    answer: "To save resources and maintain high performance, the hosting container puts the server into sleep mode when no players are active. You can wake it up instantly by opening our Discord `#〢💻⪼『-ᴄᴏᴍᴍᴀɴᴅ÷ʟɪɴᴇ』` channel and typing `/start` (or `!start`)!"
  },
  {
    id: "faq-2",
    category: "connection",
    question: "Can Bedrock (Mobile / Xbox / PlayStation / Switch) players join?",
    answer: "Yes! We have GeyserMC & Floodgate installed. Use the Bedrock IP `my-mc.link` with Port `45049`. No Java account is required for Bedrock players."
  },
  {
    id: "faq-3",
    category: "discord",
    question: "How do the Discord bot commands work?",
    answer: "Our custom bot features hybrid command support! You can either use modern slash commands like `/status` and `/start`, or prefix commands like `!status` and `!start` inside `#〢💻⪼『-ᴄᴏᴍᴍᴀɴᴅ÷ʟɪɴᴇ』`."
  },
  {
    id: "faq-4",
    category: "gameplay",
    question: "How do I protect my house and chest from griefers?",
    answer: "Hold a Golden Shovel to claim land. Right click two opposite corners of your build. Use `/trust <player>` to give your friends permission to build or open containers."
  }
];

export const SAMPLE_ONLINE_PLAYERS = [
  { uuid: "853c80ef-3c37-49fd-aa49-938b674adae6", name: "EnderKnight99", rank: "Champion", ping: 28, playtimeHours: 142 },
  { uuid: "069a79f4-44e9-4726-a5be-fca90e38aaf5", name: "NotchHero", rank: "VIP", ping: 45, playtimeHours: 89 },
  { uuid: "f3c3a9a1-8d2a-4f62-b98a-211425a81234", name: "DiamondCrafter", rank: "Member", ping: 34, playtimeHours: 24 },
  { uuid: "5c7962b2-f3f0-4c1e-bb50-8a6f2d91bcde", name: "RedstoneWizard", rank: "VIP", ping: 52, playtimeHours: 67 },
  { uuid: "7125ba40-b643-4211-b633-888469d95f87", name: "PixelBuilder", rank: "Member", ping: 61, playtimeHours: 12 },
  { uuid: "4566e69f-c907-48ee-8d71-d7ba5aa00d20", name: "ShadowMod", rank: "Staff", ping: 19, playtimeHours: 320 }
];

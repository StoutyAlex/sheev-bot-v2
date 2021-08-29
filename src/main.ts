import "dotenv/config";
import { ShardingManager } from "discord.js";
import { resolve } from 'path';
import { totalShards as configTotalShards } from "./config";
import { createLogger } from './utils/logger';

const log = createLogger(`shardingmanager`, false);

const totalShards: number | "auto" = configTotalShards === "auto" ? configTotalShards : Number(configTotalShards);

const manager = new ShardingManager(resolve(__dirname.replace('src', 'dist'), "bot.js"), {
  totalShards,
  mode: "worker",
  respawn: true,
  token: process.env.BOT_TOKEN
});

manager.on("shardCreate", shard => {
  log.info(`[ShardManager] Shard #${shard.id} Spawned.`);
  shard.on("disconnect", () => {
      log.warn("SHARD_DISCONNECTED: ", { stack: `[ShardManager] Shard #${shard.id} Disconnected` });
  }).on("reconnecting", () => {
      log.info(`[ShardManager] Shard #${shard.id} Reconnected.`);
  });
  if (manager.shards.size === manager.totalShards) log.info("[ShardManager] All shards spawned successfully.");
}).spawn().catch(e => log.error("SHARD_SPAWN_ERR: ", e));
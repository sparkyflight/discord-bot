// Packages
import { ShardingManager } from "discord.js";
import * as dotenv from "dotenv";

// Configure Dotenv
dotenv.config();

// Sharding Manager
const manager = new ShardingManager("./dist/index.js", {
	token: process.env.DISCORD_TOKEN,
});

// Sharding Manager Events
manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));

// Spawn Shards
manager.spawn();

// Packages
import fs from "fs";
import path from "path";
import * as database from "./Serendipy/prisma.js";
import { hasPerm } from "./Serendipy/perms.js";
import {
	Client,
	GatewayIntentBits,
	Events,
	ActivityType,
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	codeBlock,
	ModalSubmitInteraction,
	AutocompleteInteraction,
} from "discord.js";
import { debug, info, error } from "./Serendipy/logger.js";
import "dotenv/config";

// Config
let DISCORD_SERVER_URI: String = "https://discord.gg/XbJEUs58y4";

// Create Discord Client
const client: Client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
	rest: {
		api: "http://localhost:7852/api",
	},
});

// Get files from directory
const getFilesInDirectory = (dir: string) => {
	let files: string[] = [];
	const filesInDir = fs.readdirSync(dir);

	for (const file of filesInDir) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory())
			files = files.concat(getFilesInDirectory(filePath));
		else files.push(filePath);
	}

	return files;
};

// Add Commands
const commands: Map<
	string,
	{
		data: {
			meta: SlashCommandBuilder;
			category: string;
			accountRequired: boolean;
			permissionRequired: string | null;
		};
		execute: (
			client: Client,
			interaction: ChatInputCommandInteraction,
			otherData: any
		) => Promise<void>;
		autocomplete: (
			client: Client,
			interaction: AutocompleteInteraction
		) => Promise<void>;
	}
> = new Map();
const commandFiles = getFilesInDirectory("./dist/commands").filter((file) =>
	file.endsWith(".js")
);

for (const file of commandFiles) {
	import(`../${file}`)
		.then((module) => {
			const i = module.default.default;
			commands.set(i.data.meta.name, i);
		})
		.catch((error) => {
			console.error(`Error importing ${file}: ${error}`);
		});
}

// Add Modals
const modals: Map<
	string,
	{
		data: {
			name: string;
			permissionRequired: string | null;
		};
		execute: (
			client: Client,
			interaction: ModalSubmitInteraction
		) => Promise<void>;
	}
> = new Map();
const modalFiles = getFilesInDirectory("./dist/modals").filter((file) =>
	file.endsWith(".js")
);

for (const file of modalFiles) {
	import(`../${file}`)
		.then((module) => {
			const i = module.default.default;
			modals.set(i.data.name, i);
		})
		.catch((error) => {
			console.error(`Error importing ${file}: ${error}`);
		});
}

// Debug Event
client.on("debug", (info) => {
	debug("Discord", info);
});

// Error Event
client.on("error", (p) => {
	error("Discord", p.toString());
});

// Ready Event
client.on(Events.ClientReady, () => {
	info("Discord", `Logged in as ${client.user?.tag}!`);
	client.user?.setStatus("dnd");
	client.user?.setActivity("Sparkyflight", { type: ActivityType.Watching });
});

// Interaction Event
client.on(Events.InteractionCreate, async (interaction) => {
	// Slash Command
	if (interaction.isChatInputCommand()) {
		const command = commands.get(interaction.commandName);
		if (!command)
			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("Oops!")
						.setDescription("This command does not exist!")
						.setColor("Random"),
				],
			});
		else
			try {
				const user = await database.Users.get({
					discord_id: interaction.user.id,
				});

				if (command.data.permissionRequired) {
					if (user) {
						if (
							hasPerm(
								user.staff_perms,
								command.data.permissionRequired
							)
						)
							await command?.execute(client, interaction, {
								commands: commands,
							});
						else
							await interaction.reply({
								embeds: [
									new EmbedBuilder()
										.setTitle("Oops! Missing Permissions!")
										.setDescription(
											`You do not have enough permissions to execute this command.\nPermissions Provided: **${user.staff_perms.join(", ") || "None"}**\n Permission Required: **${command.data.permissionRequired}**.`
										)
										.setColor("Random"),
								],
							});
					} else
						await interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle("Oops! Missing Permissions!")
									.setDescription(
										`You do not have enough permissions to execute this command. Permission Required: **${command.data.permissionRequired}**.`
									)
									.setColor("Random"),
							],
						});
				} else if (command.data.accountRequired && !user)
					await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle("Oops!")
								.setDescription(
									`Sorry, you cannot use this command.\nReason: Sparkyflight account not linked with Discord. Link it by going [**here**](https://sparkyflight.xyz/account).`
								)
								.setColor("Random"),
						],
					});
				else
					await command?.execute(client, interaction, {
						commands: commands,
					});
			} catch (p) {
				error("Discord", p.toString());

				await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle("Oops! We had an issue.")
							.setDescription(
								`This issue has been reported to our developers. If you continue to having issues with our bot, you may join our [Discord Server](${DISCORD_SERVER_URI})`
							)
							.setColor("Random")
							.addFields({
								name: "Error",
								value: codeBlock("javascript", p),
								inline: false,
							}),
					],
				});
			}
	}

	// Modal
	if (interaction.isModalSubmit()) {
		const modal = modals.get(interaction.customId);
		if (!modal) return;

		try {
			if (modal.data.permissionRequired) {
				const user = await database.Users.get({
					discord_id: interaction.user.id,
				});

				if (user) {
					if (
						hasPerm(user.staff_perms, modal.data.permissionRequired)
					)
						await modal?.execute(client, interaction);
					else
						await interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle("Oops! Missing Permissions!")
									.setDescription(
										`You do not have enough permissions to execute this command.\nPermissions Provided: **${user.staff_perms.join(", ") || "None"}**\n Permission Required: **${modal.data.permissionRequired}**.`
									)
									.setColor("Random"),
							],
						});
				} else
					await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle("Oops! Missing Permissions!")
								.setDescription(
									`You do not have enough permissions to execute this command. Permission Required: **${modal.data.permissionRequired}**.`
								)
								.setColor("Random"),
						],
					});
			} else await modal?.execute(client, interaction);
		} catch (p) {
			error("Discord", p.toString());

			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("Oops! We had an issue.")
						.setDescription(
							`This issue has been reported to our developers. If you continue to having issues with our bot, you may join our [Discord Server](${DISCORD_SERVER_URI})`
						)
						.setColor("Random")
						.addFields({
							name: "Error",
							value: codeBlock("javascript", p),
							inline: false,
						}),
				],
			});
		}
	}

	// Autocomplete
	if (interaction.isAutocomplete()) {
		const command = commands.get(interaction.commandName);
		if (!command) return;

		try {
			await command?.autocomplete(client, interaction);
		} catch (p) {
			error("Discord", p.toString());
			return;
		}
	}
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);

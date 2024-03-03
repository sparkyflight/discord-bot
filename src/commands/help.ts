import { ActionRowBuilder, SlashCommandBuilder } from "@discordjs/builders";
import {
	EmbedBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from "discord.js";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("help")
			.setDescription("Need help? Well, look no further!"),
		category: "general",
		accountRequired: false,
		permissionRequired: null,
	},
	async execute(client, interaction, otherData) {
		const cap = (string: string) =>
			string.charAt(0).toUpperCase() + string.slice(1); // Capitalize first letter

		// Take command map and put it into an array with it sorted by category
		let categories: {
			name: string;
			commands: {
				name: string;
				description: string;
				permissionRequired: string | null;
				options: any;
			}[];
		}[] = [];

		otherData.commands.forEach((value, key) => {
			if (!categories.find((p) => p.name === cap(value.data.category)))
				categories.push({
					name: cap(value.data.category),
					commands: [
						{
							name: key,
							description: value.data.meta.description,
							permissionRequired: value.data.permissionRequired,
							options: value.data.meta.options,
						},
					],
				});
			else {
				let data = categories.find(
					(p) => p.name === cap(value.data.category)
				);

				data.commands.push({
					name: key,
					description: value.data.meta.description,
					permissionRequired: value.data.permissionRequired,
					options: value.data.meta.options,
				});
			}
		});

		// Embed Fields
		const embedFields: {
			name: string;
			value: string;
			inline: boolean;
		}[] = [];

		categories.forEach((p) => {
			embedFields.push({
				name: `${p.name} Commands:`,
				value: `- ${p.commands
					.map((o) => `${o.name} - ${o.description}`)
					.join("\n- ")}`,
				inline: true,
			});
		});

		// Select Menu Options
		const categoryMenuOptions = new StringSelectMenuBuilder()
			.setCustomId("category-select")
			.setPlaceholder("Select Category!")
			.addOptions();
		const commandMenuOptions = new StringSelectMenuBuilder()
			.setCustomId("command-select")
			.setPlaceholder("Select Command!")
			.addOptions();

		categories.forEach((p) => {
			const data = new StringSelectMenuOptionBuilder()
				.setLabel(p.name)
				.setDescription(`Take a look at our ${p.name} commands!`)
				.setValue(p.name);

			p.commands.map((a) =>
				commandMenuOptions.options.push(
					new StringSelectMenuOptionBuilder()
						.setLabel(a.name)
						.setDescription(a.description)
						.setValue(a.name)
				)
			);

			categoryMenuOptions.options.push(data);
		});

		// Reply
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Sparkyflight Help")
					.setURL("https://sparkyflight.xyz/")
					.setThumbnail("https://sparkyflight.xyz/logo.png")
					.setColor("Random")
					.setDescription(
						"Hello, there. Do you need help with Sparkyflight? Well, look no further! Here are a few commands that you can use to get you started! Or, if you need to create a support ticket; you may run `/support create`."
					)
					.addFields(embedFields),
			],
			components: [
				new ActionRowBuilder().addComponents(
					categoryMenuOptions
				) as any,
				new ActionRowBuilder().addComponents(commandMenuOptions) as any,
			],
		});
	},
	async autocomplete(client, interaction) {},
};

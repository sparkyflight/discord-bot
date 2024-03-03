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
		permissionRequired: null,
	},
	async execute(client, interaction, otherData) {
		const cap = (string: string) =>
			string.charAt(0).toUpperCase() + string.slice(1);

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

		const embedFields: {
			name: string;
			value: string;
			inline: boolean;
		}[] = [];

		categories.forEach((p) => {
			embedFields.push({
				name: `${p.name} Commands:`,
				value: p.commands
					.map((o) => `\`${o.name}\` - \`${o.description}\``)
					.join("\n"),
				inline: true,
			});
		});

		const selectMenuOptions = new StringSelectMenuBuilder()
			.setCustomId("category-select")
			.setPlaceholder("Select an Category!")
			.addOptions();

		categories.forEach((p) => {
			const data = new StringSelectMenuOptionBuilder()
				.setLabel(p.name)
				.setDescription(`Take a look at our ${p.name} commands!`)
				.setValue(p.name);

			selectMenuOptions.options.push(data);
		});

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
				new ActionRowBuilder().addComponents(selectMenuOptions) as any,
			],
		});
	},
	async autocomplete(client, interaction) {},
};

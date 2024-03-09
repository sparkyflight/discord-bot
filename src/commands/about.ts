import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";
import * as database from "../Serendipy/prisma";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("about")
			.setDescription("About Sparkyflight"),
		category: "general",
		accountRequired: false,
		permissionRequired: null,
	},
	async execute(client, interaction, otherData) {
		// Social Media
		const social: {
			name: string;
			url: string;
		}[] = [
			{
				name: "Discord Server",
				url: "https://discord.gg/XbJEUs58y4",
			},
			{
				name: "Github",
				url: "https://github.com/sparkyflight",
			},
			{
				name: "Reddit",
				url: "https://www.reddit.com/r/sparkyflight/",
			},
			{
				name: "Twitter",
				url: "https://twitter.com/sparkyflightapp",
			},
		];

		// Fetch list of partners from the database
		const partners = await database.Partners.getAllPartners();

		// Reply
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("About Sparkyflight")
					.setURL("https://sparkyflight.xyz/")
					.setThumbnail("https://sparkyflight.xyz/logo.png")
					.setColor("Random")
					.setDescription(
						"Hello, there. We are the future of Social Media designed for the neurodiverse community, with a primary focus on individuals on the Autism Spectrum. We aim to provide a safe and inclusive space for people to connect, learn, and communicate about their special interests."
					)
					.addFields(
						{
							name: "Social Media",
							value: social
								.map((s) => `[**${s.name}**](${s.url})`)
								.join("\n"),
							inline: true,
						},
						{
							name: "Partners",
							value: partners
								.map(
									(partner) =>
										`[**${partner.name}**](https://sparkyflight.xyz/partners/${partner.id}) - ${partner.description}`
								)
								.join("\n"),
							inline: true,
						}
					),
			],
		});
	},
	async autocomplete(client, interaction) {},
};

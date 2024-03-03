import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("about")
			.setDescription("About Sparkyflight"),
		category: "general",
		permissionRequired: null,
	},
	async execute(client, interaction, otherData) {
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

		const partners = await fetch(
			"https://api.sparkyflight.xyz/partners/list"
		).then(async (res) => await res.json());

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
					.addFields({
						name: "Social Media",
						value: social
							.map((s) => `[**${s.name}**](${s.url})`)
							.join("\n"),
						inline: false,
					})
					.addFields({
						name: "Partners",
						value: partners
							.map(
								(partner) =>
									`[**${partner.name}**](https://sparkyflight.xyz/partners/${partner.id}) - ${partner.description}`
							)
							.join("\n"),
						inline: false,
					}),
			],
		});
	},
	async autocomplete(client, interaction) {},
};

import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import * as database from "../Serendipy/prisma";
import paginationEmbed from "../pagination";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("spotlight")
			.setDescription("View Sparkyflight Spotlight")
			.addStringOption((option) =>
				option
					.setName("section")
					.setDescription(
						"What spotlight section would you like to view?"
					)
					.setRequired(false)
					.setChoices(
						{
							name: "Sparkyflight (default)",
							value: "sparkyflight",
						},
						{
							name: "Onlyfoodz",
							value: "onlyfoodz",
						}
					)
			),
		category: "social",
		accountRequired: true,
		permissionRequired: null,
	},
	async execute(client, interaction, otherData) {
		let data = await database.Posts.listAllPosts();
		const section: string | null = interaction.options.getString("section");
		if (section)
			data = data.filter(
				(post) => post.type === (section === "sparkyflight" ? 0 : 1)
			);
		else data = data.filter((post) => post.type === 0);

		const pages: EmbedBuilder[] = data.map((post) => {
			const embed = new EmbedBuilder()
				.setTitle("Spotlight")
				.setDescription(post.caption)
				.setColor("Random")
				.setURL("https://sparkyflight.xyz/")
				.setThumbnail("https://sparkyflight.xyz/logo.png")
				.setAuthor({
					name: post.user.usertag,
					iconURL:
						post.user.avatar === "None"
							? "https://sparkyflight.xyz/logo.png"
							: post.user.avatar,
					url: `https://sparkyflight.xyz/@${post.user.usertag}`,
				})
				.setTimestamp();

			if (post.image) embed.setImage(post.image);
			else if (post.plugins.find((a) => a.type === "tenor"))
				embed.setImage(
					post.plugins.find((a) => a.type === "tenor").href
				);
			return embed;
		});

		await paginationEmbed(interaction, pages, [
			{
				button: new ButtonBuilder()
					.setLabel("Upvote")
					.setStyle(ButtonStyle.Secondary)
					.setCustomId("upvote"),
				execute: async (page, collector) => {},
			},
			{
				button: new ButtonBuilder()
					.setLabel("Downvote")
					.setStyle(ButtonStyle.Secondary)
					.setCustomId("downvote"),
				execute: async (page, collector) => {},
			},
		]);
	},
	async autocomplete(client, interaction) {},
};

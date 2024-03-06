import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("ping")
			.setDescription("Check the bot's ping"),
		category: "general",
		accountRequired: false,
		permissionRequired: null,
	},
	async execute(client, interaction, otherData) {
		const reply = await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Pinging!")
					.setURL("https://sparkyflight.xyz/")
					.setThumbnail("https://sparkyflight.xyz/logo.png")
					.setColor("Orange")
					.setDescription(
						`Checking Gateway Latency & Roundtrip Latency...`
					)
					.setFooter({
						iconURL: interaction.user.displayAvatarURL(),
						text: `Executed by ${interaction.user.username}.`,
					}),
			],
			fetchReply: true,
		});

		const interactionLatency = Math.round(
			reply.createdTimestamp - interaction.createdTimestamp
		);

		reply.edit({
			embeds: [
				new EmbedBuilder()
					.setTitle("Pong!")
					.setURL("https://sparkyflight.xyz/")
					.setThumbnail("https://sparkyflight.xyz/logo.png")
					.setColor("Blue")
					.setDescription("I hope it looks good :eyes:")
					.addFields(
						{
							name: `Gateway Latency`,
							value: `\`${interaction.client.ws.ping}\`ms`,
							inline: true,
						},
						{
							name: `Roundtrip Latency`,
							value: `\`${interactionLatency}\`ms`,
							inline: true,
						}
					)
					.setFooter({
						iconURL: interaction.user.displayAvatarURL(),
						text: `Executed by ${interaction.user.username}.`,
					}),
			],
		});
	},
	async autocomplete(client, interaction) {},
};

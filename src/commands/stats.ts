import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("stats")
			.setDescription("Check the bot's statistics"),
		category: "general",
		accountRequired: false,
		permissionRequired: null,
	},
	async execute(client, interaction, otherData) {
		// Send original reply
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

		// Round up interaction latency
		const interactionLatency = Math.round(
			reply.createdTimestamp - interaction.createdTimestamp
		);

		// Client Statistics
		let totalGuilds: number = (
			await client.shard.fetchClientValues("guilds.cache.size")
		).reduce((acc, guildCount) => acc + guildCount, 0);
		let totalMembers: number = (
			await client.shard.broadcastEval((c) =>
				c.guilds.cache.reduce(
					(acc, guild) => acc + guild.memberCount,
					0
				)
			)
		).reduce((acc, memberCount) => acc + memberCount, 0);

		// Edit original reply
		reply.edit({
			embeds: [
				new EmbedBuilder()
					.setTitle("Statistics!")
					.setURL("https://sparkyflight.xyz/")
					.setThumbnail("https://sparkyflight.xyz/logo.png")
					.setColor("Blue")
					.setDescription("I hope it looks good :eyes:")
					.addFields(
						{
							name: "Server Count",
							value: String(totalGuilds),
							inline: true,
						},
						{
							name: "Member Count",
							value: String(totalMembers),
							inline: true,
						},
						{
							name: "Shard Count",
							value: String(client.shard.count),
							inline: true,
						},
						{
							name: `Gateway Latency`,
							value: `${interaction.client.ws.ping}ms`,
							inline: true,
						},
						{
							name: `Roundtrip Latency`,
							value: `${interactionLatency}ms`,
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

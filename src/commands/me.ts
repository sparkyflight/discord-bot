import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";
import * as database from "../Serendipy/prisma";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("me")
			.setDescription("View your Sparkyflight Profile"),
		category: "users",
		accountRequired: true,
		permissionRequired: null,
	},
	async execute(client, interaction, otherData) {
		const user = await database.Users.get({
			discord_id: interaction.user.id,
		});

		const embed = new EmbedBuilder()
			.setTitle("Profile")
			.addFields(
				{
					name: "Name",
					value: user.name,
					inline: true,
				},
				{
					name: "Tag",
					value: user.usertag,
					inline: true,
				},
				{
					name: "Bio",
					value: user.bio,
					inline: true,
				},
                {
                    name: "Staff Perms",
                    value: user.staff_perms.length === 0 ? "None" : user.staff_perms.join(", "),
                    inline: true,
                }
			)
			.setThumbnail(
				user.avatar === null || user.avatar === "None"
					? "https://sparkyflight.xyz/logo.png"
					: user.avatar
			)
			.setColor("Random");

		await interaction.reply({
			embeds: [embed],
		});
	},
	async autocomplete(client, interaction) {},
};

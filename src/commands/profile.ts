import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";
import * as database from "../Serendipy/prisma";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("profile")
			.setDescription("View Sparkyflight Profile")
			.addStringOption((option) =>
				option
					.setName("username")
					.setDescription("The username of the user")
					.setRequired(false)
					.setAutocomplete(true)
			),
		category: "social",
		accountRequired: true,
		permissionRequired: null,
	},
	async execute(client, interaction, otherData) {
		let user: any = null;

		const username = interaction.options.getString("username");
		if (username)
			user = await database.prisma.users.findUnique({
				where: {
					usertag: username,
				},
				include: {
					followers: {
						include: {
							user: false,
							target: false,
						},
					},
					following: {
						include: {
							user: false,
							target: false,
						},
					},
				},
			});
		else
			user = await database.prisma.users.findUnique({
				where: {
					discord_id: interaction.user.id,
				},
				include: {
					followers: {
						include: {
							user: false,
							target: false,
						},
					},
					following: {
						include: {
							user: false,
							target: false,
						},
					},
				},
			});

		const embed = new EmbedBuilder()
			.setTitle("Profile")
			.addFields(
				{
					name: "Name",
					value: `${user.name} (@${user.usertag})`,
					inline: true,
				},
				{
					name: "Bio",
					value: user.bio,
					inline: true,
				},
				{
					name: "Following",
					value: String(user.following.length),
					inline: true,
				},
				{
					name: "Followers",
					value: String(user.followers.length),
					inline: true,
				},
				{
					name: "Staff Perms",
					value:
						user.staff_perms.length === 0
							? "None"
							: user.staff_perms.join(", "),
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
	async autocomplete(client, interaction) {
		const focusedValue = interaction.options.getFocused();
		const users = await database.prisma.users.findMany();
		const choices = users.map((a) => {
			return {
				name: `${a.name} (@${a.usertag})`,
				value: a.usertag,
			};
		});

		const filtered = choices.filter((user) =>
			user.name.startsWith(focusedValue)
		);

		await interaction.respond(filtered);
	},
};

import { SlashCommandBuilder } from "@discordjs/builders";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("help")
			.setDescription("Need help? Well, look no further!"),
		permissionRequired: null,
	},
	async execute(client, interaction, otherData) {},
	async autocomplete(client, interaction) {},
};

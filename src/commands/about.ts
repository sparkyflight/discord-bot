import { SlashCommandBuilder } from "@discordjs/builders";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("about")
			.setDescription("About Sparkyflight"),
		permissionRequired: null,
	},
	async execute(client, interaction, otherData) {},
	async autocomplete(client, interaction) {},
};

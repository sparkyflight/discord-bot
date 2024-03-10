import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("status")
			.setDescription("Check our current (and future) status!"),
		category: "support",
		accountRequired: false,
		permissionRequired: null,
	},
	async execute(client, interaction) {
		const cap = (string: string) =>
			string.charAt(0).toUpperCase() + string.slice(1); // Capitalize first letter

		// Summary
		interface Summary {
			page: {
				name: string;
				url: string;
				status: "UP" | "HASISSUES" | "UNDERMAINTENANCE";
			};
			activeIncidents:
				| {
						name: string;
						started: string;
						status:
							| "INVESTIGATING"
							| "IDENTIFIED"
							| "MONITORING"
							| "RESOLVED";
						impact:
							| "OPERATIONAL"
							| "PARTIALOUTAGE"
							| "MINOROUTAGE"
							| "MAJOROUTAGE";
						url: string;
				  }[]
				| null;
			activeMaintenances:
				| {
						name: string;
						start: string;
						status: "NOTSTARTEDYET" | "INPROGRESS" | "COMPLETED";
						duration: string;
						url: string;
				  }[]
				| null;
		}

		const summary: Summary = await fetch(
			"https://status.purrquinox.com/summary.json"
		).then(async (res) => await res.json());

		// Incidents Embed
		const Incidents = new EmbedBuilder()
			.setTitle("Purrquinox Incidents")
			.setDescription("Here are the current incidents in Purrquinox!")
			.setURL("https://status.purrquinox.com/")
			.setThumbnail("https://sparkyflight.xyz/logo.png")
			.setColor("Red")
			.addFields(
				summary.activeIncidents != null
					? summary.activeIncidents.map((incident) => {
							return {
								name: `[${incident.name}](${incident.url})`,
								value: `Status: ${cap(incident.status.toLowerCase())}\nService(s) Impact: ${cap(incident.impact.toLowerCase())}\nReported: ${incident.started}`,
								inline: true,
							};
						})
					: [
							{
								name: "No active incidents",
								value: "There are currently no active incidents!",
								inline: true,
							},
						]
			);

		// Maintenances Embed
		const Maintenances = new EmbedBuilder()
			.setTitle("Purrquinox Maintenances")
			.setDescription(
				"Here are the current/scheduled maintenances in Purrquinox!"
			)
			.setURL("https://status.purrquinox.com/")
			.setThumbnail("https://sparkyflight.xyz/logo.png")
			.setColor("Orange")
			.addFields(
				summary.activeMaintenances != null
					? summary.activeMaintenances.map((maint) => {
							return {
								name: `[${maint.name}](${maint.url})`,
								value: `Status: ${cap(maint.status.toLowerCase())}\nStart Date: ${maint.start}\nDuration: ${maint.duration} minutes`,
								inline: true,
							};
						})
					: [
							{
								name: "No maintenances",
								value: "There are currently no active/scheduled maintenances in Purrquinox!",
								inline: true,
							},
						]
			);

		await interaction.reply({
			embeds: [Incidents, Maintenances],
		});
	},
	async autocomplete(client, interaction) {},
};

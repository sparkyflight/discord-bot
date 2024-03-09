import { SlashCommandBuilder } from "@discordjs/builders";
import Pagination from "../pagination";
import {
	ColorResolvable,
	EmbedBuilder,
} from "discord.js";

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

		let incidents: EmbedBuilder[] = [];
		if (summary.activeIncidents)
			incidents = summary.activeIncidents.map((p) => {
				let color: ColorResolvable = "Random";

				switch (p.impact) {
					case "OPERATIONAL":
						color = "Green";
						break;

					case "PARTIALOUTAGE":
						color = "Yellow";
						break;

					case "MINOROUTAGE":
						color = "Orange";
						break;

					case "MAJOROUTAGE":
						color = "Red";
						break;

					default:
						color = "Random";
						break;
				}

				return new EmbedBuilder()
					.setTitle(`${p.name} [INCIDENT]`)
					.setURL(p.url)
					.setThumbnail("https://sparkyflight.xyz/logo.png")
					.setColor(color)
					.setFields(
						{
							name: "Current Status",
							value: p.status,
							inline: true,
						},
						{
							name: "Started",
							value: p.started,
							inline: true,
						}
					);
			});

		let maintenances: EmbedBuilder[] = [];
		if (summary.activeMaintenances)
			maintenances = summary.activeMaintenances.map((p) => {
				let color: ColorResolvable = "Random";

				switch (p.status) {
					case "NOTSTARTEDYET":
						color = "Grey";
						break;

					case "INPROGRESS":
						color = "Red";
						break;

					case "COMPLETED":
						color = "Green";
						break;

					default:
						color = "Random";
						break;
				}

				return new EmbedBuilder()
					.setTitle(`${p.name} [MAINTENANCE]`)
					.setURL(p.url)
					.setThumbnail("https://sparkyflight.xyz/logo.png")
					.setColor(color)
					.setFields(
						{
							name: "Current Status",
							value: p.status,
							inline: true,
						},
						{
							name: "Started",
							value: p.start,
							inline: true,
						},
						{
							name: "Duration",
							value: `${p.duration} minutes`,
							inline: true,
						}
					);
			});

		let pages: EmbedBuilder[] = [...incidents, ...maintenances];

		if (pages.length === 0)
			return await interaction.reply({
				content:
					"All of our services are online, without any scheduled maintenances!",
			});
		else return await Pagination(interaction, pages, []);
	},
	async autocomplete(client, interaction) {},
};

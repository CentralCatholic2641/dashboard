<template>
	<v-card class="mb-6" v-if="team.rankings">
		<v-card-title class="text-h5" @click.self="visible = !visible" v-ripple style="cursor: pointer">
			<h5 @click.self="visible = !visible" class="text-h5">Ranking</h5>
			<v-spacer></v-spacer>
			<v-icon size="30" class="ml-4">{{ visible ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
		</v-card-title>

		<v-card-text class="mt-0 pt-0 white--text" v-if="visible">
			<p class="grey--text">
				<span class="white--text text-h2 font-weight-black mb-3 mr-2">#{{ team.rankings.rank }}</span>
				of {{ team.totalteams }}
			</p>

			<div class="d-flex">
				<table>
					<tr>
						<td style="width: 150px" class="font-weight-black">Record</td>
						<td>
							{{ team.rankings.record.wins }} - {{ team.rankings.record.losses }} -
							{{ team.rankings.record.ties }}
						</td>
					</tr>

					<tr>
						<td style="width: 150px" class="font-weight-black">Ranking Score</td>
						<td>{{ team.rankings.sort_orders[0] }}</td>
					</tr>

					<tr>
						<td style="width: 150px" class="font-weight-black">RPs</td>
						<td>{{ team.rankings.extra_stats[0] }}</td>
					</tr>

					<tr>
						<td style="width: 150px" class="font-weight-black">Avg. Match</td>
						<td>
							{{ team.rankings.sort_orders[1] }}
						</td>
					</tr>

					<tr>
						<td style="width: 150px" class="font-weight-black">Avg. Hangar</td>
						<td>
							{{ team.rankings.sort_orders[2] }}
						</td>
					</tr>

					<tr>
						<td style="width: 150px" class="font-weight-black">Avg. Auto</td>
						<td>
							{{ team.rankings.sort_orders[3] }}
						</td>
					</tr>
				</table>

				<table class="ml-10">
					<tr>
						<td style="width: 150px" class="font-weight-black">Matches Played</td>
						<td>{{ team.rankings.matches_played }}</td>
					</tr>

					<tr>
						<td style="width: 150px" class="font-weight-black">DQs</td>
						<td>{{ team.rankings.dq }}</td>
					</tr>

					<tr>
						<td style="width: 150px" class="font-weight-black">OPR</td>
						<td>
							{{ team.rankings.opr_data.opr.toFixed(1) }}
						</td>
					</tr>

					<tr>
						<td style="width: 150px" class="font-weight-black">DPR</td>
						<td>
							{{ team.rankings.opr_data.dpr.toFixed(1) }}
						</td>
					</tr>

					<tr>
						<td style="width: 150px" class="font-weight-black">CCWM</td>
						<td>
							{{ team.rankings.opr_data.ccwm.toFixed(1) }}
						</td>
					</tr>

					<tr>
						<td>&nbsp;</td>
					</tr>
				</table>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
	export default {
		name: "TeamRankings2022",
		props: ["team"],
		data() {
			return {
				visible: true,
			};
		},
	};
</script>

<style scoped></style>

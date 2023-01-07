<template>
	<v-card class="my-6">
		<v-card-title class="text-h5" @click.self="visible = !visible" v-ripple style="cursor: pointer">
			<h5 @click.self="visible = !visible" class="text-h5">Your Pit Scouting Assignments</h5>
			<v-spacer></v-spacer>
			<v-icon size="30" class="ml-4">{{ visible ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
		</v-card-title>

		<v-simple-table dense v-if="myTeams.length != 0 && visible">
			<template v-slot:default>
				<thead>
					<tr>
						<th class="text-left">Team</th>
						<th style="width: 200px" class="text-left">Status</th>
						<th style="width: 125px" class="text-right"></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="team in myTeams" :key="team.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key.toUpperCase()}/scouting/pit?team=${team.key.substring(3)}`)">
						<td class="font-weight-black">Team {{ team.key.substring(3) }}</td>
						<td
							:class="{
								'green--text': team.submitted,
								'red--text font-weight-bold': !team.submitted,
							}"
						>
							{{ team.submitted ? "Submitted" : "Not Submitted" }}
						</td>
						<td class="text-right">
							<v-icon>mdi-chevron-right</v-icon>
						</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>

		<v-card-text v-else-if="visible">
			<p class="grey--text font-italic text-center my-6">You are not assigned to scout any team's pit</p>
		</v-card-text>
	</v-card>
</template>

<script>
	export default {
		name: "PitScoutingMember",
		props: ["event", "pitscouting"],
		data() {
			return {
				myTeams: [],
				visible: true,
			};
		},
		methods: {
			refresh() {
				let data = [];
				for (let key in this.pitscouting) {
					if (this.pitscouting[key] && this.pitscouting[key].assigned == this.$root.user.username) {
						data.push({
							key,
							...this.pitscouting[key],
						});
					}
				}
				data.sort((a, b) => parseInt(a.key.substring(3)) - parseInt(b.key.substring(3)));
				this.myTeams = data;
			},
		},
		created() {
			this.refresh();
		},
		watch: {
			"$route.path"() {
				this.refresh();
			},
		},
	};
</script>

<style></style>

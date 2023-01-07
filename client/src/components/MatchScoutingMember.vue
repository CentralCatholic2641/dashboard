<template>
	<v-card class="my-6">
		<v-card-title class="text-h5" @click.self="visible = !visible" v-ripple style="cursor: pointer">
			<h5 @click.self="visible = !visible" class="text-h5">Your Match Scouting Schedule</h5>
			<v-spacer></v-spacer>
			<v-icon size="30" class="ml-4">{{ visible ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
		</v-card-title>

		<v-simple-table dense v-if="myMatches.length != 0 && visible">
			<template v-slot:default>
				<thead>
					<tr>
						<th style="width: 200px" class="text-left">Match</th>
						<th style="width: 200px" class="text-left">Time</th>
						<th style="width: 200px" class="text-left">Team</th>
						<th style="width: 200px" class="text-left">Station</th>
						<th style="width: 200px" class="text-left">Status</th>
						<th style="width: 125px" class="text-right"></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="match in myMatches" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.year}${event.event_code.toUpperCase()}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${match.team}`)">
						<td class="font-weight-black">
							<span v-if="match.comp_level != 'f' && match.comp_level != 'qm'">
								{{ comp_levelMap[match.comp_level] }}
								{{ match.set_number }} -
								{{ match.match_number }}
							</span>
							<span v-else>
								{{ comp_levelMap[match.comp_level] }}
								{{ match.match_number }}
							</span>
						</td>
						<td>{{ match.time }}</td>
						<td>{{ match.team }}</td>
						<td
							:class="{
								'red--text': match.station.includes('Red'),
								'blue--text': match.station.includes('Blue'),
							}"
						>
							{{ match.station }}
						</td>
						<td
							:class="{
								'green--text': match.submitted,
								'red--text font-weight-bold': !match.submitted,
							}"
						>
							{{ match.submitted ? "Submitted" : "Not Submitted" }}
						</td>
						<td class="text-right">
							<v-icon>mdi-chevron-right</v-icon>
						</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>

		<v-card-text v-else-if="visible">
			<p class="grey--text font-italic text-center my-6">You are not assigned to scout any matches</p>
		</v-card-text>
	</v-card>
</template>

<script>
	import dayjs from "dayjs";

	export default {
		name: "MatchScoutingScheduleMember",
		props: ["event", "schedule"],
		data() {
			return {
				myMatches: [],
				visible: true,

				comp_levelMap: {
					qm: "Quals",
					qf: "Quarters",
					sf: "Semis",
					f: "Finals",
				},
			};
		},
		methods: {
			refresh() {
				let data = [];
				for (let key in this.schedule) {
					for (let station in this.schedule[key]) {
						if (this.schedule[key] && this.schedule[key][station] && this.schedule[key][station].assigned == this.$root.user.username) {
							const eventData = this.event.schedule.find((i) => i.key == key);
							const alliance = station.includes("Red") ? "red" : "blue";
							const stationIndex = alliance == "red" ? parseInt(station.substring(3)) - 1 : parseInt(station.substring(4)) - 1;

							data.push({
								...eventData,
								...this.schedule[key][station],
								time: dayjs(eventData.actual_time * 1000).format("M/D/YY [at] HH:mm"),
								station: (station.includes("Red") ? "Red" : "Blue") + " " + (stationIndex + 1),
								team: eventData.alliances[alliance].team_keys[stationIndex].substring(3),
							});
						}
					}
				}
				data.sort((a, b) => dayjs(a.actual_time * 1000) - dayjs(b.actual_time * 1000));
				this.myMatches = data;
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

<template>
	<div>
		<v-card class="my-6">
			<v-card-title class="text-h5" @click.self="visible = !visible" v-ripple style="cursor: pointer">
				<h5 @click.self="visible = !visible" class="text-h5">Match Scouting Assignments</h5>
				<v-spacer></v-spacer>
				<v-btn @click="autoOpen = true" v-if="$root.user.role > 2 && visible" color="primary"><v-icon left>mdi-auto-fix</v-icon>Generate</v-btn>
				<v-icon size="30" class="ml-4">{{ visible ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
			</v-card-title>

			<v-simple-table dense v-if="visible">
				<template v-slot:default>
					<thead>
						<tr>
							<th class="text-left">Match</th>
							<th class="text-left">Time</th>
							<th class="text-left red--text">Red 1</th>
							<th class="text-left red--text">Red 2</th>
							<th class="text-left red--text">Red 3</th>
							<th class="text-left blue--text">Blue 1</th>
							<th class="text-left blue--text">Blue 2</th>
							<th class="text-left blue--text">Blue 3</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(match, index) in event.schedule" :key="match.key">
							<td v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key.toUpperCase()}/schedule/${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}`)" class="font-weight-black">
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

							<td v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key.toUpperCase()}/schedule/${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}`)">
								{{ matchTimes[index] }}
							</td>

							<td
								v-for="msd in [getScoutingData(match.key, 'Red1')]"
								:key="msd._id"
								v-ripple
								:class="{
									'font-italic grey--text  text--darken-1': msd.unassigned,
								}"
								style="cursor: pointer; height: 48px !important"
								@click="
									change = {
										match: match.key,
										station: 'Red1',
										open: true,
										to: msd.assigned,
									}
								"
							>
								<span class="font-weight-black">{{ match.alliances.red.team_keys[0].substring(3) }}</span>
								<span v-if="!msd.unassigned"> - </span>
								{{ msd.assignedName }}<br />
								<span
									:class="{
										'red--text': !msd.unassigned && !msd.submitted,
										'font-weight-black': msd.unassigned,
										'green--text': msd.submitted,
									}"
								>
									{{ msd.unassigned ? "Unassigned" : msd.submitted ? "Submitted" : "Not Submitted" }}
								</span>
							</td>

							<td
								v-for="msd in [getScoutingData(match.key, 'Red2')]"
								:key="msd._id"
								v-ripple
								:class="{
									'font-italic grey--text  text--darken-1': msd.unassigned,
								}"
								style="cursor: pointer; height: 48px !important"
								@click="
									change = {
										match: match.key,
										station: 'Red2',
										open: true,
										to: msd.assigned,
									}
								"
							>
								<span class="font-weight-black">{{ match.alliances.red.team_keys[1].substring(3) }}</span>
								<span v-if="!msd.unassigned"> - </span>
								{{ msd.assignedName }}<br />
								<span
									:class="{
										'red--text': !msd.unassigned && !msd.submitted,
										'font-weight-black': msd.unassigned,
										'green--text': msd.submitted,
									}"
								>
									{{ msd.unassigned ? "Unassigned" : msd.submitted ? "Submitted" : "Not Submitted" }}
								</span>
							</td>

							<td
								v-for="msd in [getScoutingData(match.key, 'Red3')]"
								:key="msd._id"
								v-ripple
								:class="{
									'font-italic grey--text  text--darken-1': msd.unassigned,
								}"
								style="cursor: pointer; height: 48px !important"
								@click="
									change = {
										match: match.key,
										station: 'Red3',
										open: true,
										to: msd.assigned,
									}
								"
							>
								<span class="font-weight-black">{{ match.alliances.red.team_keys[2].substring(3) }}</span>
								<span v-if="!msd.unassigned"> - </span>
								{{ msd.assignedName }}<br />
								<span
									:class="{
										'red--text': !msd.unassigned && !msd.submitted,
										'font-weight-black': msd.unassigned,
										'green--text': msd.submitted,
									}"
								>
									{{ msd.unassigned ? "Unassigned" : msd.submitted ? "Submitted" : "Not Submitted" }}
								</span>
							</td>

							<td
								v-for="msd in [getScoutingData(match.key, 'Blue1')]"
								:key="msd._id"
								v-ripple
								:class="{
									'font-italic grey--text  text--darken-1': msd.unassigned,
								}"
								style="cursor: pointer; height: 48px !important"
								@click="
									change = {
										match: match.key,
										station: 'Blue1',
										open: true,
										to: msd.assigned,
									}
								"
							>
								<span class="font-weight-black">{{ match.alliances.blue.team_keys[0].substring(3) }}</span>
								<span v-if="!msd.unassigned"> - </span>
								{{ msd.assignedName }}<br />
								<span
									:class="{
										'red--text': !msd.unassigned && !msd.submitted,
										'font-weight-black': msd.unassigned,
										'green--text': msd.submitted,
									}"
								>
									{{ msd.unassigned ? "Unassigned" : msd.submitted ? "Submitted" : "Not Submitted" }}
								</span>
							</td>

							<td
								v-for="msd in [getScoutingData(match.key, 'Blue2')]"
								:key="msd._id"
								v-ripple
								:class="{
									'font-italic grey--text  text--darken-1': msd.unassigned,
								}"
								style="cursor: pointer; height: 48px !important"
								@click="
									change = {
										match: match.key,
										station: 'Blue2',
										open: true,
										to: msd.assigned,
									}
								"
							>
								<span class="font-weight-black">{{ match.alliances.blue.team_keys[1].substring(3) }}</span>
								<span v-if="!msd.unassigned"> - </span>
								{{ msd.assignedName }}<br />
								<span
									:class="{
										'red--text': !msd.unassigned && !msd.submitted,
										'font-weight-black': msd.unassigned,
										'green--text': msd.submitted,
									}"
								>
									{{ msd.unassigned ? "Unassigned" : msd.submitted ? "Submitted" : "Not Submitted" }}
								</span>
							</td>

							<td
								v-for="msd in [getScoutingData(match.key, 'Blue3')]"
								:key="msd._id"
								v-ripple
								:class="{
									'font-italic grey--text  text--darken-1': msd.unassigned,
								}"
								style="cursor: pointer; height: 48px !important"
								@click="
									change = {
										match: match.key,
										station: 'Blue3',
										open: true,
										to: msd.assigned,
									}
								"
							>
								<span class="font-weight-black">{{ match.alliances.blue.team_keys[2].substring(3) }}</span>
								<span v-if="!msd.unassigned"> - </span>
								{{ msd.assignedName }}<br />
								<span
									:class="{
										'red--text': !msd.unassigned && !msd.submitted,
										'font-weight-black': msd.unassigned,
										'green--text': msd.submitted,
									}"
								>
									{{ msd.unassigned ? "Unassigned" : msd.submitted ? "Submitted" : "Not Submitted" }}
								</span>
							</td>
						</tr>
					</tbody>
				</template>
			</v-simple-table>
		</v-card>

		<v-dialog v-model="change.open" v-if="change.open" max-width="400px">
			<v-card>
				<v-card-title
					><h4 class="text-h4 font-weight-black mt-1">
						{{ change.match.substring(change.match.lastIndexOf("_") + 1).toUpperCase() }}
						{{ stationMap[change.station] }}
					</h4></v-card-title
				>

				<v-card-text>
					<v-select label="Assigned to..." v-model="change.to" :items="reassignOptions" hide-details></v-select>

					<div class="d-flex">
						<!-- <v-btn class="mt-8" color="primary" @click="openForm()"
              >Open Member<v-icon right>mdi-arrow-top-right</v-icon></v-btn
            > -->
						<v-btn class="mt-8" color="secondary" @click="openForm()">Open Form<v-icon right>mdi-arrow-top-right</v-icon></v-btn>
					</div>
				</v-card-text>

				<v-card-actions>
					<v-btn color="grey" icon @click="deleteScoutingData()"><v-icon>mdi-delete</v-icon></v-btn>
					<v-spacer></v-spacer>
					<v-btn color="primary" @click="changeAssignment()"><v-icon left>mdi-content-save</v-icon>Save</v-btn>
				</v-card-actions>

				<v-btn style="position: absolute; top: 8px; right: 8px" @click="change = { open: false }" fab top right elevation="0" class="transparent"><v-icon>mdi-close</v-icon></v-btn>
			</v-card>
		</v-dialog>

		<v-dialog scrollable v-model="autoOpen" v-if="auto" max-width="500px">
			<v-card>
				<v-card-title><h4 class="text-h4 font-weight-black mt-1">GENERATE</h4></v-card-title>

				<v-card-text>
					<v-checkbox v-for="(value, key) in auto" :key="key" v-model="auto[key]" :label="autoEnum[key]" hide-details :disabled="autoCount >= 6 && !auto[key]" @change="!auto[key] ? autoCount-- : autoCount++" dense></v-checkbox>

					<p class="red--text text-center mt-3 mb-0 pb-0">Warning! This will overwrite any existing schedule.</p>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" @click="autoAssign()">Go</v-btn>
				</v-card-actions>

				<v-btn style="position: absolute; top: 8px; right: 8px" @click="autoOpen = false" fab top right elevation="0" class="transparent"><v-icon>mdi-close</v-icon></v-btn>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
	import dayjs from "dayjs";
	import isBetween from "dayjs/plugin/isBetween.js";
	dayjs.extend(isBetween);

	export default {
		name: "MatchScoutingScheduleController",
		props: ["event", "schedule", "users"],
		data() {
			return {
				change: {
					open: false,
				},
				auto: false,
				autoEnum: false,
				autoOpen: false,
				autoCount: 0,
				visible: true,

				comp_levelMap: {
					qm: "Quals",
					qf: "Quarters",
					sf: "Semis",
					f: "Finals",
				},
				stationMap: {
					Red1: "RED 1",
					Red2: "RED 2",
					Red3: "RED 3",
					Blue1: "BLUE 1",
					Blue2: "BLUE 2",
					Blue3: "BLUE 3",
				},
			};
		},
		computed: {
			matchTimes() {
				let times = [];
				for (let match of this.event.schedule) {
					times.push(dayjs(match.actual_time * 1000).format("M/D [at] HH:mm"));
				}
				return times;
			},
			// finishedMatches() {
			//   let matches = [];
			//   for (let match of this.event.schedule) {
			//     if (dayjs(match.actual_time * 1000).isBefore(Date.now()))
			//       matches.push(true);
			//     else matches.push(false);
			//   }
			//   return matches;
			// },
			reassignOptions() {
				let users = [
					{
						text: "Unassign",
						value: "",
					},
				];
				for (let user of this.users.filter((i) => i.includeInScouting)) {
					users.push({
						text: user.name,
						value: user.username,
					});
				}
				return users;
			},
		},
		methods: {
			refresh() {
				this.auto = {};
				this.autoEnum = {};
				this.change = {
					open: false,
				};

				for (let user of this.users.filter((i) => i.includeInScouting)) {
					if (this.users.filter((i) => i.includeInScouting).indexOf(user) < 6) {
						this.auto[user.username] = true;
						this.autoEnum[user.username] = user.name;
					} else {
						this.auto[user.username] = false;
						this.autoEnum[user.username] = user.name;
					}
				}

				this.autoCount = 0;
				for (let scouter in this.auto) {
					if (this.auto[scouter] === true) this.autoCount++;
				}
			},
			getScoutingData(match, station) {
				let scout = this.schedule[match];
				if (scout) {
					if (scout[station] && scout[station].assigned.length != 0) return scout[station];
					else
						return {
							...scout,
							unassigned: true,
						};
				} else
					return {
						...scout,
						unassigned: true,
					};
			},
			deleteScoutingData() {
				const alliance = this.change.station.includes("Red") ? "red" : "blue";
				const stationIndex = alliance == "red" ? parseInt(this.change.station.substring(3)) - 1 : parseInt(this.change.station.substring(4)) - 1;

				const team = this.event.schedule.find((i) => i.key == this.change.match).alliances[alliance].team_keys[stationIndex].substring(3);
				this.$http.delete(`/api/scouting/match/${this.change.match}?team=${team}&station=${this.change.station}`).then(() => {
					this.$emit("refresh");
					this.change = {
						open: false,
					};
				});
			},
			openForm() {
				const alliance = this.change.station.includes("Red") ? "red" : "blue";
				const stationIndex = alliance == "red" ? parseInt(this.change.station.substring(3)) - 1 : parseInt(this.change.station.substring(4)) - 1;

				const team = this.event.schedule.find((i) => i.key == this.change.match).alliances[alliance].team_keys[stationIndex].substring(3);

				this.$router.push(`/events/${this.event.key.toUpperCase()}/scouting/match?match=${this.change.match.substring(this.change.match.lastIndexOf("_") + 1).toUpperCase()}&team=${team}`);
			},
			autoAssign() {
				this.$http.post(`/api/scouting/genmatch/${this.event.key}`, this.auto).then((response) => {
					this.schedule = response.data.matches;
					this.autoOpen = false;
				});
			},
			changeAssignment() {
				this.$http.post(`/api/scouting/schedule/${this.event.key}`, this.change).then(() => {
					this.change = { open: false };
					this.$emit("refresh");
				});
			},
		},
		created() {
			this.refresh();
		},
	};
</script>

<style></style>

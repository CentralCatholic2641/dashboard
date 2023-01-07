<template>
	<v-card class="mb-4" style="white-space: nowrap">
		<v-card-title class="text-h5" @click.self="visible = !visible" v-ripple style="cursor: pointer">
			<h5 @click.self="visible = !visible" class="text-h5">Detailed Match Scouting Data</h5>
			<v-spacer></v-spacer>
			<v-icon size="30" class="ml-4">{{ visible ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
		</v-card-title>

		<v-simple-table dense v-if="visible && team.schedule.length != 0">
			<template v-slot:default>
				<thead>
					<tr>
						<th class="text-left" style="min-width: 111px !important"></th>
						<th @click="$router.push(`/events/${team.scoutingschedule.event.toUpperCase()}/schedule/${match.key.substring(match.key.indexOf('_') + 1).toUpperCase()}`)" class="text-center" style="min-width: 50px; cursor: pointer" v-for="match in team.schedule" :key="match.key">
							<span v-if="match.comp_level != 'f' && match.comp_level != 'qm'">
								{{ comp_levelMap[match.comp_level] }}<br />
								{{ match.set_number }}-{{ match.match_number }}
							</span>
							<span v-else>
								{{ comp_levelMap[match.comp_level] }}<br />
								{{ match.match_number }}
							</span>
						</th>
						<th>Avg</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="font-weight-black">Station</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<span v-if="match.alliances.red.team_keys.includes(`frc${team.team_number}`)" class="red--text">R{{ match.alliances.red.team_keys.indexOf(`frc${team.team_number}`) + 1 }}</span>
							<span v-else class="blue--text">B{{ match.alliances.blue.team_keys.indexOf(`frc${team.team_number}`) + 1 }}</span>
						</td>
						<td class="grey--text">-</td>
					</tr>

					<tr>
						<td class="font-weight-black">Scouter</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<!-- :class="{
                'red--text':
                  !team.scoutingschedule.matches[match.key][
                    'Red' +
                      (match.alliances.red.team_keys.indexOf(
                        `frc${team.team_number}`
                      ) +
                        1)
                  ].submitted,
              }" -->
							<span v-if="match.alliances.red.team_keys.includes(`frc${team.team_number}`) && team.scoutingschedule.matches[match.key] && team.scoutingschedule.matches[match.key]['Red' + (match.alliances.red.team_keys.indexOf(`frc${team.team_number}`) + 1)]">{{ team.scoutingschedule.matches[match.key]["Red" + (match.alliances.red.team_keys.indexOf(`frc${team.team_number}`) + 1)].assignedName }}</span>
							<!-- :class="{
                'red--text':
                  !team.scoutingschedule.matches[match.key][
                    'Blue' +
                      (match.alliances.blue.team_keys.indexOf(
                        `frc${team.team_number}`
                      ) +
                        1)
                  ].submitted,
              }" -->
							<span v-else-if="match.alliances.blue.team_keys.includes(`frc${team.team_number}`) && team.scoutingschedule.matches[match.key] && team.scoutingschedule.matches[match.key]['Blue' + (match.alliances.blue.team_keys.indexOf(`frc${team.team_number}`) + 1)]">{{ team.scoutingschedule.matches[match.key]["Blue" + (match.alliances.blue.team_keys.indexOf(`frc${team.team_number}`) + 1)].assignedName }}</span>

							<span class="grey--text" v-else>-</span>
						</td>
						<td class="grey--text">-</td>
					</tr>

					<p class="grey--text font-italic mb-0 font-weight-bold" style="padding: 6px 12px">MATCH</p>

					<tr>
						<td class="font-weight-black">Time</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							{{ dayjs(match.time * 1000).format("M/D") }}<br />
							{{ dayjs(match.time * 1000).format("HH:mm") }}
						</td>
						<td class="grey--text">-</td>
					</tr>

					<tr class="red--text">
						<td class="font-weight-black">Red</td>
						<td class="text-center" :class="{ 'font-weight-black': match.winning_alliance == 'red' }" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							{{ match.alliances.red.score }}
						</td>
						<td class="grey--text">-</td>
					</tr>

					<tr class="blue--text">
						<td class="font-weight-black">Blue</td>
						<td class="text-center" :class="{ 'font-weight-black': match.winning_alliance == 'blue' }" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							{{ match.alliances.blue.score }}
						</td>
						<td class="grey--text">-</td>
					</tr>

					<tr>
						<td class="font-weight-black">Result</td>
						<td class="font-weight-black text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<span
								:class="{
									'green--text': match.alliances[match.winning_alliance].team_keys.includes(`frc${team.team_number}`),
									'red--text': !match.alliances[match.winning_alliance].team_keys.includes(`frc${team.team_number}`),
								}"
								v-if="match.alliances[match.winning_alliance] != undefined"
							>
								{{ match.alliances[match.winning_alliance].team_keys.includes(`frc${team.team_number}`) ? "W" : "L" }}
							</span>
							<span class="yellow--text" v-else>T</span>
						</td>
						<td class="grey--text">-</td>
					</tr>

					<p class="grey--text font-italic mb-0 font-weight-bold" style="padding: 6px 12px">AUTO</p>

					<tr>
						<td class="font-weight-black">Taxied?</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<span v-if="team.scouting[match.key] != undefined">
								{{ boolMap[team.scouting[match.key].auto.taxied] }}
							</span>
							<span v-else class="grey--text">-</span>
						</td>
						<td>{{ team.stats.auto.taxiRate }}%</td>
					</tr>

					<tr>
						<td class="font-weight-black"># Up Score</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<span v-if="team.scouting[match.key] != undefined">
								{{ team.scouting[match.key].auto.upperScored }}
							</span>
							<span v-else class="grey--text">-</span>
						</td>
						<td>{{ team.stats.auto.avgUpperScored }}</td>
					</tr>

					<tr>
						<td class="font-weight-black"># Up Miss</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<span v-if="team.scouting[match.key] != undefined">
								{{ team.scouting[match.key].auto.upperMissed }}
							</span>
							<span v-else class="grey--text">-</span>
						</td>
						<td>{{ team.stats.auto.avgUpperMissed }}</td>
					</tr>

					<tr>
						<td class="font-weight-black"># Low Score</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<span v-if="team.scouting[match.key] != undefined">
								{{ team.scouting[match.key].auto.lowerScored }}
							</span>
							<span v-else class="grey--text">-</span>
						</td>
						<td>{{ team.stats.auto.avgLowerScored }}</td>
					</tr>

					<tr>
						<td class="font-weight-black"># Low Miss</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<span v-if="team.scouting[match.key] != undefined">
								{{ team.scouting[match.key].auto.lowerMissed }}
							</span>
							<span v-else class="grey--text">-</span>
						</td>
						<td>{{ team.stats.auto.avgLowerMissed }}</td>
					</tr>

					<p class="grey--text font-italic mb-0 font-weight-bold" style="padding: 6px 12px">TELEOP</p>

					<tr>
						<td class="font-weight-black"># Up Score</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<span v-if="team.scouting[match.key] != undefined">
								{{ team.scouting[match.key].teleop.upperScored }}
							</span>
							<span v-else class="grey--text">-</span>
						</td>
						<td>{{ team.stats.teleop.avgUpperScored }}</td>
					</tr>

					<tr>
						<td class="font-weight-black"># Up Miss</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<span v-if="team.scouting[match.key] != undefined">
								{{ team.scouting[match.key].teleop.upperMissed }}
							</span>
							<span v-else class="grey--text">-</span>
						</td>
						<td>{{ team.stats.teleop.avgUpperMissed }}</td>
					</tr>

					<tr>
						<td class="font-weight-black"># Low Score</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<span v-if="team.scouting[match.key] != undefined">
								{{ team.scouting[match.key].teleop.lowerScored }}
							</span>
							<span v-else class="grey--text">-</span>
						</td>
						<td>{{ team.stats.teleop.avgLowerScored }}</td>
					</tr>

					<tr>
						<td class="font-weight-black"># Low Miss</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<span v-if="team.scouting[match.key] != undefined">
								{{ team.scouting[match.key].teleop.lowerMissed }}
							</span>
							<span v-else class="grey--text">-</span>
						</td>
						<td>{{ team.stats.teleop.avgLowerMissed }}</td>
					</tr>

					<p class="grey--text font-italic mb-0 font-weight-bold" style="padding: 6px 12px">END</p>

					<tr>
						<td class="font-weight-black">Climb</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<span v-if="team.scouting[match.key] != undefined">
								{{ team.scouting[match.key].end.climb }}
							</span>
							<span v-else class="grey--text">-</span>
						</td>
						<td>{{ team.stats.end.climbRate }}%</td>
					</tr>

					<p class="grey--text font-italic mb-0 font-weight-bold" style="padding: 6px 12px">POST</p>

					<tr>
						<td class="font-weight-black">Card?</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<span v-if="team.scouting[match.key] != undefined">
								{{ boolMap[team.scouting[match.key].post.card] }}
							</span>
							<span v-else class="grey--text">-</span>
						</td>
						<td>{{ team.stats.post.cardRate }}%</td>
					</tr>

					<tr>
						<td class="font-weight-black">Tipped?</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<span v-if="team.scouting[match.key] != undefined">
								{{ boolMap[team.scouting[match.key].post.tipped] }}
							</span>
							<span v-else class="grey--text">-</span>
						</td>
						<td>{{ team.stats.post.tippedRate }}%</td>
					</tr>

					<tr>
						<td class="font-weight-black">Died?</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<span v-if="team.scouting[match.key] != undefined">
								{{ boolMap[team.scouting[match.key].post.died] }}
							</span>
							<span v-else class="grey--text">-</span>
						</td>
						<td>{{ team.stats.post.diedRate }}%</td>
					</tr>

					<tr>
						<td class="font-weight-black">Driver Skill</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<span v-if="team.scouting[match.key] != undefined">
								{{ team.scouting[match.key].post.skill }}
							</span>
							<span v-else class="grey--text">-</span>
						</td>
						<td>{{ team.stats.post.avgSkill }}</td>
					</tr>

					<tr>
						<td class="font-weight-black">Defense</td>
						<td class="text-center" v-for="match in team.schedule" :key="match.key" v-ripple style="cursor: pointer" @click="$router.push(`/events/${event.key}/scouting/match?match=${match.key.substring(match.key.lastIndexOf('_') + 1).toUpperCase()}&team=${team.team_number}`)">
							<span v-if="team.scouting[match.key] != undefined">
								{{ team.scouting[match.key].post.defense }}
							</span>
							<span v-else class="grey--text">-</span>
						</td>
						<td>{{ team.stats.post.avgDefense }}</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>

		<v-card-text v-else>
			<p class="grey--text font-italic text-center">No matches</p>
		</v-card-text>
	</v-card>
</template>

<script>
	import dayjs from "dayjs";

	export default {
		name: "DetailedMatchScouting2022",
		props: ["team", "event"],
		data() {
			return {
				dayjs,
				endgamePointMap: {
					Low: "4",
					Mid: "6",
					High: "10",
					Traversal: "15",
				},
				comp_levelMap: {
					qm: "QM",
					qf: "QF",
					sf: "SF",
					f: "F",
				},
				boolMap: { true: "Yes", false: "No" },
				visible: true,
			};
		},
	};
</script>

<style scoped></style>

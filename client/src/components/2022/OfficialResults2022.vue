<template>
	<v-simple-table dense style="white-space: nowrap">
		<template v-slot:default>
			<thead>
				<tr>
					<th class="text-left"></th>
					<th class="text-center red--text">Red</th>
					<th class="text-center blue--text">Blue</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Taxi</td>
					<td class="text-center">
						<v-icon>{{ match.score_breakdown.red.taxiRobot1 == "Yes" ? "mdi-check" : "mdi-close" }}</v-icon>
						<v-icon>{{ match.score_breakdown.red.taxiRobot2 == "Yes" ? "mdi-check" : "mdi-close" }}</v-icon>
						<v-icon>{{ match.score_breakdown.red.taxiRobot3 == "Yes" ? "mdi-check" : "mdi-close" }}</v-icon>
						(+{{ match.score_breakdown.red.autoTaxiPoints }})
					</td>
					<td class="text-center">
						<v-icon>{{ match.score_breakdown.blue.taxiRobot1 == "Yes" ? "mdi-check" : "mdi-close" }}</v-icon>
						<v-icon>{{ match.score_breakdown.blue.taxiRobot2 == "Yes" ? "mdi-check" : "mdi-close" }}</v-icon>
						<v-icon>{{ match.score_breakdown.blue.taxiRobot3 == "Yes" ? "mdi-check" : "mdi-close" }}</v-icon>
						(+{{ match.score_breakdown.blue.autoTaxiPoints }})
					</td>
				</tr>
				<tr>
					<td>Auto Cargo Ct.</td>
					<td class="text-center">
						<v-icon>mdi-chevron-down</v-icon>
						{{ match.score_breakdown.red.autoCargoLowerBlue + match.score_breakdown.red.autoCargoLowerRed + match.score_breakdown.red.autoCargoLowerFar + match.score_breakdown.red.autoCargoLowerNear }}
						<v-icon>mdi-chevron-up</v-icon>
						{{ match.score_breakdown.red.autoCargoUpperBlue + match.score_breakdown.red.autoCargoUpperRed + match.score_breakdown.red.autoCargoUpperFar + match.score_breakdown.red.autoCargoUpperNear }}
					</td>
					<td class="text-center">
						<v-icon>mdi-chevron-down</v-icon>
						{{ match.score_breakdown.blue.autoCargoLowerBlue + match.score_breakdown.blue.autoCargoLowerRed + match.score_breakdown.blue.autoCargoLowerFar + match.score_breakdown.blue.autoCargoLowerNear }}
						<v-icon>mdi-chevron-up</v-icon>
						{{ match.score_breakdown.blue.autoCargoUpperBlue + match.score_breakdown.blue.autoCargoUpperRed + match.score_breakdown.blue.autoCargoUpperFar + match.score_breakdown.blue.autoCargoUpperNear }}
					</td>
				</tr>
				<tr>
					<td>Quintet</td>
					<td class="text-center">
						<v-icon>{{ match.score_breakdown.red.quintetAchieved ? "mdi-check" : "mdi-close" }}</v-icon>
					</td>
					<td class="text-center">
						<v-icon>{{ match.score_breakdown.blue.quintetAchieved ? "mdi-check" : "mdi-close" }}</v-icon>
					</td>
				</tr>
				<tr>
					<td>Auto Cargo Pts.</td>
					<td class="text-center">
						{{ match.score_breakdown.red.autoCargoPoints }}
					</td>
					<td class="text-center">
						{{ match.score_breakdown.blue.autoCargoPoints }}
					</td>
				</tr>
				<tr class="font-weight-black">
					<td>Total Auto</td>
					<td class="text-center">
						{{ match.score_breakdown.red.autoPoints }}
					</td>
					<td class="text-center">
						{{ match.score_breakdown.blue.autoPoints }}
					</td>
				</tr>
				<tr>
					<td>Teleop Cargo Ct.</td>
					<td class="text-center">
						<v-icon>mdi-chevron-down</v-icon>
						{{ match.score_breakdown.red.teleopCargoLowerBlue + match.score_breakdown.red.teleopCargoLowerRed + match.score_breakdown.red.teleopCargoLowerFar + match.score_breakdown.red.teleopCargoLowerNear }}
						<v-icon>mdi-chevron-up</v-icon>
						{{ match.score_breakdown.red.teleopCargoUpperBlue + match.score_breakdown.red.teleopCargoUpperRed + match.score_breakdown.red.teleopCargoUpperFar + match.score_breakdown.red.teleopCargoUpperNear }}
					</td>
					<td class="text-center">
						<v-icon>mdi-chevron-down</v-icon>
						{{ match.score_breakdown.blue.teleopCargoLowerBlue + match.score_breakdown.blue.teleopCargoLowerRed + match.score_breakdown.blue.teleopCargoLowerFar + match.score_breakdown.blue.teleopCargoLowerNear }}
						<v-icon>mdi-chevron-up</v-icon>
						{{ match.score_breakdown.blue.teleopCargoUpperBlue + match.score_breakdown.blue.teleopCargoUpperRed + match.score_breakdown.blue.teleopCargoUpperFar + match.score_breakdown.blue.teleopCargoUpperNear }}
					</td>
				</tr>
				<tr>
					<td>Teleop Cargo Pts.</td>
					<td class="text-center">
						{{ match.score_breakdown.red.teleopCargoPoints }}
					</td>
					<td class="text-center">
						{{ match.score_breakdown.blue.teleopCargoPoints }}
					</td>
				</tr>
				<tr>
					<td>Robot 1 End</td>
					<td class="text-center">
						<span v-if="match.score_breakdown.red.endgameRobot1 != 'None'"> {{ match.score_breakdown.red.endgameRobot1 }} (+{{ endgamePointMap[match.score_breakdown.red.endgameRobot1] }}) </span>
						<v-icon v-else>mdi-close</v-icon>
					</td>
					<td class="text-center">
						<span v-if="match.score_breakdown.blue.endgameRobot1 != 'None'"> {{ match.score_breakdown.blue.endgameRobot1 }} (+{{ endgamePointMap[match.score_breakdown.blue.endgameRobot1] }}) </span>
						<v-icon v-else>mdi-close</v-icon>
					</td>
				</tr>
				<tr>
					<td>Robot 2 End</td>
					<td class="text-center">
						<span v-if="match.score_breakdown.red.endgameRobot2 != 'None'"> {{ match.score_breakdown.red.endgameRobot2 }} (+{{ endgamePointMap[match.score_breakdown.red.endgameRobot2] }}) </span>
						<v-icon v-else>mdi-close</v-icon>
					</td>
					<td class="text-center">
						<span v-if="match.score_breakdown.blue.endgameRobot2 != 'None'"> {{ match.score_breakdown.blue.endgameRobot2 }} (+{{ endgamePointMap[match.score_breakdown.blue.endgameRobot2] }}) </span>
						<v-icon v-else>mdi-close</v-icon>
					</td>
				</tr>
				<tr>
					<td>Robot 3 End</td>
					<td class="text-center">
						<span v-if="match.score_breakdown.red.endgameRobot3 != 'None'"> {{ match.score_breakdown.red.endgameRobot3 }} (+{{ endgamePointMap[match.score_breakdown.red.endgameRobot3] }}) </span>
						<v-icon v-else>mdi-close</v-icon>
					</td>
					<td class="text-center">
						<span v-if="match.score_breakdown.blue.endgameRobot3 != 'None'"> {{ match.score_breakdown.blue.endgameRobot3 }} (+{{ endgamePointMap[match.score_breakdown.blue.endgameRobot3] }}) </span>
						<v-icon v-else>mdi-close</v-icon>
					</td>
				</tr>
				<tr>
					<td>Hangar Pts.</td>
					<td class="text-center">
						{{ match.score_breakdown.red.endgamePoints }}
					</td>
					<td class="text-center">
						{{ match.score_breakdown.blue.endgamePoints }}
					</td>
				</tr>
				<tr class="font-weight-black">
					<td>Total Teleop</td>
					<td class="text-center">
						{{ match.score_breakdown.red.teleopPoints }}
					</td>
					<td class="text-center">
						{{ match.score_breakdown.blue.teleopPoints }}
					</td>
				</tr>
				<tr>
					<td>Cargo Bonus</td>
					<td class="text-center">
						<v-icon>{{ match.score_breakdown.red.cargoBonusRankingPoint ? "mdi-check" : "mdi-close" }}</v-icon
						><span v-if="match.score_breakdown.red.cargoBonusRankingPoint">(+1 RP)</span>
					</td>
					<td class="text-center">
						<v-icon>{{ match.score_breakdown.blue.cargoBonusRankingPoint ? "mdi-check" : "mdi-close" }}</v-icon
						><span v-if="match.score_breakdown.blue.cargoBonusRankingPoint">(+1 RP)</span>
					</td>
				</tr>
				<tr>
					<td>Hangar Bonus</td>
					<td class="text-center">
						<v-icon>{{ match.score_breakdown.red.hangarBonusRankingPoint ? "mdi-check" : "mdi-close" }}</v-icon
						><span v-if="match.score_breakdown.red.hangarBonusRankingPoint">(+1 RP)</span>
					</td>
					<td class="text-center">
						<v-icon>{{ match.score_breakdown.blue.hangarBonusRankingPoint ? "mdi-check" : "mdi-close" }}</v-icon
						><span v-if="match.score_breakdown.blue.hangarBonusRankingPoint">(+1 RP)</span>
					</td>
				</tr>
				<tr>
					<td>Fouls/Tech Fouls</td>
					<td class="text-center">+{{ match.score_breakdown.blue.foulCount * 4 }} / +{{ match.score_breakdown.blue.techFoulCount * 8 }}</td>
					<td class="text-center">+{{ match.score_breakdown.red.foulCount * 4 }} / +{{ match.score_breakdown.red.techFoulCount * 8 }}</td>
				</tr>
				<tr>
					<td>Adjustments</td>
					<td class="text-center">
						{{ match.score_breakdown.red.adjustPoints }}
					</td>
					<td class="text-center">
						{{ match.score_breakdown.blue.adjustPoints }}
					</td>
				</tr>
				<tr class="font-weight-black">
					<td>Final Score</td>
					<td class="text-center">
						{{ match.score_breakdown.red.totalPoints }}
					</td>
					<td class="text-center">
						{{ match.score_breakdown.blue.totalPoints }}
					</td>
				</tr>
				<tr v-if="match.comp_level == 'qm'" class="font-weight-black">
					<td>Ranking Points</td>
					<td class="text-center">+{{ match.score_breakdown.red.rp }} RP</td>
					<td class="text-center">+{{ match.score_breakdown.blue.rp }} RP</td>
				</tr>
			</tbody>
		</template>
	</v-simple-table>
</template>

<script>
	export default {
		name: "OfficialResults2022",
		props: ["match"],
		data() {
			return {
				endgamePointMap: {
					Low: "4",
					Mid: "6",
					High: "10",
					Traversal: "15",
				},
			};
		},
	};
</script>

<style scoped></style>

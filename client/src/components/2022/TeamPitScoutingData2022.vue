<template>
	<v-card :style="visible ? 'flex-grow: 2' : ''">
		<v-card-title class="text-h5" @click.self="visible = !visible" v-ripple style="cursor: pointer">
			<h5 @click.self="visible = !visible" class="text-h5">Pit Scouting</h5>
			<v-spacer></v-spacer>
			<v-icon size="30" class="ml-4">{{ visible ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
		</v-card-title>

		<v-card-text class="mt-0 pt-0 white--text" v-if="visible">
			<p class="grey--text mt-1 text-center font-italic" v-if="!team.pitscouting">No pit scouting data</p>

			<div v-else>
				<v-row>
					<v-col cols="12" md="6">
						<v-img @click="img = true" style="cursor: pointer" max-width="200px" :src="team.pitscouting.image" class="mt-1" />
					</v-col>

					<v-col cols="12" md="6">
						<table>
							<tr>
								<td style="width: 200px" class="font-weight-black">Scouter</td>
								<td>{{ team.scoutingschedule.pitscouting.assignedName }}</td>
							</tr>

							<tr>
								<td style="width: 200px" class="font-weight-black">Spoke With</td>
								<td>
									{{ team.pitscouting.robot.spokeTo }}
								</td>
							</tr>
						</table>

						<h6 class="text-h6 font-weight-light mt-4">AUTONOMOUS</h6>

						<table>
							<tr>
								<td style="width: 200px" class="font-weight-black">Can Taxi?</td>
								<td>{{ boolMap[team.pitscouting.auto.taxi] }}</td>
							</tr>

							<tr>
								<td style="width: 200px" class="font-weight-black">Can Shoot...</td>
								<td>{{ team.pitscouting.auto.shootLow ? "Low " : "" }}{{ team.pitscouting.auto.shootHigh ? "High" : "" }}</td>
							</tr>

							<tr>
								<td style="width: 200px" class="font-weight-black">Can Pickup Cargo...</td>
								<td>{{ team.pitscouting.auto.cargoFloor ? "Floor " : "" }}{{ team.pitscouting.auto.cargoTerminal ? "Terminal " : "" }}{{ team.pitscouting.auto.cargoPreload ? "Preload" : "" }}</td>
							</tr>

							<tr>
								<td style="width: 200px" class="font-weight-black">Preferred Starting Position</td>
								<td>{{ team.pitscouting.auto.start }}</td>
							</tr>

							<tr>
								<td style="width: 200px" class="font-weight-black">Can Share Tarmac?</td>
								<td>{{ boolMap[team.pitscouting.auto.shareTarmac] }}</td>
							</tr>

							<tr>
								<td style="width: 200px" class="font-weight-black">Can Human Score?</td>
								<td>{{ boolMap[team.pitscouting.auto.human] }}</td>
							</tr>
						</table>
					</v-col>
				</v-row>

				<v-row>
					<v-col cols="12" md="6">
						<h6 class="text-h6 font-weight-light">TELEOPERATED</h6>

						<table>
							<tr>
								<td style="width: 200px" class="font-weight-black">Can Shoot...</td>
								<td>{{ team.pitscouting.teleop.shootLow ? "Low " : "" }}{{ team.pitscouting.teleop.shootHigh ? "High" : "" }}</td>
							</tr>

							<tr>
								<td style="width: 200px" class="font-weight-black">Preferred Shooting Position</td>
								<td>{{ team.pitscouting.teleop.shootPos }}</td>
							</tr>

							<tr>
								<td style="width: 200px" class="font-weight-black">Preferred Pickup</td>
								<td>
									{{ team.pitscouting.teleop.cargoPickup }}
								</td>
							</tr>
						</table>
					</v-col>

					<v-col cols="12" md="6">
						<h6 class="text-h6 font-weight-light">ENDGAME</h6>

						<table>
							<tr>
								<td style="width: 200px" class="font-weight-black">Can Hang...</td>
								<td>{{ team.pitscouting.end.hangLow ? "Low " : "" }}{{ team.pitscouting.end.hangMid ? "Mid " : "" }}{{ team.pitscouting.end.hangHigh ? "High " : "" }}{{ team.pitscouting.end.hangTraversal ? "Traversal" : "" }}</td>
							</tr>
						</table>
					</v-col>
				</v-row>

				<v-row>
					<v-col cols="12" md="6">
						<h6 class="text-h6 font-weight-light">DRIVERS</h6>

						<table>
							<tr>
								<td style="width: 200px" class="font-weight-black">Driver Experience</td>
								<td>{{ team.pitscouting.drivers.driverExp }}</td>
							</tr>

							<tr>
								<td style="width: 200px" class="font-weight-black">Coach Experience</td>
								<td>{{ team.pitscouting.drivers.coachExp }}</td>
							</tr>

							<tr>
								<td style="width: 200px" class="font-weight-black">Drive Practice</td>
								<td>{{ team.pitscouting.drivers.practiceHrs }} hrs.</td>
							</tr>

							<tr>
								<td style="width: 200px" class="font-weight-black">Drive Coach Type</td>
								<td>
									{{ team.pitscouting.drivers.coachType }}
								</td>
							</tr>
						</table>

						<v-btn v-if="$root.user.role > 1" class="mt-3" icon color="grey" link :to="`/events/${$route.params.code}/scouting/pit?team=${$route.params.team}`"><v-icon>mdi-pencil</v-icon></v-btn>
					</v-col>

					<v-col cols="12" md="6">
						<h6 class="text-h6 font-weight-light">ROBOT</h6>

						<table>
							<tr>
								<td style="width: 200px" class="font-weight-black">Drivetrain Type</td>
								<td>{{ team.pitscouting.robot.drivetrain }}</td>
							</tr>

							<tr>
								<td style="width: 200px" class="font-weight-black">Unique Features</td>
								<td>{{ team.pitscouting.robot.features }}</td>
							</tr>

							<tr>
								<td style="width: 200px" class="font-weight-black">Inspected Weight</td>
								<td>{{ team.pitscouting.robot.weight }} lbs.</td>
							</tr>

							<tr>
								<td style="width: 200px" class="font-weight-black">Programming Languages</td>
								<td>{{ team.pitscouting.robot.languages }}</td>
							</tr>

							<tr>
								<td style="width: 200px" class="font-weight-black">Realtime Vision?</td>
								<td>{{ boolMap[team.pitscouting.robot.vision] }}</td>
							</tr>

							<tr>
								<td style="width: 200px" class="font-weight-black">Auto Targeting?</td>
								<td>{{ boolMap[team.pitscouting.robot.vision] }}</td>
							</tr>
						</table>
					</v-col>
				</v-row>
			</div>
		</v-card-text>

		<v-dialog v-if="team.pitscouting" v-model="img" fullscreen style="overflow: hidden">
			<v-overlay @click="img = false">
				<v-img max-height="100vh" max-width="100vw" contain :src="team.pitscouting.image"></v-img>
			</v-overlay>
		</v-dialog>
	</v-card>
</template>

<script>
	export default {
		name: "TeamPitScoutingData2022",
		props: ["team"],
		data() {
			return {
				visible: true,
				img: false,

				boolMap: {
					true: "Yes",
					false: "No",
				},
			};
		},
	};
</script>

<style scoped></style>

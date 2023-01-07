<template>
	<div v-if="meetings && leaderboard && myStats">
		<v-card>
			<v-card-title class="text-h5" @click.self="visible = !visible" v-ripple style="cursor: pointer" v-if="!$route.path.includes('/members')">
				<h5 @click.self="visible = !visible" class="text-h5">Personal Stats</h5>
				<v-spacer></v-spacer>
				<v-icon size="30" class="ml-4">{{ visible ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
			</v-card-title>

			<v-card-title v-else><h5 class="text-h5">Attendance Stats</h5></v-card-title>

			<div v-if="visible">
				<v-card-text class="pt-0" :class="{ 'd-flex': $vuetify.breakpoint.smAndUp }">
					<div class="d-flex mb-4">
						<div class="mr-5">
							<h3 class="text-h3 font-weight-black white--text mb-1">
								{{ myStats.rank }}
							</h3>
							<p class="pa-0 ma-0">Rank</p>
						</div>

						<div class="ml-5 mr-10">
							<h3 class="text-h3 font-weight-light white--text mb-1">
								{{ myStats.hours }}
							</h3>
							<p class="pa-0 ma-0">Hours earned</p>
						</div>
					</div>

					<div class="d-flex mb-4">
						<div class="mr-5">
							<span>
								<h3 class="d-inline text-h3 font-weight-light white--text">
									{{ myStats.meetings }}
								</h3>
								<p class="d-inline grey--text" v-if="myStats.bonus != 0">+{{ myStats.bonus }}</p>
							</span>
							<p class="pa-0 mb-0 mt-1">Meeting{{ myStats.meetings == 1 ? "" : "s" }}</p>
						</div>

						<div class="ml-5">
							<h3 class="text-h3 font-weight-light mb-1" :class="getColor()" v-if="possibleHours != 0">{{ ((myStats.rawHours / possibleHours) * 100).toFixed(0) }}%</h3>
							<h3 class="text-h3 font-weight-light mb-1" v-else>-</h3>
							<p class="pa-0 ma-0">Attendance rate</p>
						</div>
					</div>
				</v-card-text>

				<v-simple-table dense v-if="myStats.meetings != 0 && ($route.path.includes('/attendance') ? ($root.user.role > 2 ? false : true) : true)" class="mt-n4" style="white-space: nowrap">
					<template v-slot:default>
						<thead>
							<tr>
								<th class="text-left">Meeting</th>
								<th class="text-left">Date</th>
								<th class="text-left">Hours</th>
								<th v-if="!$route.path.includes('/members')" class="text-left">Attended</th>
							</tr>
						</thead>
						<tbody v-if="$root.user.role > 2">
							<tr
								v-for="meeting in meetings.filter((i) => ($route.path.includes('/members') ? !hasNotHappened(i._id) && i.attendance[user] : true))"
								:key="meeting._id"
								:class="{
									'grey--text font-italic': hasNotHappened(meeting._id),
								}"
								v-ripple
								style="cursor: pointer"
								@click="$router.push(`/meetings/${meeting._id}`)"
							>
								<td class="font-weight-black">{{ meeting.name }}</td>
								<td>
									{{ dayjs(meeting.date).format("ddd, MMM D, YYYY") }}
								</td>
								<td>{{ meeting.bonus ? "+" : "" }}{{ dayjs(`${meeting.date}T${meeting.end}`).diff(`${meeting.date}T${meeting.start}`, "hour", true).toFixed(2) }}</td>
								<td
									v-if="!$route.path.includes('/members') ? !hasNotHappened(meeting._id) : false"
									:class="{
										'font-weight-black red--text': !meeting.attendance[user],
										'green--text': meeting.attendance[user],
									}"
								>
									{{ boolMap[meeting.attendance[user]] || "No" }}
								</td>
								<td v-else-if="!$route.path.includes('/members')">-</td>
							</tr>
						</tbody>

						<tbody v-else>
							<tr
								v-for="meeting in meetings.filter((i) => ($route.path.includes('/members') ? !hasNotHappened(i._id) && i.attendance[user] : true))"
								:key="meeting._id"
								:class="{
									'grey--text font-italic': hasNotHappened(meeting._id),
								}"
							>
								<td class="font-weight-black">{{ meeting.name }}</td>
								<td>
									{{ dayjs(meeting.date).format("ddd, MMM D, YYYY") }}
								</td>
								<td>{{ meeting.bonus ? "+" : "" }}{{ dayjs(`${meeting.date}T${meeting.end}`).diff(`${meeting.date}T${meeting.start}`, "hour", true).toFixed(2) }}</td>
								<td
									v-if="!$route.path.includes('/members') ? !hasNotHappened(meeting._id) : false"
									:class="{
										'font-weight-black red--text': !meeting.attendance[user],
										'green--text': meeting.attendance[user],
									}"
								>
									{{ boolMap[meeting.attendance[user]] || "No" }}
								</td>
								<td v-else-if="!$route.path.includes('/members')">-</td>
							</tr>
						</tbody>
					</template>
				</v-simple-table>

				<v-card-text v-if="visible && myStats.meetings == 0">
					<p class="text-center grey--text font-italic pa-0 mb-0 mt-n6" v-if="!$route.path.includes('members')">You have not attended any meetings</p>
					<p class="text-center pa-0 mb-0 mt-n6 grey--text font-italic" v-else>No meetings attended</p>
				</v-card-text>
			</div>
		</v-card>
	</div>
</template>

<script>
	import dayjs from "dayjs";

	export default {
		name: "AttendancePersonalStats",
		props: ["meetings", "leaderboard", "user", "possibleHours"],
		data() {
			return {
				boolMap: {
					true: "Yes",
					false: "No",
				},
				dayjs,
				visible: true,
			};
		},
		computed: {
			myStats() {
				return this.leaderboard.find((i) => i._id == this.user);
			},
		},
		methods: {
			getColor() {
				const grade = (this.myStats.rawHours / this.possibleHours) * 100;
				if (grade >= 100) return "platinum";
				else if (grade > 90) return "gold";
				else if (grade > 80) return "green--text";
				else if (grade > 70) return "light-green--text";
				else if (grade > 60) return "lime--text";
				else if (grade > 50) return "yellow--text";
				else if (grade > 40) return "orange--text";
				else if (grade > 30) return "deep-orange--text";
				else if (grade > 10) return "red--text";
				else if (grade != 0) return "deep-purple--text text--lighten-1";
				else return "blue--text text--darken-3";
			},
			hasNotHappened(meeting) {
				const data = this.meetings.find((i) => i._id == meeting);
				return dayjs().isBefore(`${data.date}T${data.start}`);
			},
		},
	};
</script>

<style>
	.gold {
		color: #c6981e !important;
	}

	.platinum {
		color: #728cb0 !important;
	}
</style>

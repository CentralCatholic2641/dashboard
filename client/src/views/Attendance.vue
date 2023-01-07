<template>
	<div>
		<v-toolbar dense color="grey darken-4" style="z-index: 1">
			<v-toolbar-title class="d-flex">
				<v-breadcrumbs v-if="$vuetify.breakpoint.smAndUp" :items="breadcrumbs" divider="/" class="pa-0 ma-0"></v-breadcrumbs>

				<h6 class="text-h6 font-weight-black">{{ $root.user.role > 2 ? "" : "My" }} Attendance</h6>
			</v-toolbar-title>
		</v-toolbar>

		<div :style="`height: calc(100vh - ${$vuetify.breakpoint.mdAndUp ? '112px' : '104px'}); overflow: auto`">
			<v-container style="max-width: 1185px" class="px-8 pt-0 mt-4">
				<v-row class="mt-4">
					<v-col cols="12" md="6" v-if="$root.user.role > 1 && leaderboard">
						<AttendanceLeaderboard :possibleHours="possibleHours" :leaderboard="leaderboard" />
					</v-col>

					<v-col cols="12" :md="$root.user.role > 1 ? 6 : 7" v-if="meetings && leaderboard">
						<AttendancePersonalStats :leaderboard="leaderboard" :meetings="meetings" :user="$root.user._id" :possibleHours="possibleHours" class="mb-6" v-if="$root.user.includeInAttendance" />

						<AttendanceByMeeting v-if="$root.user.role > 1" :users="users" :meetings="meetings" />
					</v-col>
				</v-row>
			</v-container>
		</div>
	</div>
</template>

<script>
	import AttendanceLeaderboard from "../components/AttendanceLeaderboard.vue";
	import AttendancePersonalStats from "../components/AttendancePersonalStats.vue";
	import AttendanceByMeeting from "../components/AttendanceByMeeting.vue";

	export default {
		name: "Attendance",
		data() {
			return {
				leaderboard: [],
				meetings: [],
				users: [],
				possibleHours: 0,
			};
		},
		computed: {
			breadcrumbs() {
				return [
					{
						text: `FRC Team ${this.$root.config.team}`,
						disabled: false,
						to: "/",
					},
					{
						text: "",
						disabled: true,
						to: "/attendance",
					},
				];
			},
		},
		methods: {
			refresh() {
				this.$root.loading = true;
				this.$http.get("/api/meeting/leaderboard").then((response) => {
					this.leaderboard = response.data.leaderboard;
					this.users = response.data.users;
					this.possibleHours = response.data.possibleHours;
					this.$http.get("/api/meeting").then((response2) => {
						this.meetings = response2.data;
						for (let i of this.meetings) {
							if (!i.attendance) i.attendance = {};
						}
						this.$root.loading = false;
					});
				});
			},
		},
		created() {
			this.refresh();
		},
		components: {
			AttendanceLeaderboard,
			AttendancePersonalStats,
			AttendanceByMeeting,
		},
	};
</script>

<style scoped></style>

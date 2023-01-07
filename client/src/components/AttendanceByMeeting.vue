<template>
	<div v-if="meetings">
		<v-card>
			<v-card-title class="text-h5" @click.self="visible = !visible" v-ripple style="cursor: pointer">
				<h5 @click.self="visible = !visible" class="text-h5">
					{{ $vuetify.breakpoint.mdAndUp ? "Attendees Per Meeting" : "Per Meeting" }}
				</h5>
				<v-spacer></v-spacer>
				<v-icon size="30" class="ml-4">{{ visible ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
			</v-card-title>

			<v-simple-table dense v-if="visible && meetings.length != 0" style="white-space: nowrap">
				<template v-slot:default>
					<thead>
						<tr>
							<th class="text-left">Meeting</th>
							<th class="text-left">Date</th>
							<th class="text-left">Hours</th>
							<th class="text-left">#</th>
							<th class="text-left">Rate</th>
						</tr>
					</thead>

					<tbody v-if="$root.user.role > 2">
						<tr v-for="meeting in meetings" :key="meeting._id" :class="{ 'grey--text font-italic': hasNotHappened(meeting._id) }" v-ripple style="cursor: pointer" @click="$router.push(`/meetings/${meeting._id}`)">
							<td class="font-weight-black">{{ meeting.name }}</td>
							<td>
								{{ dayjs(meeting.date).format("MMM D") }}
							</td>
							<td>{{ meeting.bonus ? "+" : "" }}{{ dayjs(`${meeting.date}T${meeting.end}`).diff(`${meeting.date}T${meeting.start}`, "hour", true).toFixed(1) }}</td>
							<td>
								{{ getAttendanceCount(meeting._id) }}
							</td>
							<td v-if="!hasNotHappened(meeting._id) && !meeting.bonus" :class="getColor((getAttendanceCount(meeting._id) / users.filter((i) => i.includeInAttendance).length) * 100)">{{ ((getAttendanceCount(meeting._id) / users.filter((i) => i.includeInAttendance).length) * 100).toFixed(1) }}%</td>
							<td v-else>-</td>
						</tr>
					</tbody>

					<tbody v-else>
						<tr v-for="meeting in meetings" :key="meeting._id" :class="{ 'grey--text font-italic': hasNotHappened(meeting._id) }">
							<td class="font-weight-black">{{ meeting.name }}</td>
							<td>
								{{ dayjs(meeting.date).format("MMM D") }}
							</td>
							<td>
								{{ dayjs(`${meeting.date}T${meeting.end}`).diff(`${meeting.date}T${meeting.start}`, "hour", true).toFixed(1) }}
							</td>
							<td>
								{{ getAttendanceCount(meeting._id) }}
							</td>
							<td v-if="!hasNotHappened(meeting._id) && !meeting.bonus" :class="getColor((getAttendanceCount(meeting._id) / users.filter((i) => i.includeInAttendance).length) * 100)">{{ ((getAttendanceCount(meeting._id) / users.filter((i) => i.includeInAttendance).length) * 100).toFixed(1) }}%</td>
							<td v-else>-</td>
						</tr>
					</tbody>
				</template>
			</v-simple-table>

			<v-card-text v-else-if="visible && meetings.length == 0">
				<p class="grey--text text-center font-italic ma-2">No meetings</p>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
	import dayjs from "dayjs";

	export default {
		name: "AttendanceByMeeting",
		props: ["meetings", "users"],
		data() {
			return {
				dayjs,
				visible: true,
			};
		},
		methods: {
			getAttendanceCount(meeting) {
				const data = this.meetings.find((i) => i._id == meeting);
				let count = 0;
				for (let i in data.attendance) {
					if (data.attendance[i] == true) count++;
				}
				return count;
			},
			getColor(grade) {
				if (grade > 80) return "green--text";
				else if (grade > 70) return "light-green--text";
				else if (grade > 60) return "lime--text";
				else if (grade > 50) return "yellow--text";
				else if (grade > 40) return "orange--text";
				else if (grade > 30) return "deep-orange--text";
				else if (grade > 10) return "red--text";
				else return "deep-purple--text";
			},
			hasNotHappened(meeting) {
				const data = this.meetings.find((i) => i._id == meeting);
				return dayjs().isBefore(`${data.date}T${data.start}`);
			},
		},
	};
</script>

<style scoped></style>

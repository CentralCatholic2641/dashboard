<template>
	<div v-if="meeting">
		<v-toolbar dense color="grey darken-4" style="z-index: 1">
			<v-toolbar-title class="d-flex">
				<v-breadcrumbs v-if="$vuetify.breakpoint.smAndUp" :items="breadcrumbs" divider="/" class="pa-0 ma-0"></v-breadcrumbs>

				<h6 class="text-h6 font-weight-black">{{ meeting.name }}</h6>
			</v-toolbar-title>
		</v-toolbar>

		<div :style="`height: calc(100vh - ${$vuetify.breakpoint.mdAndUp ? '112px' : '104px'}); overflow: auto`">
			<v-container style="max-width: 1185px" class="px-8 pt-0 mt-4">
				<v-row class="mt-4">
					<v-col cols="12" md="8">
						<v-card class="mb-6">
							<v-card-title class="text-h5">Basic Information</v-card-title>

							<v-card-text class="white--text">
								<table>
									<tr>
										<td style="width: 100px" class="font-weight-black">Date</td>
										<td>{{ date }}</td>
									</tr>

									<tr>
										<td style="width: 100px" class="font-weight-black">Start Time</td>
										<td>
											{{ meeting.start }}
										</td>
									</tr>

									<tr>
										<td style="width: 100px" class="font-weight-black">End Time</td>
										<td>
											{{ meeting.end }}
										</td>
									</tr>

									<tr>
										<td style="width: 100px" class="font-weight-black">Duration</td>
										<td>{{ duration }} hours</td>
									</tr>
								</table>
							</v-card-text>
						</v-card>

						<v-card class="mb-6">
							<v-card-title class="text-h5">Notes</v-card-title>

							<v-card-text>
								<Editor @input="changes = true" v-model="meeting.notes" placeholder="Notes..." />
							</v-card-text>
						</v-card>

						<v-card class="mb-4" v-if="$root.user.role > 2 && users">
							<v-card-title class="text-h5">Attendance</v-card-title>

							<v-card-text>
								<v-row @mouseleave="attendance_hover = false" class="pb-4 pt-2">
									<v-col v-for="n in Math.ceil(users.filter((i) => i.includeInAttendance).length / 14)" :key="n" cols="12" :md="12 / Math.ceil(users.filter((i) => i.includeInAttendance).length / 14)" class="my-0 py-0">
										<div v-for="user in users.filter((i) => i.includeInAttendance).slice((n - 1) * 14, Math.min(n * 14, users.filter((i) => i.includeInAttendance).length))" :key="user._id" @mouseover="attendance_hover = user.username">
											<v-checkbox :label="user.name" hide-details v-model="meeting.attendance[user._id]" @change="changes = true" dense></v-checkbox>
										</div>
									</v-col>
								</v-row>
							</v-card-text>
						</v-card>

						<v-card class="mb-4" v-else>
							<v-card-title class="text-h5">Attendance</v-card-title>

							<v-card-text>
								<span v-if="meeting.attendance[$root.user._id]"> You attended this meeting (+{{ duration }} hours) </span>
								<span v-else>You did not attend this meeting</span>
							</v-card-text>
						</v-card>
					</v-col>

					<v-col cols="12" md="4" v-if="$root.user.role > 2">
						<h5 class="text-h5 mt-3">Actions</h5>

						<v-list dense class="transparent mt-3 mb-4">
							<v-list-item @click="save()" :disabled="!changes" :class="{ 'blue--text': changes }">
								<v-list-item-icon><v-icon left :class="{ 'grey--text': !changes, 'blue--text': changes }">mdi-content-save</v-icon></v-list-item-icon>
								<v-list-item-title>Save Changes</v-list-item-title>
							</v-list-item>

							<v-list-item @click="refresh()" :disabled="!changes">
								<v-list-item-icon><v-icon left :class="{ 'grey--text': !changes }">mdi-undo-variant</v-icon></v-list-item-icon>
								<v-list-item-title>Revert Changes</v-list-item-title>
							</v-list-item>

							<v-list-item @click="edit = true" class="orange--text">
								<v-list-item-icon><v-icon left class="orange--text">mdi-pencil</v-icon></v-list-item-icon>
								<v-list-item-title>Edit Meeting</v-list-item-title>
							</v-list-item>

							<v-list-item @click="confirm_delete = true" class="red--text">
								<v-list-item-icon><v-icon left class="red--text">mdi-delete</v-icon></v-list-item-icon>
								<v-list-item-title>Delete Meeting</v-list-item-title>
							</v-list-item>
						</v-list>

						<v-img v-if="attendance_hover" :src="`/api/content/members/${attendance_hover}.jpg`"></v-img>
					</v-col>
				</v-row>
			</v-container>
		</div>

		<v-dialog max-width="500px" v-if="$root.user.role > 2 && edit" v-model="edit">
			<MeetingEditor :meeting="meeting" @close="(edit = false), refresh()" />
		</v-dialog>

		<v-dialog v-model="confirm_delete" max-width="400" persistent>
			<v-card style="border: 3px #f44336 solid; background: #212121 !important">
				<v-card-title>
					<h4 class="text-h4 font-weight-black mt-1" v-if="$vuetify.breakpoint.mdAndUp">CONFIRM</h4>
					<h5 class="text-h5 font-weight-black mt-1" v-else>CONFIRM</h5>
				</v-card-title>

				<v-card-text> Are you sure you want to delete this meeting? This action is irreversible. </v-card-text>

				<v-card-actions>
					<v-btn color="green" text @click="confirm_delete = false">Cancel</v-btn>
					<v-spacer></v-spacer>
					<v-btn color="red" text @click="deleteMeeting()">Delete</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
	import MeetingEditor from "../components/MeetingEditor.vue";
	import dayjs from "dayjs";
	import Editor from "../components/Editor.vue";

	export default {
		name: "Meeting",
		data() {
			return {
				meeting: false,
				edit: false,
				users: [],
				changes: false,
				attendance_hover: false,
				confirm_delete: false,
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
						text: "Meetings",
						disabled: false,
						exact: true,
						to: "/meetings",
					},
					{
						text: "",
						disabled: true,
						to: `/meetings/${this.meeting._id}`,
					},
				];
			},
			date() {
				return dayjs(this.meeting.date).format("dddd, MMMM D, YYYY");
			},
			duration() {
				return dayjs(`${this.meeting.date}T${this.meeting.end}`).diff(`${this.meeting.date}T${this.meeting.start}`, "hour", true).toFixed(2);
			},
		},
		methods: {
			refresh() {
				if (this.$root.user.role > 2) {
					this.changes = false;
					this.$root.loading = true;
					this.$http.get(`/api/meeting/get/${this.$route.params.meeting}`).then((response) => {
						this.$http.get("/api/auth/users").then((response2) => {
							this.users = response2.data;
							this.$root.loading = false;
						});
						if (!response.data.attendance) response.data.attendance = {};
						this.meeting = response.data;
					});
				} else this.$router.replace("/");
			},
			deleteMeeting() {
				if (this.$root.user.role > 2) {
					this.$http.delete(`/api/meeting/${this.meeting._id}`).then(() => {
						this.$router.push("/meetings");
					});
				}
			},
			save() {
				this.$http.put("/api/meeting", this.meeting).then(() => {
					this.changes = false;
				});
			},
		},
		created() {
			this.refresh();
		},
		components: {
			MeetingEditor,
			Editor,
		},
	};
</script>

<style scoped></style>

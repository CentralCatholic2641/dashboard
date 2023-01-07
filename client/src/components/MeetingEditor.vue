<template>
	<v-card>
		<v-btn style="position: absolute; top: 8px; right: 8px" @click="$emit('close')" fab top right elevation="0" class="transparent"><v-icon>mdi-close</v-icon></v-btn>

		<v-card-title>
			<h4 class="text-h4 font-weight-black mt-1" v-if="$vuetify.breakpoint.mdAndUp">EDIT MEETING</h4>
			<h5 class="text-h5 font-weight-black mt-1" v-else>EDIT MEETING</h5>
		</v-card-title>

		<v-card-text>
			<v-text-field label="Name" v-model="input.name" prepend-icon="mdi-format-title"></v-text-field>

			<v-menu ref="date_menu" v-model="date_menu" :close-on-content-click="false" :nudge-right="40" :return-value.sync="input.date" transition="scale-transition" offset-y max-width="290px" min-width="290px">
				<template v-slot:activator="{ on, attrs }">
					<v-text-field v-model="input.date" label="Date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
				</template>
				<v-date-picker v-if="date_menu" v-model="input.date" full-width @click:date="$refs.date_menu.save(input.date)" color="primary"></v-date-picker>
			</v-menu>

			<v-menu ref="start_time_menu" v-model="start_time_menu" :close-on-content-click="false" :nudge-right="40" :return-value.sync="input.start" transition="scale-transition" offset-y max-width="290px" min-width="290px">
				<template v-slot:activator="{ on, attrs }">
					<v-text-field v-model="input.start" label="Start Time" prepend-icon="mdi-clock-start" readonly v-bind="attrs" v-on="on"></v-text-field>
				</template>
				<v-time-picker v-if="start_time_menu" v-model="input.start" full-width @click:minute="$refs.start_time_menu.save(input.start)" format="24hr" color="primary"></v-time-picker>
			</v-menu>

			<v-menu ref="end_time_menu" v-model="end_time_menu" :close-on-content-click="false" :nudge-right="40" :return-value.sync="input.end" transition="scale-transition" offset-y min-width="290px">
				<template v-slot:activator="{ on, attrs }">
					<v-text-field v-model="input.end" label="End Time" prepend-icon="mdi-clock-end" readonly v-bind="attrs" v-on="on" hide-details class="mb-4"></v-text-field>
				</template>
				<v-time-picker v-if="end_time_menu" v-model="input.end" full-width @click:minute="$refs.end_time_menu.save(input.end)" format="24hr" color="primary"></v-time-picker>
			</v-menu>

			<v-checkbox v-model="input.bonus" hide-details label="Bonus Meeting?"></v-checkbox>
		</v-card-text>

		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn color="primary" @click="save()"><v-icon left>mdi-content-save</v-icon>Save</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
	export default {
		name: "MeetingEditor",
		props: ["meeting"],
		data() {
			return {
				input: {},
				date_menu: false,
				start_time_menu: false,
				end_time_menu: false,
				users: [],
				attendanceToggle: {},
			};
		},
		methods: {
			save() {
				this.$http.put("/api/meeting", this.input).then((response) => this.$emit("close"));
			},
			refresh() {
				this.$http.get("/api/auth/users").then((response) => {
					if (!this.input.attendance) this.input.attendance = {};
					if (!this.input.bonus) this.input.bonus = false;
					this.users = response.data;
				});
			},
		},
		created() {
			this.input = this.meeting;
			this.refresh();
		},
	};
</script>

<style scoped></style>

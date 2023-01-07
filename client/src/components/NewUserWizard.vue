<template>
	<div>
		<v-card-title>
			<h4 class="text-h4 font-weight-black mt-1" v-if="$vuetify.breakpoint.mdAndUp">NEW MEMBER</h4>
			<h5 class="text-h5 font-weight-black mt-1" v-else>NEW MEMBER</h5>
		</v-card-title>

		<v-card-text>
			<v-row>
				<v-col cols="12" md="6">
					<v-text-field prepend-icon="mdi-account" hide-details="auto" label="Username" v-model="data.username" :error-messages="error.username" autocomplete="off"></v-text-field>
				</v-col>

				<v-col cols="12" md="6">
					<v-text-field prepend-icon="mdi-format-title" autocomplete="off" hide-details="auto" label="Name" v-model="data.name"></v-text-field>
				</v-col>
			</v-row>

			<v-row>
				<v-col cols="12" md="6">
					<v-text-field prepend-icon="mdi-lock" autocomplete="off" :error-messages="error.password" label="Password" v-model="data.password" type="password" hide-details="auto"></v-text-field>
				</v-col>

				<v-col cols="12" md="6">
					<v-text-field prepend-icon="mdi-lock-check" autocomplete="off" :error-messages="error.password" label="Confirm Password" v-model="confirm_password" type="password" hide-details="auto"></v-text-field>
				</v-col>
			</v-row>

			<v-row>
				<v-col cols="12" md="6">
					<v-select prepend-icon="mdi-format-list-bulleted-type" v-model="data.type" label="Type" hide-details :items="types"></v-select>
				</v-col>
			</v-row>
		</v-card-text>

		<v-card-actions>
			<v-btn text color="grey" @click="$emit('close')">Cancel</v-btn>
			<v-spacer></v-spacer>
			<v-btn color="primary" @click="createUser()" :disabled="!data.username || !data.name || !data.password || !confirm_password || !data.type">Create<v-icon right>mdi-chevron-right</v-icon></v-btn>
		</v-card-actions>
	</div>
</template>

<script>
	export default {
		name: "NewUserWizard",
		data() {
			return {
				confirm_password: "",
				data: {
					type: "Freshman",
					includeInScouting: true,
					includeInAttendance: true,
					resetPasswordOnNextLogin: true,
					locked: false,
					role: 1,
					position: "Member",
				},
				error: {
					username: "",
					password: "",
				},
				types: ["Freshman", "Sophomore", "Junior", "Senior", "Mentor"],
			};
		},
		methods: {
			createUser() {
				if (this.confirm_password == this.data.password) {
					this.data.shortname = this.data.name.substring(0, this.data.name.indexOf(" ")) + " " + this.data.name.substring(this.data.name.lastIndexOf(" ") + 1, this.data.name.lastIndexOf(" ") + 2) + ".";
					if (this.data.type == "Mentor") {
						this.data.role = 2;
						this.data.position = "Mentor";
						this.data.includeInScouting = false;
					}
					this.$http.post("/api/auth/create", this.data).then((response) => {
						if (response.data.error) this.error = response.data.error;
						else {
							this.$emit("close");
						}
					});
				} else this.error.password = "Passwords do not match";
			},
		},
	};
</script>

<style scoped></style>

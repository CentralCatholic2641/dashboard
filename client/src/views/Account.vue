<template>
	<div>
		<v-toolbar dense color="grey darken-4" style="z-index: 1">
			<v-toolbar-title class="d-flex">
				<v-breadcrumbs v-if="$vuetify.breakpoint.smAndUp" :items="breadcrumbs" divider="/" class="pa-0 ma-0"></v-breadcrumbs>

				<h6 class="text-h6 font-weight-black">Account</h6>
			</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-btn color="primary" @click="save()" :disabled="cantSave"><v-icon left>mdi-content-save</v-icon>Save</v-btn>
		</v-toolbar>

		<div :style="`height: calc(100vh - ${$vuetify.breakpoint.mdAndUp ? '112px' : '104px'}); overflow: auto`">
			<v-container style="max-width: 1185px" class="px-8 pt-0 mt-6">
				<v-row>
					<v-col cols="12" md="6">
						<v-card class="mb-6">
							<v-card-title><h5 class="text-h5">Profile</h5></v-card-title>

							<v-card-text>
								<v-text-field class="mb-4" hide-details v-model="$root.user.email" label="Email" @input="changes = true" prepend-icon="mdi-email"></v-text-field>

								<v-text-field class="mb-4" hide-details v-model="$root.user.phone" label="Phone" @input="changes = true" prepend-icon="mdi-phone"></v-text-field>

								<v-text-field hide-details v-model="$root.user.address" label="Address" @input="changes = true" prepend-icon="mdi-home"></v-text-field>
							</v-card-text>

							<v-card-actions>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>

						<v-card class="mb-6">
							<v-card-title><h5 class="text-h5">Change Password</h5></v-card-title>

							<v-card-text>
								<v-text-field class="mb-4" hide-details v-model="reset.new" label="New Password" @input="changes = true" prepend-icon="mdi-lock" type="password"></v-text-field>

								<v-text-field hide-details v-model="confirm_password" label="Confirm New Password" @input="changes = true" prepend-icon="mdi-lock-check" type="password"></v-text-field>
							</v-card-text>

							<v-card-actions>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>
					</v-col>
				</v-row>
			</v-container>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Account",
		data() {
			return {
				reset: {
					new: "",
				},
				confirm_password: "",

				changes: false,
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
						to: "/account",
					},
				];
			},
			cantSave() {
				let value = true;

				if (this.changes) value = false;

				if (this.reset.new.length != 0) {
					if (this.confirm_password.length == 0) value = true;
					else if (this.reset.new == this.confirm_password) value = false;
					else value = true;
				}

				return value;
			},
		},
		methods: {
			save() {
				let mode = false;

				if (this.reset.new.length != 0) {
					mode = true;
					this.$root.user.password = this.reset.new;
				}

				this.$http.put(`/api/auth/${this.$root.user._id}?password=${mode}`, this.$root.user).then((response) => {
					this.$root.user = response.data.find((i) => i._id == this.$root.user._id);
					this.changes = false;
					this.reset = {
						old: "",
						new: "",
					};
					this.confirm_password = "";
				});
			},
		},
	};
</script>

<style scoped></style>

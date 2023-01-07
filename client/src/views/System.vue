<template>
	<div>
		<v-toolbar dense color="grey darken-4" style="z-index: 1">
			<v-toolbar-title class="d-flex">
				<v-breadcrumbs v-if="$vuetify.breakpoint.smAndUp" :items="breadcrumbs" divider="/" class="pa-0 ma-0"></v-breadcrumbs>

				<h6 class="text-h6 font-weight-black">System</h6>
			</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-btn :disabled="!changes" color="primary" @click="save()"><v-icon left>mdi-content-save</v-icon>Save</v-btn>
		</v-toolbar>

		<div :style="`height: calc(100vh - ${$vuetify.breakpoint.mdAndUp ? '112px' : '104px'}); overflow: auto`">
			<v-container style="max-width: 1185px" class="px-8 pt-0 mt-4">
				<v-row class="mt-n1">
					<v-col cols="12" md="4">
						<v-card class="mb-6">
							<v-card-text>
								<div class="mr-5">
									<h3 :class="getClass($root.config.status || 'Active')" class="text-h3 font-weight-light mb-1">
										{{ $root.config.status || "Active" }}
									</h3>
									<p class="pa-0 ma-0">System status</p>
								</div>
							</v-card-text>
						</v-card>

						<v-card class="mb-6">
							<v-card-title>
								<h5 class="text-h5">Cache</h5>
							</v-card-title>

							<v-card-text>
								<v-text-field hide-details label="Cache Duration (Hours)" type="number" v-model="$root.config.cacheLength" @input="changes = true"></v-text-field>

								<v-btn class="mt-5" @click="clearCache()" text><v-icon left>mdi-delete</v-icon>Clear Cache</v-btn>
							</v-card-text>
						</v-card>
					</v-col>

					<v-col cols="12" md="4">
						<v-card class="mb-6">
							<v-card-title>
								<h5 class="text-h5">Season</h5>
							</v-card-title>

							<v-card-text>
								<v-text-field hide-details label="Season" type="number" v-model="$root.config.year" @input="changes = true"></v-text-field>

								<v-switch class="mt-5" hide-details label="Event Mode" v-model="$root.config.event" color="primary" @change="changes = true" :disabled="!$root.config.currentEvent"></v-switch>

								<v-select :items="events" label="Current Event" hide-details class="mt-5" v-model="$root.config.currentEvent" @input="changes = true"></v-select>
							</v-card-text>
						</v-card>

						<v-card class="mb-6">
							<v-card-title>
								<h5 class="text-h5">Activation</h5>
							</v-card-title>

							<v-card-text>
								{{ $root.config.code || "No activation code" }}
							</v-card-text>
						</v-card>
					</v-col>

					<v-col cols="12" md="4">
						<v-card class="mb-6">
							<v-card-title>
								<h5 class="text-h5">Updates</h5>
							</v-card-title>

							<v-card-text>
								<div style="display: flex; align-items: center">
									<div>
										<p class="mb-1">
											Current version: <b>v{{ $root.version }}</b>
										</p>
										<p class="mb-0">
											Latest version: <b>v{{ latest }}</b>
										</p>
									</div>

									<v-btn style="margin-left: 48px" @click="update()" :disabled="!needsUpdate" color="primary"><v-icon left>mdi-update</v-icon>Update</v-btn>
								</div>
							</v-card-text>
						</v-card>

						<v-card class="mb-6">
							<v-card-title>
								<h5 class="text-h5">Support</h5>
							</v-card-title>

							<v-card-text>
								To contact support, email
								<a class="blue--text" href="mailto:support@team2641.com">support@team2641.com</a>
							</v-card-text>
						</v-card>
					</v-col>
				</v-row>
			</v-container>
		</div>

		<v-dialog v-model="update_progress" max-width="500" persistent>
			<v-card>
				<v-card-title>
					<h4 class="text-h4 font-weight-black mt-1" v-if="$vuetify.breakpoint.mdAndUp">UPDATE IN PROGRESS...</h4>
					<h5 class="text-h5 font-weight-black mt-1" v-else>UPDATE IN PROGRESS...</h5>
				</v-card-title>
				<v-card-text>This page will automatically reload upon completion.</v-card-text>

				<v-progress-linear indeterminate></v-progress-linear>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
	export default {
		name: "System",
		data() {
			return {
				changes: false,
				latest: "",
				update_progress: false,
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
						to: "/system",
					},
				];
			},
			events() {
				let data = [{ text: "None", value: null }];

				for (let event of this.$root.config.events) {
					data.push({
						text: event.name,
						value: event.key,
					});
				}

				return data;
			},
			needsUpdate() {
				if (!this.latest) return false;
				else return this.$root.version != this.latest;
			},
		},
		methods: {
			save() {
				this.$http.post("/api/admin", this.$root.config).then((response) => {
					this.$root.config = response.data;
					this.changes = false;
				});
			},
			clearCache() {
				this.$http.delete("/api/admin/flush");
			},
			getClass(status) {
				switch (status) {
					case "Unactivated":
						return "grey--text";
					case "Active":
						return "green--text";
					case "Disabled":
						return "amber--text";
					case "Down":
						return "red--text";
					default:
						return "white--text";
				}
			},
			checkForUpdates() {
				this.$http.get("https://update.aidanliddy.com/ver/tms/v1").then((response) => {
					this.latest = response.data;
				});
			},
			update() {
				this.update_progress = true;
				this.$http.post(`/api/admin/update`, { version: this.latest });
				setTimeout(() => {
					this.update_progress = false;
					window.location.reload(true);
				}, 60000);
			},
		},
		created() {
			if (this.$root.user.role != 4) this.$router.push("/");
			else this.checkForUpdates();
		},
	};
</script>

<style scoped></style>

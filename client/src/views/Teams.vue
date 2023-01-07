<template>
	<div v-if="teams">
		<v-toolbar dense color="grey darken-4" style="z-index: 1">
			<v-toolbar-title class="d-flex">
				<v-breadcrumbs v-if="$vuetify.breakpoint.smAndUp" :items="breadcrumbs" divider="/" class="pa-0 ma-0"></v-breadcrumbs>

				<h6 class="text-h6 font-weight-black">Teams</h6>
			</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-menu offset-y>
				<template v-slot:activator="{ on, attrs }">
					<v-btn class="mr-2" :input-value="true" v-bind="attrs" v-on="on" text>{{ season }}<v-icon right>mdi-clock</v-icon></v-btn>
				</template>
				<v-list dense style="max-height: 500px; overflow: auto">
					<v-list-item-group v-model="season" mandatory>
						<v-list-item v-for="year in years" :key="year" :value="year">
							<v-list-item-title>{{ year }}</v-list-item-title>
						</v-list-item>
					</v-list-item-group>
				</v-list>
			</v-menu>

			<div style="max-width: 500px">
				<v-pagination v-model="page" :length="20"></v-pagination>
			</div>
		</v-toolbar>

		<div :style="`height: calc(100vh - ${$vuetify.breakpoint.mdAndUp ? '112px' : '104px'}); overflow: auto`">
			<v-container style="max-width: 1185px" class="px-8 pt-0 mt-7">
				<v-card class="mb-4">
					<v-simple-table class="transparent" dense style="white-space: nowrap">
						<template v-slot:default>
							<thead>
								<tr>
									<th style="width: 75px" class="text-left"></th>
									<th class="text-left">Team</th>
									<th style="width: 400px" class="text-left">Location</th>
								</tr>
							</thead>

							<tbody>
								<tr v-ripple style="cursor: pointer" v-for="team in teams" :key="team.key" @click="$router.push(`/teams/${team.team_number}`)">
									<td>
										{{ team.team_number }}
									</td>
									<td class="font-weight-black">
										{{ team.nickname }}
									</td>
									<td>
										{{ team.city }}, {{ team.state_prov }},
										{{ team.country }}
									</td>
								</tr>
							</tbody>
						</template>
					</v-simple-table>
				</v-card>
			</v-container>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Teams",
		data() {
			return {
				teams: false,
				page: 1,
				season: -1,
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
						to: "/teams",
					},
				];
			},
			years() {
				let data = [];

				for (let i = new Date().getFullYear() - 1991; i > 0; i--) {
					data.push(1991 + i);
				}

				return data;
			},
		},
		methods: {
			refresh() {
				this.$root.loading = true;
				this.$http.get(`/api/team?page=${this.page - 1}&season=${this.season}`).then((response) => {
					this.teams = response.data;
					this.$root.loading = false;
				});
			},
		},
		created() {
			this.season = this.$root.config.year;
			this.refresh();
		},
		watch: {
			page() {
				this.refresh();
			},
			season() {
				this.refresh();
			},
		},
	};
</script>

<style>
	.v-pagination__item,
	.v-pagination__navigation {
		box-shadow: none;
	}

	.theme--dark.v-pagination .v-pagination__item,
	.theme--dark.v-pagination .v-pagination__navigation {
		background: transparent;
	}
</style>

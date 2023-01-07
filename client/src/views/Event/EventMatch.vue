<template>
	<div v-if="event">
		<v-toolbar dense color="grey darken-4" style="z-index: 1">
			<v-toolbar-title class="d-flex">
				<v-breadcrumbs v-if="$vuetify.breakpoint.smAndUp" :items="breadcrumbs" divider="/" class="pa-0 ma-0"></v-breadcrumbs>

				<h6 class="text-h6 font-weight-black">
					<span v-if="match.comp_level != 'qm' && match.comp_level != 'f'">{{ comp_levelMap[match.comp_level] }} {{ match.set_number }} Match {{ match.match_number }}</span>
					<span v-else>{{ comp_levelMap[match.comp_level] }} {{ match.match_number }}</span>
				</h6>
			</v-toolbar-title>

			<v-spacer></v-spacer>

			<EventNav :event="event" />
		</v-toolbar>

		<div :style="`height: calc(100vh - ${$vuetify.breakpoint.mdAndUp ? '112px' : '104px'}); overflow: auto`">
			<v-container style="max-width: 1400px" class="px-8 pt-0 mt-4">
				<v-row class="mt-4">
					<v-col cols="12" md="5">
						<v-card class="mb-6">
							<v-simple-table dense>
								<template v-slot:default>
									<thead>
										<tr>
											<th class="text-left">1</th>
											<th class="text-left">2</th>
											<th class="text-left">3</th>
											<th class="text-left">Score</th>
										</tr>
									</thead>
									<tbody>
										<tr
											v-ripple
											style="cursor: pointer"
											class="red--text"
											:class="{
												'font-weight-black': match.winning_alliance == 'red',
											}"
										>
											<td @click="$router.push(`/events/${event.year}${event.event_code.toUpperCase()}/teams/${match.alliances.red.team_keys[0].substring(3)}`)">
												{{ match.alliances.red.team_keys[0].substring(3) }}
											</td>
											<td @click="$router.push(`/events/${event.year}${event.event_code.toUpperCase()}/teams/${match.alliances.red.team_keys[1].substring(3)}`)">
												{{ match.alliances.red.team_keys[1].substring(3) }}
											</td>
											<td @click="$router.push(`/events/${event.year}${event.event_code.toUpperCase()}/teams/${match.alliances.red.team_keys[2].substring(3)}`)">
												{{ match.alliances.red.team_keys[2].substring(3) }}
											</td>
											<td>
												{{ match.alliances.red.score != -1 ? match.alliances.red.score : "-" }}
											</td>
										</tr>

										<tr
											v-ripple
											style="cursor: pointer"
											class="blue--text"
											:class="{
												'font-weight-black': match.winning_alliance == 'blue',
											}"
										>
											<td @click="$router.push(`/events/${event.year}${event.event_code.toUpperCase()}/teams/${match.alliances.blue.team_keys[0].substring(3)}`)">
												{{ match.alliances.blue.team_keys[0].substring(3) }}
											</td>
											<td @click="$router.push(`/events/${event.year}${event.event_code.toUpperCase()}/teams/${match.alliances.blue.team_keys[1].substring(3)}`)">
												{{ match.alliances.blue.team_keys[1].substring(3) }}
											</td>
											<td @click="$router.push(`/events/${event.year}${event.event_code.toUpperCase()}/teams/${match.alliances.blue.team_keys[2].substring(3)}`)">
												{{ match.alliances.blue.team_keys[2].substring(3) }}
											</td>
											<td>
												{{ match.alliances.blue.score != -1 ? match.alliances.blue.score : "-" }}
											</td>
										</tr>
									</tbody>
								</template>
							</v-simple-table>
						</v-card>

						<v-card class="mb-4" v-if="match.score_breakdown">
							<v-card-title class="text-h5">Official Results</v-card-title>

							<OfficialResults2022 :match="match" />
						</v-card>
					</v-col>

					<v-col cols="12" md="7">
						<iframe class="mb-4" v-if="match.videos[0]" style="width: 100%; height: 433px" :src="`https://www.youtube.com/embed/${match.videos[0].key}`" frameborder="0"></iframe>

						<v-card class="mb-3">
							<v-card-title class="text-h5">Scouting Data</v-card-title>

							<MatchScoutingData2022 :match="match" />
						</v-card>
					</v-col>
				</v-row>
			</v-container>
		</div>
	</div>
</template>

<script>
	import dayjs from "dayjs";
	import OfficialResults2022 from "../../components/2022/OfficialResults2022.vue";
	import MatchScoutingData2022 from "../../components/2022/MatchScoutingData2022.vue";
	import EventNav from "../../components/EventNav.vue";

	export default {
		name: "EventMatch",
		data() {
			return {
				event: false,
				match: false,

				comp_levelMap: {
					qm: "Quals",
					qf: "Quarters",
					sf: "Semis",
					f: "Finals",
				},
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
						text: "Events",
						disabled: false,
						exact: true,
						to: "/events",
					},
					{
						text: `${this.event.year} ${this.event.name}`,
						disabled: false,
						exact: true,
						to: `/events/${this.event.year}${this.event.event_code.toUpperCase()}`,
					},
					{
						text: "Schedule",
						disabled: false,
						exact: true,
						to: `/events/${this.event.year}${this.event.event_code.toUpperCase()}/schedule`,
					},
					{
						text: "",
						disabled: true,
						to: `/events/${this.event.year}${this.event.event_code.toUpperCase()}/schedule/${this.match.key.toUpperCase().substring(this.match.key.indexOf("_") + 1)}`,
					},
				];
			},
			start() {
				if (this.match)
					if (this.match.actual_time) return dayjs(this.match.actual_time * 1000).format("dddd, MMMM D, YYYY [at] HH:mm");
					else return dayjs(this.match.time * 1000).format("dddd, MMMM D, YYYY [at] HH:mm");
			},
		},
		methods: {
			refresh() {
				this.$root.loading = true;
				this.$http.get(`/api/event/${this.$route.params.code.toLowerCase()}/schedule/${this.$route.params.match.toLowerCase()}`).then((response) => {
					this.match = response.data.match;
					this.event = response.data.event;
					this.$root.loading = false;
				});
			},
		},
		created() {
			this.refresh();
		},
		components: {
			OfficialResults2022,
			MatchScoutingData2022,
			EventNav,
		},
		watch: {
			"$route.path"() {
				this.refresh();
			},
		},
	};
</script>

<style scoped></style>

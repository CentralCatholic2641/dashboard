<template>
	<div v-if="event && match">
		<v-toolbar dense color="grey darken-4" style="z-index: 1">
			<v-toolbar-title class="d-flex">
				<v-breadcrumbs v-if="$vuetify.breakpoint.smAndUp" :items="breadcrumbs" divider="/" class="pa-0 ma-0"></v-breadcrumbs>

				<h6 class="text-h6 font-weight-black">Match Scouting</h6>
			</v-toolbar-title>
		</v-toolbar>

		<div :style="`height: calc(100vh - ${$vuetify.breakpoint.mdAndUp ? '112px' : '104px'}); overflow: auto`">
			<v-container style="max-width: 1185px" class="px-8 pt-0 mt-4">
				<MatchScoutingForm2022 :event="event" :match="match" />
			</v-container>
		</div>
	</div>
</template>

<script>
	import MatchScoutingForm2022 from "../../components/2022/MatchScoutingForm2022.vue";

	export default {
		name: "EventScoutingMatch",
		data() {
			return {
				event: false,
				match: false,

				comp_levelMap: {
					qm: "Qualifications",
					qf: "Quaterfinals",
					sf: "Semifinals",
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
						text: "",
					},
				];
			},
		},
		methods: {
			refresh() {
				this.$root.loading = true;
				this.$http.get(`/api/event/${this.$route.params.code.toLowerCase()}/schedule/${this.$route.query.match.toLowerCase()}`).then((response) => {
					this.event = response.data.event;
					this.match = response.data.match;
					this.$root.loading = false;
				});
			},
		},
		created() {
			this.refresh();
		},
		watch: {
			"$route.path"() {
				this.refresh();
			},
		},
		components: {
			MatchScoutingForm2022,
		},
	};
</script>

<style scoped></style>

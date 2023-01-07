<template>
	<div v-if="event && pitscouting">
		<v-toolbar dense color="grey darken-4" style="z-index: 1">
			<v-toolbar-title class="d-flex">
				<v-breadcrumbs v-if="$vuetify.breakpoint.smAndUp" :items="breadcrumbs" divider="/" class="pa-0 ma-0"></v-breadcrumbs>

				<h6 class="text-h6 font-weight-black">Pit Scouting</h6>
			</v-toolbar-title>
		</v-toolbar>

		<div :style="`height: calc(100vh - ${$vuetify.breakpoint.mdAndUp ? '112px' : '104px'}); overflow: auto`">
			<v-container style="max-width: 1185px" class="px-8 pt-0 mt-4">
				<PitScoutingForm2022 :pitscouting="pitscouting[team.key]" :event="event" :team="team" />
			</v-container>
		</div>
	</div>
</template>

<script>
	import PitScoutingForm2022 from "../../components/2022/PitScoutingForm2022.vue";

	export default {
		name: "EventScoutingPit",
		data() {
			return {
				event: false,
				team: false,
				pitscouting: false,
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
				this.$http.get(`/api/event/${this.$route.params.code.toLowerCase()}/teams/${this.$route.query.team}`).then((response) => {
					this.event = response.data.event;
					this.team = response.data.team;
					this.$http.get(`/api/scouting/schedule/${this.$route.params.code.toLowerCase()}`).then((response2) => {
						if (!response2.data.pitscouting) response2.data.pitscouting = {};
						this.pitscouting = response2.data.pitscouting;
						this.$root.loading = false;
					});
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
			PitScoutingForm2022,
		},
	};
</script>

<style scoped></style>

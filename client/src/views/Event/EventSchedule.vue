<template>
	<div v-if="event">
		<v-toolbar dense color="grey darken-4" style="z-index: 1">
			<v-toolbar-title class="d-flex">
				<v-breadcrumbs v-if="$vuetify.breakpoint.smAndUp" :items="breadcrumbs" divider="/" class="pa-0 ma-0"></v-breadcrumbs>

				<h6 class="text-h6 font-weight-black">Match Schedule</h6>
			</v-toolbar-title>

			<v-spacer></v-spacer>

			<EventNav :event="event" />
		</v-toolbar>

		<div :style="`height: calc(100vh - ${$vuetify.breakpoint.mdAndUp ? '112px' : '104px'}); overflow: auto`">
			<v-container style="max-width: 1185px" class="px-8 pt-0 mt-4">
				<v-card class="mt-6 mb-4">
					<MatchSchedule :schedule="event.schedule" :event="event" />
				</v-card>
			</v-container>
		</div>
	</div>
</template>

<script>
	import MatchSchedule from "../../components/MatchSchedule.vue";
	import EventNav from "../../components/EventNav.vue";

	export default {
		name: "EventSchedule",
		data() {
			return {
				event: false,
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
						disabled: false,
						exact: true,
						to: `/events/${this.event.year}${this.event.event_code.toUpperCase()}/schedule`,
					},
				];
			},
		},
		methods: {
			refresh() {
				this.$root.loading = true;
				this.$http.get(`/api/event/${this.$route.params.code.toLowerCase()}/schedule`).then((response) => {
					this.event = response.data;
					this.$root.loading = false;
				});
			},
		},
		created() {
			this.refresh();
		},
		components: {
			MatchSchedule,
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

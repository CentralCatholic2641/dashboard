<template>
	<div>
		<main v-if="$vuetify.breakpoint.mdAndUp">
			<v-btn exact text link :to="`/events/${event.key.toUpperCase()}`"><v-icon left>mdi-information-variant</v-icon>Info</v-btn>
			<v-btn text link :to="`/events/${event.key.toUpperCase()}/schedule`"><v-icon left>mdi-clock</v-icon>Schedule</v-btn>
			<v-btn text link :to="`/events/${event.key.toUpperCase()}/teams`"><v-icon left>mdi-account-group</v-icon>Teams</v-btn>
			<v-btn text link :to="`/events/${event.key.toUpperCase()}/scouting`"><v-icon left>mdi-binoculars</v-icon>Scouting</v-btn>
		</main>

		<v-menu v-else bottom offset-y>
			<template v-slot:activator="{ on, attrs }">
				<v-btn icon v-bind="attrs" v-on="on">
					<v-icon v-if="$route.path.includes('schedule')">mdi-clock</v-icon>
					<v-icon v-else-if="$route.path.includes('teams')">mdi-account-group</v-icon>
					<v-icon v-else-if="$route.path.includes('scouting')">mdi-binoculars</v-icon>
					<v-icon v-else>mdi-information-variant</v-icon>
				</v-btn>
			</template>

			<v-list dense>
				<p class="pt-2 px-4">{{ event.name }}</p>

				<v-list-item exact link :to="`/events/${event.key.toUpperCase()}`">
					<v-list-item-icon><v-icon>mdi-information-variant</v-icon></v-list-item-icon>
					<v-list-item-title>Information</v-list-item-title>
				</v-list-item>

				<v-list-item link :to="`/events/${event.key.toUpperCase()}/schedule`">
					<v-list-item-icon><v-icon>mdi-clock</v-icon></v-list-item-icon>
					<v-list-item-title>Schedule</v-list-item-title>
				</v-list-item>

				<v-list-item link :to="`/events/${event.key.toUpperCase()}/teams`">
					<v-list-item-icon><v-icon>mdi-account-group</v-icon></v-list-item-icon>
					<v-list-item-title>Teams</v-list-item-title>
				</v-list-item>

				<v-list-item link :to="`/events/${event.key.toUpperCase()}/scouting`">
					<v-list-item-icon><v-icon>mdi-binoculars</v-icon></v-list-item-icon>
					<v-list-item-title>Scouting</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
	</div>
</template>

<script>
	export default {
		name: "EventNav",
		props: ["event"],
	};
</script>

<style scoped></style>

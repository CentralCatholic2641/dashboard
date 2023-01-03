<template>
  <div>
    <v-toolbar dense color="grey darken-4" style="z-index: 1">
      <v-toolbar-title class="d-flex">
        <v-breadcrumbs
          v-if="$vuetify.breakpoint.smAndUp"
          :items="breadcrumbs"
          divider="/"
          class="pa-0 ma-0"
        ></v-breadcrumbs>

        <h6 class="text-h6 font-weight-black">Home</h6>
      </v-toolbar-title>
    </v-toolbar>

    <div
      :style="`height: calc(100vh - ${
        $vuetify.breakpoint.mdAndUp ? '112px' : '104px'
      }); overflow: auto`"
    >
      <v-container style="max-width: 1185px" class="px-8 pt-0 mt-6">
        <TeamCalendar />
      </v-container>
    </div>
  </div>
</template>

<script>
import TeamCalendar from "../components/TeamCalendar.vue";

export default {
  name: "Home",
  computed: {
    breadcrumbs() {
      return [
        {
          text: `FRC Team ${this.$root.config.team}`,
          disabled: true,
          to: "/",
        },
        {
          text: ``,
          disabled: true,
          to: "/",
        },
      ];
    },
  },
  components: {
    TeamCalendar,
  },
  created() {
    if (this.$root.config.event)
      this.$router.replace(
        `/events/${this.$root.config.currentEvent.toUpperCase()}`
      );
  },
};
</script>

<style scoped>
</style>
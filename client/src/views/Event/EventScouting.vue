<template>
  <div v-if="event && schedule && users">
    <v-toolbar dense color="grey darken-4" style="z-index: 1">
      <v-toolbar-title class="d-flex">
        <v-breadcrumbs
          v-if="$vuetify.breakpoint.smAndUp"
          :items="breadcrumbs"
          divider="/"
          class="pa-0 ma-0"
        ></v-breadcrumbs>

        <h6 class="text-h6 font-weight-black">Scouting</h6>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <EventNav :event="event" />
    </v-toolbar>

    <div
      :style="`height: calc(100vh - ${
        $vuetify.breakpoint.mdAndUp ? '112px' : '104px'
      }); overflow: auto`"
    >
      <v-container
        style="max-width: 1185px"
        class="px-8 pt-0 mt-4"
        v-if="event.schedule.length != 0"
      >
        <MatchScoutingController
          @refresh="refresh()"
          :event="event"
          :schedule="schedule"
          :users="users"
          v-if="$root.user.role > 1"
        />

        <MatchScoutingMember
          @refresh="refresh()"
          :event="event"
          :schedule="schedule"
          v-else
        />

        <PitScoutingController
          @refresh="refresh()"
          :event="event"
          :pitscouting="pitscouting"
          :users="users"
          v-if="$root.user.role > 1"
        />

        <PitScoutingMember
          @refresh="refresh()"
          :event="event"
          :pitscouting="pitscouting"
          v-else
        />

        <StatsByScouter
          @refresh="refresh()"
          :schedule="schedule"
          :pitscouting="pitscouting"
          :users="users"
          v-if="$root.user.role > 1"
          class="mb-3"
        />
      </v-container>

      <v-container style="max-width: 1185px" class="px-8 pt-0 mt-6" v-else>
        <v-card>
          <v-card-text>
            <p class="grey--text font-italic text-center mt-4">
              Scouting is not available for this competition
            </p>
          </v-card-text>
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script>
import MatchScoutingController from "../../components/MatchScoutingController.vue";
import MatchScoutingMember from "../../components/MatchScoutingMember.vue";
import PitScoutingController from "../../components/PitScoutingController.vue";
import PitScoutingMember from "../../components/PitScoutingMember.vue";
import StatsByScouter from "../../components/StatsByScouter.vue";
import EventNav from "../../components/EventNav.vue";

export default {
  name: "EventScouting",
  data() {
    return {
      event: false,
      schedule: false,
      pitscouting: false,
      users: false,
      Object,
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
          to: `/events/${
            this.event.year
          }${this.event.event_code.toUpperCase()}`,
        },
        {
          text: "",
          disabled: true,
          to: `/events/${
            this.event.year
          }${this.event.event_code.toUpperCase()}/scouting`,
        },
      ];
    },
  },
  methods: {
    refresh() {
      this.$root.loading = true;
      this.$http
        .get(`/api/event/${this.$route.params.code.toLowerCase()}/schedule`)
        .then((response) => {
          this.event = response.data;
          this.$http
            .get(
              `/api/scouting/schedule/${this.$route.params.code.toLowerCase()}`
            )
            .then((response2) => {
              if (!response2.data.matches) response2.data.matches = {};
              this.schedule = response2.data.matches;
              if (!response2.data.pitscouting) response2.data.pitscouting = {};
              this.pitscouting = response2.data.pitscouting;
              this.users = response2.data.users;
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
      this.$forceUpdate();
    },
  },
  components: {
    MatchScoutingController,
    MatchScoutingMember,
    PitScoutingController,
    PitScoutingMember,
    StatsByScouter,
    EventNav,
  },
};
</script>

<style scoped>
</style>
<template>
  <div v-if="team">
    <v-toolbar dense color="grey darken-4" style="z-index: 1">
      <v-toolbar-title class="d-flex">
        <v-breadcrumbs
          v-if="$vuetify.breakpoint.smAndUp"
          :items="breadcrumbs"
          divider="/"
          class="pa-0 ma-0"
        ></v-breadcrumbs>

        <h6 class="text-h6 font-weight-black">
          {{ team.team_number }}.
          <span class="font-weight-light">{{ team.nickname }}</span>
        </h6>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <EventNav :event="event" />
    </v-toolbar>

    <div
      :style="`height: calc(100vh - ${
        $vuetify.breakpoint.mdAndUp ? '112px' : '104px'
      }); overflow: auto`"
    >
      <v-container style="max-width: 1700px" class="px-8 pt-0 mt-4">
        <v-row class="mt-4">
          <v-col cols="12" md="6" style="display: flex; flex-direction: column">
            <TeamRankings2022 :team="team" />

            <TeamPitScoutingData2022 :team="team" />
          </v-col>

          <v-col cols="12" md="6" style="display: flex; flex-direction: column">
            <TeamBasicInfo :event="event" :team="team" />

            <MatchScoutingOverview2022 :team="team" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <MatchSchedule :schedule="team.schedule" :event="event" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <DetailedMatchScouting2022 :team="team" :event="event" />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import MatchSchedule from "../../components/MatchSchedule.vue";
import TeamBasicInfo from "../../components/TeamBasicInfo.vue";
import MatchScoutingOverview2022 from "../../components/2022/MatchScoutingOverview2022.vue";
import TeamRankings2022 from "../../components/2022/TeamRankings2022.vue";
import DetailedMatchScouting2022 from "../../components/2022/DetailedMatchScouting2022.vue";
import TeamPitScoutingData2022 from "../../components/2022/TeamPitScoutingData2022.vue";
import EventNav from "../../components/EventNav.vue";

export default {
  name: "EventTeam",
  data() {
    return {
      event: false,
      team: false,

      comp_levelMap: {
        qm: "QM",
        qf: "QF",
        sf: "SF",
        f: "F",
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
          to: `/events/${
            this.event.year
          }${this.event.event_code.toUpperCase()}`,
        },
        {
          text: "Teams",
          disabled: false,
          exact: true,
          to: `/events/${
            this.event.year
          }${this.event.event_code.toUpperCase()}/teams`,
        },
        {
          text: "",
          disabled: true,
          to: `/events/${
            this.event.year
          }${this.event.event_code.toUpperCase()}/teams/${
            this.team.team_number
          }`,
        },
      ];
    },
  },
  methods: {
    refresh() {
      this.$root.loading = true;
      this.$http
        .get(
          `/api/event/${this.$route.params.code.toLowerCase()}/teams/${
            this.$route.params.team
          }`
        )
        .then((response) => {
          this.event = response.data.event;
          this.team = response.data.team;
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
    MatchSchedule,
    TeamBasicInfo,
    TeamRankings2022,
    MatchScoutingOverview2022,
    DetailedMatchScouting2022,
    TeamPitScoutingData2022,
    EventNav,
  },
  watch: {
    "$route.path"() {
      this.refresh();
    },
  },
};
</script>

<style scoped>
.v-card__text {
  color: white !important;
}
</style>
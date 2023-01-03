<template>
  <div v-if="event">
    <v-toolbar dense color="grey darken-4" style="z-index: 1">
      <v-toolbar-title class="d-flex">
        <v-breadcrumbs
          v-if="$vuetify.breakpoint.smAndUp"
          :items="breadcrumbs"
          divider="/"
          class="pa-0 ma-0"
        ></v-breadcrumbs>

        <h6 class="text-h6 font-weight-black">Teams</h6>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <EventNav :event="event" />
    </v-toolbar>

    <div
      :style="`height: calc(100vh - ${
        $vuetify.breakpoint.mdAndUp ? '112px' : '104px'
      }); overflow: auto`"
    >
      <v-container style="max-width: 1185px" class="px-8 pt-0 mt-4">
        <v-card class="mt-6 mb-4">
          <v-simple-table dense style="white-space: nowrap">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">#</th>
                  <th class="text-left">Name</th>
                  <th class="text-left">Rank</th>
                  <th class="text-left">Score</th>
                  <th class="text-left">RPs</th>
                  <th class="text-left">Avg</th>
                  <th class="text-left">Record</th>
                  <th class="text-left">DQ</th>
                  <th class="text-left">Played</th>
                  <th class="text-left">OPR</th>
                  <th class="text-left">DPR</th>
                  <th class="text-left">CCWM</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-ripple
                  style="cursor: pointer"
                  @click="
                    $router.push(
                      `/events/${
                        event.year
                      }${event.event_code.toUpperCase()}/teams/${
                        team.team_number
                      }`
                    )
                  "
                  v-for="team in event.teams"
                  :key="team.team_number"
                >
                  <td class="font-weight-black">{{ team.team_number }}</td>
                  <td>{{ team.nickname }}</td>
                  <td v-if="team.rankings">{{ team.rankings.rank }}</td>
                  <td v-else>-</td>
                  <td v-if="team.rankings">
                    {{ team.rankings.sort_orders[0] }}
                  </td>
                  <td v-else>-</td>
                  <td v-if="team.rankings">
                    {{ team.rankings.extra_stats[0] }}
                  </td>
                  <td v-else>-</td>
                  <td v-if="team.rankings">
                    {{ team.rankings.sort_orders[1] }}
                  </td>
                  <td v-else>-</td>
                  <td v-if="team.rankings">
                    {{ team.rankings.record.wins }} -
                    {{ team.rankings.record.losses }} -
                    {{ team.rankings.record.ties }}
                  </td>
                  <td v-else>-</td>
                  <td v-if="team.rankings">{{ team.rankings.dq }}</td>
                  <td v-else>-</td>
                  <td v-if="team.rankings">
                    {{ team.rankings.matches_played }}
                  </td>
                  <td v-else>-</td>
                  <td v-if="event.opr_data">
                    {{ event.opr_data.oprs[team.key].toFixed(1) }}
                  </td>
                  <td v-else>-</td>
                  <td v-if="event.opr_data">
                    {{ event.opr_data.dprs[team.key].toFixed(1) }}
                  </td>
                  <td v-else>-</td>
                  <td v-if="event.opr_data">
                    {{ event.opr_data.ccwms[team.key].toFixed(1) }}
                  </td>
                  <td v-else>-</td>
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
import EventNav from "../../components/EventNav.vue";

export default {
  name: "EventTeams",
  data() {
    return {
      event: false,

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
          to: `/events/${
            this.event.year
          }${this.event.event_code.toUpperCase()}`,
        },
        {
          text: "",
          disabled: true,
          to: `/events/${
            this.event.year
          }${this.event.event_code.toUpperCase()}/teams`,
        },
      ];
    },
  },
  methods: {
    refresh() {
      this.$root.loading = true;
      this.$http
        .get(`/api/event/${this.$route.params.code.toLowerCase()}/teams`)
        .then((response) => {
          this.event = response.data;
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
    EventNav,
  },
};
</script>

<style scoped>
</style>
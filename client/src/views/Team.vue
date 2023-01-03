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

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="mr-2" :input-value="true" v-bind="attrs" v-on="on" text
            >{{ season }}<v-icon right>mdi-clock</v-icon></v-btn
          >
        </template>
        <v-list dense style="max-height: 500px; overflow: auto">
          <v-list-item-group v-model="season" mandatory>
            <v-list-item v-for="year in years" :key="year" :value="year">
              <v-list-item-title>{{ year }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-toolbar>

    <div
      :style="`height: calc(100vh - ${
        $vuetify.breakpoint.mdAndUp ? '112px' : '104px'
      }); overflow: auto`"
    >
      <v-container style="max-width: 1185px" class="px-8 pt-0 mt-7">
        <v-row>
          <v-col cols="12" md="8">
            <v-card class="mb-6">
              <v-card-title class="text-h5">Basic Information</v-card-title>

              <v-card-text class="mt-0 pt-0 white--text">
                <table>
                  <tr>
                    <td style="width: 100px" class="font-weight-black">
                      Location
                    </td>
                    <td>
                      {{ team.city }}, {{ team.state_prov }}, {{ team.country }}
                    </td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">
                      Sponsors
                    </td>
                    <td>{{ team.name }}</td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">
                      Rookie Year
                    </td>
                    <td>
                      {{ team.rookie_year }} (Season
                      {{ $root.config.year - team.rookie_year }})
                    </td>
                  </tr>
                </table>
              </v-card-text>
            </v-card>

            <v-card
              link
              :to="`/events/${event.key.toUpperCase()}/teams/${
                team.team_number
              }`"
              style="cursor: pointer"
              v-for="event in team.events"
              :key="event.key"
              class="mb-6"
            >
              <div class="pt-4 px-4 d-flex">
                <h5 class="text-h5" style="white-space: normal">
                  {{ event.name }}
                </h5>
                <v-spacer></v-spacer>
                <v-icon>mdi-chevron-right</v-icon>
              </div>
              <v-card-subtitle>
                <p class="ma-0 pa-0">
                  {{ event.city }}, {{ event.state_prov }},
                  {{ event.country }}
                </p>
                <p class="ma-0 pa-0">
                  {{ dayjs(event.start_date).format("MMMM D") }} to
                  {{ dayjs(event.end_date).format("MMMM D, YYYY") }}
                </p>
              </v-card-subtitle>

              <v-card-text class="white--text" v-if="team.statuses[event.key]">
                <p
                  class="ma-0 pa-0"
                  v-html="team.statuses[event.key].overall_status_str"
                ></p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-list dense class="transparent mt-3">
              <v-list-item
                class="blue--text"
                :href="team.website"
                target="_blank"
                v-if="team.website"
              >
                <v-list-item-icon
                  ><v-icon left class="blue--text"
                    >mdi-link</v-icon
                  ></v-list-item-icon
                >
                <v-list-item-title>{{ team.website }}</v-list-item-title>
              </v-list-item>

              <div
                v-for="(social, index) in team.social"
                :key="index"
                link
                :to="`/`"
              >
                <v-list-item
                  :href="`https://github.com/${social.foreign_key}`"
                  target="_blank"
                  v-if="social.type == 'github-profile'"
                >
                  <v-list-item-icon
                    ><v-icon left>mdi-github</v-icon></v-list-item-icon
                  >
                  <v-list-item-title>{{
                    social.foreign_key
                  }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  class="pink--text text--lighten-1"
                  :href="`https://instagram.com/${social.foreign_key}`"
                  target="_blank"
                  v-if="social.type == 'instagram-profile'"
                >
                  <v-list-item-icon
                    ><v-icon left class="pink--text text--lighten-1"
                      >mdi-instagram</v-icon
                    ></v-list-item-icon
                  >
                  <v-list-item-title>{{
                    social.foreign_key
                  }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  class="red--text"
                  :href="`https://www.youtube.com/${social.foreign_key}`"
                  target="_blank"
                  v-if="social.type == 'youtube-channel'"
                >
                  <v-list-item-icon
                    ><v-icon left class="red--text"
                      >mdi-youtube</v-icon
                    ></v-list-item-icon
                  >
                  <v-list-item-title>{{
                    social.foreign_key
                  }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  class="light-blue--text"
                  :href="`https://www.twitter.com/${social.foreign_key}`"
                  target="_blank"
                  v-if="social.type == 'twitter-profile'"
                >
                  <v-list-item-icon
                    ><v-icon left class="light-blue--text"
                      >mdi-twitter</v-icon
                    ></v-list-item-icon
                  >
                  <v-list-item-title>{{
                    social.foreign_key
                  }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  class="blue--text text--darken-3"
                  :href="`https://www.facebook.com/${social.foreign_key}`"
                  target="_blank"
                  v-if="social.type == 'facebook-profile'"
                >
                  <v-list-item-icon
                    ><v-icon left class="blue--text text--darken-3"
                      >mdi-facebook</v-icon
                    ></v-list-item-icon
                  >
                  <v-list-item-title>{{
                    social.foreign_key
                  }}</v-list-item-title>
                </v-list-item>
              </div>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "Team",
  data() {
    return {
      team: false,
      dayjs,
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
          text: "Teams",
          disabled: false,
          exact: true,
          to: "/teams",
        },
        {
          text: "",
          disabled: true,
          to: `/teams/${this.team.team_number}`,
        },
      ];
    },
    years() {
      let data = [];

      for (
        let i = new Date().getFullYear() - this.team.rookie_year;
        i >= 0;
        i--
      ) {
        data.push(this.team.rookie_year + i);
      }

      return data;
    },
  },
  methods: {
    refresh() {
      this.$root.loading = true;
      this.$http
        .get(`/api/team/frc${this.$route.params.team}?season=${this.season}`)
        .then((response) => {
          this.team = response.data;
          this.$root.loading = false;
        });
    },
  },
  created() {
    this.season = this.$root.config.year;
    this.refresh();
  },
  watch: {
    season() {
      this.refresh();
    },
  },
};
</script>

<style scoped>
</style>
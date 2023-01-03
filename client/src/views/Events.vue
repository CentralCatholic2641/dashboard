<template>
  <div v-if="weeks">
    <v-toolbar dense color="grey darken-4" style="z-index: 1">
      <v-toolbar-title class="d-flex">
        <v-breadcrumbs
          v-if="$vuetify.breakpoint.smAndUp"
          :items="breadcrumbs"
          divider="/"
          class="pa-0 ma-0"
        ></v-breadcrumbs>

        <h6 class="text-h6 font-weight-black">Events</h6>
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
        <v-card v-for="(week, key) of weeks" :key="key" class="mb-6">
          <v-card-title>
            <h5 class="text-h5" v-if="key == 'champ'">FIRST Championship</h5>
            <h5 class="text-h5" v-else-if="key == 'pre'">Pre-Season</h5>
            <h5 class="text-h5" v-else-if="key == 'post'">Off-Season</h5>
            <h5 class="text-h5" v-else>Week {{ key }}</h5>
          </v-card-title>

          <v-simple-table class="transparent" dense style="white-space: nowrap">
            <template v-slot:default>
              <thead>
                <tr>
                  <th style="width: 120px" class="text-left"></th>
                  <th style="width: 560px" class="text-left">Event</th>
                  <th class="text-left">Location</th>
                  <th style="width: 175px" class="text-left">Start</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-ripple
                  style="cursor: pointer"
                  v-for="event in week"
                  :key="event.key"
                  @click="
                    $router.push(
                      `/events/${season}${event.event_code.toUpperCase()}`
                    )
                  "
                >
                  <td>
                    {{ event.event_code.toUpperCase() }}
                  </td>
                  <td class="font-weight-black">
                    {{ event.name }}
                  </td>
                  <td>
                    {{ event.city }}, {{ event.state_prov }},
                    {{ event.country }}
                  </td>
                  <td>
                    {{ dayjs(event.start_date).format("ddd, MMM D, YYYY") }}
                  </td>
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
import dayjs from "dayjs";

export default {
  name: "Events",
  data() {
    return {
      weeks: false,
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
          text: "",
          disabled: true,
          to: "/events",
        },
      ];
    },
    years() {
      let data = [];

      for (let i = new Date().getFullYear() - 1991; i > 0; i--) {
        data.push(1991 + i);
      }

      return data;
    },
  },
  methods: {
    refresh() {
      this.$root.loading = true;
      this.$http.get(`/api/event?season=${this.season}`).then((response) => {
        this.weeks = response.data;
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
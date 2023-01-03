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

        <h6
          class="text-h6 font-weight-black"
          v-if="$vuetify.breakpoint.mdAndUp"
        >
          {{ event.year }} {{ event.name }}
        </h6>

        <h6 class="text-h6 font-weight-black" v-else>Information</h6>
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
        style="max-width: 1500px"
        class="px-8 pt-0 mt-4"
        v-if="isActive"
      >
        <v-row class="mt-4" v-if="event.event_type != 4">
          <v-col cols="12" md="6">
            <EventQualResults :event="event" />
          </v-col>

          <v-col cols="12" md="6">
            <EventBasicInfo class="mb-6" :event="event" />

            <EventPlayoffResults class="mb-6" :event="event" />

            <EventAlliances class="mb-6" :event="event" />

            <EventRanking :event="event" />
          </v-col>
        </v-row>

        <v-row class="mt-4" v-else>
          <v-col cols="12" md="6">
            <EventPlayoffResults class="mb-6" :event="event" />
          </v-col>

          <v-col cols="12" md="6">
            <EventBasicInfo class="mb-6" :event="event" />

            <EventAlliances :event="event" />
          </v-col>
        </v-row>
      </v-container>

      <v-container class="px-8 pt-0 mt-4" v-else>
        <v-row class="mt-4">
          <v-col cols="12" md="6">
            <p class="font-italic grey--text mt-8 mb-8 pa-0 text-center">
              This event has not started yet
            </p>
          </v-col>

          <v-col cols="12" md="6">
            <EventBasicInfo class="mb-6" :event="event" />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import EventRanking from "../../components/EventRanking.vue";
import EventQualResults from "../../components/EventQualResults.vue";
import EventBasicInfo from "../../components/EventBasicInfo.vue";
import EventPlayoffResults from "../../components/EventPlayoffResults.vue";
import EventAlliances from "../../components/EventAlliances.vue";
import EventNav from "../../components/EventNav.vue";
import dayjs from "dayjs";

export default {
  name: "Event",
  data() {
    return {
      event: false,

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
          text: "",
          disabled: true,
          to: `/events/${
            this.event.year
          }${this.event.event_code.toUpperCase()}`,
        },
      ];
    },
    isActive() {
      return dayjs().isAfter(dayjs(this.event.start_date));
    },
  },
  methods: {
    refresh() {
      this.$root.loading = true;
      this.$http
        .get(`/api/event/${this.$route.params.code.toLowerCase()}`)
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
    EventRanking,
    EventQualResults,
    EventBasicInfo,
    EventPlayoffResults,
    EventAlliances,
    EventNav,
  },
};
</script>

<style scoped>
</style>
<template>
  <v-card>
    <v-row class="fill-height ma-0 pa-0">
      <v-col class="ma-0 pa-0">
        <v-toolbar flat class="transparent">
          <h5 class="text-h5">Team Calendar</h5>
          <v-spacer></v-spacer>
          <div
            class="d-flex"
            style="align-items: center"
            v-if="$vuetify.breakpoint.mdAndUp"
          >
            <v-toolbar-title class="mr-3" v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-btn fab text small @click="prev">
              <v-icon> mdi-chevron-left </v-icon>
            </v-btn>
            <v-btn fab text small @click="next">
              <v-icon> mdi-chevron-right </v-icon>
            </v-btn>
            <v-btn
              :disabled="focus == ''"
              outlined
              class="ml-4"
              @click="setToday"
            >
              Today
            </v-btn>
          </div>
        </v-toolbar>

        <v-sheet height="575">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            type="month"
            @click:event="showEvent"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card width="350px" flat>
              <h5 class="text-h5 pt-4 px-4" style="white-space: normal">
                {{ selectedEvent.name }}
              </h5>

              <v-card-text>
                <p class="ma-0 pa-0">{{ selectedEvent.details }}</p>
                <p
                  class="mb-0 mt-2 pa-0 font-italic"
                  v-if="selectedEvent.color == '#DC2626'"
                >
                  Bonus meeting
                </p>
              </v-card-text>

              <v-card-actions v-if="$root.user.role > 2">
                <v-btn
                  color="primary"
                  link
                  :to="`/meetings/${selectedEvent._id}`"
                  >Open<v-icon right>mdi-arrow-right</v-icon></v-btn
                >
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "TeamCalendar",
  data() {
    return {
      meetings: false,
      focus: "",
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
    };
  },
  methods: {
    refresh() {
      this.$http.get("/api/calendar").then((response) => {
        this.meetings = response.data;

        for (let i of this.meetings) {
          this.events.push({
            name: i.name,
            start: dayjs(`${i.date}T${i.start}`).valueOf(),
            end: dayjs(`${i.date}T${i.end}`).valueOf(),
            color: i.bonus ? "#DC2626" : "#1E3A8A",
            timed: true,
            details:
              dayjs(`${i.date}`).format("ddd, MMM D, YYYY") +
              " at " +
              i.start +
              " to " +
              i.end,
            _id: i._id,
          });
        }

        this.$refs.calendar.checkChange();
      });
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
  },
  created() {
    this.refresh();
  },
  mounted() {},
};
</script>

<style>
.theme--dark.v-calendar-weekly .v-calendar-weekly__head-weekday {
  border-right: 0px !important;
  border-bottom: #121212 1px solid !important;
  padding: 6px 0px !important;
  background-color: #1e1e1e !important;
}

.theme--dark.v-calendar-weekly:not(.v-outside)
  .v-calendar-weekly__day:not(.v-outside) {
  border-right: #121212 1px solid !important;
  border-bottom: #121212 1px solid !important;
}

.theme--dark.v-calendar-weekly {
  border-top: 0px !important;
  border-left: 0px !important;
}

.theme--dark.v-calendar-weekly .v-calendar-weekly__day.v-outside {
  background-color: #1e1e1e !important;
  border-right: #1e1e1e 1px solid !important;
  border-bottom: #121212 1px solid !important;
}

.theme--dark.v-calendar-weekly .v-calendar-weekly__head-weekday.v-outside {
  background-color: #1e1e1e !important;
}

.v-calendar .v-event {
  margin-left: 4px !important;
}
</style>
<template>
  <div v-if="meetings">
    <v-toolbar dense color="grey darken-4" style="z-index: 1">
      <v-toolbar-title class="d-flex">
        <v-breadcrumbs
          v-if="$vuetify.breakpoint.smAndUp"
          :items="breadcrumbs"
          divider="/"
          class="pa-0 ma-0"
        ></v-breadcrumbs>

        <h6 class="text-h6 font-weight-black">Meetings</h6>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn color="primary" @click="create = true"
        ><v-icon left>mdi-plus</v-icon>New</v-btn
      >
    </v-toolbar>

    <div
      :style="`height: calc(100vh - ${
        $vuetify.breakpoint.mdAndUp ? '112px' : '104px'
      }); overflow: auto`"
    >
      <v-container style="max-width: 1185px" class="px-8 pt-0 mt-4">
        <v-card class="mt-6" v-if="meetings.length != 0">
          <v-simple-table class="transparent" dense style="white-space: nowrap">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Date</th>
                  <th class="text-left">Start</th>
                  <th class="text-left">End</th>
                  <th class="text-left">Hours</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-ripple
                  style="cursor: pointer"
                  v-for="meeting in meetings"
                  :key="meeting._id"
                  @click="$router.push(`/meetings/${meeting._id}`)"
                  :class="{
                    'grey--text font-italic': hasNotHappened(meeting._id),
                  }"
                >
                  <td class="font-weight-black">{{ meeting.name }}</td>
                  <td>
                    {{ dayjs(meeting.date).format("ddd, MMM D, YYYY") }}
                  </td>
                  <td>{{ meeting.start }}</td>
                  <td>{{ meeting.end }}</td>
                  <td>
                    {{ meeting.bonus ? "+" : ""
                    }}{{
                      dayjs(`${meeting.date}T${meeting.end}`)
                        .diff(`${meeting.date}T${meeting.start}`, "hour", true)
                        .toFixed(2)
                    }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>

        <p class="font-italic grey--text text-center mt-12" v-else>
          No meetings
        </p>

        <p v-if="meetings.length > 0" class="pb-0 mt-4 mb-1 grey--text">
          {{ meetings.length }} meetings
        </p>
      </v-container>
    </div>

    <v-dialog v-model="create" max-width="500px">
      <NewMeetingWizard @close="(create = false), refresh()" />
    </v-dialog>
  </div>
</template>

<script>
import NewMeetingWizard from "../components/NewMeetingWizard.vue";
import dayjs from "dayjs";

export default {
  name: "Meetings",
  data() {
    return {
      meetings: false,
      create: false,
      dayjs,
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
          to: "/meetings",
        },
      ];
    },
  },
  methods: {
    refresh() {
      if (this.$root.user.role > 2) {
        this.$root.loading = true;
        this.$http.get("/api/meeting").then((response) => {
          this.meetings = response.data;
          this.$root.loading = false;
        });
      } else this.$router.replace("/");
    },
    hasNotHappened(meeting) {
      const data = this.meetings.find((i) => i._id == meeting);
      return dayjs().isBefore(`${data.date}T${data.start}`);
    },
  },
  created() {
    this.refresh();
  },
  components: {
    NewMeetingWizard,
  },
};
</script>

<style scoped>
</style>
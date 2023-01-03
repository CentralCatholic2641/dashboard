<template>
  <div>
    <v-card class="my-6">
      <v-card-title
        class="text-h5"
        @click.self="visible = !visible"
        v-ripple
        style="cursor: pointer"
      >
        <h5 @click.self="visible = !visible" class="text-h5">
          Pit Scouting Assignments
        </h5>
        <v-spacer></v-spacer>
        <v-btn
          @click="autoOpen = true"
          v-if="$root.user.role > 2 && visible"
          color="primary"
          ><v-icon left>mdi-auto-fix</v-icon>Generate</v-btn
        >
        <v-icon size="30" class="ml-4">{{
          visible ? "mdi-chevron-up" : "mdi-chevron-down"
        }}</v-icon>
      </v-card-title>

      <v-simple-table dense v-if="visible">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Team</th>
              <th class="text-left">Assigned to</th>
              <th class="text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="team in teams"
              :key="team.key"
              v-ripple
              style="cursor: pointer"
              @click="
                change = {
                  team: team.key,
                  open: true,
                  to: scoutingData[team.key].assigned,
                }
              "
            >
              <td
                v-ripple
                style="cursor: pointer"
                @click="
                  $router.push(
                    `/events/${event.key.toUpperCase()}/teams/${team.key.substring(
                      3
                    )}`
                  )
                "
                class="font-weight-black"
              >
                {{ team.key.substring(3) }}
              </td>

              <td>
                {{
                  scoutingData[team.key].unassigned
                    ? "-"
                    : scoutingData[team.key].assignedName
                }}
              </td>

              <td
                :class="{
                  'font-weight-black grey--text text--darken-1 font-italic':
                    scoutingData[team.key].unassigned,
                  'red--text':
                    !scoutingData[team.key].unassigned &&
                    !scoutingData[team.key].submitted,
                  'green--text': scoutingData[team.key].submitted,
                }"
              >
                {{
                  scoutingData[team.key].unassigned
                    ? "Unassigned"
                    : scoutingData[team.key].submitted
                    ? "Submitted"
                    : "Not Submitted"
                }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <v-dialog v-model="change.open" v-if="change.open" max-width="400px">
      <v-card>
        <v-card-title
          ><h4 class="text-h4 font-weight-black mt-1">
            TEAM {{ change.team.substring(3) }}
          </h4></v-card-title
        >

        <v-card-text>
          <v-select
            label="Assigned to..."
            v-model="change.to"
            :items="reassignOptions"
            hide-details
          ></v-select>

          <v-btn class="mt-8" color="secondary" block @click="openForm()"
            >Open Form<v-icon right>mdi-arrow-top-right</v-icon></v-btn
          >
        </v-card-text>

        <v-card-actions>
          <v-btn color="grey" icon @click="deleteScoutingData()"
            ><v-icon>mdi-delete</v-icon></v-btn
          >
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="changeAssignment()"
            ><v-icon left>mdi-content-save</v-icon>Save</v-btn
          >
        </v-card-actions>

        <v-btn
          style="position: absolute; top: 8px; right: 8px"
          @click="change = { open: false }"
          fab
          top
          right
          elevation="0"
          class="transparent"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-card>
    </v-dialog>

    <v-dialog scrollable v-model="autoOpen" v-if="auto" max-width="500px">
      <v-card>
        <v-card-title
          ><h4 class="text-h4 font-weight-black mt-1">
            GENERATE
          </h4></v-card-title
        >

        <v-card-text>
          <v-checkbox
            v-for="(value, key) in auto"
            :key="key"
            v-model="auto[key]"
            :label="autoEnum[key]"
            hide-details
            dense
          ></v-checkbox>

          <p class="red--text text-center mt-3 mb-0 pb-0">
            Warning! This will overwrite any existing pit scouting assignments.
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="autoAssign()">Go</v-btn>
        </v-card-actions>

        <v-btn
          style="position: absolute; top: 8px; right: 8px"
          @click="autoOpen = false"
          fab
          top
          right
          elevation="0"
          class="transparent"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
dayjs.extend(isBetween);

export default {
  name: "PitScoutingController",
  props: ["event", "pitscouting", "users"],
  data() {
    return {
      change: {
        open: false,
      },
      auto: false,
      autoEnum: false,
      autoOpen: false,
      autoCount: 0,
      teams: false,
      visible: true,
      scoutingData: {},

      comp_levelMap: {
        qm: "Quals",
        qf: "Quarters",
        sf: "Semis",
        f: "Finals",
      },
    };
  },
  computed: {
    reassignOptions() {
      let users = [
        {
          text: "Unassign",
          value: "",
        },
      ];
      for (let user of this.users.filter((i) => i.includeInScouting)) {
        users.push({
          text: user.name,
          value: user.username,
        });
      }
      return users;
    },
  },
  methods: {
    refresh() {
      this.auto = {};
      this.autoEnum = {};
      this.change = {
        open: false,
      };

      for (let user of this.users.filter((i) => i.includeInScouting)) {
        if (this.users.filter((i) => i.includeInScouting).indexOf(user) < 6) {
          this.auto[user.username] = true;
          this.autoEnum[user.username] = user.name;
        } else {
          this.auto[user.username] = false;
          this.autoEnum[user.username] = user.name;
        }
      }

      this.autoCount = 0;
      for (let scouter in this.auto) {
        if (this.auto[scouter] === true) this.autoCount++;
      }

      this.$http
        .get(`/api/event/${this.event.key}/teams/short`)
        .then((response) => {
          this.teams = response.data.teams;
          let data = {};

          for (let team of this.teams) {
            console.log(team);
            let scout = this.pitscouting[team.key];
            if (scout) {
              if (scout.assigned.length != 0) {
                data[team.key] = scout;
              } else
                data[team.key] = {
                  ...scout,
                  unassigned: true,
                };
            } else {
              data[team.key] = {
                assigned: false,
                assignedName: "",
                submitted: false,
                unassigned: true,
              };
            }
          }

          this.scoutingData = data;
        });
    },
    deleteScoutingData() {
      this.$http
        .delete(`/api/scouting/pit/${this.event.key}?team=${this.change.team}`)
        .then(() => {
          this.$emit("refresh");
        });
    },
    openForm() {
      this.$router.push(
        `/events/${this.event.key.toUpperCase()}/scouting/pit?team=${this.change.team.substring(
          3
        )}`
      );
    },
    autoAssign() {
      this.$http
        .post(`/api/scouting/genpit/${this.event.key}`, this.auto)
        .then(() => {
          this.$emit("refresh");
          this.autoOpen = false;
        });
    },
    changeAssignment() {
      this.$http
        .post(`/api/scouting/pitscouting/${this.event.key}`, this.change)
        .then(() => {
          this.$emit("refresh");
          this.change = { open: false };
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
};
</script>

<style>
</style>
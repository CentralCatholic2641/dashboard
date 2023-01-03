<template>
  <div v-if="match">
    <v-container class="mt-4" style="max-width: 400px" v-if="inThisMatch">
      <section class="text-center">
        <p>
          <span class="font-weight-black">Match: </span>
          <span v-if="match.comp_level != 'f' && match.comp_level != 'qm'">
            {{ comp_levelMap[match.comp_level] }}
            {{ match.set_number }} Match
            {{ match.match_number }}
          </span>
          <span v-else>
            {{ comp_levelMap[match.comp_level] }}
            {{ match.match_number }}
          </span>
        </p>

        <p>
          <span class="font-weight-black">Time: </span>
          <span>
            {{ matchStart }}
          </span>
        </p>

        <p>
          <span class="font-weight-black">Team: </span>
          <span>
            {{ $route.query.team }}
          </span>
        </p>

        <p>
          <span class="font-weight-black">Station: </span>
          <span
            :class="{
              'red--text': station.includes('Red'),
              'blue--text': station.includes('Blue'),
            }"
          >
            {{ station }}
          </span>
        </p>
      </section>

      <section v-if="data.team">
        <div class="text-center">
          <div v-if="match.alliances.red.score && match.alliances.blue.score">
            <h2 class="text-h2 mt-6 mb-5">
              <span
                class="red--text"
                :class="{
                  'font-weight-bold':
                    match.alliances.red.score > match.alliances.blue.score,
                }"
                >{{ match.alliances.red.score }}</span
              >
              -
              <span
                class="blue--text"
                :class="{
                  'font-weight-bold':
                    match.alliances.blue.score > match.alliances.red.score,
                }"
                >{{ match.alliances.blue.score }}</span
              >
            </h2>
            <p
              class="font-italic"
              v-if="match.alliances.blue.score != match.alliances.red.score"
              :class="
                match.alliances.blue.score > match.alliances.red.score
                  ? 'blue--text'
                  : 'red--text'
              "
            >
              The
              {{
                match.alliances.blue.score > match.alliances.red.score
                  ? "blue"
                  : "red"
              }}
              alliance won this match.
            </p>
            <p class="font-italic purple--text text--lighten-2" v-else>
              This match resulted in a tie.
            </p>
          </div>
          <p v-else class="grey--text font-italic mb-5">Scores not posted</p>
        </div>

        <v-divider v-if="data.team"></v-divider>

        <div v-if="data.team" class="my-4">
          <h5 class="text-h5">AUTONOMOUS</h5>
          <v-checkbox
            :disabled="!data.match"
            v-model="data.auto.taxied"
            label="Taxied?"
          ></v-checkbox>

          <v-row>
            <v-col cols="6">
              <div class="text-center">
                <p>Upper Cargo Scored</p>
                <v-btn color="secondary" large @click="data.auto.upperScored++"
                  >+1
                </v-btn>
                <p class="my-4 font-weight-black">
                  {{ data.auto.upperScored }}
                </p>
                <v-btn
                  :disabled="data.auto.upperScored == 0"
                  color="primary"
                  large
                  @click="data.auto.upperScored--"
                  >-1
                </v-btn>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-center">
                <p>Upper Cargo Missed</p>
                <v-btn color="secondary" large @click="data.auto.upperMissed++"
                  >+1
                </v-btn>
                <p class="my-4 font-weight-black">
                  {{ data.auto.upperMissed }}
                </p>
                <v-btn
                  :disabled="data.auto.upperMissed == 0"
                  color="primary"
                  large
                  @click="data.auto.upperMissed--"
                  >-1
                </v-btn>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <div class="text-center">
                <p>Lower Cargo Scored</p>
                <v-btn color="secondary" large @click="data.auto.lowerScored++"
                  >+1
                </v-btn>
                <p class="my-4 font-weight-black">
                  {{ data.auto.lowerScored }}
                </p>
                <v-btn
                  :disabled="data.auto.lowerScored == 0"
                  color="primary"
                  large
                  @click="data.auto.lowerScored--"
                  >-1
                </v-btn>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-center">
                <p>Lower Cargo Missed</p>
                <v-btn color="secondary" large @click="data.auto.lowerMissed++"
                  >+1
                </v-btn>
                <p class="my-4 font-weight-black">
                  {{ data.auto.lowerMissed }}
                </p>
                <v-btn
                  :disabled="data.auto.lowerMissed == 0"
                  color="primary"
                  large
                  @click="data.auto.lowerMissed--"
                  >-1
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </div>

        <v-divider v-if="data.team"></v-divider>

        <div class="mt-4" v-if="data.team">
          <h5 class="text-h5 mb-4">TELEOPERATED</h5>
          <v-row>
            <v-col cols="6">
              <div class="text-center">
                <p>Upper Cargo Scored</p>
                <v-btn
                  color="secondary"
                  large
                  @click="data.teleop.upperScored++"
                  >+1
                </v-btn>
                <p class="my-4 font-weight-black">
                  {{ data.teleop.upperScored }}
                </p>
                <v-btn
                  :disabled="data.teleop.upperScored == 0"
                  color="primary"
                  large
                  @click="data.teleop.upperScored--"
                  >-1
                </v-btn>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-center">
                <p>Upper Cargo Missed</p>
                <v-btn
                  color="secondary"
                  large
                  @click="data.teleop.upperMissed++"
                  >+1
                </v-btn>
                <p class="my-4 font-weight-black">
                  {{ data.teleop.upperMissed }}
                </p>
                <v-btn
                  :disabled="data.teleop.upperMissed == 0"
                  color="primary"
                  large
                  @click="data.teleop.upperMissed--"
                  >-1
                </v-btn>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <div class="text-center">
                <p>Lower Cargo Scored</p>
                <v-btn
                  color="secondary"
                  large
                  @click="data.teleop.lowerScored++"
                  >+1
                </v-btn>
                <p class="my-4 font-weight-black">
                  {{ data.teleop.lowerScored }}
                </p>
                <v-btn
                  :disabled="data.teleop.lowerScored == 0"
                  color="primary"
                  large
                  @click="data.teleop.lowerScored--"
                  >-1
                </v-btn>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-center">
                <p>Lower Cargo Missed</p>
                <v-btn
                  color="secondary"
                  large
                  @click="data.teleop.lowerMissed++"
                  >+1
                </v-btn>
                <p class="my-4 font-weight-black">
                  {{ data.teleop.lowerMissed }}
                </p>
                <v-btn
                  :disabled="data.teleop.lowerMissed == 0"
                  color="primary"
                  large
                  @click="data.teleop.lowerMissed--"
                  >-1
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </div>

        <v-divider class="mt-7" v-if="data.team"></v-divider>

        <div class="mt-4" v-if="data.team">
          <h5 class="text-h5 mb-4">ENDGAME</h5>
          <p class="grey--text">Climb</p>
          <v-radio-group v-model="data.end.climb" hide-details>
            <v-radio label="Low" value="Low"></v-radio>
            <v-radio label="Mid" value="Mid"></v-radio>
            <v-radio label="High" value="High"></v-radio>
            <v-radio label="Traversal" value="Traversal"></v-radio>
            <v-radio label="Failed" value="Failed"></v-radio>
            <v-radio label="Did Not Attempt" value="Did Not Attempt"></v-radio>
          </v-radio-group>

          <v-checkbox
            label="Started Climb Before Endgame?"
            v-model="data.end.climbedEarly"
          ></v-checkbox>

          <p class="grey--text"># of Alliance Robots Climbed</p>
          <v-radio-group
            v-model="data.end.totalClimbers"
            row
            :disabled="!data.match"
          >
            <v-radio
              v-for="i in 4"
              :key="i - 1"
              :label="(i - 1).toString()"
              :value="i - 1"
            ></v-radio>
          </v-radio-group>
        </div>

        <v-divider v-if="data.team"></v-divider>

        <div class="mt-4" v-if="data.team">
          <h5 class="text-h5 mb-4">POSTGAME</h5>

          <v-row>
            <v-col cols="6">
              <p class="grey--text">Driver Skill</p>
              <v-radio-group v-model="data.post.skill" hide-details>
                <v-radio label="Poor" value="1"></v-radio>
                <v-radio label="Mediocre" value="2"></v-radio>
                <v-radio label="Average" value="3"></v-radio>
                <v-radio label="Effective" value="4"></v-radio>
                <v-radio label="Excellent" value="5"></v-radio>
                <v-radio label="Did Not Drive" value="0"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="6">
              <p class="grey--text">Defense</p>
              <v-radio-group v-model="data.post.defense" hide-details>
                <v-radio label="Poor" value="1"></v-radio>
                <v-radio label="Average" value="3"></v-radio>
                <v-radio label="Effective" value="4"></v-radio>
                <v-radio label="Not Defensive" value="0"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <p class="grey--text mt-8">Additional Statistics</p>

          <v-checkbox
            hide-details
            label="Died"
            v-model="data.post.died"
            class="mt-0"
          ></v-checkbox>
          <v-checkbox
            hide-details
            label="Tipped Over"
            v-model="data.post.tipped"
            class="mt-1"
          ></v-checkbox>
          <v-checkbox
            hide-details
            label="Yellow/Red Card"
            v-model="data.post.card"
            class="mt-1"
          ></v-checkbox>
        </div>

        <v-textarea
          class="mt-3"
          v-if="data.team"
          label="Additional Comments (optional)..."
          v-model="data.comments"
        ></v-textarea>

        <v-divider v-if="data.team"></v-divider>

        <div v-if="data.team" class="ma-auto mt-5 text-center">
          <p class="grey--text mt-6">
            Please ensure that all data is accurate.
          </p>
          <v-btn class="mt-3" color="primary" @click="submit()"
            >Submit<v-icon right>mdi-check</v-icon></v-btn
          >
        </div>
      </section>
    </v-container>

    <v-container
      class="pa-6 text-center red--text font-weight-black"
      style="max-width: 400px"
      v-else
    >
      <p>Invaid input information</p>
      <p>Team mismatch</p>
      <p>Station unavailable</p>
      <p>Could not find existing scouting information</p>
      <p>Assigned scouter not available</p>
      <p>Fatal error</p>
      <p>Could not establish a connection to the database</p>
    </v-container>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "MatchScoutingForm2022",
  props: ["match", "event"],
  data() {
    return {
      data: {
        type: "match",
        team: null,
        match: null,
        event: null,
        scouter: null,
        auto: {
          taxied: false,
          upperScored: 0,
          upperMissed: 0,
          lowerScored: 0,
          lowerMissed: 0,
        },
        teleop: {
          upperScored: 0,
          upperMissed: 0,
          lowerScored: 0,
          lowerMissed: 0,
        },
        end: {
          climb: "Did Not Attempt",
          climbedEarly: false,
          totalClimbers: 0,
        },
        post: {
          skill: null,
          defense: null,
          died: false,
          tipped: false,
          card: false,
        },
        comments: "",
      },
      station: false,
      inThisMatch: false,

      comp_levelMap: {
        qm: "Qualification",
        qf: "Quaterfinal",
        sf: "Semifinal",
        f: "Final",
      },
    };
  },
  computed: {
    matchStart() {
      return dayjs(this.match.actual_time * 1000).format("M/D/YY [at] HH:mm");
    },
  },
  methods: {
    resetForm() {
      this.data = {
        type: "match",
        team: null,
        match: null,
        event: null,
        scouter: null,
        auto: {
          taxied: false,
          upperScored: 0,
          upperMissed: 0,
          lowerScored: 0,
          lowerMissed: 0,
        },
        teleop: {
          upperScored: 0,
          upperMissed: 0,
          lowerScored: 0,
          lowerMissed: 0,
        },
        end: {
          climb: "Did Not Attempt",
          climbedEarly: false,
          totalClimbers: 0,
        },
        post: {
          skill: null,
          defense: null,
          died: false,
          tipped: false,
          card: false,
        },
        comments: "",
      };
    },
    refresh() {
      this.$http
        .get(
          `/api/scouting/match/${this.$route.params.code.toLowerCase()}_${this.$route.query.match.toLowerCase()}`
        )
        .then((response) => {
          if (response.data[this.$route.query.team])
            this.data = response.data[this.$route.query.team];
          this.inThisMatch = false;
          for (let red of this.match.alliances.red.team_keys) {
            if (red.includes(this.$route.query.team)) {
              this.inThisMatch = true;
              this.station =
                "Red " + (this.match.alliances.red.team_keys.indexOf(red) + 1);
            }
          }

          for (let blue of this.match.alliances.blue.team_keys) {
            if (blue.includes(this.$route.query.team)) {
              this.inThisMatch = true;
              this.station =
                "Blue " +
                (this.match.alliances.blue.team_keys.indexOf(blue) + 1);
            }
          }

          this.data.team = this.$route.query.team;
          this.data.match = `${
            this.event.key
          }_${this.$route.query.match.toLowerCase()}`;
          this.data.scouter = this.$root.user.username;
          this.data.event = this.event.key;
        });
    },
    submit() {
      this.$http
        .post(
          `/api/scouting/match?station=${this.station.split(" ").join("")}`,
          this.data
        )
        .then(() => {
          this.$router.push(`/events/${this.event.key.toUpperCase()}/scouting`);
        });
    },
  },
  created() {
    this.refresh();
  },
};
</script>

<style scoped>
</style>
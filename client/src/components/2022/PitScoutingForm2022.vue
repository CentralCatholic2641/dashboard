<template>
  <div>
    <v-container class="mt-4" style="max-width: 400px">
      <section class="text-center">
        <p>
          <span class="font-weight-black">Team: </span>
          <span>
            {{ data.team }}
          </span>
        </p>
      </section>

      <section v-if="data.team">
        <v-text-field
          label="Who are you speaking with?"
          v-model="data.robot.spokeTo"
        ></v-text-field>

        <div class="my-4">
          <h5 class="text-h5">AUTONOMOUS</h5>
          <v-checkbox v-model="data.auto.taxi" label="Can Taxi?"></v-checkbox>

          <div class="d-flex" style="align-items: center">
            <p class="pa-0 ma-0">Can shoot...</p>
            <v-checkbox
              class="ml-6"
              v-model="data.auto.shootLow"
              label="Low"
            ></v-checkbox>
            <v-checkbox
              class="ml-6"
              v-model="data.auto.shootHigh"
              label="High"
            ></v-checkbox>
          </div>

          <div class="d-flex" style="align-items: center">
            <p class="pa-0 ma-0">Cargo pickup...</p>
            <v-checkbox
              class="ml-6"
              v-model="data.auto.cargoFloor"
              label="Floor"
            ></v-checkbox>
            <v-checkbox
              class="ml-6"
              v-model="data.auto.cargoTerminal"
              label="Terminal"
            ></v-checkbox>
            <v-checkbox
              class="ml-6"
              v-model="data.auto.cargoPreload"
              label="Preload"
            ></v-checkbox>
          </div>

          <v-text-field
            label="Preferred Starting Position"
            v-model="data.auto.start"
          ></v-text-field>

          <v-checkbox
            v-model="data.auto.shareTarmac"
            label="Can Share Tarmac?"
            hide-details
          ></v-checkbox>

          <v-checkbox
            v-model="data.auto.human"
            label="Can Human Player Score?"
          ></v-checkbox>
        </div>

        <v-divider></v-divider>

        <div class="my-4">
          <h5 class="text-h5">TELEOPERATED</h5>

          <div class="d-flex" style="align-items: center">
            <p class="pa-0 ma-0">Can shoot...</p>
            <v-checkbox
              class="ml-6"
              v-model="data.teleop.shootLow"
              label="Low"
            ></v-checkbox>
            <v-checkbox
              class="ml-6"
              v-model="data.teleop.shootHigh"
              label="High"
            ></v-checkbox>
          </div>

          <v-text-field
            label="Preferred Shooting Position"
            v-model="data.teleop.shootPos"
          ></v-text-field>

          <div class="d-flex" style="align-items: center">
            <p class="pa-0 ma-0">Preferred Pickup...</p>
            <v-checkbox
              class="ml-6"
              v-model="data.teleop.cargoPickup"
              value="Floor"
              label="Floor"
            ></v-checkbox>
            <v-checkbox
              class="ml-6"
              v-model="data.teleop.cargoPickup"
              value="Terminal"
              label="Terminal"
            ></v-checkbox>
          </div>
        </div>

        <v-divider></v-divider>

        <div class="my-4">
          <h5 class="text-h5">ENDGAME</h5>

          <p class="pa-0 mb-0 mt-6">Can hang...</p>
          <v-checkbox
            class="ml-6"
            v-model="data.end.hangLow"
            label="Low"
            hide-details
          ></v-checkbox>
          <v-checkbox
            class="ml-6"
            v-model="data.end.hangMid"
            label="Mid"
            hide-details
          ></v-checkbox>
          <v-checkbox
            class="ml-6"
            v-model="data.end.hangHigh"
            label="High"
            hide-details
          ></v-checkbox>
          <v-checkbox
            class="ml-6"
            v-model="data.end.hangTraversal"
            label="Traversal"
            hide-details
          ></v-checkbox>
        </div>

        <v-divider></v-divider>

        <div class="my-4">
          <h5 class="text-h5">DRIVERS</h5>

          <v-row class="mt-2">
            <v-col cols="4">
              <div class="text-center">
                <p>Total Driver Exp.</p>
                <v-btn color="secondary" large @click="data.drivers.driverExp++"
                  >+1
                </v-btn>
                <p class="my-4 font-weight-black">
                  {{ data.drivers.driverExp }}
                </p>
                <v-btn
                  :disabled="data.drivers.driverExp == 0"
                  color="primary"
                  large
                  @click="data.drivers.driverExp--"
                  >-1
                </v-btn>
              </div>
            </v-col>

            <v-col cols="4">
              <div class="text-center">
                <p>Total Coach Exp.</p>
                <v-btn color="secondary" large @click="data.drivers.coachExp++"
                  >+1
                </v-btn>
                <p class="my-4 font-weight-black">
                  {{ data.drivers.coachExp }}
                </p>
                <v-btn
                  :disabled="data.drivers.coachExp == 0"
                  color="primary"
                  large
                  @click="data.drivers.coachExp--"
                  >-1
                </v-btn>
              </div>
            </v-col>

            <v-col cols="4">
              <div class="text-center">
                <p>Drive Practice Hrs.</p>
                <v-btn
                  color="secondary"
                  large
                  @click="data.drivers.practiceHrs++"
                  >+1
                </v-btn>
                <p class="my-4 font-weight-black">
                  {{ data.drivers.practiceHrs }}
                </p>
                <v-btn
                  :disabled="data.drivers.practiceHrs == 0"
                  color="primary"
                  large
                  @click="data.drivers.practiceHrs--"
                  >-1
                </v-btn>
              </div>
            </v-col>
          </v-row>

          <div class="d-flex mt-3" style="align-items: center">
            <p class="pa-0 ma-0">Coach Type...</p>
            <v-checkbox
              class="ml-6"
              v-model="data.drivers.coachType"
              value="Student"
              label="Student"
            ></v-checkbox>
            <v-checkbox
              class="ml-6"
              v-model="data.drivers.coachType"
              value="Mentor"
              label="Mentor"
            ></v-checkbox>
          </div>
        </div>

        <v-divider></v-divider>

        <div class="my-4">
          <h5 class="text-h5">ROBOT</h5>

          <v-text-field
            label="Drivetrain Description"
            v-model="data.robot.drivetrain"
            hide-details
            class="mb-4"
          ></v-text-field>

          <v-text-field
            label="Unique Features"
            v-model="data.robot.features"
            hide-details
            class="mb-4"
          ></v-text-field>

          <v-text-field
            label="Inspected Weight (lbs)"
            v-model="data.robot.weight"
            type="number"
            hide-details
            class="mb-4"
          ></v-text-field>

          <v-text-field
            label="Programming Languages"
            v-model="data.robot.languages"
          ></v-text-field>

          <v-checkbox
            v-model="data.robot.vision"
            label="Realtime Vision?"
            hide-details
          ></v-checkbox>

          <v-checkbox
            v-model="data.robot.autoTarget"
            label="Automatic Targeting?"
          ></v-checkbox>

          <v-file-input
            label="Image"
            accept="image/*"
            v-model="upload"
            prepend-icon=""
          ></v-file-input>

          <p class="grey--text font-italic text-center font-weight-bold">
            If an image is already uploaded, this will replace it!
          </p>

          <v-img max-width="200px" v-if="upload" :src="url"></v-img>
        </div>

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
  </div>
</template>

<script>
import resizebase64 from "resize-base64";

export default {
  name: "PitScoutingForm2022",
  props: ["team", "event", "pitscouting"],
  data() {
    return {
      upload: null,
      data: {
        type: "pit",
        team: null,
        event: null,
        scouter: null,
        auto: {
          taxi: false,
          shootLow: true,
          shootHigh: true,
          cargoFloor: false,
          cargoTerminal: false,
          cargoPreload: true,
          start: "Anywhere",
          shareTarmac: true,
          human: false,
        },
        teleop: {
          shootLow: true,
          shootHigh: true,
          shootPos: "Tarmac",
          cargoPickup: "Floor",
        },
        end: {
          hangLow: false,
          hangMid: false,
          hangHigh: false,
          hangTraversal: false,
        },
        drivers: {
          driverExp: 0,
          coachExp: 0,
          practiceHrs: 0,
          coachType: "Student",
        },
        robot: {
          drivetrain: "",
          features: "",
          weight: 100,
          languages: "",
          vision: false,
          autoTarget: false,
          spokeTo: "",
        },
        image: "",
        comments: "",
      },
    };
    ``;
  },
  computed: {
    url() {
      return URL.createObjectURL(this.upload);
    },
  },
  methods: {
    resetForm() {
      this.data = {
        type: "pit",
        team: null,
        event: null,
        scouter: null,
        auto: {
          taxi: false,
          shootLow: true,
          shootHigh: true,
          cargoFloor: true,
          cargoTerminal: true,
          start: "Anywhere",
          shareTarmac: true,
          human: false,
        },
        teleop: {
          shootLow: true,
          shootHigh: true,
          shootPos: "Tarmac",
          cargoPickup: "Floor",
        },
        end: {
          hangLow: false,
          hangMid: false,
          hangHigh: false,
          hangTraversal: false,
        },
        drivers: {
          driverExp: 0,
          coachExp: 0,
          practiceHrs: 0,
          coachType: "Student",
        },
        robot: {
          drivetrain: "",
          features: "",
          weight: 100,
          languages: "",
          vision: false,
          autoTarget: false,
          spokeTo: "",
        },
        image: "",
        comments: "",
      };
    },
    refresh() {
      this.$http
        .get(
          `/api/scouting/pit/${this.$route.params.code.toLowerCase()}/${
            this.$route.query.team
          }`
        )
        .then((response) => {
          if (response.data) this.data = response.data;
        });

      this.data.team = this.$route.query.team;
      this.data.scouter = this.$root.user.username;
      this.data.event = this.event.key;
    },
    submit() {
      if (this.upload) {
        let reader = new FileReader();
        reader.readAsDataURL(this.upload);
        reader.onload = () => {
          this.data.image = resizebase64(reader.result, 500, 500);

          this.$http
            .post(
              `/api/scouting/pit?team=${this.data.team}&event=${this.data.event}`,
              this.data
            )
            .then(() => {
              this.$router.push(
                `/events/${this.event.key.toUpperCase()}/scouting`
              );
            });
        };
        reader.onerror = (error) => {
          console.log("Error: ", error);
        };
      } else {
        this.$http
          .post(
            `/api/scouting/pit?team=${this.data.team}&event=${this.data.event}`,
            this.data
          )
          .then(() => {
            this.$router.push(
              `/events/${this.event.key.toUpperCase()}/scouting`
            );
          });
      }
    },
  },
  created() {
    this.refresh();
  },
};
</script>

<style scoped>
</style>
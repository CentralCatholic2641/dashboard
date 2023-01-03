<template>
  <div>
    <canvas id="canvas"></canvas>
    <v-progress-linear :value="(step / 6) * 100"></v-progress-linear>

    <v-container style="max-width: 1200px" class="text-center">
      <!-- ACTIVATION -->
      <section v-if="step == 0" class="ma-auto" style="max-width: 600px">
        <h3 class="text-h3 font-weight-light mt-12">
          Welcome, Team {{ $root.config.team }}!
        </h3>

        <p class="mt-6">
          Thank you for using our software, the premier<br />FIRST Robotics
          Competition team management software.
        </p>

        <p class="mt-6">
          Before your team can use this software, some configuration is
          required.<br />This wizard will walk you through it.
        </p>

        <p class="mt-6">
          If you have any questions or experience any problems,<br />please
          contact support at
          <a class="blue--text" href="mailto:support@team2641.com"
            >support@team2641.com</a
          >.
        </p>

        <p class="mt-6">
          To begin, enter your 30-digit activation code supplied by Team 2641.
        </p>

        <v-text-field
          solo
          label="Activation Code"
          hide-details="auto"
          class="mt-6 ma-auto"
          style="max-width: 340px; text-align: center"
          v-model="code"
        ></v-text-field>

        <v-btn
          :disabled="code.length != 35"
          @click="activate()"
          color="primary"
          class="mt-8"
          >Begin<v-icon>mdi-chevron-right</v-icon></v-btn
        >
      </section>

      <!-- STEP 1: SYSADMIN ACCOUNT -->
      <section v-if="step == 1">
        <h3 class="text-h3 font-weight-light mt-12">
          System Administrator Account
        </h3>
        <v-divider class="my-6"></v-divider>

        <p>
          This account is used to manage important parts of this software.<br />It
          has the highest level of access.
        </p>
        <p>
          You can create more sysadmin accounts later.<br />There must always be
          at least one sysadmin account.
        </p>
        <p>
          Access to these accounts should only be given to those who trusted,<br />
          because sysadmins may have access to sensitive information.
        </p>

        <v-row class="mt-6">
          <v-col cols="4">
            <h5 class="text-h5">Authentication Details</h5>
            <v-text-field
              solo
              label="Username*"
              hide-details="auto"
              class="mt-6 ma-auto"
              style="max-width: 340px; text-align: center"
              v-model="user.username"
              prepend-icon="mdi-account"
            ></v-text-field>

            <v-text-field
              solo
              label="Password*"
              type="password"
              hide-details="auto"
              class="mt-4 ma-auto"
              style="max-width: 340px; text-align: center"
              v-model="user.password"
              prepend-icon="mdi-lock"
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <h5 class="text-h5">Basic Information</h5>

            <v-text-field
              solo
              label="Name*"
              hide-details="auto"
              class="mt-6 ma-auto"
              style="max-width: 340px; text-align: center"
              v-model="user.name"
              prepend-icon="mdi-account"
            ></v-text-field>

            <v-text-field
              solo
              label="Email"
              hide-details="auto"
              class="mt-4 ma-auto"
              style="max-width: 340px; text-align: center"
              v-model="user.email"
              prepend-icon="mdi-email"
            ></v-text-field>

            <v-text-field
              solo
              label="Phone"
              hide-details="auto"
              class="mt-4 ma-auto"
              style="max-width: 340px; text-align: center"
              v-model="user.phone"
              prepend-icon="mdi-phone"
            ></v-text-field>

            <v-text-field
              solo
              label="Address"
              hide-details="auto"
              class="mt-4 ma-auto"
              style="max-width: 340px; text-align: center"
              v-model="user.address"
              prepend-icon="mdi-home"
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <h5 class="text-h5">Options</h5>

            <v-checkbox
              v-model="user.includeInAttendance"
              label="Include in Attendance?"
              hide-details
              class="mb-4"
            ></v-checkbox>

            <v-checkbox
              v-model="user.includeInScouting"
              label="Include in Scouting?"
              hide-details
              class="mb-4"
            ></v-checkbox>

            <v-checkbox
              v-model="user.resetPasswordOnNextLogin"
              label="Reset Password on Next Login?"
              hide-details
              class="mb-4"
            ></v-checkbox>
          </v-col>
        </v-row>
      </section>

      <!-- STEP 2: TEAM INFO -->
      <section v-if="step == 2">
        <h3 class="text-h3 font-weight-light mt-12">
          Information About Your Team
        </h3>
        <v-divider class="my-6"></v-divider>

        <p>
          Team 2641 uses this information to confirm your support license and to
          ensure the security of your team's data.
        </p>

        <v-row style="max-width: 800px" class="ma-auto">
          <v-col cols="6">
            <v-text-field
              solo
              label="Team Number*"
              hide-details="auto"
              class="ma-auto"
              style="max-width: 340px; text-align: center"
              v-model="$root.config.team"
              prepend-icon="mdi-account-group"
              @keypress.prevent
            ></v-text-field>

            <v-text-field
              solo
              label="School(s)*"
              hide-details="auto"
              class="mt-4 ma-auto"
              style="max-width: 340px; text-align: center"
              v-model="survey.school"
              prepend-icon="mdi-school"
            ></v-text-field>

            <v-text-field
              solo
              label="Location*"
              hide-details="auto"
              class="mt-4 ma-auto"
              style="max-width: 340px; text-align: center"
              v-model="survey.location"
              prepend-icon="mdi-map-marker"
            ></v-text-field>

            <v-text-field
              solo
              label="District (if applicable)"
              hide-details="auto"
              class="mt-4 ma-auto"
              style="max-width: 340px; text-align: center"
              v-model="survey.district"
              prepend-icon="mdi-vector-intersection"
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <v-text-field
              solo
              label="Rookie Year*"
              hide-details="auto"
              class="ma-auto"
              style="max-width: 340px; text-align: center"
              v-model="survey.rookie"
              prepend-icon="mdi-clock"
            ></v-text-field>

            <v-text-field
              solo
              label="Avg. # of Members*"
              hide-details="auto"
              class="mt-4 ma-auto"
              style="max-width: 340px; text-align: center"
              v-model="survey.members"
              prepend-icon="mdi-account-group"
            ></v-text-field>

            <v-text-field
              solo
              label="Avg. # of Competitions*"
              hide-details="auto"
              class="mt-4 ma-auto"
              style="max-width: 340px; text-align: center"
              v-model="survey.comps"
              prepend-icon="mdi-calendar-star"
            ></v-text-field>
          </v-col>
        </v-row>
      </section>

      <!-- STEP 3: API INFO -->
      <section v-if="step == 3">
        <h3 class="text-h3 font-weight-light mt-12">
          External API Configuration
        </h3>
        <v-divider class="my-6"></v-divider>

        <p>
          This is used to communicate with FRC Events and the Blue Alliance
          API's.
        </p>

        <v-text-field
          solo
          label="FRC Events Username*"
          hide-details="auto"
          class="mt-4 ma-auto"
          style="max-width: 340px; text-align: center"
          v-model="frcusername"
          prepend-icon="mdi-account"
        ></v-text-field>

        <v-text-field
          solo
          label="FRC Events Token*"
          hide-details="auto"
          class="mt-4 ma-auto"
          style="max-width: 340px; text-align: center"
          v-model="frctoken"
          prepend-icon="mdi-lock"
        ></v-text-field>

        <v-text-field
          solo
          label="TBA Token*"
          hide-details="auto"
          class="mt-4 ma-auto"
          style="max-width: 340px; text-align: center"
          v-model="tbatoken"
          prepend-icon="mdi-lock"
        ></v-text-field>
      </section>

      <!-- STEP 4: CONTACT INFO -->
      <section v-if="step == 4">
        <h3 class="text-h3 font-weight-light mt-12">Contact Information</h3>
        <v-divider class="my-6"></v-divider>

        <p>
          Enter the contact information for the person we should contact
          regarding product updates, support tickets, etc.
        </p>

        <p>By default, this information matches what you entered earlier.</p>

        <div class="d-flex">
          <v-checkbox
            label="Don't use the default"
            class="ma-auto mb-3"
            hide-details
            style="position: relative"
            v-model="contactInfoDifferent"
          ></v-checkbox>
        </div>

        <v-text-field
          solo
          label="Name*"
          hide-details="auto"
          class="mt-4 ma-auto"
          style="max-width: 340px; text-align: center"
          v-model="contact.name"
          prepend-icon="mdi-account"
          :disabled="!contactInfoDifferent"
        ></v-text-field>

        <v-text-field
          solo
          label="Email*"
          hide-details="auto"
          class="mt-4 ma-auto"
          style="max-width: 340px; text-align: center"
          v-model="contact.email"
          prepend-icon="mdi-email"
          :disabled="!contactInfoDifferent"
        ></v-text-field>

        <v-text-field
          solo
          label="Phone*"
          hide-details="auto"
          class="mt-4 ma-auto"
          style="max-width: 340px; text-align: center"
          v-model="contact.phone"
          prepend-icon="mdi-phone"
          :disabled="!contactInfoDifferent"
        ></v-text-field>

        <v-text-field
          solo
          label="Address*"
          hide-details="auto"
          class="mt-4 ma-auto"
          style="max-width: 340px; text-align: center"
          v-model="contact.address"
          prepend-icon="mdi-home"
          :disabled="!contactInfoDifferent"
        ></v-text-field>

        <v-textarea
          solo
          label="Notes"
          hide-details="auto"
          class="mt-4 ma-auto"
          style="max-width: 340px; text-align: center"
          v-model="contact.notes"
          prepend-icon="mdi-text"
        ></v-textarea>
      </section>

      <!-- STEP 5: CONFIRM -->
      <section v-if="step == 5">
        <h3 class="text-h3 font-weight-light mt-12">Confirmation</h3>
        <v-divider class="my-6"></v-divider>

        <p>Please ensure the information your entered is accurate.</p>

        <v-row class="mt-1 ma-auto" style="max-width: 1100px">
          <v-col cols="4">
            <v-card>
              <h5 class="text-h5 px-4 pt-4">Sysadmin Account</h5>

              <v-card-text class="text-left white--text">
                <table>
                  <tr>
                    <td style="width: 100px" class="font-weight-black">
                      Username
                    </td>
                    <td>{{ user.username }}</td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">
                      Password
                    </td>
                    <td>{{ user.password }}</td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">Name</td>
                    <td>
                      {{ user.name }}
                    </td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">
                      Email
                    </td>
                    <td>
                      {{ user.email }}
                    </td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">
                      Phone
                    </td>
                    <td>
                      {{ user.phone }}
                    </td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">
                      Address
                    </td>
                    <td>
                      {{ user.address }}
                    </td>
                  </tr>
                </table>

                <p v-if="user.includeInAttendance" class="my-2">
                  Included in attendance
                </p>

                <p v-if="user.includeInScouting" class="my-2">
                  Included in scouting
                </p>

                <p v-if="user.resetPasswordOnNextLogin" class="my-2">
                  Password reset on next login
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="4">
            <v-card>
              <h5 class="text-h5 px-4 pt-4">Team Info</h5>

              <v-card-text class="text-left white--text">
                <table>
                  <tr>
                    <td style="width: 100px" class="font-weight-black">Team</td>
                    <td>{{ $root.config.team }}</td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">
                      School(s)
                    </td>
                    <td>{{ survey.school }}</td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">
                      Location
                    </td>
                    <td>
                      {{ survey.location }}
                    </td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">
                      District
                    </td>
                    <td>
                      {{ survey.district || "-" }}
                    </td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">
                      Rookie Year
                    </td>
                    <td>
                      {{ survey.rookie }}
                    </td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">
                      Avg. Members
                    </td>
                    <td>
                      {{ survey.members }}
                    </td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">
                      Avg. Comps.
                    </td>
                    <td>
                      {{ survey.comps }}
                    </td>
                  </tr>
                </table>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="4">
            <v-card>
              <h5 class="text-h5 px-4 pt-4">Contact Info</h5>

              <v-card-text class="text-left white--text">
                <table>
                  <tr>
                    <td style="width: 100px" class="font-weight-black">Name</td>
                    <td>
                      {{ contact.name }}
                    </td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">
                      Email
                    </td>
                    <td>
                      {{ contact.email }}
                    </td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">
                      Phone
                    </td>
                    <td>
                      {{ contact.phone }}
                    </td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">
                      Address
                    </td>
                    <td>
                      {{ contact.address }}
                    </td>
                  </tr>
                </table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <div class="d-flex">
          <v-checkbox
            label="I certify that the information above is accurate"
            class="ma-auto mt-6"
            hide-details
            style="position: relative"
            v-model="confirmed"
          ></v-checkbox>
        </div>
      </section>

      <!-- FINISH -->
      <section v-if="step == 6" class="ma-auto" style="max-width: 600px">
        <h3 class="text-h3 font-weight-light mt-12">Congratulations!</h3>

        <p class="mt-6">You have finished the initial configuration process.</p>

        <p class="mt-6">Now, you can log into the portal.</p>

        <v-btn @click="reload()" color="primary" class="mt-4"
          >Login<v-icon>mdi-chevron-right</v-icon></v-btn
        >
      </section>
    </v-container>

    <v-btn
      text
      @click="step--"
      :disabled="step == 1"
      v-if="step != 0"
      fixed
      bottom
      left
      ><v-icon left>mdi-chevron-left</v-icon>Back</v-btn
    >

    <v-btn
      color="primary"
      @click="step++"
      :disabled="!stepVerified"
      v-if="step != 0 && step != 5"
      fixed
      bottom
      right
      >Next<v-icon right>mdi-chevron-right</v-icon></v-btn
    >

    <v-btn
      color="green darken-2"
      @click="finish()"
      :disabled="!stepVerified"
      v-if="step == 5"
      fixed
      bottom
      right
      >Finish<v-icon right>mdi-check</v-icon></v-btn
    >
  </div>
</template>

<script>
import ConfettiGenerator from "confetti-js";

let confetti;
export default {
  name: "Initialization",
  data() {
    return {
      step: 0,
      code: "PDEB4-UGE6R-J6JB8-QEJNI-53DVV-T0DXS",
      user: {
        username: "test",
        password: "test",
        name: "Test User",
        email: "test@test.com",
        phone: "1234567890",
        address: "123 Anywhere Ln, San Jose, CA",
        includeInAttendance: true,
        includeInScouting: true,
        role: 4,
      },
      survey: {
        school: "Bellarmine College Preparatory",
        location: "San Jose, CA",
        rookie: 1999,
        members: "50",
        comps: "4",
      },
      contact: {
        name: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
      },
      frctoken: "",
      frcusername: "",
      tbatoken: "",
      contactInfoDifferent: false,
      confirmed: false,
    };
  },
  computed: {
    stepVerified() {
      let verified = false;

      if (this.step == 1) {
        verified = this.user.username && this.user.password && this.user.name;
      } else if (this.step == 2) {
        verified =
          this.survey.school &&
          this.survey.location &&
          this.survey.rookie &&
          this.survey.members &&
          this.survey.comps;
      } else if (this.step == 3) {
        verified = this.frctoken && this.frcusername && this.tbatoken;
      } else if (this.step == 4) {
        verified =
          this.contact.name &&
          this.contact.email &&
          this.contact.phone &&
          this.contact.address;
      } else if (this.step == 5) {
        verified = this.confirmed;
      }

      return verified;
    },
  },
  methods: {
    activate() {
      this.$root.loading = true;
      this.$http
        .post(`http://localhost:3000/api/instance/activate`, {
          code: this.code,
          config: this.$root.config,
        })
        .then((response) => {
          if (response.data.valid) this.step = 1;
          else this.errors.code = "Invalid activation code";
          this.$root.loading = false;
        });
    },
    finish() {
      this.user.shortname =
        this.user.name.substring(0, this.user.name.indexOf(" ")) +
        " " +
        this.user.name.substring(
          this.user.name.lastIndexOf(" ") + 1,
          this.user.name.lastIndexOf(" ") + 2
        ) +
        ".";

      this.$http.post("/api/auth/create", this.user).then((response) => {
        if (response.data.error) this.error = response.data.error;
        else
          this.$http
            .post("/api/admin", {
              team: this.$root.config.team,
              event: false,
              initialized: true,
              year: this.$root.config.year,
              cacheLength: this.$root.config.cacheLength,
              currentEvent: this.$root.config.currentEvent,
              pitMode: this.$root.config.pitMode,
              tbatoken: this.tbatoken,
              frctoken: btoa(`${this.frcusername}:${this.frctoken}`),
              code: this.code,
              version: this.$root.version,
            })
            .then((response2) => {
              if (response2.data.initialized)
                response2.data.initialized = false;
              this.$root.config = response2.data;
              this.$http.get("https://ipapi.co/json").then((response3) => {
                this.$http
                  .post("http://localhost:3000/api/instance/register", {
                    team: this.$root.config.team,
                    location: this.survey.location,
                    code: this.code,
                    status: "Active",
                    contact: this.contact,
                    survey: this.survey,
                    activated: new Date().toLocaleString(),
                    ip: response3.data.ip,
                  })
                  .then((response4) => {
                    this.step++;
                    confetti.render();
                  });
              });
            });
      });
    },
    reload() {
      location.reload();
    },
  },
  watch: {
    step() {
      if (this.step >= 3 && !this.contactInfoDifferent) {
        this.contact.name = this.user.name;
        this.contact.email = this.user.email;
        this.contact.phone = this.user.phone;
        this.contact.address = this.user.address;
      }
    },
  },
  mounted() {
    let confettiSettings = {
      target: "canvas",
      max: "500",
      size: "0.75",
      animate: true,
      props: ["square"],
      colors: [
        [165, 104, 246],
        [230, 61, 135],
        [0, 199, 228],
        [253, 214, 126],
      ],
      clock: "75",
      rotate: false,
      width: "1876",
      height: "1052",
      start_from_edge: false,
      respawn: false,
    };

    confetti = new ConfettiGenerator(confettiSettings);
  },
};
</script>

<style scoped>
canvas#canvas {
  position: absolute;
  top: -64px;
  left: 0px;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
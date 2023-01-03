<template>
  <v-app v-if="$root.config">
    <v-app-bar app color="secondary">
      <v-app-bar-nav-icon
        class="mr-3"
        v-if="
          $root.user &&
          !$root.disableDrawer &&
          $root.authenticated &&
          $root.config.status == 'Active'
        "
        @click="$root.drawer = !$root.drawer"
      ></v-app-bar-nav-icon>
      <div
        v-if="!$root.disableDrawer"
        class="d-flex align-center"
        style="cursor: pointer"
        @click="$router.push('/')"
      >
        <v-img
          alt="FIRST logo"
          class="shrink mr-2"
          contain
          src="./assets/logo.png"
          width="50"
        />
        <v-toolbar-title class="text-h5 font-weight-light">{{
          $root.title
        }}</v-toolbar-title>
      </div>

      <div v-else class="d-flex align-center">
        <v-img
          alt="FIRST logo"
          class="shrink mr-2"
          contain
          src="./assets/logo.png"
          width="50"
        />
        <v-toolbar-title class="text-h5 font-weight-light">{{
          $root.title
        }}</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <h4
        v-if="$vuetify.breakpoint.mdAndUp && $root.config.event"
        class="text-h4 font-weight-black pa-0 ma-0 ml-2"
      >
        {{ time }}
      </h4>
    </v-app-bar>

    <v-navigation-drawer
      app
      v-model="$root.drawer"
      v-if="$root.user && $root.config.status == 'Active'"
    >
      <v-toolbar color="#181818">
        <v-toolbar-title>
          <v-list-item class="ma-0 pa-0">
            <v-list-item-content>
              <v-list-item-title class="text-h6 font-weight-bold">{{
                $root.user.name
              }}</v-list-item-title>
              <v-list-item-subtitle class="grey--text">{{
                $root.user.username
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-toolbar-title>
      </v-toolbar>

      <v-list
        dense
        v-if="!$root.config.event"
        :style="`height: calc(100vh - ${
          $vuetify.breakpoint.mdAndUp ? '185px' : '177px'
        }); overflow: auto`"
        :class="{ 'pb-0': $root.config.events.length != 0 }"
      >
        <v-list-item link to="/" color="primary">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          link
          :to="`/members/${$root.user._id}`"
          color="primary"
          v-if="$root.user.role > 2"
        >
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>My Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/tasks" color="primary">
          <v-list-item-icon>
            <v-icon>mdi-checkbox-multiple-marked</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Tasks</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="$root.user.role > 2"
          link
          to="/meetings"
          color="primary"
        >
          <v-list-item-icon>
            <v-icon>mdi-calendar</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Meetings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/attendance" color="primary">
          <v-list-item-icon>
            <v-icon>mdi-clock</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Attendance</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="$root.user.role > 2"
          link
          to="/members"
          color="primary"
        >
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Members</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/payments" color="primary">
          <v-list-item-icon>
            <v-icon>mdi-bank</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Payments</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/sponsors" color="primary">
          <v-list-item-icon>
            <v-icon>mdi-account-cash</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Sponsors</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="$root.user.role > 2"
          link
          to="/mailing"
          color="primary"
        >
          <v-list-item-icon>
            <v-icon>mdi-email</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Mailing</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          :class="{ 'mb-2': $root.user.role < 4 }"
          link
          to="/resources"
          color="primary"
        >
          <v-list-item-icon>
            <v-icon>mdi-folder-open</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Resources</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          link
          to="/system"
          v-if="$root.user.role == 4"
          color="primary"
          class="mb-2"
        >
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>System</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <div v-if="$root.tasks && $root.tasks.length != 0" class="mb-2">
          <v-divider></v-divider>

          <p class="ml-5 mt-4 mb-0 pb-0 grey--text text--lighten-1">
            Your Tasks
          </p>
          <p class="grey--text ml-5 mb-4" style="font-size: 12px">
            {{ $root.tasks.length }} task{{
              $root.tasks.length == 1 ? "" : "s"
            }}
            in progress
          </p>

          <v-list-item
            v-for="task in $root.tasks"
            :key="task._id"
            link
            :to="`/tasks/${task._id}`"
            :color="getTaskColor(task.subteam)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ task.title }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon
              ><v-icon>mdi-chevron-right</v-icon></v-list-item-icon
            >
          </v-list-item>
        </div>

        <div class="mb-2">
          <v-divider></v-divider>

          <p class="ml-5 mt-4 mb-0 pb-0 grey--text text--lighten-1">
            FIRST Robotics Competition
          </p>
          <p class="grey--text ml-5 mb-4" style="font-size: 12px">
            {{ $root.config.year }} Season
          </p>

          <v-list-item link to="/teams" color="primary">
            <v-list-item-icon>
              <v-icon>mdi-account-group</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Teams</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link to="/events" color="primary">
            <v-list-item-icon>
              <v-icon>mdi-calendar-star</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Events</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>

        <div v-for="event in $root.config.events" :key="event.key" class="mb-2">
          <v-divider></v-divider>

          <p class="ml-5 mt-4 mb-0 pb-0 grey--text text--lighten-1">
            {{ event.name }}
          </p>
          <p class="grey--text ml-5 mb-4" style="font-size: 12px">
            {{ dayjs(event.start_date).format("MMM D, YYYY") }} •
            {{ event.city }}, {{ event.state_prov }}
          </p>

          <v-list-item
            exact
            link
            :to="`/events/${event.key.toUpperCase()}`"
            color="primary"
          >
            <v-list-item-icon>
              <v-icon>mdi-information-variant</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Information</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            link
            :to="`/events/${event.key.toUpperCase()}/schedule`"
            color="primary"
          >
            <v-list-item-icon>
              <v-icon>mdi-clock</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Schedule</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            link
            :to="`/events/${event.key.toUpperCase()}/teams`"
            color="primary"
          >
            <v-list-item-icon>
              <v-icon>mdi-account-group</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Teams</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            link
            :to="`/events/${event.key.toUpperCase()}/scouting`"
            color="primary"
          >
            <v-list-item-icon>
              <v-icon>mdi-binoculars</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Scouting</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>

      <v-list
        dense
        v-else
        :style="`height: calc(100vh - ${
          $vuetify.breakpoint.mdAndUp
            ? $root.user.role == 4
              ? '225px'
              : '185px'
            : $root.user.role == 4
            ? '217px'
            : '177px'
        }); overflow: auto`"
        :class="{ 'pb-0': $root.config.events.length != 0 }"
      >
        <div
          v-for="event in [
            $root.config.events.find((i) => i.key == $root.config.currentEvent),
          ]"
          :key="event.key"
          class="mb-2"
        >
          <p class="ml-5 mt-2 mb-0 pb-0 grey--text text--lighten-1">
            {{ event.name }}
          </p>
          <p class="grey--text ml-5 mb-4" style="font-size: 12px">
            {{ dayjs(event.start_date).format("MMM D, YYYY") }} •
            {{ event.city }}, {{ event.state_prov }}
          </p>

          <v-list-item
            exact
            link
            :to="`/events/${event.key.toUpperCase()}`"
            color="primary"
          >
            <v-list-item-icon>
              <v-icon>mdi-information-variant</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Overview</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            link
            :to="`/events/${event.key.toUpperCase()}/teams/${
              $root.config.team
            }`"
            color="primary"
          >
            <v-list-item-icon>
              <v-icon>mdi-account-group</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title
                >Team {{ $root.config.team }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            link
            :to="`/events/${event.key.toUpperCase()}/schedule`"
            color="primary"
          >
            <v-list-item-icon>
              <v-icon>mdi-clock</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Global Schedule</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            link
            :to="`/events/${event.key.toUpperCase()}/teams`"
            exact
            color="primary"
          >
            <v-list-item-icon>
              <v-icon>mdi-chevron-triple-up</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Rankings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            link
            :to="`/events/${event.key.toUpperCase()}/scouting`"
            color="primary"
          >
            <v-list-item-icon>
              <v-icon>mdi-binoculars</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Scouting</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>

        <v-divider></v-divider>

        <v-list-item
          @click="$root.config.event = false"
          color="primary"
          class="my-2"
        >
          <v-list-item-icon>
            <v-icon>mdi-arrow-left</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Exit Event Mode</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-divider></v-divider>

        <v-list dense class="mb-0 pb-0">
          <v-list-item link to="/account" color="primary">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Account</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="logout()" color="primary">
            <v-list-item-icon>
              <v-icon>mdi-arrow-left</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <p class="my-0 ml-3 pa-0 grey--text overline">v{{ $root.version }}</p>
      </template>
    </v-navigation-drawer>

    <v-main
      :style="`height: calc(100vh - ${
        $vuetify.breakpoint.mdAndUp ? '64px' : '56px'
      }); overflow: auto`"
    >
      <div v-if="$root.config.status == 'Active'">
        <main v-if="$root.config.initialized">
          <v-container
            class="px-0"
            style="max-width: 400px"
            v-if="$root.user != false && $root.user.locked"
          >
            <v-card class="mt-12">
              <v-card-title class="mb-2 pb-0"
                ><h5 class="text-h5">Account Locked</h5></v-card-title
              >

              <v-card-text>
                <p class="ma-0 pa-0">
                  Please contact your administrator for more information
                </p>
              </v-card-text>

              <v-card-actions>
                <v-btn @click="logout()" color="grey" text
                  ><v-icon left>mdi-arrow-left </v-icon>Log out</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-container>

          <v-container
            class="px-0 text-center"
            style="max-width: 400px"
            v-else-if="
              $root.user != false && $root.user.resetPasswordOnNextLogin
            "
          >
            <v-card class="mt-12">
              <v-card-title class="mb-2 pb-0"
                ><h5 class="text-h5">Reset Password</h5></v-card-title
              >

              <v-card-text>
                <v-text-field
                  class="mb-4"
                  hide-details
                  v-model="new_password"
                  label="New Password"
                  type="password"
                ></v-text-field>
                <v-text-field
                  hide-details
                  v-model="new_password_confirm"
                  label="Confirm New Password"
                  type="password"
                  @keypress.enter="resetPassword()"
                ></v-text-field>
              </v-card-text>

              <v-card-actions>
                <v-btn @click="logout()" color="grey" text
                  ><v-icon left>mdi-arrow-left </v-icon>Log out</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="new_password != new_password_confirm"
                  @click="resetPassword()"
                  color="primary"
                  >Continue<v-icon right>mdi-arrow-right</v-icon></v-btn
                >
              </v-card-actions>
            </v-card>
          </v-container>

          <router-view v-else-if="$root.user != false && $root.authenticated" />

          <v-overlay
            :value="$root.loading && $root.user"
            class="text-center"
            style="z-index: 100"
          >
            <v-progress-circular
              :size="50"
              :width="4"
              indeterminate
              class="mb-4 mt-n12"
            ></v-progress-circular>
            <p>Loading...</p>
          </v-overlay>

          <v-row no-gutters v-if="!$root.user">
            <v-col cols="12" md="6">
              <v-img
                class="pa-0 ma-0 elevation-24"
                :max-height="
                  $vuetify.breakpoint.mdAndUp ? 'calc(100vh - 64px)' : '200px'
                "
                src="@/assets/login.jpg"
                :position="
                  $vuetify.breakpoint.mdAndUp
                    ? 'center center'
                    : 'center bottom -75px'
                "
              ></v-img>
            </v-col>

            <v-col
              cols="12"
              md="6"
              :style="
                $vuetify.breakpoint.mdAndUp
                  ? 'padding: 75px 125px 25px 125px'
                  : 'padding: 24px'
              "
              style="max-width: 750px"
            >
              <h2 class="text-h2 mb-5">Login</h2>
              <p class="grey--text mb-6">
                Enter your FRC Team Management System here.
              </p>

              <v-divider></v-divider>

              <v-text-field
                class="mt-6"
                label="Username"
                v-model="user.username"
                hide-details="auto"
                autocomplete="off"
                :error-messages="error.username"
              ></v-text-field>
              <v-text-field
                class="mt-4 pb-2"
                label="Password"
                v-model="user.password"
                type="password"
                hide-details="auto"
                autocomplete="off"
                :error-messages="error.password"
                @keypress.enter="login()"
              ></v-text-field>
              <v-checkbox
                label="Stay signed in?"
                v-model="user.sticky"
              ></v-checkbox>
              <div class="d-flex">
                <v-spacer></v-spacer>
                <v-btn large color="primary" class="mt-1" @click="login()"
                  >Go<v-icon right>mdi-arrow-right</v-icon></v-btn
                >
              </div>
            </v-col>
          </v-row>
        </main>

        <main v-else>
          <Initialization />
        </main>
      </div>

      <div v-else style="max-width: 500px" class="ma-auto mt-12 text-center">
        <v-icon size="100" color="red">mdi-alert</v-icon>
        <h2 class="text-h2 font-weight-light red--text mt-10">NOTICE</h2>
        <p class="mt-10">This instance has been disabled.</p>
        <p class="mt-4">
          Please contact support at
          <a class="blue--text" href="mailto:support@team2641.com"
            >support@team2641.com</a
          >.
        </p>
      </div>
    </v-main>
  </v-app>
</template>

<script type="module">
import dayjs from "dayjs";
import Initialization from "./views/Initialization.vue";

let timeInterval;

export default {
  name: "App",
  data() {
    return {
      user: { username: "", password: "", sticky: true },
      error: {
        username: "",
        password: "",
      },
      time: "",
      href: window.location.href,
      new_password: "",
      new_password_confirm: "",
      dayjs,
    };
  },
  created() {
    timeInterval = setInterval(() => {
      this.time = dayjs().format("HH:mm:ss");
    }, 250);
  },
  methods: {
    login() {
      this.error = {
        username: "",
        password: "",
      };
      this.$http
        .post("/api/auth/login", {
          username: this.user.username.toLowerCase(),
          password: this.user.password,
          sticky: this.user.sticky,
        })
        .then((response) => {
          if (!response.data.error) {
            this.user = {
              username: "",
              password: "",
              sticky: true,
            };
            this.$root.user = response.data.user;
            this.$root.tasks = response.data.tasks;

            if (
              !this.$root.user.resetPasswordOnNextLogin &&
              !this.$root.user.locked
            ) {
              if (!this.$route.path.includes("screen"))
                this.$root.drawer = true;
              this.$root.authenticated = true;
            }
          } else {
            this.user.password = "";
            if (response.data.error == "Password is incorrect") {
              this.error.password = response.data.error;
            } else {
              this.error.username = response.data.error;
            }
          }
        });
    },
    logout() {
      if (this.$root.user) {
        this.$root.user = false;
        this.$http.get("/api/auth/logout");
        this.$root.drawer = false;
        this.$root.authenticated = false;
      }
    },
    resetPassword() {
      if (this.$root.user && this.new_password == this.new_password_confirm) {
        this.$root.user.password = this.new_password;
        this.$root.user.resetPasswordOnNextLogin = false;
        this.$http
          .put(
            `/api/auth/${this.$root.user._id}?password=true`,
            this.$root.user
          )
          .then(() => {
            this.$root.authenticated = true;
            this.$root.drawer = true;
            this.new_password = "";
            this.new_password_confirm = "";
          });
      }
    },
    getTaskColor(subteam) {
      if (subteam == "Code") return "blue";
      else if (subteam == "Electronics") return "green";
      else if (subteam == "Mechanical") return "purple";
      else return "teal";
    },
  },
  beforeDestroy() {
    clearInterval(timeInterval);
  },
  components: {
    Initialization,
  },
};
</script>

<style>
html,
body {
  background: #121212;
  overflow: hidden !important;
}

input {
  color: white;
  width: 100%;
  outline: none;
}

.highlighted {
  background: rgba(255, 255, 255, 0.3);
}
</style>
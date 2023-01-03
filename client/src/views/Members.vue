<template>
  <div v-if="users">
    <v-toolbar dense color="grey darken-4" style="z-index: 1">
      <v-toolbar-title class="d-flex">
        <v-breadcrumbs
          v-if="$vuetify.breakpoint.smAndUp"
          :items="breadcrumbs"
          divider="/"
          class="pa-0 ma-0"
        ></v-breadcrumbs>

        <h6 class="text-h6 font-weight-black">Members</h6>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mr-2"
            :input-value="filter != 'all'"
            v-bind="attrs"
            v-on="on"
            text
            >{{ filter }}<v-icon right>mdi-filter</v-icon></v-btn
          >
        </template>
        <v-list dense>
          <v-list-item-group v-model="filter" mandatory>
            <v-list-item value="all">
              <v-list-item-title>All</v-list-item-title>
            </v-list-item>

            <v-list-item value="members">
              <v-list-item-title>Members</v-list-item-title>
            </v-list-item>

            <v-list-item value="mentors">
              <v-list-item-title>Mentors</v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item value="freshmen">
              <v-list-item-title>Freshmen</v-list-item-title>
            </v-list-item>

            <v-list-item value="sophomores">
              <v-list-item-title>Sophomores</v-list-item-title>
            </v-list-item>

            <v-list-item value="juniors">
              <v-list-item-title>Juniors</v-list-item-title>
            </v-list-item>

            <v-list-item value="seniors">
              <v-list-item-title>Seniors</v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item value="mechanical">
              <v-list-item-title>Mechanical</v-list-item-title>
            </v-list-item>

            <v-list-item value="electronics">
              <v-list-item-title>Electronics</v-list-item-title>
            </v-list-item>

            <v-list-item value="code">
              <v-list-item-title>Code</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>

      <v-menu offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="mr-2" v-bind="attrs" v-on="on" icon
            ><v-icon>mdi-table</v-icon></v-btn
          >
        </template>
        <v-list dense>
          <v-list-item
            v-for="(value, column) of columnMap"
            :key="column"
            :input-value="columns[column]"
            @click="(columns[column] = !columns[column]), updatePageState()"
          >
            <v-list-item-icon
              ><v-icon v-if="columns[column]"
                >mdi-check</v-icon
              ></v-list-item-icon
            >
            <v-list-item-title>{{ columnMap[column] }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn color="primary" @click="new_wizard.open = true"
        ><v-icon left>mdi-plus</v-icon>New</v-btn
      >
    </v-toolbar>

    <div
      :style="`height: calc(100vh - ${
        $vuetify.breakpoint.mdAndUp ? '112px' : '104px'
      }); overflow: auto`"
    >
      <v-container style="max-width: 1200px" class="px-8 pt-0 mt-6">
        <v-card v-if="filtered.length > 0">
          <v-simple-table class="transparent" dense style="white-space: nowrap">
            <template v-slot:default>
              <thead>
                <tr>
                  <th
                    v-for="(value, column) of columns"
                    v-if="value"
                    :key="column"
                    class="text-left"
                  >
                    {{ columnMap[column] }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-ripple
                  style="cursor: pointer"
                  v-for="user in filtered"
                  :key="user._id"
                  @click="$router.push(`/members/${user._id}`)"
                >
                  <td
                    v-for="(value, column) of columns"
                    v-if="value"
                    :key="column"
                    :class="{
                      'font-weight-black':
                        column.includes('name') &&
                        column != 'username' &&
                        column != 'parentname',
                    }"
                  >
                    <span v-if="column == 'role'">
                      {{ roleMap[user.role] || "-" }}
                    </span>
                    <span v-else-if="column == 'dob'">
                      <span v-if="user.dob">
                        {{ dayjs(user.dob).format("MMM D, YYYY") }}
                      </span>
                      <span v-else>-</span>
                    </span>
                    <span v-else-if="column == 'parentname'">
                      <span v-if="user.parents[0]">
                        {{ user.parents[0].name }}
                      </span>
                      <span v-else>-</span>
                    </span>
                    <span v-else>
                      {{ user[column] || "-" }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>

        <p class="font-italic grey--text text-center mt-12" v-else>
          No members
        </p>

        <p class="pb-0 mt-4 mb-1 grey--text" v-if="filtered.length > 0">
          {{ filtered.length }} members
        </p>

        <v-dialog
          max-width="700"
          v-model="new_wizard.open"
          v-if="new_wizard.open"
        >
          <v-card>
            <new-user-wizard
              @close="(new_wizard.open = false), refresh()"
            ></new-user-wizard>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import NewUserWizard from "../components/NewUserWizard.vue";

export default {
  name: "Members",
  data() {
    return {
      dayjs,
      filter: "all",
      users: false,
      new_wizard: {
        open: false,
        data: {},
      },
      columns: {
        name: true,
        shortname: false,
        fullname: false,
        username: true,
        subteam: true,
        role: true,
        type: true,
        position: true,
        email: false,
        phone: true,
        address: false,
        dob: false,
        allergies: false,
        parentname: false,
        includeInAttendance: false,
        includeInScouting: false,
        resetPasswordOnNextLogin: false,
        locked: false,
      },
      columnMap: {
        name: "Name",
        shortname: "Short Name",
        fullname: "Legal Name",
        username: "Username",
        subteam: "Subteam",
        role: "Role",
        type: "Type",
        position: "Position",
        email: "Email",
        phone: "Phone",
        address: "Address",
        dob: "Date of Birth",
        allergies: "Allergies",
        parentname: "Parent Name",
        includeInAttendance: "Include in Attendance",
        includeInScouting: "Include in Scouting",
        resetPasswordOnNextLogin: "Reset Password",
        locked: "Locked",
      },
      roleMap: {
        1: "Member",
        2: "Manager",
        3: "Admin",
        4: "Sysadmin",
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
          text: "",
          disabled: true,
          to: "/members",
        },
      ];
    },
    filtered() {
      let data = [];

      switch (this.filter) {
        case "all":
          data = this.users;
          break;
        case "members":
          data = this.users.filter((i) => i.type != "Mentor");
          break;
        case "mentors":
          data = this.users.filter((i) => i.type == "Mentor");
          break;
        case "freshmen":
          data = this.users.filter((i) => i.type == "Freshman");
          break;
        case "sophomores":
          data = this.users.filter((i) => i.type == "Sophomore");
          break;
        case "juniors":
          data = this.users.filter((i) => i.type == "Junior");
          break;
        case "seniors":
          data = this.users.filter((i) => i.status == "Seniors");
          break;
        case "mechanical":
          data = this.users.filter((i) => i.subteam == "Mechanical");
          break;
        case "electronics":
          data = this.users.filter((i) => i.subteam == "Electronics");
          break;
        case "code":
          data = this.users.filter((i) => i.subteam == "Code");
          break;
        default:
          data = this.users;
          break;
      }

      data.sort((a, b) => a.name.localeCompare(b.name));

      return data;
    },
  },
  methods: {
    refresh() {
      this.$root.loading = true;
      this.$http.get("/api/auth/users").then((response) => {
        this.users = response.data;
        this.$root.loading = false;
      });
    },
    updatePageState() {
      this.$root.user.pagestate.members = {
        filter: this.filter,
        columns: this.columns,
      };
      this.$http.put(`/api/auth/${this.$root.user._id}`, this.$root.user);
    },
  },
  created() {
    if (this.$root.user.role > 2) this.refresh();
    else this.$router.push("/");
  },
  mounted() {
    if (!this.$root.user.pagestate) this.$root.user.pagestate = {};
    if (!this.$root.user.pagestate.members)
      this.$root.user.pagestate.members = {
        filter: "all",
        columns: this.columns,
      };
    this.filter = this.$root.user.pagestate.members.filter;
    this.columns = this.$root.user.pagestate.members.columns;

    for (let i of Object.keys(this.columnMap)) {
      if (!Object.keys(this.$root.user.pagestate.members).includes(i))
        this.$root.user.pagestate.members[i] = false;
    }
  },
  components: {
    NewUserWizard,
  },
  watch: {
    columns() {
      this.updatePageState();
    },
    filter() {
      this.updatePageState();
    },
  },
};
</script>

<style scoped>
</style>
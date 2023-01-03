<template>
  <div v-if="member">
    <v-toolbar dense color="grey darken-4" style="z-index: 1">
      <v-toolbar-title class="d-flex">
        <v-breadcrumbs
          v-if="$vuetify.breakpoint.smAndUp"
          :items="breadcrumbs"
          divider="/"
          class="pa-0 ma-0"
        ></v-breadcrumbs>

        <h6 class="text-h6 font-weight-black">{{ member.name }}</h6>
      </v-toolbar-title>
    </v-toolbar>

    <div
      :style="`height: calc(100vh - ${
        $vuetify.breakpoint.mdAndUp ? '112px' : '104px'
      }); overflow: auto`"
    >
      <v-container style="max-width: 1185px" class="px-8 pt-0 mt-4">
        <v-row class="mt-4">
          <v-col cols="12" md="8">
            <v-card class="mb-6">
              <v-card-title class="text-h5">Basic Information</v-card-title>

              <v-card-text class="white--text">
                <table>
                  <tr>
                    <td
                      style="width: 100px !important; white-space: nowrap"
                      class="font-weight-black pr-2"
                    >
                      Short Name
                    </td>
                    <td>
                      {{ member.shortname || "-" }}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="width: 100px !important; white-space: nowrap"
                      class="font-weight-black pr-2"
                    >
                      Legal Name
                    </td>
                    <td>
                      {{ member.fullname || "-" }}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="width: 100px !important; white-space: nowrap"
                      class="font-weight-black pr-2"
                    >
                      Email
                    </td>
                    <td v-if="member.email">
                      <a class="blue--text" :href="`mailto:${member.email}`">{{
                        member.email
                      }}</a>
                    </td>
                    <td v-else>-</td>
                  </tr>

                  <tr>
                    <td
                      style="width: 100px !important; white-space: nowrap"
                      class="font-weight-black pr-2"
                    >
                      Phone
                    </td>
                    <td>
                      {{ member.phone || "-" }}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="width: 100px !important; white-space: nowrap"
                      class="font-weight-black pr-2"
                    >
                      Address
                    </td>
                    <td>
                      {{ member.address || "-" }}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="width: 100px !important; white-space: nowrap"
                      class="font-weight-black pr-2"
                    >
                      Date of Birth
                    </td>
                    <td v-if="member.dob">
                      {{ dayjs(member.dob).format("MMM D, YYYY") }}
                    </td>
                    <td v-else>-</td>
                  </tr>

                  <tr>
                    <td
                      style="width: 100px !important; white-space: nowrap"
                      class="font-weight-black pr-2"
                    >
                      Position
                    </td>
                    <td>{{ member.position || "Member" }}</td>
                  </tr>

                  <tr>
                    <td
                      style="width: 100px !important; white-space: nowrap"
                      class="font-weight-black pr-2"
                    >
                      Type
                    </td>
                    <td>
                      {{ member.type || "-" }}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="width: 100px !important; white-space: nowrap"
                      class="font-weight-black pr-2"
                    >
                      Role
                    </td>
                    <td>{{ roleMap[member.role || "member"] }}</td>
                  </tr>

                  <tr>
                    <td
                      style="width: 100px !important; white-space: nowrap"
                      class="font-weight-black pr-2"
                    >
                      Subteam
                    </td>
                    <td>
                      {{ member.subteam || "-" }}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="width: 100px !important; white-space: nowrap"
                      class="font-weight-black pr-2"
                    >
                      Allergies
                    </td>
                    <td>
                      {{ member.allergies || "-" }}
                    </td>
                  </tr>
                </table>
              </v-card-text>
            </v-card>

            <v-card class="mb-6">
              <v-card-title class="text-h5">Notes</v-card-title>

              <v-card-text class="pb-0 mb-0 white--text">
                <Editor
                  @input="changes = true"
                  v-model="member.notes"
                  placeholder="Notes..."
                />
              </v-card-text>
            </v-card>

            <AttendancePersonalStats
              :leaderboard="leaderboard"
              :meetings="meetings"
              :user="member._id"
              :possibleHours="possibleHours"
              class="mb-6"
            />

            <MemberPayments :member="member" class="mb-6" />

            <MemberSponsors :member="member" class="mb-6" />

            <v-card class="mb-4" v-if="member.type != 'Mentor'">
              <v-card-title class="text-h5">Parents</v-card-title>

              <v-simple-table
                dense
                v-if="member.parents.length > 0"
                style="white-space: nowrap"
              >
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Name</th>
                      <th class="text-left">Relationship</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-ripple
                      style="cursor: pointer"
                      v-for="parent in member.parents"
                      :key="parent._id"
                      @click="edit_parent = { data: parent, open: true }"
                    >
                      <td class="font-weight-black">{{ parent.name }}</td>
                      <td>{{ parent.relationship }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>

              <v-card-text v-else>
                <p class="grey--text font-italic pb-0 mb-0 text-center">
                  No parents added
                </p>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  @click="edit_parent = { data: { _id: 'new' }, open: true }"
                  ><v-icon left>mdi-plus</v-icon>New</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-img :src="`/api/content/members/${member.username}.jpg`"></v-img>

            <section v-if="$root.user.role > 2">
              <h5 class="text-h5 mt-3">Actions</h5>

              <v-list dense class="transparent mt-3">
                <v-list-item
                  :disabled="!changes"
                  @click="save()"
                  :class="{ 'blue--text': changes, 'grey--text': !changes }"
                >
                  <v-list-item-icon
                    ><v-icon
                      left
                      :class="{ 'blue--text': changes, 'grey--text': !changes }"
                      >mdi-content-save</v-icon
                    ></v-list-item-icon
                  >
                  <v-list-item-title>Save Changes</v-list-item-title>
                </v-list-item>

                <v-list-item @click="refresh()" :disabled="!changes">
                  <v-list-item-icon
                    ><v-icon left :class="{ 'grey--text': !changes }"
                      >mdi-undo-variant</v-icon
                    ></v-list-item-icon
                  >
                  <v-list-item-title>Revert Changes</v-list-item-title>
                </v-list-item>

                <v-list-item @click="reset = true">
                  <v-list-item-icon
                    ><v-icon left
                      >mdi-form-textbox-password</v-icon
                    ></v-list-item-icon
                  >
                  <v-list-item-title>Reset Password</v-list-item-title>
                </v-list-item>

                <v-list-item @click="edit = true" class="amber--text">
                  <v-list-item-icon
                    ><v-icon left class="amber--text"
                      >mdi-pencil</v-icon
                    ></v-list-item-icon
                  >
                  <v-list-item-title>Edit Profile</v-list-item-title>
                </v-list-item>

                <v-list-item @click="confirm_delete = true" class="red--text">
                  <v-list-item-icon
                    ><v-icon left class="red--text"
                      >mdi-delete</v-icon
                    ></v-list-item-icon
                  >
                  <v-list-item-title>Delete Member</v-list-item-title>
                </v-list-item>

                <!-- <v-list-item disabled>
                <v-list-item-icon
                  ><v-icon left class="grey--text"
                    >mdi-image</v-icon
                  ></v-list-item-icon
                >
                <v-list-item-title>Replace Picture</v-list-item-title>
              </v-list-item> -->
              </v-list>
            </section>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <v-dialog v-model="edit" width="800px">
      <v-card>
        <v-card-title>
          <h4
            class="text-h4 font-weight-black mt-1"
            v-if="$vuetify.breakpoint.mdAndUp"
          >
            EDIT MEMBER
          </h4>
          <h5 class="text-h5 font-weight-black mt-1" v-else>EDIT MEMBER</h5>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                class="mb-4"
                hide-details
                v-model="member.name"
                label="Name"
                @change="changes = true"
                prepend-icon="mdi-account"
              ></v-text-field>

              <v-text-field
                class="mb-4"
                hide-details
                v-model="member.shortname"
                label="Short Name"
                @change="changes = true"
                prepend-icon="mdi-account"
              ></v-text-field>

              <v-text-field
                class="mb-4"
                hide-details
                v-model="member.fullname"
                label="Legal Name"
                @change="changes = true"
                prepend-icon="mdi-gavel"
              ></v-text-field>

              <v-text-field
                class="mb-4"
                hide-details
                v-model="member.email"
                label="Email"
                @change="changes = true"
                prepend-icon="mdi-email"
              ></v-text-field>

              <v-text-field
                class="mb-4"
                hide-details
                v-model="member.phone"
                label="Phone"
                @change="changes = true"
                prepend-icon="mdi-phone"
              ></v-text-field>

              <v-text-field
                class="mb-4"
                hide-details
                v-model="member.address"
                label="Address"
                @change="changes = true"
                prepend-icon="mdi-home"
              ></v-text-field>

              <v-menu
                ref="dob_menu"
                v-model="dob_menu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="member.dob"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="member.dob"
                    label="Date of Birth"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    hide-details
                    class="mb-4"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-if="dob_menu"
                  v-model="member.dob"
                  full-width
                  @click:date="$refs.dob_menu.save(member.dob)"
                  color="primary"
                ></v-date-picker>
              </v-menu>

              <v-select
                class="mb-4"
                hide-details
                :items="types"
                v-model="member.type"
                label="Type"
                @change="changes = true"
                prepend-icon="mdi-star"
              ></v-select>

              <v-select
                class="mb-4"
                hide-details
                :items="roles"
                v-model="member.role"
                label="Role"
                @change="changes = true"
                prepend-icon="mdi-account-tie-hat"
              ></v-select>

              <v-select
                class="mb-4"
                hide-details
                :items="positions"
                v-model="member.position"
                label="Position"
                @change="changes = true"
                prepend-icon="mdi-account-arrow-up"
              ></v-select>

              <v-select
                class="mb-4"
                hide-details
                :items="subteams"
                v-model="member.subteam"
                label="Subteam"
                @change="changes = true"
                prepend-icon="mdi-account-group"
              ></v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                class="mb-4"
                hide-details
                v-model="member.allergies"
                label="Food Allergies"
                @change="changes = true"
                prepend-icon="mdi-food-off"
              ></v-text-field>

              <v-checkbox
                class="mb-4"
                v-model="member.includeInAttendance"
                label="Include in Attendance"
                hide-details
              ></v-checkbox>

              <v-checkbox
                class="mb-4"
                v-model="member.includeInScouting"
                label="Include in Scouting"
                hide-details
              ></v-checkbox>

              <v-checkbox
                class="mb-4"
                v-model="member.resetPasswordOnNextLogin"
                label="Reset Password on Next Login"
                hide-details
              ></v-checkbox>

              <v-checkbox
                v-model="member.locked"
                label="Lock Account"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn text color="grey" @click="refresh()">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="save()"
            >Save<v-icon right>mdi-content-save</v-icon></v-btn
          >
        </v-card-actions>

        <v-btn
          style="position: absolute; top: 8px; right: 8px"
          @click="edit = false"
          fab
          top
          right
          elevation="0"
          class="transparent"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirm_delete" max-width="400" persistent>
      <v-card style="border: 3px #f44336 solid; background: #212121 !important">
        <v-card-title>
          <h4
            class="text-h4 font-weight-black mt-1"
            v-if="$vuetify.breakpoint.mdAndUp"
          >
            CONFIRM
          </h4>
          <h5 class="text-h5 font-weight-black mt-1" v-else>CONFIRM</h5>
        </v-card-title>

        <v-card-text>
          Are you sure you want to delete this member? This action is
          irreversible.
        </v-card-text>

        <v-card-actions>
          <v-btn color="green" text @click="confirm_delete = false"
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteUser()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="reset" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <h4
            class="text-h4 font-weight-black mt-1"
            v-if="$vuetify.breakpoint.mdAndUp"
          >
            RESET PASSWORD
          </h4>
          <h5 class="text-h5 font-weight-black mt-1" v-else>RESET PASSWORD</h5>
        </v-card-title>

        <v-card-text>
          <v-text-field
            @input="changes = true"
            hide-details="auto"
            type="password"
            class="mb-4"
            v-model="new_password"
            label="New Password..."
            autocomplete="off"
          ></v-text-field>
          <v-text-field
            @input="changes = true"
            hide-details="auto"
            type="password"
            v-model="confirm_new_password"
            label="Confirm New Password..."
            autocomplete="off"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn text color="grey" @click="refresh()">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="save()"
            :disabled="!new_password || new_password != confirm_new_password"
            >Save<v-icon right>mdi-content-save</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog width="500" v-model="edit_parent.open" v-if="edit_parent.open">
      <v-card>
        <v-card-title>
          <h4
            class="text-h4 font-weight-black mt-1"
            v-if="$vuetify.breakpoint.mdAndUp"
          >
            {{
              edit_parent.data._id == "new"
                ? "NEW PARENT"
                : `EDIT ${edit_parent.data.name.toUpperCase()}`
            }}
          </h4>
          <h5 class="text-h5 font-weight-black mt-1" v-else>
            {{
              edit_parent.data._id == "new"
                ? "NEW PARENT"
                : `EDIT ${edit_parent.data.name.toUpperCase()}`
            }}
          </h5>
        </v-card-title>

        <v-card-text>
          <v-text-field
            class="mb-4"
            hide-details
            v-model="edit_parent.data.name"
            label="Name"
            @change="changes = true"
            prepend-icon="mdi-account"
          ></v-text-field>

          <v-text-field
            class="mb-4"
            hide-details
            v-model="edit_parent.data.email"
            label="Email"
            @change="changes = true"
            prepend-icon="mdi-email"
          ></v-text-field>

          <v-text-field
            class="mb-4"
            hide-details
            v-model="edit_parent.data.phone"
            label="Phone"
            @change="changes = true"
            prepend-icon="mdi-phone"
          ></v-text-field>

          <v-text-field
            class="mb-4"
            hide-details
            v-model="edit_parent.data.address"
            label="Address"
            @change="changes = true"
            prepend-icon="mdi-home"
          ></v-text-field>

          <v-text-field
            class="mb-4"
            hide-details
            v-model="edit_parent.data.relationship"
            label="Relationship"
            @change="changes = true"
            prepend-icon="mdi-account-child"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn
            text
            color="grey"
            @click="edit_parent = { open: false, data: {} }"
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveParent()"
            ><v-icon left>mdi-content-save</v-icon>Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AttendancePersonalStats from "../components/AttendancePersonalStats.vue";
import MemberPayments from "../components/MemberPayments.vue";
import MemberSponsors from "../components/MemberSponsors.vue";
import Editor from "../components/Editor.vue";
import dayjs from "dayjs";

export default {
  name: "Member",
  data() {
    return {
      member: false,
      possibleHours: 0,
      edit: false,
      changes: false,
      confirm_delete: false,
      dob_menu: false,
      edit_parent: {
        data: {},
        open: false,
      },
      reset: false,
      new_password: "",
      confirm_new_password: "",

      types: ["Freshman", "Sophomore", "Junior", "Senior", "Mentor"],
      roles: [
        { text: "Member", value: 1 },
        { text: "Manager", value: 2 },
        { text: "Admin", value: 3 },
        { text: "Sysadmin", value: 4 },
      ],
      positions: [
        "Member",
        "Team Lead",
        "Captain",
        "Mentor",
        "Head Coach",
        "Head Moderator",
      ],
      subteams: ["", "Mechanical", "Electronics", "Code", "Scouting", "Media"],

      roleMap: {
        1: "Member",
        2: "Manager",
        3: "Admin",
        4: "Sysadmin",
      },
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
          text: "Members",
          disabled: false,
          exact: true,
          to: "/members",
        },
        {
          text: "",
          disabled: true,
          to: `/members/${this.member._id}`,
        },
      ];
    },
  },
  methods: {
    refresh() {
      this.edit = false;
      this.changes = false;
      this.$root.loading = true;
      this.reset = false;
      this.new_password = "";
      this.confirm_new_password = "";
      this.$http
        .get(`/api/auth/users/${this.$route.params.id}`)
        .then((response3) => {
          this.$http
            .get(`/api/meeting/leaderboard/${this.$route.params.id}`)
            .then((response) => {
              this.leaderboard = [response.data.leaderboard];
              this.possibleHours = response.data.possibleHours;
              this.$http.get("/api/meeting").then((response2) => {
                this.meetings = response2.data;
                for (let i of this.meetings) {
                  if (!i.attendance) i.attendance = {};
                }
                this.$root.loading = false;
                this.member = response3.data;
                this.$root.loading = false;
              });
            });
        });
    },
    save() {
      let sendRequest = (change) => {
        this.$http
          .put(`/api/auth/${this.member._id}?password=${change}`, this.member)
          .then(() => {
            this.edit = false;
            this.changes = false;
            this.edit_parent = {
              open: false,
              data: {},
            };
            this.reset = false;
            this.new_password = "";
            this.confirm_new_password = "";
          });
      };

      if (this.new_password) {
        if (this.new_password == this.confirm_new_password) {
          this.member.password = this.new_password;
          sendRequest("true");
        }
      } else sendRequest("false");
    },
    saveParent() {
      if (this.edit_parent.data._id == "new") {
        delete this.edit_parent.data._id;
        this.member.parents.push(this.edit_parent.data);
      } else {
        const index = this.member.parents.findIndex(
          (i) => i._id == this.edit_parent.data._id
        );
        this.member.parents[index] = this.edit_parent.data;
      }
      this.save();
    },
    deleteUser() {
      this.$http.delete(`/api/auth/${this.member._id}`).then(() => {
        this.$router.push("/members");
      });
    },
  },
  created() {
    this.refresh();
  },
  components: {
    AttendancePersonalStats,
    MemberPayments,
    MemberSponsors,
    Editor,
  },
};
</script>

<style scoped>
</style>
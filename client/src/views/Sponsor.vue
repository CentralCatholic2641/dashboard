<template>
  <div v-if="sponsor">
    <v-toolbar dense color="grey darken-4" style="z-index: 1">
      <v-toolbar-title class="d-flex">
        <v-breadcrumbs
          v-if="$vuetify.breakpoint.smAndUp"
          :items="breadcrumbs"
          divider="/"
          class="pa-0 ma-0"
        ></v-breadcrumbs>

        <h6 class="text-h6 font-weight-black">{{ sponsor.sponsor.org }}</h6>
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
                    <td style="width: 150px" class="font-weight-black">
                      Level
                    </td>
                    <td
                      v-if="sponsor.sponsor.level == 'Blue'"
                      class="blue--text text--darken-2 font-weight-black"
                    >
                      {{ sponsor.sponsor.level }}
                    </td>
                    <td
                      v-else-if="sponsor.sponsor.level == 'Gold'"
                      style="color: #c6981e"
                      class="font-weight-black"
                    >
                      {{ sponsor.sponsor.level }}
                    </td>
                    <td
                      v-else-if="sponsor.sponsor.level == 'Platinum'"
                      class="font-weight-black"
                      style="color: #728cb0"
                    >
                      {{ sponsor.sponsor.level }}
                    </td>
                    <td v-else>-</td>
                  </tr>

                  <tr>
                    <td style="width: 150px" class="font-weight-black">
                      Value
                    </td>
                    <td v-if="sponsor.sponsor.value">
                      ${{ sponsor.sponsor.value }}
                    </td>
                    <td v-else>-</td>
                  </tr>

                  <tr>
                    <td style="width: 150px" class="font-weight-black">
                      Member
                    </td>
                    <td>
                      {{
                        memberslist.find(
                          (i) => i.value == sponsor.sponsor.member
                        )
                          ? memberslist.find(
                              (i) => i.value == sponsor.sponsor.member
                            ).text
                          : "-"
                      }}
                    </td>
                  </tr>

                  <tr>
                    <td style="width: 150px" class="font-weight-black">
                      Contact
                    </td>
                    <td>
                      {{ sponsor.name || "-" }}
                    </td>
                  </tr>

                  <tr>
                    <td style="width: 150px" class="font-weight-black">
                      Username
                    </td>
                    <td>
                      {{ sponsor.username || "-" }}
                    </td>
                  </tr>

                  <tr>
                    <td style="width: 150px" class="font-weight-black">
                      Email
                    </td>
                    <td v-if="sponsor.email">
                      <a class="blue--text" :href="`mailto:${sponsor.email}`">{{
                        sponsor.email
                      }}</a>
                    </td>
                    <td v-else>-</td>
                  </tr>

                  <tr>
                    <td style="width: 150px" class="font-weight-black">
                      Phone
                    </td>
                    <td>
                      {{ sponsor.phone || "-" }}
                    </td>
                  </tr>

                  <tr>
                    <td style="width: 150px" class="font-weight-black">
                      Address
                    </td>
                    <td>
                      {{ sponsor.address || "-" }}
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
                  v-model="sponsor.notes"
                  placeholder="Notes..."
                />
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-img
              :src="`/api/content/sponsors/${sponsor.username}.png`"
            ></v-img>

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
                  <v-list-item-title>Edit Information</v-list-item-title>
                </v-list-item>

                <v-list-item @click="confirm_delete = true" class="red--text">
                  <v-list-item-icon
                    ><v-icon left class="red--text"
                      >mdi-delete</v-icon
                    ></v-list-item-icon
                  >
                  <v-list-item-title>Delete Sponsor</v-list-item-title>
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

    <v-dialog v-model="edit" width="700px">
      <v-card>
        <v-card-title>
          <h4
            class="text-h4 font-weight-black mt-1"
            v-if="$vuetify.breakpoint.mdAndUp"
          >
            EDIT SPONSOR
          </h4>
          <h5 class="text-h5 font-weight-black mt-1" v-else>EDIT SPONSOR</h5>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Organization*"
                v-model="sponsor.sponsor.org"
                hide-details
                prepend-icon="mdi-domain"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                :items="memberslist"
                label="Member to Benefit"
                v-model="sponsor.sponsor.member"
                hide-details
                prepend-icon="mdi-account-group"
              ></v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                label="Value"
                v-model="sponsor.sponsor.value"
                hide-details
                prepend-icon="mdi-currency-usd"
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Contact*"
                v-model="sponsor.name"
                hide-details
                prepend-icon="mdi-account-cash"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Phone"
                v-model="sponsor.phone"
                hide-details
                prepend-icon="mdi-phone"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                label="Email"
                v-model="sponsor.email"
                hide-details
                prepend-icon="mdi-email"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Address"
                v-model="sponsor.address"
                hide-details
                prepend-icon="mdi-map-marker"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-select
                :items="levels"
                label="Level"
                v-model="sponsor.sponsor.level"
                hide-details
                prepend-icon="mdi-cash-multiple"
              ></v-select>
            </v-col>

            <!-- <v-col cols="12" md="6">
                  <v-text-field
                    hide-details="auto"
                    label="Username*"
                    v-model="sponsor.username"
                    :error-messages="error.username"
                    autocomplete="off"
                    prepend-icon="mdi-account"
                  ></v-text-field>
                </v-col> -->
          </v-row>
          <v-checkbox
            class="mb-4"
            v-model="sponsor.resetPasswordOnNextLogin"
            label="Reset Password on Next Login"
            hide-details
          ></v-checkbox>

          <v-checkbox
            v-model="sponsor.locked"
            label="Lock Account"
            hide-details
          ></v-checkbox>
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

    <v-dialog v-model="reset" persistent max-width="500px">
      <v-card>
        <v-card-title
          ><h4 class="text-h4 font-weight-black mt-1">
            RESET PASSWORD
          </h4></v-card-title
        >

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
          Are you sure you want to delete this sponsor? This action is
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
  </div>
</template>

<script>
import Editor from "../components/Editor.vue";

export default {
  name: "Sponsor",
  data() {
    return {
      sponsor: false,
      edit: false,
      changes: false,
      confirm_delete: false,
      levels: ["Blue", "Gold", "Platinum"],
      memberslist: [
        {
          text: "-",
          value: null,
        },
      ],
      reset: false,
      new_password: "",
      confirm_new_password: "",
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
          text: "Sponsors",
          disabled: false,
          exact: true,
          to: "/sponsors",
        },
        {
          text: "",
          disabled: true,
          to: `/sponsors/${this.sponsor._id}`,
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
        .then((response) => {
          this.$http.get("/api/auth/users").then((response2) => {
            for (let i of response2.data) {
              this.memberslist.push({
                text: i.name,
                value: i._id,
              });
            }
            this.sponsor = response.data;
            this.$root.loading = false;
          });
        });
    },
    save() {
      let sendRequest = (change) => {
        this.$http
          .put(`/api/auth/${this.sponsor._id}?password=${change}`, this.sponsor)
          .then(() => {
            this.edit = false;
            this.changes = false;
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
    deleteUser() {
      this.$http.delete(`/api/auth/${this.sponsor._id}`).then(() => {
        this.$router.push("/sponsors");
      });
    },
  },
  created() {
    this.refresh();
  },
  components: {
    Editor,
  },
};
</script>

<style scoped>
</style>
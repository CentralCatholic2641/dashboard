<template>
  <div v-if="payment">
    <v-toolbar dense color="grey darken-4" style="z-index: 1">
      <v-toolbar-title class="d-flex">
        <v-breadcrumbs
          v-if="$vuetify.breakpoint.smAndUp"
          :items="breadcrumbs"
          divider="/"
          class="pa-0 ma-0"
        ></v-breadcrumbs>

        <h6 class="text-h6 font-weight-black">{{ payment.title }}</h6>
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
                    <td style="width: 100px" class="font-weight-black">
                      Value
                    </td>
                    <td>${{ payment.value || "-" }}</td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">Type</td>
                    <td>{{ payment.type || "-" }}</td>
                  </tr>

                  <tr>
                    <td style="width: 100px" class="font-weight-black">Due</td>
                    <td>{{ dueDate || "-" }}</td>
                  </tr>
                </table>
              </v-card-text>
            </v-card>

            <v-card class="mb-6">
              <v-card-title class="text-h5">Notes</v-card-title>

              <v-card-text class="pb-0 mb-0 white--text">
                <Editor
                  @input="changes = true"
                  v-model="payment.notes"
                  placeholder="Notes..."
                />
              </v-card-text>
            </v-card>

            <v-card class="mb-6">
              <v-simple-table
                class="transparent"
                dense
                style="white-space: nowrap"
              >
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left" style="width: 56px"></th>
                      <th class="text-left">Name</th>
                      <th class="text-left">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      :class="{
                        'grey--text font-italic':
                          !payment.members[member._id].included,
                      }"
                      v-for="member in membersToRender"
                      :key="member._id"
                    >
                      <td
                        @click="
                          (payment.members[member._id].included =
                            !payment.members[member._id].included),
                            (changes = true)
                        "
                        v-ripple
                        style="cursor: pointer"
                      >
                        <v-icon>{{
                          payment.members[member._id].included
                            ? "mdi-check"
                            : ""
                        }}</v-icon>
                      </td>
                      <td
                        @click="$router.push(`/members/${member._id}`)"
                        v-ripple
                        style="cursor: pointer"
                        class="font-weight-black"
                      >
                        {{ member.name }}
                      </td>
                      <td
                        :class="
                          getColor(
                            payment.members[member._id].status,
                            payment.members[member._id].included
                          )
                        "
                        @click="cycleStatus(member._id)"
                        v-ripple
                        style="cursor: pointer"
                      >
                        {{
                          payment.members[member._id].included
                            ? payment.members[member._id].status
                            : "-"
                        }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="mb-6">
              <v-card-text class="white--text">
                <div class="mr-5">
                  <h3
                    :class="getPercentColor(percentIn * 100)"
                    class="text-h3 font-weight-light white--text mb-1"
                  >
                    {{ (percentIn * 100).toFixed(1) }}%
                  </h3>
                  <p class="pa-0 ma-0">Paid</p>
                </div>
              </v-card-text>
            </v-card>

            <section>
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

                <v-list-item @click="edit = true" class="amber--text">
                  <v-list-item-icon
                    ><v-icon left class="amber--text"
                      >mdi-pencil</v-icon
                    ></v-list-item-icon
                  >
                  <v-list-item-title>Edit Payment</v-list-item-title>
                </v-list-item>

                <v-list-item @click="confirm_delete = true" class="red--text">
                  <v-list-item-icon
                    ><v-icon left class="red--text"
                      >mdi-delete</v-icon
                    ></v-list-item-icon
                  >
                  <v-list-item-title>Delete Payment</v-list-item-title>
                </v-list-item>
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
            EDIT PAYMENT
          </h4>
          <h5 class="text-h5 font-weight-black mt-1" v-else>EDIT PAYMENT</h5>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Title"
                prepend-icon="mdi-format-title"
                v-model="payment.title"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="payment.type"
                label="Type"
                hide-details
                :items="types"
                prepend-icon="mdi-format-list-bulleted-type"
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-menu
                ref="date_menu"
                v-model="date_menu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="payment.due"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="payment.due"
                    label="Due"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    hide-details
                    class="mb-4"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-if="date_menu"
                  v-model="payment.due"
                  full-width
                  @click:date="$refs.date_menu.save(payment.due)"
                  color="primary"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                label="Value"
                type="number"
                v-model="payment.value"
                hide-details
                prepend-icon="mdi-currency-usd"
              ></v-text-field>
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
          Are you sure you want to delete this payment? This action is
          irreversible.
        </v-card-text>

        <v-card-actions>
          <v-btn color="green" text @click="confirm_delete = false"
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deletePayment()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Editor from "../components/Editor.vue";
import dayjs from "dayjs";

export default {
  name: "Payment",
  data() {
    return {
      payment: false,
      members: [],
      edit: false,
      changes: false,
      confirm_delete: false,
      date_menu: false,
      types: ["Dues", "Competition", "Other"],
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
          text: "Payments",
          disabled: false,
          exact: true,
          to: "/payments",
        },
        {
          text: "",
        },
      ];
    },
    membersToRender() {
      let data = [];

      for (let i of this.members) {
        if (!this.payment.members[i._id]) this.payment.members[i._id] = {};
        if (this.payment.members[i._id].included) data.push(i);
      }

      for (let i of this.members) {
        if (!this.payment.members[i._id]) this.payment.members[i._id] = {};
        if (!this.payment.members[i._id].included) data.push(i);
      }

      return data;
    },
    percentIn() {
      let totalIncluded = 0;
      let totalPaid = 0;

      for (let i in this.payment.members) {
        if (this.payment.members[i].included) totalIncluded++;
        if (
          this.payment.members[i].status == "Paid" ||
          this.payment.members[i].status == "Sponsored"
        )
          totalPaid++;
      }

      return totalPaid / totalIncluded;
    },
    dueDate() {
      return dayjs(this.payment.due).format("dddd, MMMM D, YYYY");
    },
  },
  methods: {
    refresh() {
      if (this.$root.user.role > 2) {
        this.$root.loading = true;
        this.edit = false;
        this.changes = false;
        this.$http.get(`/api/auth/users`).then((response2) => {
          this.$http
            .get(`/api/payment/${this.$route.params.id}`)
            .then((response) => {
              this.$root.loading = false;
              this.payment = response.data;
              this.members = response2.data;
            });
        });
      } else this.$router.replace("/");
    },
    save() {
      this.$http
        .put(`/api/payment/${this.payment._id}`, this.payment)
        .then(() => {
          this.edit = false;
          this.changes = false;
        });
    },
    deletePayment() {
      this.$http.delete(`/api/payment/${this.payment._id}`).then(() => {
        this.$router.push("/payments");
      });
    },
    getColor(status, included) {
      if (!included) return "";
      else if (status == "Paid") return "green--text";
      else if (status == "Not paid") return "red--text font-weight-black";
      else if (status == "Sponsored") return "blue--text";
      else if (status == "Deferred") return "grey--text";
    },
    cycleStatus(id) {
      this.changes = true;
      if (this.payment.members[id].status == "Not paid")
        this.payment.members[id].status = "Paid";
      else if (this.payment.members[id].status == "Paid")
        this.payment.members[id].status = "Sponsored";
      else if (this.payment.members[id].status == "Sponsored")
        this.payment.members[id].status = "Deferred";
      else if (this.payment.members[id].status == "Deferred")
        this.payment.members[id].status = "Not paid";
    },
    getPercentColor(grade) {
      if (grade > 80) return "green--text";
      else if (grade > 70) return "light-green--text";
      else if (grade > 60) return "lime--text";
      else if (grade > 50) return "yellow--text";
      else if (grade > 40) return "orange--text";
      else if (grade > 30) return "deep-orange--text";
      else return "red--text";
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
<template>
  <div>
    <v-toolbar dense color="grey darken-4" style="z-index: 1">
      <v-toolbar-title class="d-flex">
        <v-breadcrumbs
          v-if="$vuetify.breakpoint.smAndUp"
          :items="breadcrumbs"
          divider="/"
          class="pa-0 ma-0"
        ></v-breadcrumbs>

        <h6 class="text-h6 font-weight-black">Mailing</h6>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn color="primary" :disabled="emails.length == 0" @click="emails = []"
        ><v-icon left>mdi-close</v-icon>Clear</v-btn
      >
    </v-toolbar>

    <div
      :style="`height: calc(100vh - ${
        $vuetify.breakpoint.mdAndUp ? '112px' : '104px'
      }); overflow: auto`"
    >
      <v-container style="max-width: 1185px" class="px-8 pt-0 mt-4">
        <v-card @click="copyEmails()" class="mt-6" v-if="emails.length != 0">
          <v-card-text class="white--text">
            <span v-for="email in emails" :key="email"> {{ email }}, </span>
          </v-card-text>
        </v-card>

        <v-card class="mt-6" v-else>
          <v-card-text class="font-italic text-center"
            >No email addresses added.</v-card-text
          >
        </v-card>

        <v-row class="mt-3">
          <v-col cols="12" md="6">
            <v-card class="mb-6">
              <v-card-title class="text-h5">Add...</v-card-title>

              <v-card-text class="text-center">
                <v-btn
                  class="mx-1 mb-2"
                  color="blue darken-4"
                  large
                  @click="mailTo('everyone')"
                  >Everyone</v-btn
                >
                <v-btn
                  class="mx-1 mb-2"
                  color="blue darken-4"
                  large
                  @click="mailTo('members')"
                  >Members</v-btn
                >
                <v-btn
                  class="mx-1 mb-2"
                  color="blue darken-4"
                  large
                  @click="mailTo('mentors')"
                  >Mentors</v-btn
                >
                <v-btn
                  class="mx-1 mb-2"
                  color="blue darken-4"
                  large
                  @click="mailTo('parents')"
                  >Parents</v-btn
                >
                <br />
                <v-btn
                  class="mx-1 mb-2"
                  color="red darken-4"
                  large
                  @click="mailTo('mechanical')"
                  >Mechanical</v-btn
                >
                <v-btn
                  class="mx-1 mb-2"
                  color="red darken-4"
                  large
                  @click="mailTo('electronics')"
                  >Electronics</v-btn
                >
                <v-btn
                  class="mx-1 mb-2"
                  color="red darken-4"
                  large
                  @click="mailTo('code')"
                  >Code</v-btn
                >
              </v-card-text>
            </v-card>

            <v-card>
              <v-card-title class="text-h5">Parents</v-card-title>

              <v-simple-table
                class="transparent"
                v-if="contacts.length != 0"
                dense
              >
                <template v-slot:default>
                  <tbody>
                    <tr
                      v-ripple
                      style="cursor: pointer"
                      v-for="contact in contacts.filter(
                        (i) => i.parents.length != 0
                      )"
                      :key="contact._id"
                      :class="{
                        highlighted: isIn(contact.parents[0].email),
                      }"
                      @click="toggleAddress(contact.parents[0].email)"
                    >
                      <td style="width: 75px">
                        <v-icon v-if="isIn(contact.parents[0].email)"
                          >mdi-check</v-icon
                        >
                      </td>
                      <td class="font-weight-black">
                        {{ contact.parents[0].name }}
                      </td>
                      <td>({{ contact.name }})</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="mb-2">
              <v-card-title class="text-h5">Members</v-card-title>

              <v-simple-table
                class="transparent"
                v-if="contacts.length != 0"
                dense
              >
                <template v-slot:default>
                  <tbody>
                    <tr
                      v-ripple
                      style="cursor: pointer"
                      v-for="contact in contacts"
                      :key="contact._id"
                      :class="{
                        highlighted: isIn(contact.email),
                      }"
                      @click="toggleAddress(contact.email)"
                    >
                      <td style="width: 75px">
                        <v-icon v-if="isIn(contact.email)">mdi-check</v-icon>
                      </td>
                      <td class="font-weight-black">{{ contact.name }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: "Mailing",
  data() {
    return {
      contacts: [],
      emails: [],
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
          to: "/mailroom",
        },
      ];
    },
  },
  methods: {
    refresh() {
      if (this.$root.user.role > 2) {
        this.$root.loading = true;
        this.$http.get("/api/auth/email").then((response) => {
          this.contacts = response.data;
          this.$root.loading = false;
        });
      } else this.$router.replace("/");
    },
    toggleAddress(address) {
      if (this.emails.includes(address)) {
        this.emails.splice(this.emails.indexOf(address), 1);
      } else {
        this.emails.push(address);
      }
    },
    copyEmails() {
      let data = "";
      for (let email of this.emails) {
        data += email + ";";
      }
      navigator.clipboard.writeText(data);
    },
    isIn(address) {
      return this.emails.includes(address);
    },
    mailTo(i) {
      let data = [];
      switch (i) {
        case "everyone":
          for (let i of this.contacts) {
            if (i.parents) {
              for (let j of i.parents) {
                if (j.email && !data.includes(j.email)) data.push(j.email);
              }
            }
            if (i.email && !data.includes(i.email)) data.push(i.email);
          }
          break;
        case "members":
          for (let i of this.contacts) {
            if (i.email && !data.includes(i.email) && i.type != "Mentor")
              data.push(i.email);
          }
          break;
        case "mentors":
          for (let i of this.contacts) {
            if (i.email && !data.includes(i.email) && i.type == "Mentor")
              data.push(i.email);
          }
          break;
        case "parents":
          for (let i of this.contacts) {
            if (i.parents) {
              for (let j of i.parents) {
                if (!data.includes(j.email) && j.email) data.push(j.email);
              }
            }
          }
          break;
        case "mechanical":
          for (let i of this.contacts) {
            if (i.email && !data.includes(i.email) && i.subteam == "Mechanical")
              data.push(i.email);
          }
          break;
        case "electronics":
          for (let i of this.contacts) {
            if (
              i.email &&
              !data.includes(i.email) &&
              i.subteam == "Electronics"
            )
              data.push(i.email);
          }
          break;
        case "code":
          for (let i of this.contacts) {
            if (i.email && !data.includes(i.email) && i.subteam == "Code")
              data.push(i.email);
          }
          break;
      }
      this.emails = data;
    },
    open(path) {
      window.location.href = path;
    },
  },
  created() {
    this.refresh();
  },
};
</script>

<style scoped>
</style>
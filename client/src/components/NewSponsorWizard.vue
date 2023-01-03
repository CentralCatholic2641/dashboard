<template>
  <div>
    <v-card-title>
      <h4
        class="text-h4 font-weight-black mt-1"
        v-if="$vuetify.breakpoint.mdAndUp"
      >
        NEW SPONSOR
      </h4>
      <h5 class="text-h5 font-weight-black mt-1" v-else>NEW SPONSOR</h5>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="Organization*"
            v-model="data.sponsor.org"
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
            v-model="data.sponsor.member"
            hide-details
            prepend-icon="mdi-account-group"
          ></v-select>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Value"
            v-model="data.sponsor.value"
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
            v-model="data.name"
            hide-details
            prepend-icon="mdi-account-cash"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            label="Phone"
            v-model="data.phone"
            hide-details
            prepend-icon="mdi-phone"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Email"
            v-model="data.email"
            hide-details
            prepend-icon="mdi-email"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field
            label="Address"
            v-model="data.address"
            hide-details
            prepend-icon="mdi-map-marker"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-select
            :items="levels"
            label="Level"
            v-model="data.sponsor.level"
            hide-details
            prepend-icon="mdi-cash-multiple"
          ></v-select>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            hide-details="auto"
            label="Username*"
            v-model="data.username"
            :error-messages="error.username"
            autocomplete="off"
            prepend-icon="mdi-account"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-btn text color="grey" @click="$emit('close')">Cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="createUser()"
        :disabled="
          !data.sponsor.org ||
          !data.name ||
          !data.username ||
          !data.password ||
          !confirm_password
        "
        >Create<v-icon right>mdi-chevron-right</v-icon></v-btn
      >
    </v-card-actions>
  </div>
</template>

<script>
export default {
  name: "NewSponsorWizard",
  props: ["members"],
  data() {
    return {
      confirm_password: "",
      data: {
        sponsor: {},
        type: "Sponsor",
        includeInScouting: false,
        includeInAttendance: false,
        resetPasswordOnNextLogin: true,
        locked: false,
        role: 100,
        position: "Sponsor",
      },
      error: {
        username: "",
        password: "",
      },
      levels: ["Blue", "Gold", "Platinum"],
    };
  },
  computed: {
    memberslist() {
      let data = [];

      for (let i of this.members) {
        data.push({
          text: i.name,
          value: i._id,
        });
      }

      return data;
    },
  },
  methods: {
    createUser() {
      this.data.password = this.data.username;
      this.confirm_password = this.data.username;
      if (this.confirm_password == this.data.password) {
        this.$http.post("/api/auth/create", this.data).then((response) => {
          if (response.data.error) this.error = response.data.error;
          else {
            this.$emit("close");
          }
        });
      } else this.error.password = "Passwords do not match";
    },
  },
};
</script>

<style scoped></style>
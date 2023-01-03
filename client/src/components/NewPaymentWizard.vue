<template>
  <div>
    <v-card-title>
      <h4
        class="text-h4 font-weight-black mt-1"
        v-if="$vuetify.breakpoint.mdAndUp"
      >
        NEW PAYMENT
      </h4>
      <h5 class="text-h5 font-weight-black mt-1" v-else>NEW PAYMENT</h5>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            label="Title"
            prepend-icon="mdi-format-title"
            v-model="data.title"
            hide-details
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="data.type"
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
            :return-value.sync="data.due"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="data.due"
                label="Due"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                hide-details
                class="mb-n1"
              ></v-text-field>
            </template>
            <v-date-picker
              v-if="date_menu"
              v-model="data.due"
              full-width
              @click:date="$refs.date_menu.save(data.due)"
              color="primary"
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Value"
            type="number"
            v-model="data.value"
            hide-details
            prepend-icon="mdi-currency-usd"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-btn text color="grey" @click="$emit('close')">Cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="create()"
        :disabled="!data.title || !data.type || !data.value"
        >Create<v-icon right>mdi-chevron-right</v-icon></v-btn
      >
    </v-card-actions>
  </div>
</template>

<script>
export default {
  name: "NewPaymentWizard",
  data() {
    return {
      data: {},
      types: ["Dues", "Competition", "Other"],
      date_menu: false,
    };
  },
  methods: {
    create() {
      this.$http.post("/api/payment", this.data).then((response) => {
        this.$emit("close");
      });
    },
  },
};
</script>

<style scoped></style>
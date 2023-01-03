<template>
  <v-card>
    <v-card-title>
      <h4
        class="text-h4 font-weight-black mt-1"
        v-if="$vuetify.breakpoint.mdAndUp"
      >
        NEW MEETING
      </h4>
      <h5 class="text-h5 font-weight-black mt-1" v-else>NEW MEETING</h5>
    </v-card-title>

    <v-card-text>
      <v-text-field
        label="Name"
        v-model="data.name"
        prepend-icon="mdi-format-title"
      ></v-text-field>

      <v-menu
        ref="date_menu"
        v-model="date_menu"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="data.date"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="data.date"
            label="Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-if="date_menu"
          v-model="data.date"
          full-width
          @click:date="$refs.date_menu.save(data.date)"
          color="primary"
        ></v-date-picker>
      </v-menu>

      <v-menu
        ref="start_time_menu"
        v-model="start_time_menu"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="data.start"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="data.start"
            label="Start Time"
            prepend-icon="mdi-clock-start"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="start_time_menu"
          v-model="data.start"
          full-width
          @click:minute="$refs.start_time_menu.save(data.start)"
          format="24hr"
          color="primary"
        ></v-time-picker>
      </v-menu>

      <v-menu
        ref="end_time_menu"
        v-model="end_time_menu"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="data.end"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="data.end"
            label="End Time"
            prepend-icon="mdi-clock-end"
            readonly
            v-bind="attrs"
            v-on="on"
            hide-details
            class="mb-4"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="end_time_menu"
          v-model="data.end"
          full-width
          @click:minute="$refs.end_time_menu.save(data.end)"
          format="24hr"
          color="primary"
        ></v-time-picker>
      </v-menu>

      <v-checkbox
        v-model="data.bonus"
        hide-details
        label="Bonus Meeting?"
      ></v-checkbox>
    </v-card-text>

    <v-card-actions>
      <v-btn text color="grey" @click="$emit('close')">Cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="addEvent()"
        ><v-icon left>mdi-plus</v-icon>Add</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "NewMeetingWizard",
  data() {
    return {
      data: {},
      date_menu: false,
      start_time_menu: false,
      end_time_menu: false,
    };
  },
  methods: {
    addEvent() {
      this.data.attendance = {};
      this.$http.post("/api/meeting", this.data).then((response) => {
        this.data = {};
        this.$emit("close");
      });
    },
  },
};
</script>

<style scoped>
</style>
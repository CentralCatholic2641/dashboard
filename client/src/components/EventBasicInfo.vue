<template>
  <v-card class="mb-4">
    <v-card-title
      class="text-h5"
      @click.self="visible = !visible"
      v-ripple
      style="cursor: pointer"
    >
      <h5 @click.self="visible = !visible" class="text-h5">
        Basic Information
      </h5>
      <v-spacer></v-spacer>
      <v-icon size="30" class="ml-4">{{
        visible ? "mdi-chevron-up" : "mdi-chevron-down"
      }}</v-icon>
    </v-card-title>

    <v-card-text class="mt-0 pt-0 white--text" v-if="visible">
      <table>
        <tr>
          <td style="width: 100px" class="font-weight-black">Start</td>
          <td>{{ start || "-" }}</td>
        </tr>

        <tr>
          <td style="width: 100px" class="font-weight-black">End</td>
          <td>{{ end || "-" }}</td>
        </tr>

        <tr>
          <td style="width: 100px" class="font-weight-black">Location</td>
          <td>{{ event.location_name || "-" }}</td>
        </tr>

        <tr>
          <td style="width: 100px" class="font-weight-black">Address</td>
          <td>{{ event.address || "-" }}</td>
        </tr>

        <tr>
          <td style="width: 100px" class="font-weight-black">Website</td>
          <td v-if="event.website">
            <a target="_blank" class="blue--text" :href="event.website">{{
              event.website
            }}</a>
          </td>
          <td v-else>-</td>
        </tr>
      </table>
    </v-card-text>
  </v-card>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "EventBasicInfo",
  props: ["event"],
  data() {
    return {
      visible: true,
    };
  },
  computed: {
    start() {
      if (this.event)
        return dayjs(this.event.start_date).format("dddd, MMMM D, YYYY");
    },
    end() {
      if (this.event)
        return dayjs(this.event.end_date).format("dddd, MMMM D, YYYY");
    },
  },
};
</script>

<style scoped>
</style>
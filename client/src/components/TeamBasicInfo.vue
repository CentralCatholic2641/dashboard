<template>
  <v-card class="mb-6">
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
          <td style="width: 150px" class="font-weight-black">Location</td>
          <td>{{ team.city }}, {{ team.state_prov }}, {{ team.country }}</td>
        </tr>

        <tr>
          <td style="width: 150px" class="font-weight-black">Sponsors</td>
          <td>{{ team.name }}</td>
        </tr>

        <tr>
          <td style="width: 150px" class="font-weight-black">Rookie Year</td>
          <td>
            {{ team.rookie_year }} (Season {{ event.year - team.rookie_year }})
          </td>
        </tr>
      </table>

      <div class="d-flex">
        <v-spacer></v-spacer>
        <v-btn color="grey" text link :to="`/teams/${team.team_number}`"
          >See More<v-icon right>mdi-arrow-right</v-icon></v-btn
        >
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "TeamBasicInfo",
  props: ["event", "team"],
  data() {
    return {
      visible: true,
    };
  },
};
</script>

<style scoped>
</style>
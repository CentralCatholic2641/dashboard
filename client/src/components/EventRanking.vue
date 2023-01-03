<template>
  <v-card class="mb-4" style="white-space: nowrap">
    <v-card-title
      class="text-h5"
      @click.self="visible = !visible"
      v-ripple
      style="cursor: pointer"
    >
      <h5 @click.self="visible = !visible" class="text-h5">Ranking</h5>
      <v-spacer></v-spacer>
      <v-icon size="30" class="ml-4">{{
        visible ? "mdi-chevron-up" : "mdi-chevron-down"
      }}</v-icon>
    </v-card-title>

    <v-simple-table dense v-if="visible && ranking && ranking.length != 0">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Rank</th>
            <th class="text-left">#</th>
            <th class="text-left">Score</th>
            <th class="text-left">Avg</th>
            <th class="text-left">Record</th>
            <th class="text-left">DQ</th>
            <th class="text-left">Matches</th>
            <th class="text-left">RPs</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-ripple
            @click="
              $router.push(
                `/events/${event.key.toUpperCase()}/teams/${team.team_key.substring(
                  3
                )}`
              )
            "
            style="cursor: pointer"
            v-for="team in ranking"
            :key="team.team_key"
          >
            <td class="font-weight-black">{{ team.rank }}</td>
            <td>{{ team.team_key.substring(3) }}</td>
            <td>{{ team.sort_orders[0] }}</td>
            <td>{{ team.sort_orders[1] }}</td>
            <td>
              {{ team.record.wins }}-{{ team.record.losses }}-{{
                team.record.ties
              }}
            </td>
            <td>{{ team.dq }}</td>
            <td>{{ team.matches_played }}</td>
            <td>{{ team.extra_stats[0] }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-card-text v-else-if="visible && (!ranking || ranking.length == 0)">
      <p class="text-center mt-2 grey--text font-italic">
        Ranking data unavailable
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "EventRanking2022",
  props: ["event"],
  data() {
    return {
      ranking: false,
      opr_data: false,
      visible: true,
    };
  },
  methods: {
    refresh() {
      this.$root.loading = true;
      this.$http
        .get(`/api/event/${this.$route.params.code.toLowerCase()}/ranking`)
        .then((response) => {
          this.ranking = response.data.rankings;
          // this.opr_data = response.data.opr_data;
          this.$root.loading = false;
        });
    },
  },
  created() {
    this.refresh();
  },
};
</script>

<style scoped>
</style>
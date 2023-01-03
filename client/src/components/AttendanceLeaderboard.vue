<template>
  <div v-if="leaderboard">
    <v-card>
      <v-card-title
        class="text-h5"
        @click.self="visible = !visible"
        v-ripple
        style="cursor: pointer"
      >
        <h5 @click.self="visible = !visible" class="text-h5">Leaderboard</h5>
        <v-spacer></v-spacer>
        <v-icon size="30" class="ml-4">{{
          visible ? "mdi-chevron-up" : "mdi-chevron-down"
        }}</v-icon>
      </v-card-title>

      <v-simple-table dense v-if="visible" style="white-space: nowrap">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">#</th>
              <th class="text-left">Name</th>
              <th class="text-left">Meetings</th>
              <th class="text-left">Hours</th>
              <th class="text-left">Rate</th>
            </tr>
          </thead>

          <tbody v-if="$root.user.role > 2">
            <tr
              v-for="member in leaderboard"
              :key="member._id"
              @click="$router.push(`/members/${member._id}`)"
              style="cursor: pointer"
              v-ripple
            >
              <td class="font-weight-black">{{ member.rank }}</td>
              <td class="font-weight-black">{{ member.name }}</td>
              <td>
                {{ member.meetings
                }}<span class="grey--text" v-if="member.bonus != 0"
                  >&nbsp;+{{ member.bonus }}</span
                >
              </td>
              <td>{{ member.hours }}</td>
              <td
                :class="getColor((member.rawHours / possibleHours) * 100)"
                v-if="possibleHours != 0"
              >
                {{ ((member.rawHours / possibleHours) * 100).toFixed(1) }}%
              </td>
              <td v-else>-</td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr v-for="member in leaderboard" :key="member._id">
              <td class="font-weight-black">{{ member.rank }}</td>
              <td class="font-weight-black">{{ member.name }}</td>
              <td>
                {{ member.meetings
                }}<span class="grey--text" v-if="member.bonus != 0"
                  >&nbsp;+{{ member.bonus }}</span
                >
              </td>
              <td>{{ member.hours }}</td>
              <td :class="getColor((member.rawHours / possibleHours) * 100)">
                {{ ((member.rawHours / possibleHours) * 100).toFixed(1) }}%
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "AttendanceLeaderboard",
  props: ["leaderboard", "possibleHours"],
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    getColor(grade) {
      if (grade >= 100) return "platinum";
      else if (grade > 90) return "gold";
      else if (grade > 80) return "green--text";
      else if (grade > 70) return "light-green--text";
      else if (grade > 60) return "lime--text";
      else if (grade > 50) return "yellow--text";
      else if (grade > 40) return "orange--text";
      else if (grade > 30) return "deep-orange--text";
      else if (grade > 10) return "red--text";
      else if (grade != 0) return "deep-purple--text text--lighten-1";
      else return "blue--text text--darken-3";
    },
  },
};
</script>

<style scoped>
.gold {
  color: #c6981e;
}

.platinum {
  color: #728cb0;
}
</style>
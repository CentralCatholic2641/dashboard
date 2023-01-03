<template>
  <v-card style="white-space: nowrap">
    <v-card-title
      class="text-h5"
      @click.self="visible = !visible"
      v-ripple
      style="cursor: pointer"
      v-if="!$route.path.includes('/schedule')"
    >
      <h5 @click.self="visible = !visible" class="text-h5">Match Schedule</h5>
      <v-spacer></v-spacer>
      <v-icon size="30" class="ml-4">{{
        visible ? "mdi-chevron-up" : "mdi-chevron-down"
      }}</v-icon>
    </v-card-title>

    <v-simple-table dense v-if="visible && schedule.length != 0">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Match</th>
            <th class="text-left">Time</th>
            <th class="text-left red--text">Red 1</th>
            <th class="text-left red--text">Red 2</th>
            <th class="text-left red--text">Red 3</th>
            <th class="text-left blue--text">Blue 1</th>
            <th class="text-left blue--text">Blue 2</th>
            <th class="text-left blue--text">Blue 3</th>
            <th class="text-left red--text">Red</th>
            <th class="text-left blue--text">Blue</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-ripple
            style="cursor: pointer"
            v-for="(match, index) in schedule"
            :key="match.key"
          >
            <td
              @click="
                $router.push(
                  `/events/${
                    event.year
                  }${event.event_code.toUpperCase()}/schedule/${match.key
                    .substring(match.key.indexOf('_') + 1)
                    .toUpperCase()}`
                )
              "
              class="font-weight-black"
            >
              <span v-if="match.comp_level != 'f' && match.comp_level != 'qm'">
                {{ comp_levelMap[match.comp_level] }}
                {{ match.set_number }} -
                {{ match.match_number }}
              </span>
              <span v-else>
                {{ comp_levelMap[match.comp_level] }}
                {{ match.match_number }}
              </span>
            </td>
            <td
              @click="
                $router.push(
                  `/events/${
                    event.year
                  }${event.event_code.toUpperCase()}/schedule/${match.key
                    .substring(match.key.indexOf('_') + 1)
                    .toUpperCase()}`
                )
              "
            >
              {{ times[index] }}
            </td>
            <td
              @click="
                $router.push(
                  `/events/${
                    event.year
                  }${event.event_code.toUpperCase()}/teams/${match.alliances.red.team_keys[0].substring(
                    3
                  )}`
                )
              "
              class="red--text"
              :class="{ 'font-weight-black': match.winning_alliance == 'red' }"
            >
              {{ match.alliances.red.team_keys[0].substring(3) }}
            </td>
            <td
              @click="
                $router.push(
                  `/events/${
                    event.year
                  }${event.event_code.toUpperCase()}/teams/${match.alliances.red.team_keys[1].substring(
                    3
                  )}`
                )
              "
              class="red--text"
              :class="{ 'font-weight-black': match.winning_alliance == 'red' }"
            >
              {{ match.alliances.red.team_keys[1].substring(3) }}
            </td>
            <td
              @click="
                $router.push(
                  `/events/${
                    event.year
                  }${event.event_code.toUpperCase()}/teams/${match.alliances.red.team_keys[2].substring(
                    3
                  )}`
                )
              "
              class="red--text"
              :class="{ 'font-weight-black': match.winning_alliance == 'red' }"
            >
              {{ match.alliances.red.team_keys[2].substring(3) }}
            </td>
            <td
              @click="
                $router.push(
                  `/events/${
                    event.year
                  }${event.event_code.toUpperCase()}/teams/${match.alliances.blue.team_keys[0].substring(
                    3
                  )}`
                )
              "
              class="blue--text"
              :class="{ 'font-weight-black': match.winning_alliance == 'blue' }"
            >
              {{ match.alliances.blue.team_keys[0].substring(3) }}
            </td>
            <td
              @click="
                $router.push(
                  `/events/${
                    event.year
                  }${event.event_code.toUpperCase()}/teams/${match.alliances.blue.team_keys[1].substring(
                    3
                  )}`
                )
              "
              class="blue--text"
              :class="{ 'font-weight-black': match.winning_alliance == 'blue' }"
            >
              {{ match.alliances.blue.team_keys[1].substring(3) }}
            </td>
            <td
              @click="
                $router.push(
                  `/events/${
                    event.year
                  }${event.event_code.toUpperCase()}/teams/${match.alliances.blue.team_keys[2].substring(
                    3
                  )}`
                )
              "
              class="blue--text"
              :class="{ 'font-weight-black': match.winning_alliance == 'blue' }"
            >
              {{ match.alliances.blue.team_keys[2].substring(3) }}
            </td>
            <td
              @click="
                $router.push(
                  `/events/${
                    event.year
                  }${event.event_code.toUpperCase()}/schedule/${match.key
                    .substring(match.key.indexOf('_') + 1)
                    .toUpperCase()}`
                )
              "
              class="red--text"
              :class="{ 'font-weight-black': match.winning_alliance == 'red' }"
            >
              {{ match.alliances.red.score }}
            </td>
            <td
              @click="
                $router.push(
                  `/events/${
                    event.year
                  }${event.event_code.toUpperCase()}/schedule/${match.key
                    .substring(match.key.indexOf('_') + 1)
                    .toUpperCase()}`
                )
              "
              class="blue--text"
              :class="{ 'font-weight-black': match.winning_alliance == 'blue' }"
            >
              {{ match.alliances.blue.score }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-card-text v-else>
      <p class="grey--text font-italic text-center mt-4">
        Schedule unavailable
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "MatchSchedule2022",
  props: ["event", "schedule"],
  data() {
    return {
      comp_levelMap: {
        qm: "QM",
        qf: "QF",
        sf: "SF",
        f: "F",
      },
      dayjs,
      visible: true,
    };
  },
  computed: {
    times() {
      let data = [];

      for (let i of this.schedule) {
        data.push(dayjs(i.actual_time * 1000).format("M/D/YY [at] HH:mm"));
      }

      return data;
    },
  },
};
</script>

<style scoped>
</style>
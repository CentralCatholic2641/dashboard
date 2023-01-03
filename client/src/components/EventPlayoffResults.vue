<template>
  <v-card class="mb-4" style="white-space: nowrap">
    <v-card-title
      class="text-h5"
      @click.self="visible = !visible"
      v-ripple
      style="cursor: pointer"
    >
      <h5 @click.self="visible = !visible" class="text-h5">Playoff Results</h5>
      <v-spacer></v-spacer>
      <v-icon size="30" class="ml-4">{{
        visible ? "mdi-chevron-up" : "mdi-chevron-down"
      }}</v-icon>
    </v-card-title>

    <v-simple-table dense v-if="visible && playoffs.length != 0">
      <template v-slot:default>
        <thead>
          <tr>
            <!-- <th class="text-left"></th> -->
            <th class="text-left">Match</th>
            <th class="text-left red--text">R1</th>
            <th class="text-left red--text">R2</th>
            <th class="text-left red--text">R3</th>
            <th class="text-left blue--text">B1</th>
            <th class="text-left blue--text">B2</th>
            <th class="text-left blue--text">B3</th>
            <th class="text-left red--text">R</th>
            <th class="text-left blue--text">B</th>
          </tr>
        </thead>
        <tbody>
          <!-- <p style="margin: auto" class="text-center my-2 pa-0">
                    Quarterfinals
                  </p> -->
          <tr
            @click="
              $router.push(
                `/events/${
                  event.year
                }${event.event_code.toUpperCase()}/schedule/${match.key
                  .toUpperCase()
                  .substring(match.key.indexOf('_') + 1)}`
              )
            "
            v-ripple
            style="cursor: pointer"
            v-for="match in playoffs"
            :key="match.key"
          >
            <!-- <td style="width: 20px">
                      <v-btn icon small><v-icon>mdi-play</v-icon></v-btn>
                    </td> -->
            <td v-if="match.comp_level != 'f'" class="font-weight-black">
              {{ comp_levelMap[match.comp_level] }}
              {{ match.set_number }} -
              {{ match.match_number }}
            </td>
            <td v-else class="font-weight-black">
              {{ comp_levelMap[match.comp_level] }}
              {{ match.match_number }}
            </td>
            <td
              :class="{
                'font-weight-black': match.winning_alliance == 'red',
              }"
              class="red--text"
            >
              {{ match.alliances.red.team_keys[0].substring(3) }}
            </td>
            <td
              :class="{
                'font-weight-black': match.winning_alliance == 'red',
              }"
              class="red--text"
            >
              {{ match.alliances.red.team_keys[1].substring(3) }}
            </td>
            <td
              :class="{
                'font-weight-black': match.winning_alliance == 'red',
              }"
              class="red--text"
            >
              {{ match.alliances.red.team_keys[2].substring(3) }}
            </td>
            <td
              :class="{
                'font-weight-black': match.winning_alliance == 'blue',
              }"
              class="blue--text"
            >
              {{ match.alliances.blue.team_keys[0].substring(3) }}
            </td>
            <td
              :class="{
                'font-weight-black': match.winning_alliance == 'blue',
              }"
              class="blue--text"
            >
              {{ match.alliances.blue.team_keys[1].substring(3) }}
            </td>
            <td
              :class="{
                'font-weight-black': match.winning_alliance == 'blue',
              }"
              class="blue--text"
            >
              {{ match.alliances.blue.team_keys[2].substring(3) }}
            </td>
            <td
              :class="{
                'font-weight-black': match.winning_alliance == 'red',
              }"
              class="red--text"
            >
              {{ match.alliances.red.score }}
            </td>
            <td
              :class="{
                'font-weight-black': match.winning_alliance == 'blue',
              }"
              class="blue--text"
            >
              {{ match.alliances.blue.score }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-card-text v-else-if="visible && playoffs.length == 0">
      <p class="text-center mt-2 grey--text font-italic">
        Playoff results unavailable
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "EventPlayoffResults",
  props: ["event"],
  data() {
    return {
      visible: true,

      comp_levelMap: {
        qm: "QM",
        qf: "QF",
        sf: "SF",
        f: "F",
      },
    };
  },
  computed: {
    playoffs() {
      let data = JSON.parse(
        JSON.stringify(this.event.schedule.filter((i) => i.comp_level != "qm"))
      );

      const qf = data
        .filter((i) => i.comp_level == "qf")
        .sort((a, b) => a.set_number - b.set_number);

      const sf = data
        .filter((i) => i.comp_level == "sf")
        .sort((a, b) => a.set_number - b.set_number);

      const f = data
        .filter((i) => i.comp_level == "f")
        .sort((a, b) => a.set_number - b.set_number);

      return [...qf, ...sf, ...f];
    },
  },
};
</script>

<style scoped>
</style>
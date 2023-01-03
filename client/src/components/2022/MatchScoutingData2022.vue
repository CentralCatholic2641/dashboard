<template>
  <div style="white-space: nowrap">
    <v-simple-table dense v-if="scouting">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left"></th>
            <th class="text-left red--text">R1</th>
            <th class="text-left red--text">R2</th>
            <th class="text-left red--text">R3</th>
            <th class="text-left blue--text">B1</th>
            <th class="text-left blue--text">B2</th>
            <th class="text-left blue--text">B3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="font-weight-black">Team</td>
            <td
              @click="
                $router.push(
                  `/events/${match.key
                    .substring(0, match.key.indexOf('_'))
                    .toUpperCase()}/teams/${match.alliances.red.team_keys[0].substring(
                    3
                  )}`
                )
              "
              v-ripple
              style="cursor: pointer"
            >
              {{ match.alliances.red.team_keys[0].substring(3) }}
            </td>
            <td
              @click="
                $router.push(
                  `/events/${match.key
                    .substring(0, match.key.indexOf('_'))
                    .toUpperCase()}/teams/${match.alliances.red.team_keys[1].substring(
                    3
                  )}`
                )
              "
              v-ripple
              style="cursor: pointer"
            >
              {{ match.alliances.red.team_keys[1].substring(3) }}
            </td>
            <td
              @click="
                $router.push(
                  `/events/${match.key
                    .substring(0, match.key.indexOf('_'))
                    .toUpperCase()}/teams/${match.alliances.red.team_keys[2].substring(
                    3
                  )}`
                )
              "
              v-ripple
              style="cursor: pointer"
            >
              {{ match.alliances.red.team_keys[2].substring(3) }}
            </td>
            <td
              @click="
                $router.push(
                  `/events/${match.key
                    .substring(0, match.key.indexOf('_'))
                    .toUpperCase()}/teams/${match.alliances.blue.team_keys[0].substring(
                    3
                  )}`
                )
              "
              v-ripple
              style="cursor: pointer"
            >
              {{ match.alliances.blue.team_keys[0].substring(3) }}
            </td>
            <td
              @click="
                $router.push(
                  `/events/${match.key
                    .substring(0, match.key.indexOf('_'))
                    .toUpperCase()}/teams/${match.alliances.blue.team_keys[1].substring(
                    3
                  )}`
                )
              "
              v-ripple
              style="cursor: pointer"
            >
              {{ match.alliances.blue.team_keys[1].substring(3) }}
            </td>
            <td
              @click="
                $router.push(
                  `/events/${match.key
                    .substring(0, match.key.indexOf('_'))
                    .toUpperCase()}/teams/${match.alliances.blue.team_keys[2].substring(
                    3
                  )}`
                )
              "
              v-ripple
              style="cursor: pointer"
            >
              {{ match.alliances.blue.team_keys[2].substring(3) }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-black">Scouter</td>
            <td v-if="red1 != undefined">
              {{ red1.scouter.Red1.assignedName }}
            </td>
            <td v-else>-</td>
            <td v-if="red2 != undefined">
              {{ red2.scouter.Red2.assignedName }}
            </td>
            <td v-else>-</td>
            <td v-if="red3 != undefined">
              {{ red3.scouter.Red3.assignedName }}
            </td>
            <td v-else>-</td>
            <td v-if="blue1 != undefined">
              {{ blue1.scouter.Blue1.assignedName }}
            </td>
            <td v-else>-</td>
            <td v-if="blue2 != undefined">
              {{ blue2.scouter.Blue2.assignedName }}
            </td>
            <td v-else>-</td>
            <td v-if="blue3 != undefined">
              {{ blue3.scouter.Blue3.assignedName }}
            </td>
            <td v-else>-</td>
          </tr>
          <p
            class="grey--text font-italic mb-0 font-weight-bold"
            style="padding: 6px 12px"
          >
            AUTO
          </p>
          <tr>
            <td class="font-weight-black">Taxied?</td>
            <td v-if="red1 != undefined">{{ boolMap[red1.auto.taxied] }}</td>
            <td v-else>-</td>
            <td v-if="red2 != undefined">
              {{ boolMap[red2.auto.taxied] }}
            </td>
            <td v-else>-</td>
            <td v-if="red3 != undefined">
              {{ boolMap[red3.auto.taxied] }}
            </td>
            <td v-else>-</td>
            <td v-if="blue1 != undefined">
              {{ boolMap[blue1.auto.taxied] }}
            </td>
            <td v-else>-</td>
            <td v-if="blue2 != undefined">
              {{ boolMap[blue2.auto.taxied] }}
            </td>
            <td v-else>-</td>
            <td v-if="blue3 != undefined">
              {{ boolMap[blue3.auto.taxied] }}
            </td>
            <td v-else>-</td>
          </tr>
          <tr>
            <td class="font-weight-black"># Upper Scored</td>
            <td v-if="red1 != undefined">{{ red1.auto.upperScored }}</td>
            <td v-else>-</td>
            <td v-if="red2 != undefined">{{ red2.auto.upperScored }}</td>
            <td v-else>-</td>
            <td v-if="red3 != undefined">{{ red3.auto.upperScored }}</td>
            <td v-else>-</td>
            <td v-if="blue1 != undefined">{{ blue1.auto.upperScored }}</td>
            <td v-else>-</td>
            <td v-if="blue2 != undefined">{{ blue2.auto.upperScored }}</td>
            <td v-else>-</td>
            <td v-if="blue3 != undefined">{{ blue3.auto.upperScored }}</td>
            <td v-else>-</td>
          </tr>
          <tr>
            <td class="font-weight-black"># Upper Missed</td>
            <td v-if="red1 != undefined">{{ red1.auto.upperMissed }}</td>
            <td v-else>-</td>

            <td v-if="red2 != undefined">{{ red2.auto.upperMissed }}</td>
            <td v-else>-</td>

            <td v-if="red3 != undefined">{{ red3.auto.upperMissed }}</td>
            <td v-else>-</td>
            <td v-if="blue1 != undefined">{{ blue1.auto.upperMissed }}</td>
            <td v-else>-</td>
            <td v-if="blue2 != undefined">{{ blue2.auto.upperMissed }}</td>
            <td v-else>-</td>
            <td v-if="blue3 != undefined">{{ blue3.auto.upperMissed }}</td>
            <td v-else>-</td>
          </tr>
          <tr>
            <td class="font-weight-black"># Lower Scored</td>
            <td v-if="red1 != undefined">{{ red1.auto.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="red2 != undefined">{{ red2.auto.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="red3 != undefined">{{ red3.auto.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="blue1 != undefined">{{ blue1.auto.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="blue2 != undefined">{{ blue2.auto.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="blue3 != undefined">{{ blue3.auto.lowerScored }}</td>
            <td v-else>-</td>
          </tr>
          <tr>
            <td class="font-weight-black"># Lower Missed</td>
            <td v-if="red1 != undefined">{{ red1.auto.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="red2 != undefined">{{ red2.auto.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="red3 != undefined">{{ red3.auto.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="blue1 != undefined">{{ blue1.auto.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="blue2 != undefined">{{ blue2.auto.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="blue3 != undefined">{{ blue3.auto.lowerScored }}</td>
            <td v-else>-</td>
          </tr>
          <p
            class="grey--text font-italic mb-0 font-weight-bold"
            style="padding: 6px 12px"
          >
            TELEOP
          </p>
          <tr>
            <td class="font-weight-black"># Upper Scored</td>
            <td v-if="red1 != undefined">{{ red1.teleop.upperScored }}</td>
            <td v-else>-</td>
            <td v-if="red2 != undefined">{{ red2.teleop.upperScored }}</td>
            <td v-else>-</td>
            <td v-if="red3 != undefined">{{ red3.teleop.upperScored }}</td>
            <td v-else>-</td>
            <td v-if="blue1 != undefined">{{ blue1.teleop.upperScored }}</td>
            <td v-else>-</td>
            <td v-if="blue2 != undefined">{{ blue2.teleop.upperScored }}</td>
            <td v-else>-</td>
            <td v-if="blue3 != undefined">{{ blue3.teleop.upperScored }}</td>
            <td v-else>-</td>
          </tr>
          <tr>
            <td class="font-weight-black"># Upper Missed</td>
            <td v-if="red1 != undefined">{{ red1.teleop.upperMissed }}</td>
            <td v-else>-</td>
            <td v-if="red2 != undefined">{{ red2.teleop.upperMissed }}</td>
            <td v-else>-</td>
            <td v-if="red3 != undefined">{{ red3.teleop.upperMissed }}</td>
            <td v-else>-</td>
            <td v-if="blue1 != undefined">{{ blue1.teleop.upperMissed }}</td>
            <td v-else>-</td>
            <td v-if="blue2 != undefined">{{ blue2.teleop.upperMissed }}</td>
            <td v-else>-</td>
            <td v-if="blue3 != undefined">{{ blue3.teleop.upperMissed }}</td>
            <td v-else>-</td>
          </tr>
          <tr>
            <td class="font-weight-black"># Lower Scored</td>
            <td v-if="red1 != undefined">{{ red1.teleop.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="red2 != undefined">{{ red2.teleop.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="red3 != undefined">{{ red3.teleop.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="blue1 != undefined">{{ blue1.teleop.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="blue2 != undefined">{{ blue2.teleop.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="blue3 != undefined">{{ blue3.teleop.lowerScored }}</td>
            <td v-else>-</td>
          </tr>
          <tr>
            <td class="font-weight-black"># Lower Missed</td>
            <td v-if="red1 != undefined">{{ red1.teleop.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="red2 != undefined">{{ red2.teleop.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="red3 != undefined">{{ red3.teleop.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="blue1 != undefined">{{ blue1.teleop.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="blue2 != undefined">{{ blue2.teleop.lowerScored }}</td>
            <td v-else>-</td>
            <td v-if="blue3 != undefined">{{ blue3.teleop.lowerScored }}</td>
            <td v-else>-</td>
          </tr>
          <p
            class="grey--text font-italic mb-0 font-weight-bold"
            style="padding: 6px 12px"
          >
            END
          </p>
          <tr>
            <td class="font-weight-black">Climb</td>
            <td v-if="red1 != undefined">{{ red1.end.climb }}</td>
            <td v-else>-</td>
            <td v-if="red2 != undefined">{{ red2.end.climb }}</td>
            <td v-else>-</td>
            <td v-if="red3 != undefined">{{ red3.end.climb }}</td>
            <td v-else>-</td>
            <td v-if="blue1 != undefined">{{ blue1.end.climb }}</td>
            <td v-else>-</td>
            <td v-if="blue2 != undefined">{{ blue2.end.climb }}</td>
            <td v-else>-</td>
            <td v-if="blue3 != undefined">{{ blue3.end.climb }}</td>
            <td v-else>-</td>
          </tr>
          <p
            class="grey--text font-italic mb-0 font-weight-bold"
            style="padding: 6px 12px"
          >
            POST
          </p>
          <tr>
            <td class="font-weight-black">Card?</td>
            <td v-if="red1 != undefined">{{ boolMap[red1.post.card] }}</td>
            <td v-else>-</td>
            <td v-if="red2 != undefined">{{ boolMap[red2.post.card] }}</td>
            <td v-else>-</td>
            <td v-if="red3 != undefined">{{ boolMap[red3.post.card] }}</td>
            <td v-else>-</td>
            <td v-if="blue1 != undefined">{{ boolMap[blue1.post.card] }}</td>
            <td v-else>-</td>
            <td v-if="blue2 != undefined">{{ boolMap[blue2.post.card] }}</td>
            <td v-else>-</td>
            <td v-if="blue3 != undefined">{{ boolMap[blue3.post.card] }}</td>
            <td v-else>-</td>
          </tr>
          <tr>
            <td class="font-weight-black">Tipped?</td>
            <td v-if="red1 != undefined">{{ boolMap[red1.post.tipped] }}</td>
            <td v-else>-</td>
            <td v-if="red2 != undefined">{{ boolMap[red2.post.tipped] }}</td>
            <td v-else>-</td>
            <td v-if="red3 != undefined">{{ boolMap[red3.post.tipped] }}</td>
            <td v-else>-</td>
            <td v-if="blue1 != undefined">{{ boolMap[blue1.post.tipped] }}</td>
            <td v-else>-</td>
            <td v-if="blue2 != undefined">{{ boolMap[blue2.post.tipped] }}</td>
            <td v-else>-</td>
            <td v-if="blue3 != undefined">{{ boolMap[blue3.post.tipped] }}</td>
            <td v-else>-</td>
          </tr>
          <tr>
            <td class="font-weight-black">Died?</td>
            <td v-if="red1 != undefined">{{ boolMap[red1.post.died] }}</td>
            <td v-else>-</td>
            <td v-if="red2 != undefined">{{ boolMap[red2.post.died] }}</td>
            <td v-else>-</td>
            <td v-if="red3 != undefined">{{ boolMap[red3.post.died] }}</td>
            <td v-else>-</td>
            <td v-if="blue1 != undefined">{{ boolMap[blue1.post.died] }}</td>
            <td v-else>-</td>
            <td v-if="blue2 != undefined">{{ boolMap[blue2.post.died] }}</td>
            <td v-else>-</td>
            <td v-if="blue3 != undefined">{{ boolMap[blue3.post.died] }}</td>
            <td v-else>-</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  name: "MatchScoutingData2022",
  props: ["match"],
  data() {
    return {
      scouting: false,
      endgamePointMap: {
        Low: "4",
        Mid: "6",
        High: "10",
        Traversal: "15",
      },
      boolMap: { true: "Yes", false: "No" },
    };
  },
  computed: {
    red1() {
      return this.scouting[this.match.alliances.red.team_keys[0].substring(3)];
    },
    red2() {
      return this.scouting[this.match.alliances.red.team_keys[1].substring(3)];
    },
    red3() {
      return this.scouting[this.match.alliances.red.team_keys[2].substring(3)];
    },
    blue1() {
      return this.scouting[this.match.alliances.blue.team_keys[0].substring(3)];
    },
    blue2() {
      return this.scouting[this.match.alliances.blue.team_keys[1].substring(3)];
    },
    blue3() {
      return this.scouting[this.match.alliances.blue.team_keys[2].substring(3)];
    },
  },
  methods: {
    refresh() {
      this.$root.loading = true;
      this.$http
        .get(`/api/scouting/match/${this.match.key}`)
        .then((response) => {
          this.scouting = response.data;
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
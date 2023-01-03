<template>
  <v-card :style="visible ? 'flex-grow: 2' : ''">
    <v-card-title
      class="text-h5"
      @click.self="visible = !visible"
      v-ripple
      style="cursor: pointer"
    >
      <h5 @click.self="visible = !visible" class="text-h5">
        Match Scouting Overview
      </h5>
      <v-spacer></v-spacer>
      <v-icon size="30" class="ml-4">{{
        visible ? "mdi-chevron-up" : "mdi-chevron-down"
      }}</v-icon>
    </v-card-title>

    <v-card-text class="mt-0 pt-0 white--text" v-if="visible">
      <div v-if="team.stats.matchCount != 0">
        <p class="grey--text">
          {{ team.stats.matchCount }} match<span
            v-if="team.stats.matchCount.length != 1"
            >es</span
          >
          scouted
        </p>

        <v-row>
          <v-col cols="6">
            <h6 class="text-h6 font-weight-light">AUTONOMOUS</h6>

            <table>
              <tr>
                <td style="width: 200px" class="font-weight-black">
                  Avg. Upper Scored
                </td>
                <td>{{ team.stats.auto.avgUpperScored }}</td>
              </tr>

              <tr>
                <td style="width: 200px" class="font-weight-black">
                  Avg. Upper Missed
                </td>
                <td>{{ team.stats.auto.avgUpperMissed }}</td>
              </tr>

              <tr>
                <td style="width: 200px" class="font-weight-black">
                  Avg. Lower Scored
                </td>
                <td>{{ team.stats.auto.avgLowerScored }}</td>
              </tr>

              <tr>
                <td style="width: 200px" class="font-weight-black">
                  Avg. Lower Missed
                </td>
                <td>{{ team.stats.auto.avgLowerMissed }}</td>
              </tr>

              <tr>
                <td style="width: 200px" class="font-weight-black">
                  Taxi Rate
                </td>
                <td>{{ team.stats.auto.taxiRate }}%</td>
              </tr>
            </table>
          </v-col>

          <v-col cols="6">
            <h6 class="text-h6 font-weight-light">TELEOPERATED</h6>

            <table>
              <tr>
                <td style="width: 200px" class="font-weight-black">
                  Avg. Upper Scored
                </td>
                <td>{{ team.stats.teleop.avgUpperScored }}</td>
              </tr>

              <tr>
                <td style="width: 200px" class="font-weight-black">
                  Avg. Upper Missed
                </td>
                <td>{{ team.stats.teleop.avgUpperMissed }}</td>
              </tr>

              <tr>
                <td style="width: 200px" class="font-weight-black">
                  Avg. Lower Scored
                </td>
                <td>{{ team.stats.teleop.avgLowerScored }}</td>
              </tr>

              <tr>
                <td style="width: 200px" class="font-weight-black">
                  Avg. Lower Missed
                </td>
                <td>{{ team.stats.teleop.avgLowerMissed }}</td>
              </tr>
            </table>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <h6 class="text-h6 font-weight-light">ENDGAME</h6>

            <table>
              <tr>
                <td style="width: 200px" class="font-weight-black">
                  Climb Rate
                </td>
                <td>{{ team.stats.end.climbRate }}%</td>
              </tr>

              <tr>
                <td style="width: 200px" class="font-weight-black">
                  # Climbs Low
                </td>
                <td>{{ team.stats.end.climb.low }}</td>
              </tr>

              <tr>
                <td style="width: 200px" class="font-weight-black">
                  # Climbs Mid
                </td>
                <td>{{ team.stats.end.climb.mid }}</td>
              </tr>

              <tr>
                <td style="width: 200px" class="font-weight-black">
                  # Climbs High
                </td>
                <td>{{ team.stats.end.climb.high }}</td>
              </tr>

              <tr>
                <td style="width: 200px" class="font-weight-black">
                  # Climbs Traversal
                </td>
                <td>{{ team.stats.end.climb.traversal }}</td>
              </tr>

              <tr>
                <td style="width: 200px" class="font-weight-black">
                  # Climbs Failed/DNA
                </td>
                <td>{{ team.stats.end.climb.failed }}</td>
              </tr>
            </table>
          </v-col>

          <v-col cols="6">
            <h6 class="text-h6 font-weight-light">POSTGAME</h6>

            <table>
              <tr>
                <td style="width: 200px" class="font-weight-black">
                  Driver Skill
                </td>
                <td>{{ team.stats.post.avgSkillText }}</td>
              </tr>

              <tr>
                <td style="width: 200px" class="font-weight-black">
                  Defensive Skill
                </td>
                <td>{{ team.stats.post.avgDefenseText }}</td>
              </tr>

              <tr>
                <td style="width: 200px" class="font-weight-black">
                  Died Rate
                </td>
                <td>{{ team.stats.post.diedRate }}%</td>
              </tr>

              <tr>
                <td style="width: 200px" class="font-weight-black">
                  Tipped Rate
                </td>
                <td>{{ team.stats.post.tippedRate }}%</td>
              </tr>

              <tr>
                <td style="width: 200px" class="font-weight-black">
                  Card Rate
                </td>
                <td>{{ team.stats.post.cardRate }}%</td>
              </tr>
            </table>
          </v-col>
        </v-row>

        <v-row v-if="team.stats.comments.length != 0">
          <v-col cols="12">
            <h6 class="text-h6 font-weight-light mb-3">COMMENTS</h6>

            <div v-for="(comment, index) in team.stats.comments" :key="index">
              <p class="white--text mb-1">
                <span class="font-weight-black">
                  {{
                    comment.match
                      .substring(comment.match.indexOf("_") + 1)
                      .toUpperCase()
                  }}:
                </span>
                <span v-html="comment.comment"></span>
              </p>
            </div>
          </v-col>
        </v-row>
      </div>

      <p v-else class="grey--text font-italic my-4 text-center">
        No scouting data
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "MatchScoutingOverview2022",
  props: ["team"],
  data() {
    return {
      visible: true,
    };
  },
};
</script>

<style scoped>
</style>
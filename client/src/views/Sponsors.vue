<template>
  <div>
    <v-toolbar dense color="grey darken-4" style="z-index: 1">
      <v-toolbar-title class="d-flex">
        <v-breadcrumbs
          v-if="$vuetify.breakpoint.smAndUp"
          :items="breadcrumbs"
          divider="/"
          class="pa-0 ma-0"
        ></v-breadcrumbs>

        <h6 class="text-h6 font-weight-black">
          {{ $root.user.role > 2 ? "" : "My" }} Sponsors
        </h6>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        v-if="$root.user.role > 2"
        color="primary"
        @click="new_wizard.open = true"
        ><v-icon left>mdi-plus</v-icon>New</v-btn
      >
    </v-toolbar>

    <div
      :style="`height: calc(100vh - ${
        $vuetify.breakpoint.mdAndUp ? '112px' : '104px'
      }); overflow: auto`"
    >
      <v-container style="max-width: 1185px" class="px-8 pt-0 mt-4">
        <v-card
          class="mt-6"
          v-if="
            $root.user.role > 2
              ? sponsors.length != 0
              : sponsors.filter((i) => i.sponsor.member == $root.user._id)
                  .length != 0
          "
        >
          <v-simple-table class="transparent" dense style="white-space: nowrap">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Organization</th>
                  <th class="text-left">Level</th>
                  <th class="text-left">Value</th>
                  <th class="text-left" v-if="$root.user.role > 2">Member</th>
                  <th class="text-left">Contact</th>
                  <!-- <th class="text-left">Status</th> -->
                </tr>
              </thead>

              <tbody v-if="$root.user.role > 2">
                <tr
                  v-ripple
                  style="cursor: pointer"
                  v-for="sponsor in sponsors"
                  :key="sponsor._id"
                  @click="$router.push(`/sponsors/${sponsor._id}`)"
                >
                  <td class="font-weight-black">
                    {{ sponsor.sponsor.org || "-" }}
                  </td>
                  <td
                    v-if="sponsor.sponsor.level == 'Blue'"
                    class="blue--text text--darken-2 font-weight-black"
                  >
                    {{ sponsor.sponsor.level }}
                  </td>
                  <td
                    v-else-if="sponsor.sponsor.level == 'Gold'"
                    style="color: #c6981e"
                    class="font-weight-black"
                  >
                    {{ sponsor.sponsor.level }}
                  </td>
                  <td
                    v-else-if="sponsor.sponsor.level == 'Platinum'"
                    class="font-weight-black"
                    style="color: #728cb0"
                  >
                    {{ sponsor.sponsor.level }}
                  </td>
                  <td v-else>-</td>
                  <td v-if="sponsor.sponsor.value">
                    ${{ sponsor.sponsor.value }}
                  </td>
                  <td v-else>-</td>
                  <td>
                    {{
                      members.find((i) => i._id == sponsor.sponsor.member)
                        ? members.find((i) => i._id == sponsor.sponsor.member)
                            .name
                        : "-"
                    }}
                  </td>
                  <td>{{ sponsor.name }}</td>
                  <!-- <td>{{ sponsor.sponsor.status || "Waiting for info" }}</td> -->
                </tr>
              </tbody>

              <tbody v-else>
                <tr
                  v-for="sponsor in sponsors.filter(
                    (i) => i.sponsor.member == $root.user._id
                  )"
                  :key="sponsor._id"
                >
                  <td class="font-weight-black">
                    {{ sponsor.sponsor.org || "-" }}
                  </td>
                  <td
                    v-if="sponsor.sponsor.level == 'Blue'"
                    class="blue--text text--darken-2 font-weight-black"
                  >
                    {{ sponsor.sponsor.level }}
                  </td>
                  <td
                    v-else-if="sponsor.sponsor.level == 'Gold'"
                    style="color: #c6981e"
                    class="font-weight-black"
                  >
                    {{ sponsor.sponsor.level }}
                  </td>
                  <td
                    v-else-if="sponsor.sponsor.level == 'Platinum'"
                    class="font-weight-black"
                    style="color: #728cb0"
                  >
                    {{ sponsor.sponsor.level }}
                  </td>
                  <td v-else>-</td>
                  <td v-if="sponsor.sponsor.value">
                    ${{ sponsor.sponsor.value }}
                  </td>
                  <td v-else>-</td>
                  <td>{{ sponsor.name }}</td>
                  <!-- <td>{{ sponsor.sponsor.status || "Waiting for info" }}</td> -->
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>

        <p class="grey--text font-italic text-center mt-12" v-else>
          No sponsors
        </p>

        <p
          v-if="
            $root.user.role > 2
              ? sponsors.length > 0
              : sponsors.filter((i) => i.sponsor.member == $root.user._id)
                  .length > 0
          "
          class="pb-0 mt-4 mb-1 grey--text"
        >
          {{
            $root.user.role > 2
              ? sponsors.length
              : sponsors.filter((i) => i.sponsor.member == $root.user._id)
                  .length
          }}
          sponsors
        </p>

        <v-dialog
          max-width="700"
          v-model="new_wizard.open"
          v-if="new_wizard.open"
        >
          <v-card>
            <NewSponsorWizard
              :members="members"
              @close="(new_wizard.open = false), refresh()"
            />
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </div>
</template>

<script>
import NewSponsorWizard from "../components/NewSponsorWizard.vue";

export default {
  name: "Sponsors",
  data() {
    return {
      sponsors: [],
      new_wizard: {
        open: false,
        data: {},
      },
      members: [],
    };
  },
  computed: {
    breadcrumbs() {
      return [
        {
          text: `FRC Team ${this.$root.config.team}`,
          disabled: false,
          to: "/",
        },
        {
          text: "",
          disabled: true,
          to: "/sponsors",
        },
      ];
    },
  },
  methods: {
    refresh() {
      this.$root.loading = true;
      this.$http.get("/api/auth/users?sponsor=true").then((response) => {
        this.$http.get("/api/auth/users").then((response2) => {
          this.sponsors = response.data;
          this.members = response2.data;
          this.$root.loading = false;
        });
      });
    },
  },
  created() {
    this.refresh();
  },
  components: {
    NewSponsorWizard,
  },
};
</script>

<style scoped>
</style>
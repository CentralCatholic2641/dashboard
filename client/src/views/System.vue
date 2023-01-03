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

        <h6 class="text-h6 font-weight-black">System</h6>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn :disabled="!changes" color="primary" @click="save()"
        ><v-icon left>mdi-content-save</v-icon>Save</v-btn
      >
    </v-toolbar>

    <div
      :style="`height: calc(100vh - ${
        $vuetify.breakpoint.mdAndUp ? '112px' : '104px'
      }); overflow: auto`"
    >
      <v-container style="max-width: 1185px" class="px-8 pt-0 mt-4">
        <v-text-field
          class="mt-5"
          hide-details
          label="Season"
          type="number"
          v-model="$root.config.year"
          style="width: 350px"
          @input="changes = true"
        ></v-text-field>

        <v-switch
          class="mt-5"
          label="Event Mode"
          v-model="$root.config.event"
          color="primary"
          @change="changes = true"
        ></v-switch>

        <v-text-field
          hide-details
          label="Cache Duration (Hours)"
          type="number"
          v-model="$root.config.cacheLength"
          style="width: 350px"
          @input="changes = true"
        ></v-text-field>

        <v-btn class="mt-5" @click="clearCache()" color="primary"
          ><v-icon left>mdi-delete</v-icon>Clear Cache</v-btn
        >

        <v-text-field
          class="mt-5"
          hide-details
          label="Current Event"
          v-model="$root.config.currentEvent"
          style="width: 350px"
          @input="changes = true"
        ></v-text-field>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: "System",
  data() {
    return {
      changes: false,
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
          to: "/system",
        },
      ];
    },
  },

  methods: {
    refresh() {},
    save() {
      this.$http.post("/api/admin", this.$root.config).then((response) => {
        this.$root.config = response.data;
        this.changes = false;
      });
    },
    clearCache() {
      this.$http.delete("/api/admin/flush");
    },
  },
  created() {
    if (this.$root.user.role == 4) this.refresh();
    else this.$router.push("/");
  },
};
</script>

<style scoped>
</style>
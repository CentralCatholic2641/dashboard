<template>
  <div>
    <v-card-title>
      <h4
        class="text-h4 font-weight-black mt-1"
        v-if="$vuetify.breakpoint.mdAndUp"
      >
        NEW TASK
      </h4>
      <h5 class="text-h5 font-weight-black mt-1" v-else>NEW TASK</h5>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="Title"
            v-model="data.title"
            hide-details
            prepend-icon="mdi-format-title"
            @keypress.enter="create()"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-btn text color="grey" @click="$emit('close')">Cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="create()"
        >Create<v-icon right>mdi-chevron-right</v-icon></v-btn
      >
    </v-card-actions>
  </div>
</template>

<script>
export default {
  name: "NewTaskWizard",
  data() {
    return {
      data: {
        status: "To Do",
        primary: null,
      },
    };
  },
  methods: {
    create() {
      this.$http.post("/api/task", this.data).then((response) => {
        this.$emit("close");
      });
    },
  },
};
</script>

<style scoped></style>
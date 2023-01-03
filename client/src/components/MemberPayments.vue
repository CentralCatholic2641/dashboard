<template>
  <div v-if="member">
    <v-card>
      <v-card-title>
        <h5 class="text-h5">Payments</h5>
      </v-card-title>

      <v-simple-table
        dense
        v-if="
          payments.filter((i) =>
            i.members[member._id] ? i.members[member._id].included : false
          ).length != 0
        "
        style="white-space: nowrap"
      >
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Title</th>
              <th class="text-left">Type</th>
              <th class="text-left">Due</th>
              <th class="text-left">Value</th>
              <th class="text-left">Status</th>
            </tr>
          </thead>

          <tbody v-if="$root.user.role > 2">
            <tr
              v-for="payment in payments.filter((i) =>
                i.members[member._id] ? i.members[member._id].included : false
              )"
              :key="payment._id"
              @click="$router.push(`/payments/${payment._id}`)"
              v-ripple
              style="cursor: pointer"
            >
              <td class="font-weight-black">{{ payment.title }}</td>
              <td>{{ payment.type }}</td>
              <td>{{ dayjs(payment.due).format("ddd, MMM D, YYYY") }}</td>
              <td>${{ payment.value }}</td>
              <td
                :class="
                  getColor(
                    payment.members[member._id].status,
                    payment.members[member._id].included
                  )
                "
              >
                {{
                  payment.members[member._id].included
                    ? payment.members[member._id].status
                    : "-"
                }}
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr
              v-for="payment in payments.filter(
                (i) => i.members[member._id].included
              )"
              :key="payment._id"
            >
              <td class="font-weight-black">{{ payment.title }}</td>
              <td>{{ payment.type }}</td>
              <td>{{ payment.due }}</td>
              <td>${{ payment.value }}</td>
              <td :class="getColor(payment.members[member._id].status, true)">
                {{ payment.members[member._id].status }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <v-card-text v-else>
        <p class="pa-0 ma-0 text-center grey--text font-italic">No payments</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "MemberPayments",
  props: ["member"],
  data() {
    return {
      payments: [],
      dayjs,
    };
  },
  methods: {
    refresh() {
      this.$http.get("/api/payment").then((response) => {
        this.payments = response.data;
      });
    },
    getColor(status, included) {
      if (!included) return "";
      else if (status == "Paid") return "green--text";
      else if (status == "Not paid") return "red--text font-weight-black";
      else if (status == "Deferred") return "grey--text";
    },
  },
  created() {
    this.refresh();
  },
};
</script>

<style scoped>
</style>
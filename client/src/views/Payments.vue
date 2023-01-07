<template>
	<div>
		<v-toolbar dense color="grey darken-4" style="z-index: 1">
			<v-toolbar-title class="d-flex">
				<v-breadcrumbs v-if="$vuetify.breakpoint.smAndUp" :items="breadcrumbs" divider="/" class="pa-0 ma-0"></v-breadcrumbs>

				<h6 class="text-h6 font-weight-black">{{ $root.user.role > 2 ? "" : "My" }} Payments</h6>
			</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-btn v-if="$root.user.role > 2" color="primary" @click="new_wizard.open = true"><v-icon left>mdi-plus</v-icon>New</v-btn>
		</v-toolbar>

		<div :style="`height: calc(100vh - ${$vuetify.breakpoint.mdAndUp ? '112px' : '104px'}); overflow: auto`">
			<v-container style="max-width: 1185px" class="px-8 pt-0 mt-4">
				<v-card class="mt-6" v-if="payments.length != 0">
					<v-simple-table class="transparent" dense style="white-space: nowrap">
						<template v-slot:default>
							<thead>
								<tr>
									<th class="text-left">Title</th>
									<th class="text-left">Due</th>
									<th class="text-left">Type</th>
									<th class="text-left">Value</th>
									<th class="text-left" v-if="$root.user.role > 2">Paid</th>
									<th class="text-left" v-else>Status</th>
								</tr>
							</thead>

							<tbody v-if="$root.user.role > 2">
								<tr v-ripple style="cursor: pointer" v-for="payment in payments" :key="payment._id" @click="$router.push(`/payments/${payment._id}`)">
									<td class="font-weight-black">
										{{ payment.title }}
									</td>
									<td>
										{{ dayjs(payment.due).format("ddd, MMM D, YYYY") }}
									</td>
									<td>{{ payment.type }}</td>
									<td>${{ payment.value }}</td>
									<td :class="getPercentColor(getPercentIn(payment) * 100)">{{ (getPercentIn(payment) * 100).toFixed(1) }}%</td>
								</tr>
							</tbody>

							<tbody v-else>
								<tr v-for="payment in payments.filter((i) => i.members[$root.user._id].included)" :key="payment._id">
									<td class="font-weight-black">
										{{ payment.title }}
									</td>
									<td>
										{{ dayjs(payment.due).format("dddd, MMMM D, YYYY") }}
									</td>
									<td>{{ payment.type }}</td>
									<td>${{ payment.value }}</td>
									<td :class="getColor(payment.members[$root.user._id].status)">
										{{ payment.members[$root.user._id].status }}
									</td>
								</tr>
							</tbody>
						</template>
					</v-simple-table>
				</v-card>

				<p class="font-italic grey--text text-center mt-12" v-else>No payments</p>

				<p v-if="payments.length > 0" class="pb-0 mt-4 mb-1 grey--text">{{ payments.length }} payments</p>

				<v-dialog max-width="700" v-model="new_wizard.open" v-if="new_wizard.open">
					<v-card>
						<NewPaymentWizard @close="(new_wizard.open = false), refresh()" />
					</v-card>
				</v-dialog>
			</v-container>
		</div>
	</div>
</template>

<script>
	import NewPaymentWizard from "../components/NewPaymentWizard.vue";
	import dayjs from "dayjs";

	export default {
		name: "Payments",
		data() {
			return {
				payments: [],
				new_wizard: {
					open: false,
					data: {},
				},
				dayjs,
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
					},
				];
			},
		},
		methods: {
			refresh() {
				this.$root.loading = true;
				this.$http.get("/api/payment").then((response) => {
					this.payments = response.data;
					this.$root.loading = false;
				});
			},
			getColor(status) {
				if (status == "Paid") return "green--text";
				else if (status == "Not paid") return "red--text font-weight-black";
				else if (status == "Deferred") return "grey--text";
				else if (status == "Sponsored") return "blue--text";
			},
			getPercentColor(grade) {
				if (grade > 80) return "green--text";
				else if (grade > 70) return "light-green--text";
				else if (grade > 60) return "lime--text";
				else if (grade > 50) return "yellow--text";
				else if (grade > 40) return "orange--text";
				else if (grade > 30) return "deep-orange--text";
				else return "red--text";
			},
			getPercentIn(payment) {
				let totalIncluded = 0;
				let totalPaid = 0;

				for (let i in payment.members) {
					if (payment.members[i].included) totalIncluded++;
					if (payment.members[i].status == "Paid" || payment.members[i].status == "Sponsored") totalPaid++;
				}

				return totalPaid / totalIncluded;
			},
		},
		created() {
			this.refresh();
		},
		components: {
			NewPaymentWizard,
		},
	};
</script>

<style scoped></style>

<template>
	<div v-if="member">
		<v-card>
			<v-card-title>
				<h5 class="text-h5">Sponsors</h5>
			</v-card-title>

			<v-simple-table dense v-if="sponsors.length != 0" style="white-space: nowrap">
				<template v-slot:default>
					<thead>
						<tr>
							<th class="text-left">Organization</th>
							<th class="text-left">Level</th>
							<th class="text-left">Value</th>
						</tr>
					</thead>

					<tbody v-if="$root.user.role > 2">
						<tr v-for="sponsor in sponsors" :key="sponsor._id" @click="$router.push(`/sponsors/${sponsor._id}`)" v-ripple style="cursor: pointer">
							<td class="font-weight-black">{{ sponsor.sponsor.org }}</td>
							<td v-if="sponsor.sponsor.level == 'Blue'" class="blue--text text--darken-2 font-weight-black">
								{{ sponsor.sponsor.level }}
							</td>
							<td v-else-if="sponsor.sponsor.level == 'Gold'" style="color: #c6981e" class="font-weight-black">
								{{ sponsor.sponsor.level }}
							</td>
							<td v-else-if="sponsor.sponsor.level == 'Platinum'" class="font-weight-black" style="color: #728cb0">
								{{ sponsor.sponsor.level }}
							</td>
							<td v-else>-</td>
							<td>${{ sponsor.sponsor.value }}</td>
						</tr>
					</tbody>

					<tbody v-else>
						<tr v-for="sponsor in sponsors" :key="sponsor._id">
							<td class="font-weight-black">{{ sponsor.sponsor.org }}</td>
							<td v-if="sponsor.sponsor.level == 'Blue'" class="blue--text text--darken-2 font-weight-black">
								{{ sponsor.sponsor.level }}
							</td>
							<td v-else-if="sponsor.sponsor.level == 'Gold'" style="color: #c6981e" class="font-weight-black">
								{{ sponsor.sponsor.level }}
							</td>
							<td v-else-if="sponsor.sponsor.level == 'Platinum'" class="font-weight-black" style="color: #728cb0">
								{{ sponsor.sponsor.level }}
							</td>
							<td v-else>-</td>
							<td>${{ sponsor.sponsor.value }}</td>
						</tr>
					</tbody>
				</template>
			</v-simple-table>

			<v-card-text v-else>
				<p class="pa-0 ma-0 grey--text font-italic text-center">No sponsors</p>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
	export default {
		name: "MemberSponsors",
		props: ["member"],
		data() {
			return {
				sponsors: [],
			};
		},
		methods: {
			refresh() {
				this.$http.get("/api/auth/users?sponsor=true").then((response) => {
					this.sponsors = response.data.filter((i) => i.sponsor.member == this.member._id);
				});
			},
		},
		created() {
			this.refresh();
		},
	};
</script>

<style scoped></style>

<template>
	<div v-if="schedule && pitscouting && users">
		<v-card>
			<v-card-title class="text-h5 my-1" @click.self="visible = !visible" v-ripple style="cursor: pointer">
				<h5 @click.self="visible = !visible" class="text-h5">Stats by Scouter</h5>
				<v-spacer></v-spacer>
				<v-icon size="30" class="ml-4">{{ visible ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
			</v-card-title>

			<v-simple-table dense v-if="visible && scouts.length != 0">
				<template v-slot:default>
					<thead>
						<tr>
							<th class="text-left">Name</th>
							<th class="text-left">Assignments</th>
							<th class="text-left">Submitted</th>
							<th class="text-left">Remaining</th>
							<th class="text-left">Grade</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="user in scouts"
							:key="user._id"
							:class="{
								'grey--text text--darken-1 font-italic': assignments[user.username] == 0,
							}"
						>
							<td class="font-weight-black" v-if="$root.user.role > 2" v-ripple @click="$router.push(`/members/${user._id}`)" style="cursor: pointer">
								{{ user.name }}
							</td>
							<td class="font-weight-black" v-else>{{ user.name }}</td>
							<td>{{ assignments[user.username] }}</td>
							<td>
								{{ submitted[user.username] }}
							</td>
							<td>
								{{ assignments[user.username] - submitted[user.username] }}
							</td>
							<td :class="getColor(user.username)">{{ ((submitted[user.username] / assignments[user.username]) * 100).toFixed(1) }}%</td>
						</tr>
					</tbody>
				</template>
			</v-simple-table>

			<v-card-text v-else-if="visible && scouts.length == 0">
				<p class="text-center mt-2 grey--text font-italic">No scouts</p>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
	import dayjs from "dayjs";

	export default {
		name: "StatsByScouter",
		props: ["schedule", "pitscouting", "users"],
		data() {
			return {
				visible: true,

				dayjs,
			};
		},
		methods: {
			getColor(username) {
				const grade = (this.submitted[username] / this.assignments[username]) * 100;

				if (grade > 95) return "green--text";
				else if (grade > 90) return "light-green--text";
				else if (grade > 85) return "lime--text";
				else if (grade > 80) return "yellow--text";
				else if (grade > 75) return "orange--text";
				else if (grade > 70) return "deep-orange--text";
				else return "red--text";
			},
		},
		computed: {
			assignments() {
				let data = {};

				for (let i of this.users.filter((i) => i.includeInScouting)) {
					data[i.username] = 0;
				}

				for (let j in this.schedule) {
					if (this.schedule[j]) {
						for (let k in this.schedule[j]) {
							if (this.schedule[j][k] && this.schedule[j][k].assigned) {
								if (typeof data[this.schedule[j][k].assigned] != "number") data[this.schedule[j][k].assigned] = 0;
								data[this.schedule[j][k].assigned]++;
							}
						}
					}
				}

				for (let j in this.pitscouting) {
					if (this.pitscouting[j] && this.pitscouting[j].assigned) {
						if (typeof data[this.pitscouting[j].assigned] != "number") data[this.pitscouting[j].assigned] = 0;
						data[this.pitscouting[j].assigned]++;
					}
				}
				return data;
			},
			submitted() {
				let data = {};

				for (let i of this.users.filter((i) => i.includeInScouting)) {
					data[i.username] = 0;
				}

				for (let j in this.schedule) {
					if (this.schedule[j]) {
						for (let k in this.schedule[j]) {
							if (this.schedule[j][k] && this.schedule[j][k].submitted) {
								if (typeof data[this.schedule[j][k].assigned] != "number") data[this.schedule[j][k].assigned] = 0;
								data[this.schedule[j][k].assigned]++;
							}
						}
					}
				}

				for (let j in this.pitscouting) {
					if (this.pitscouting[j] && this.pitscouting[j].submitted) {
						if (typeof data[this.pitscouting[j].assigned] != "number") data[this.pitscouting[j].assigned] = 0;
						data[this.pitscouting[j].assigned]++;
					}
				}

				return data;
			},
			scouts() {
				return this.users.filter((i) => i.includeInScouting && this.assignments[i.username] != 0);
			},
		},
	};
</script>

<style scoped></style>

<template>
	<v-card class="mb-4" style="white-space: nowrap">
		<v-card-title class="text-h5" @click.self="visible = !visible" v-ripple style="cursor: pointer">
			<h5 @click.self="visible = !visible" class="text-h5">Alliances</h5>
			<v-spacer></v-spacer>
			<v-icon size="30" class="ml-4">{{ visible ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
		</v-card-title>

		<v-simple-table dense v-if="visible && event.alliances && event.alliances.length != 0">
			<template v-slot:default>
				<thead>
					<tr>
						<th class="text-left">Alliance</th>
						<th class="text-left">Captain</th>
						<th class="text-left">Pick 1</th>
						<th class="text-left">Pick 2</th>
						<th class="text-left">Record</th>
					</tr>
				</thead>

				<tbody v-if="!event.division_keys">
					<tr
						v-ripple
						style="cursor: pointer"
						v-for="alliance in event.alliances"
						:key="alliance.key"
						:class="{
							'font-weight-black': alliance.status.level == 'f' && alliance.status.status == 'won',
						}"
						:style="alliance.status.level == 'f' ? (alliance.status.status == 'won' ? 'color: #c6981e' : 'color: #6f7c8a') : ''"
					>
						<td class="font-weight-black">{{ alliance.name }}</td>
						<td @click="$router.push(`/events/${event.key.toUpperCase()}/teams/${alliance.picks[0].substring(3)}`)">
							{{ alliance.picks[0].substring(3) }}
						</td>
						<td @click="$router.push(`/events/${event.key.toUpperCase()}/teams/${alliance.picks[1].substring(3)}`)">
							{{ alliance.picks[1].substring(3) }}
						</td>
						<td @click="$router.push(`/events/${event.key.toUpperCase()}/teams/${alliance.picks[2].substring(3)}`)">
							{{ alliance.picks[2].substring(3) }}
						</td>
						<td>
							{{ alliance.status.record.wins }} - {{ alliance.status.record.losses }} -
							{{ alliance.status.record.ties }}
						</td>
					</tr>
				</tbody>

				<tbody v-else>
					<tr
						v-ripple
						style="cursor: pointer"
						v-for="(alliance, index) in event.alliances"
						:key="alliance.key"
						:class="{
							'font-weight-black': alliance.status.level == 'f' && alliance.status.status == 'won',
						}"
						:style="alliance.status.level == 'f' ? (alliance.status.status == 'won' ? 'color: #c6981e' : 'color: #6f7c8a') : ''"
						@click="$router.push(`/events/${event.division_keys[index].toUpperCase()}`)"
					>
						<td class="font-weight-black">{{ alliance.name }}</td>
						<td @click="$router.push(`/events/${event.key.toUpperCase()}/teams/${alliance.picks[0].substring(3)}`)">
							{{ alliance.picks[0].substring(3) }}
						</td>
						<td @click="$router.push(`/events/${event.key.toUpperCase()}/teams/${alliance.picks[1].substring(3)}`)">
							{{ alliance.picks[1].substring(3) }}
						</td>
						<td @click="$router.push(`/events/${event.key.toUpperCase()}/teams/${alliance.picks[2].substring(3)}`)">
							{{ alliance.picks[2].substring(3) }}
						</td>
						<td>
							{{ alliance.status.record.wins }} - {{ alliance.status.record.losses }} -
							{{ alliance.status.record.ties }}
						</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>

		<v-card-text v-else-if="visible && (!event.alliances || event.alliance.length == 0)">
			<p class="text-center mt-2 grey--text font-italic">Alliance data unavailable</p>
		</v-card-text>
	</v-card>
</template>

<script>
	export default {
		name: "EventAlliances",
		props: ["event"],
		data() {
			return {
				visible: true,
			};
		},
	};
</script>

<style scoped></style>

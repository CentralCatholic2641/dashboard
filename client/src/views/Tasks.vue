<template>
	<div>
		<v-toolbar dense color="grey darken-4" style="z-index: 1">
			<v-toolbar-title class="d-flex">
				<v-breadcrumbs v-if="$vuetify.breakpoint.smAndUp" :items="breadcrumbs" divider="/" class="pa-0 ma-0"></v-breadcrumbs>

				<h6 class="text-h6 font-weight-black">Tasks</h6>
			</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-menu offset-y>
				<template v-slot:activator="{ on, attrs }">
					<v-btn class="mr-2" :input-value="filter != 'all'" v-bind="attrs" v-on="on" text>{{ filter }}<v-icon right>mdi-filter</v-icon></v-btn>
				</template>
				<v-list dense>
					<v-list-item-group v-model="filter" mandatory>
						<v-list-item value="all">
							<v-list-item-title>All</v-list-item-title>
						</v-list-item>

						<v-list-item value="your">
							<v-list-item-title>Your Tasks</v-list-item-title>
						</v-list-item>

						<v-list-item value="incomplete">
							<v-list-item-title>Incomplete</v-list-item-title>
						</v-list-item>

						<v-divider></v-divider>

						<v-list-item value="todo">
							<v-list-item-title>To-Do</v-list-item-title>
						</v-list-item>

						<v-list-item value="in progress">
							<v-list-item-title>In Progress</v-list-item-title>
						</v-list-item>

						<v-list-item value="review">
							<v-list-item-title>Under Review</v-list-item-title>
						</v-list-item>

						<v-list-item value="completed">
							<v-list-item-title>Completed</v-list-item-title>
						</v-list-item>

						<v-list-item value="frozen">
							<v-list-item-title>Frozen</v-list-item-title>
						</v-list-item>

						<v-divider></v-divider>

						<v-list-item value="mechanical">
							<v-list-item-title>Mechanical</v-list-item-title>
						</v-list-item>

						<v-list-item value="electronics">
							<v-list-item-title>Electronics</v-list-item-title>
						</v-list-item>

						<v-list-item value="code">
							<v-list-item-title>Code</v-list-item-title>
						</v-list-item>

						<v-list-item value="design">
							<v-list-item-title>Design</v-list-item-title>
						</v-list-item>

						<v-list-item value="field">
							<v-list-item-title>Field</v-list-item-title>
						</v-list-item>

						<v-list-item value="communications">
							<v-list-item-title>Communications</v-list-item-title>
						</v-list-item>

						<v-list-item value="strategy">
							<v-list-item-title>Strategy</v-list-item-title>
						</v-list-item>

						<v-list-item value="other">
							<v-list-item-title>Other</v-list-item-title>
						</v-list-item>
					</v-list-item-group>
				</v-list>
			</v-menu>

			<!-- <v-btn icon><v-icon>mdi-sort-variant</v-icon></v-btn> -->
			<v-btn v-if="$root.user.role > 2" color="primary" @click="new_wizard.open = true"><v-icon left>mdi-plus</v-icon>New</v-btn>
		</v-toolbar>

		<div :style="`height: calc(100vh - ${$vuetify.breakpoint.mdAndUp ? '112px' : '104px'}); overflow: auto`">
			<v-container class="px-8 pt-0 mt-7" v-if="filtered.length != 0">
				<v-row>
					<v-col class="pa-4" cols="12" md="4" xl="3" v-for="task in filtered" :key="task._id">
						<v-card :class="getColor(task.subteam)" link :to="`/tasks/${task._id}`" style="height: 100%" :style="task.assigned.includes($root.user._id) ? 'outline: 4px rgba(255, 255, 255, 0.35) solid' : ''">
							<div
								style="height: 100%"
								:class="{
									striped: task.status == 'Frozen',
									completed: task.status == 'Completed',
								}"
							>
								<!-- <v-card-title class="mb-0 pb-0"> -->
								<h5 class="text-h5 px-4 pt-4">{{ task.title }}</h5>
								<!-- </v-card-title> -->

								<v-card-text class="mt-0 pt-0 pb-9">
									<p class="mt-4" v-html="task.description"></p>
									<div class="d-flex">
										<p
											style="width: 100px"
											v-if="task.peopleNeeded || task.assigned.length"
											:class="{
												'orange--text': task.assigned.length < task.peopleNeeded,
											}"
										>
											<v-icon
												:class="{
													'orange--text': task.assigned.length < task.peopleNeeded,
													'grey--text': task.status == 'Completed',
												}"
												>mdi-account</v-icon
											>
											{{ task.assigned.length }}

											{{ task.peopleNeeded ? `/ ${task.peopleNeeded}` : "" }}
										</p>
										<p v-if="task.subteam">
											<v-icon
												:class="{
													'grey--text': task.status == 'Completed',
												}"
												>mdi-account-group</v-icon
											>
											{{ task.subteam }}
										</p>
									</div>
									<p
										v-if="task.due"
										:class="{
											'orange--text': dayjs(task.due).isBefore(dayjs()) && task.status != 'Completed',
										}"
									>
										<v-icon
											:class="{
												'orange--text': dayjs(task.due).isBefore(dayjs()) && task.status != 'Completed',
												'grey--text': task.status == 'Completed',
											}"
											>mdi-clock</v-icon
										>
										{{ dayjs(task.due).format("ddd, MMM D") }}
									</p>
								</v-card-text>

								<div style="position: absolute; bottom: 0px; width: 100%">
									<div class="d-flex mx-4 mb-3" style="align-items: baseline">
										<p class="grey--text ma-0 pa-0">{{ task.status }}</p>
										<v-spacer></v-spacer>
										<p v-if="task.status != 'To Do'" class="grey--text ma-0 pa-0">{{ getPercentComplete(task).toFixed(0) }}%</p>
									</div>

									<v-progress-linear :color="task.status == 'Completed' ? 'grey' : 'white'" rounded :value="getPercentComplete(task)"></v-progress-linear>
								</div>
							</div>
						</v-card>
					</v-col>
				</v-row>
				<p class="pb-0 mt-4 mb-1 ml-1 grey--text">{{ filtered.length }} tasks</p>
			</v-container>

			<p class="font-italic grey--text text-center mt-12" v-else>No tasks</p>
		</div>

		<v-dialog max-width="500" v-model="new_wizard.open" v-if="new_wizard.open">
			<v-card>
				<NewTaskWizard @close="(new_wizard.open = false), refresh()" />
			</v-card>
		</v-dialog>

		<v-overlay v-if="current" style="z-index: 100000" :style="`padding-top: ${$vuetify.breakpoint.mdAndUp ? '25vh' : '0px'}`" :opacity="0.65">
			<v-container :style="`width: ${$vuetify.breakpoint.mdAndUp ? '1100px' : '100vw'};`" style="height: 100vh; overflow-y: auto">
				<v-btn
					color="grey darken-3"
					exact
					fab
					absolute
					top
					right
					link
					to="/tasks"
					:class="{
						'mr-n10': $vuetify.breakpoint.mdAndUp,
						'mt-11': $vuetify.breakpoint.smAndDown,
					}"
					><v-icon>mdi-close</v-icon></v-btn
				>

				<v-row>
					<v-col cols="12" md="6">
						<v-card v-if="hasRights" :class="getColor(current.subteam)" class="elevation-12">
							<div
								:class="{
									striped: current.status == 'Frozen',
								}"
							>
								<v-card-title class="mb-0 pb-0">
									<h5 class="text-h5" style="width: 100%">
										<input type="text" v-model="current.title" @input="changes = true" />
									</h5>
								</v-card-title>

								<v-card-text class="mb-0 pb-0">
									<p>
										<v-textarea label="Description" auto-grow type="text" v-model="current.description" color="white" @input="changes = true" />
									</p>

									<div class="d-flex">
										<p class="d-flex"><v-icon>mdi-account</v-icon><input class="ml-2 mr-2" type="number" v-model="current.peopleNeeded" placeholder="People Needed" @input="changes = true" /></p>
										<p class="d-flex">
											<v-menu offset-y>
												<template v-slot:activator="{ on, attrs }">
													<div v-bind="attrs" v-on="on">
														<v-icon>mdi-account-group</v-icon>
														{{ current.subteam }}
													</div>
												</template>
												<v-list dense>
													<v-list-item v-for="item in subteams" :key="item.value" :value="item.value" @click="(current.subteam = item.value), (changes = true)" :input-value="current.subteam == item.value">
														<v-list-item-title>{{ item.text }}</v-list-item-title>
													</v-list-item>
												</v-list>
											</v-menu>
										</p>
									</div>

									<p class="d-flex">
										<v-icon>mdi-clock</v-icon>
										<v-menu ref="due_menu" v-model="due_menu" :close-on-content-click="false" :nudge-right="40" :return-value.sync="current.due" transition="scale-transition" offset-y max-width="290px" min-width="290px">
											<template v-slot:activator="{ on, attrs }">
												<input class="ml-2" type="text" v-model="current.due" placeholder="Due" v-bind="attrs" v-on="on" readonly />
											</template>
											<v-date-picker v-if="due_menu" v-model="current.due" full-width @click:date="$refs.due_menu.save(current.due)" @change="changes = true" color="primary"></v-date-picker>
										</v-menu>
									</p>
								</v-card-text>

								<div class="d-flex mx-4 mb-3" style="align-items: baseline">
									<v-select :items="statuses" v-model="current.status" hide-details dense style="width: 20px" @change="changes = true" color="white"></v-select>
									<v-spacer></v-spacer>
									<p v-if="current.status != 'To Do'" class="grey--text ma-0 pa-0">{{ getPercentComplete(current).toFixed(0) }}%</p>
								</div>

								<v-progress-linear color="white" rounded :value="getPercentComplete(current)"></v-progress-linear>
							</div>
						</v-card>

						<v-card :class="getColor(current.subteam)" v-else class="elevation-12">
							<div
								style="height: 100%"
								:class="{
									striped: current.status == 'Frozen',
								}"
							>
								<v-card-title class="mb-0 pb-0">
									<h5 class="text-h5">{{ current.title }}</h5>
								</v-card-title>

								<v-card-text class="mt-2 pb-9">
									<p v-html="current.description"></p>
									<div class="d-flex">
										<p
											style="width: 100px"
											v-if="current.peopleNeeded || current.assigned.length"
											:class="{
												'orange--text': current.assigned.length < current.peopleNeeded,
											}"
										>
											<v-icon
												:class="{
													'orange--text': current.assigned.length < current.peopleNeeded,
												}"
												>mdi-account</v-icon
											>
											{{ current.assigned.length }}

											{{ current.peopleNeeded ? `/ ${current.peopleNeeded}` : "" }}
										</p>
										<p v-if="current.subteam"><v-icon>mdi-account-group</v-icon> {{ current.subteam }}</p>
									</div>
									<p
										v-if="current.due"
										:class="{
											'orange--text': dayjs(current.due).isBefore(dayjs()),
										}"
									>
										<v-icon
											:class="{
												'orange--text': dayjs(current.due).isBefore(dayjs()),
											}"
											>mdi-clock</v-icon
										>
										{{ dayjs(current.due).format("ddd, MMM D") }}
									</p>
								</v-card-text>

								<div style="position: absolute; bottom: 0px; width: 100%">
									<div class="d-flex mx-4 mb-3" style="align-items: baseline">
										<p class="grey--text ma-0 pa-0">{{ current.status }}</p>
										<v-spacer></v-spacer>
										<p v-if="current.status != 'To Do'" class="grey--text ma-0 pa-0">{{ getPercentComplete(current).toFixed(0) }}%</p>
									</div>

									<v-progress-linear color="white" rounded :value="getPercentComplete(current)"></v-progress-linear>
								</div>
							</div>
						</v-card>

						<div class="mt-6" v-if="hasRights">
							<v-btn text color="red" @click="deleteTask(current._id)"><v-icon left>mdi-delete</v-icon>Delete</v-btn>
						</div>
					</v-col>

					<v-col cols="12" md="6">
						<v-card class="mb-6 elevation-12">
							<v-card-title>
								<h5 class="text-h5">Members</h5>
							</v-card-title>

							<v-simple-table class="transparent" dense style="white-space: nowrap" v-if="current.assigned.length != 0">
								<template v-slot:default>
									<thead>
										<tr>
											<th style="width: 56px" class="text-left"></th>
											<th class="text-left">Name</th>
											<th class="text-left">Type</th>
											<th class="text-left">Subteam</th>
											<th v-if="hasRights"></th>
										</tr>
									</thead>

									<tbody>
										<tr v-for="(member, index) in current.assigned" :key="member._id">
											<td @click="setPrimaryAssignee(member)" v-ripple style="cursor: pointer" class="font-weight-black">
												<v-icon class="yellow--text" v-if="current.primary == member">mdi-star</v-icon>
											</td>
											<td class="font-weight-black">
												{{ membersMap[member].name }}
											</td>
											<td>
												{{ membersMap[member].type || "-" }}
											</td>
											<td>
												{{ membersMap[member].subteam || "-" }}
											</td>
											<td v-if="hasRights" @click="removeAssignee(member, index)" style="cursor: pointer; width: 56px">
												<v-icon class="grey--text">mdi-close</v-icon>
											</td>
										</tr>
									</tbody>
								</template>
							</v-simple-table>

							<v-card-text class="text-center my-0 py-0">
								<p class="grey--text font-italic pb-6" v-if="current.assigned.length == 0">Nobody is assigned to this task</p>
								<v-autocomplete class="pb-4" v-if="hasRights" append-outer-icon="mdi-plus" @click:append-outer="addAssignee()" label="Assign..." v-model="add_assign" :items="memberslist" hide-details @keypress.enter="addAssignee()"></v-autocomplete>
							</v-card-text>
						</v-card>

						<v-card class="mb-6 elevation-12">
							<v-card-title>
								<h5 class="text-h5">Checklist</h5>
							</v-card-title>

							<v-simple-table class="transparent" dense style="white-space: nowrap" v-if="current.checklist.length != 0">
								<template v-slot:default>
									<tbody v-if="hasRights">
										<tr
											v-ripple
											style="cursor: pointer"
											v-for="(item, index) in current.checklist"
											:key="item._id"
											:class="{
												'grey--text font-italic text--darken-1': item.completed,
											}"
										>
											<td @click="(item.completed = !item.completed), (changes = true), getPercentComplete(current) == 100 ? (current.status = 'Under Review') : ''" style="cursor: pointer; width: 56px">
												<v-icon
													:class="{
														'grey--text text--darken-2': item.completed,
													}"
													>{{ item.completed ? "mdi-checkbox-marked" : "mdi-checkbox-blank-outline" }}</v-icon
												>
											</td>
											<td
												:class="{
													'text-decoration-line-through': item.completed,
												}"
												@click="(item.completed = !item.completed), (changes = true), getPercentComplete(current) == 100 ? (current.status = 'Under Review') : ''"
											>
												{{ item.title }}
											</td>
											<td @click="current.checklist.splice(index, 1), (changes = true)" style="cursor: pointer; width: 56px">
												<v-icon class="grey--text">mdi-close</v-icon>
											</td>
										</tr>
									</tbody>

									<tbody v-else>
										<tr
											v-for="item in current.checklist"
											:key="item._id"
											:class="{
												'grey--text font-italic': item.completed,
											}"
										>
											<td style="width: 56px">
												<v-icon
													:class="{
														'grey--text': item.completed,
													}"
													>{{ item.completed ? "mdi-checkbox-marked" : "mdi-checkbox-blank-outline" }}</v-icon
												>
											</td>
											<td
												:class="{
													'text-decoration-line-through': item.completed,
												}"
											>
												{{ item.title }}
											</td>
										</tr>
									</tbody>
								</template>
							</v-simple-table>

							<v-card-text class="text-center my-0 py-0">
								<p class="grey--text font-italic pb-6" v-if="current.checklist.length == 0">No items</p>
								<v-text-field class="pb-4" v-if="hasRights" append-outer-icon="mdi-plus" @click:append-outer="addChecklistItem()" label="Add..." v-model="add_checklist" hide-details @keypress.enter="addChecklistItem()"></v-text-field>
							</v-card-text>
						</v-card>

						<v-card class="mb-6 elevation-12">
							<v-card-title>
								<h5 class="text-h5">Resources</h5>
							</v-card-title>

							<v-simple-table class="transparent" dense style="white-space: nowrap" v-if="current.checklist.length != 0">
								<template v-slot:default>
									<tbody v-if="hasRights">
										<tr
											v-ripple
											style="cursor: pointer"
											v-for="(item, index) in current.checklist"
											:key="item._id"
											:class="{
												'grey--text font-italic text-decoration-line-through': item.completed,
											}"
										>
											<td @click="(item.completed = !item.completed), (changes = true), getPercentComplete(current) == 100 ? (current.status = 'Under Review') : ''" style="cursor: pointer; width: 56px">
												<v-icon
													:class="{
														'grey--text': item.completed,
													}"
													>{{ item.completed ? "mdi-checkbox-marked" : "mdi-checkbox-blank-outline" }}</v-icon
												>
											</td>
											<td @click="(item.completed = !item.completed), (changes = true), getPercentComplete(current) == 100 ? (current.status = 'Under Review') : ''">
												{{ item.title }}
											</td>
											<td @click="current.checklist.splice(index, 1), (changes = true)" style="cursor: pointer; width: 56px">
												<v-icon class="grey--text">mdi-close</v-icon>
											</td>
										</tr>
									</tbody>

									<tbody v-else>
										<tr
											v-for="item in current.checklist"
											:key="item._id"
											:class="{
												'grey--text font-italic text-decoration-line-through': item.completed,
											}"
										>
											<td style="width: 56px">
												<v-icon
													:class="{
														'grey--text': item.completed,
													}"
													>{{ item.completed ? "mdi-checkbox-marked" : "mdi-checkbox-blank-outline" }}</v-icon
												>
											</td>
											<td>
												{{ item.title }}
											</td>
										</tr>
									</tbody>
								</template>
							</v-simple-table>

							<v-card-text class="text-center my-0 py-0">
								<p class="grey--text font-italic pb-6" v-if="current.checklist.length == 0">No resources linked</p>
							</v-card-text>

							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="primary" @click="resource_wizard = true"><v-icon left>mdi-plus</v-icon>Add</v-btn>
							</v-card-actions>
						</v-card>
					</v-col>
				</v-row>
			</v-container>

			<v-dialog persistent max-width="450" v-model="resource_wizard" v-if="resource_wizard">
				<v-card>
					<LinkResourceWizard @close="resource_wizard = false" @save="linkResource" />
				</v-card>
			</v-dialog>

			<v-btn :disabled="!changes" @click="save()" fixed bottom right color="primary"><v-icon left>mdi-content-save</v-icon>Save</v-btn>
		</v-overlay>
	</div>
</template>

<script>
	import dayjs from "dayjs";
	import NewTaskWizard from "../components/NewTaskWizard.vue";

	export default {
		name: "Tasks",
		data() {
			return {
				tasks: [],
				members: [],
				new_wizard: {
					open: false,
					data: {},
				},
				current: false,
				dayjs,
				statuses: ["To Do", "In Progress", "Under Review", "Completed", "Frozen"],
				subteams: [
					{
						text: "-",
						value: null,
					},
					{
						text: "Mechanical",
						value: "Mechanical",
					},
					{
						text: "Electronics",
						value: "Electronics",
					},
					{
						text: "Code",
						value: "Code",
					},
					{
						text: "Design",
						value: "Design",
					},
					{
						text: "Field",
						value: "Field",
					},
					{
						text: "Communications",
						value: "Communications",
					},
					{
						text: "Strategy",
						value: "Strategy",
					},
				],
				add_checklist: "",
				add_assign: "",
				due_menu: false,
				subteam_menu: false,
				changes: false,
				filter: "incomplete",
				resource_wizard: false,
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
			memberslist() {
				let data = [];

				for (let i of this.members) {
					data.push({
						text: i.name,
						value: i._id,
					});
				}

				return data;
			},
			membersMap() {
				let data = {};

				for (let i of this.members) {
					data[i._id] = i;
				}

				return data;
			},
			hasRights() {
				return this.$root.user.role > 2 || this.$root.user.position == "Team Lead";
			},
			filtered() {
				let data = [];

				switch (this.filter) {
					case "all":
						data = this.tasks;
						break;
					case "your":
						data = this.tasks.filter((i) => i.assigned.includes(this.$root.user._id));
						break;
					case "incomplete":
						data = this.tasks.filter((i) => i.status != "Completed");
						break;
					case "todo":
						data = this.tasks.filter((i) => i.status == "To Do");
						break;
					case "in progress":
						data = this.tasks.filter((i) => i.status == "In Progress");
						break;
					case "review":
						data = this.tasks.filter((i) => i.status == "Under Review");
						break;
					case "completed":
						data = this.tasks.filter((i) => i.status == "Completed");
						break;
					case "frozen":
						data = this.tasks.filter((i) => i.status == "Frozen");
						break;
					case "mechanical":
						data = this.tasks.filter((i) => i.subteam == "Mechanical");
						break;
					case "electronics":
						data = this.tasks.filter((i) => i.subteam == "Electronics");
						break;
					case "code":
						data = this.tasks.filter((i) => i.subteam == "Code");
						break;
					case "design":
						data = this.tasks.filter((i) => i.subteam == "Design");
						break;
					case "field":
						data = this.tasks.filter((i) => i.subteam == "Field");
						break;
					case "communications":
						data = this.tasks.filter((i) => i.subteam == "Communications");
						break;
					case "strategy":
						data = this.tasks.filter((i) => i.subteam == "Strategy");
						break;
					case "other":
						data = this.tasks.filter((i) => i.subteam == "Other");
						break;
				}

				data.sort((a, b) => dayjs(`${b.due}`) - dayjs(`${a.due}`));

				return data;
			},
		},
		methods: {
			refresh() {
				this.$root.loading = true;
				this.$http.get(`/api/task`).then((response) => {
					this.$http.get("/api/auth/users?sponsor=false").then((response2) => {
						this.members = response2.data;
						this.tasks = response.data;
						this.$root.loading = false;
						this.changes = false;
						if (this.$route.params.id) {
							this.current = this.tasks.find((i) => i._id == this.$route.params.id);
							this.current_open = true;
						}
					});
				});
			},
			getColor(subteam) {
				if (subteam == "Mechanical") return "purple darken-4";
				else if (subteam == "Electronics") return "green darken-4";
				else if (subteam == "Code") return "light-blue darken-4";
				else if (subteam == "Design") return "red darken-4";
				else if (subteam == "Field") return "blue-grey darken-4";
				else if (subteam == "Communications") return "orange darken-4";
				else if (subteam == "Strategy") return "indigo darken-3";
				else return "teal darken-4";
			},
			getPercentComplete(task) {
				if (task.checklist.length != 0) {
					let itemsFinished = 0;
					for (let i of task.checklist) {
						if (i.completed) itemsFinished++;
					}
					return (itemsFinished / task.checklist.length) * 100;
				} else if (task.status == "Completed") return 100;
				else return 0;
			},
			addChecklistItem() {
				if (this.add_checklist != "") {
					this.current.checklist.push({
						title: this.add_checklist,
						completed: false,
					});
					this.add_checklist = "";
					this.changes = true;
				}
			},
			addAssignee() {
				if (this.add_assign != "") {
					this.current.assigned.push(this.add_assign);
					this.add_assign = "";
					this.changes = true;
				}
			},
			setPrimaryAssignee(id) {
				if (this.current.primary == id) this.current.primary = null;
				else this.current.primary = id;
				this.changes = true;
			},
			removeAssignee(id, index) {
				this.current.assigned.splice(index, 1);
				if (this.current.primary == id) this.current.primary = null;
				this.changes = true;
			},
			save() {
				if (this.current) {
					this.$http.put(`/api/task/${this.current._id}`, this.current).then((response) => {
						this.current = response.data;
						this.changes = false;
					});
				}
			},
			deleteTask(task) {
				this.$http.delete(`/api/task/${task}`).then((response) => {
					this.refresh();
					this.$router.push("/tasks");
				});
			},
			handleKeyUp(e) {
				if (e.code == "Escape" && this.$route.path != "/tasks" && !this.changes) this.$router.push("/tasks");
			},
		},
		created() {
			this.refresh();
			document.addEventListener("keyup", this.handleKeyUp);
			if (this.$route.query.filter) this.filter = this.$route.query.filter;
		},
		beforeDestroy() {
			document.removeEventListener("keyup", this.handleKeyUp);
		},
		components: {
			NewTaskWizard,
		},
		watch: {
			"$route.path"() {
				if (this.$route.params.id) {
					this.current = this.tasks.find((i) => i._id == this.$route.params.id);
				} else {
					this.current = false;
					this.refresh();
				}
			},
		},
	};
</script>

<style>
	input,
	textarea {
		color: white;
		outline: none;
		width: 100% !important;
	}

	.striped {
		background: repeating-linear-gradient(-45deg, transparent, transparent 15px, rgba(0, 0, 0, 0.1) 15px, rgba(0, 0, 0, 0.1) 30px);
	}

	.completed {
		background: rgba(0, 0, 0, 0.4);
		color: #9e9e9e;
	}
</style>

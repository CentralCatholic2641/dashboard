<template>
	<div>
		<v-toolbar dense color="grey darken-4" style="z-index: 1">
			<v-toolbar-title class="d-flex">
				<v-breadcrumbs v-if="$vuetify.breakpoint.smAndUp" :items="breadcrumbs" divider="/" class="pa-0 ma-0"></v-breadcrumbs>

				<h6 class="text-h6 font-weight-black">Resources</h6>

				<v-breadcrumbs v-if="$vuetify.breakpoint.smAndUp" :items="path" divider="/" class="pa-0 ma-0"></v-breadcrumbs>
			</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-btn color="primary" @click="new_wizard = true"><v-icon left>mdi-plus</v-icon>New</v-btn>
		</v-toolbar>

		<div :style="`height: calc(100vh - ${$vuetify.breakpoint.mdAndUp ? '112px' : '104px'}); overflow: auto`">
			<v-container style="max-width: 1185px" class="px-8 pt-0 mt-4">
				<v-card class="mt-6" v-if="resources.length != 0">
					<v-simple-table class="transparent" dense style="white-space: nowrap">
						<template v-slot:default>
							<thead>
								<tr>
									<th class="text-left" style="width: 50px"></th>
									<th class="text-left">Name</th>
									<th class="text-left">Type</th>
									<th class="text-left">Size</th>
									<th class="text-left">Owner</th>
								</tr>
							</thead>

							<tbody>
								<tr v-ripple style="cursor: pointer" v-for="resource in resources.filter((i) => i.type == 'Folder')" :key="resource._id" @click="$router.push(`/resources/${encodeURIComponent(resource.path)}%2F${resource.filename}`)" @contextmenu="showActionMenu($event), (action_menu_item = resource)">
									<td>
										<v-icon>mdi-folder-open</v-icon>
									</td>
									<td class="font-weight-black">
										{{ resource.filename || "-" }}
									</td>
									<td></td>
									<td></td>
									<td></td>
								</tr>

								<tr v-ripple style="cursor: pointer" v-for="resource in resources.filter((i) => i.type != 'Folder')" :key="resource._id" @click="resource.type == 'Link' ? open(resource.to) : $router.push(`/resources/${encodeURIComponent(resource.path)}/${resource.filename}`)" @contextmenu="showActionMenu($event), (action_menu_item = resource)">
									<td>
										<v-icon v-if="resource.type == 'Document'">mdi-file-document</v-icon>
										<v-icon v-else-if="resource.type == 'Image'">mdi-image</v-icon>
										<v-icon v-else-if="resource.type == 'Video'">mdi-video</v-icon>
										<v-icon v-else-if="resource.type == 'Link'">mdi-link-variant</v-icon>
									</td>
									<td class="font-weight-black">
										{{ resource.filename || "-" }}
									</td>
									<td v-if="resource.type != 'Link'">
										{{ resource.mime || "-" }}
									</td>
									<td v-else>link</td>
									<td v-if="resource.type != 'Link'">
										{{ resource.size || "-" }}
									</td>
									<td v-else>-</td>
									<td>{{ resource.rights.owner.name || "-" }}</td>
								</tr>
							</tbody>
						</template>
					</v-simple-table>
				</v-card>

				<p class="grey--text font-italic text-center mt-12" v-else>No resources</p>
			</v-container>
		</div>

		<v-dialog persistent max-width="450" v-model="new_wizard" v-if="new_wizard">
			<v-card>
				<NewResourceWizard @close="(new_wizard = false), refresh()" :path="$route.params.path" />
			</v-card>
		</v-dialog>

		<v-menu v-if="action_menu_item" v-model="action_menu" :position-x="x" :position-y="y" absolute offset-y>
			<v-list dense>
				<!-- <v-list-item
          v-if="
            action_menu_item.type == 'Link' &&
            (action_menu_item.rights.owner._id == $root.user._id ||
              $root.user.role > 2)
          "
          @click="startEditLink(action_menu_item)"
          class="amber--text"
        >
          <v-list-item-icon
            ><v-icon class="amber--text">mdi-pencil</v-icon></v-list-item-icon
          >
          <v-list-item-title>Edit Link</v-list-item-title>
        </v-list-item> -->

				<!-- <v-list-item @click="startRename(action_menu_item)">
          <v-list-item-icon><v-icon>mdi-form-textbox</v-icon></v-list-item-icon>
          <v-list-item-title>Rename</v-list-item-title>
        </v-list-item> -->

				<v-list-item @click="newTab(action_menu_item)">
					<v-list-item-icon><v-icon>mdi-arrow-top-right</v-icon></v-list-item-icon>
					<v-list-item-title>Open in New Tab</v-list-item-title>
				</v-list-item>

				<v-list-item @click="copyLink(action_menu_item)" class="blue--text">
					<v-list-item-icon><v-icon class="blue--text">mdi-share-variant</v-icon></v-list-item-icon>
					<v-list-item-title>Copy Link</v-list-item-title>
				</v-list-item>

				<v-list-item @click="deleteResource(action_menu_item._id)" class="red--text" v-if="action_menu_item.rights.owner._id == $root.user._id || $root.user.role > 2">
					<v-list-item-icon><v-icon class="red--text">mdi-delete</v-icon></v-list-item-icon>
					<v-list-item-title>Delete</v-list-item-title>
				</v-list-item>

				<!-- <v-list-item
          @click="startTransfer(action_menu_item.path)"
          class="grey--text"
          v-if="
            action_menu_item.rights.owner._id == $root.user._id ||
            $root.user.role > 2
          "
        >
          <v-list-item-icon
            ><v-icon class="grey--text"
              >mdi-arrow-right</v-icon
            ></v-list-item-icon
          >
          <v-list-item-title>Transfer</v-list-item-title>
        </v-list-item> -->
			</v-list>
		</v-menu>
	</div>
</template>

<script>
	import NewResourceWizard from "../components/NewResourceWizard.vue";

	export default {
		name: "Resources",
		data() {
			return {
				resources: [],
				path: [],
				encodeURIComponent,
				decodeURIComponent,
				new_wizard: false,
				action_menu_item: null,
				action_menu: false,
				x: 0,
				y: 0,
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
						to: "/resources",
					},
				];
			},
		},
		methods: {
			refresh() {
				this.$root.loading = true;
				this.$http.get(`/api/resource/${encodeURIComponent(this.$route.params.path)}`).then((response) => {
					this.resources = response.data;
					this.$root.loading = false;

					this.path = [
						{
							text: "",
						},
					];
					const split = ("/" + decodeURIComponent(this.$route.params.path)).split("/").slice(1);
					for (let i = 0; i < split.length; i++) {
						this.path.push({
							text: split[i],
							to: `/resources/${encodeURIComponent(split.reduce((accumulator, currentValue, currentIndex) => (currentIndex > i ? accumulator : accumulator + "/" + currentValue)))}`,
							exact: true,
						});
					}
				});
			},
			showActionMenu(e) {
				e.preventDefault();
				this.x = e.clientX;
				this.y = e.clientY;
				this.$nextTick(() => {
					this.action_menu = true;
				});
			},
			open(path) {
				window.open(path);
			},
			deleteResource(id) {
				this.$http.delete(`/api/resource/${id}`).then(() => {
					this.refresh();
				});
			},
			generateLink(resource) {
				if (resource.type == "Link") return resource.to;
				else if (resource.type == "Folder") return window.location.href + "%2F" + encodeURIComponent(resource.filename);
				else return window.location.href + "/" + resource.filename;
			},
			copyLink(resource) {
				navigator.clipboard.writeText(this.generateLink(resource));
			},
			newTab(resource) {
				window.open(this.generateLink(resource));
			},
		},
		created() {
			this.refresh();
		},
		watch: {
			"$route.path"() {
				this.refresh();
			},
		},
		components: {
			NewResourceWizard,
		},
	};
</script>

<style scoped></style>

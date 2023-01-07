<template>
	<div>
		<v-card-title>
			<h4 class="text-h4 font-weight-black mt-1" v-if="$vuetify.breakpoint.mdAndUp">NEW RESOURCE</h4>
			<h5 class="text-h5 font-weight-black mt-1" v-else>NEW RESOURCE</h5>
		</v-card-title>

		<v-card-text class="grey--text">
			<p>Resource Type</p>

			<v-row>
				<v-col cols="4">
					<v-btn block :color="type == 'file' ? 'primary' : 'grey'" :outlined="type != 'file'" class="mb-4" large @click="type = 'file'">File</v-btn>
				</v-col>
				<v-col cols="4">
					<v-btn block :color="type == 'folder' ? 'primary' : 'grey'" :outlined="type != 'folder'" class="mb-4" large @click="type = 'folder'">Folder</v-btn>
				</v-col>
				<v-col cols="4">
					<v-btn block :color="type == 'link' ? 'primary' : 'grey'" :outlined="type != 'link'" class="mb-4" large @click="type = 'link'">Link</v-btn>
				</v-col>
			</v-row>

			<section v-if="type == 'file'">
				<v-file-input v-model="file" label="File..."></v-file-input>
			</section>

			<section v-else-if="type == 'folder'">
				<v-text-field v-model="data.filename" label="Folder Name..." prepend-icon="mdi-folder-open"></v-text-field>
			</section>

			<section v-else-if="type == 'link'">
				<v-text-field v-model="data.filename" label="Link Name..." prepend-icon="mdi-format-title"></v-text-field>

				<v-text-field v-model="data.to" label="URL..." prepend-icon="mdi-link"></v-text-field>
			</section>
		</v-card-text>

		<v-card-actions>
			<v-btn text color="grey" @click="$emit('close')">Cancel</v-btn>
			<v-spacer></v-spacer>
			<v-btn color="primary" @click="createResource()" :disabled="cantCreate">Create<v-icon right>mdi-chevron-right</v-icon></v-btn>
		</v-card-actions>
	</div>
</template>

<script>
	import prettyBytes from "pretty-bytes";

	export default {
		name: "NewResourceWizard",
		props: ["path"],
		data() {
			return {
				type: "file",
				file: null,
				data: {
					filename: "",
					path: this.path,
					type: "",
					mime: "",
					rights: { owner: this.$root.user._id, read: [], write: [] },
					size: "",
					to: "",
					file: "",
				},
			};
		},
		computed: {
			cantCreate() {
				let value = false;

				if (this.type == "file") {
					if (!this.file) value = true;
				} else if (this.type == "folder") {
					if (!this.data.filename) this.value = true;
				} else if (this.type == "link") {
					if (!this.data.to || !this.data.filename) this.value = true;
				} else {
					this.value = true;
				}

				return value;
			},
		},
		methods: {
			createResource() {
				if (this.type == "link") this.data.type = "Link";
				else if (this.type == "folder") this.data.type = "Folder";
				this.$http.post("/api/resource", this.data).then((response) => {
					this.$emit("close");
				});
			},
		},
		watch: {
			file() {
				let reader = new FileReader();
				reader.readAsDataURL(this.file);
				reader.onload = () => {
					this.data.filename = this.file.name;
					this.data.size = prettyBytes(this.file.size);
					this.data.mime = this.file.type;

					if (this.file.type.includes("image")) this.data.type = "Image";
					else if (this.file.type.includes("video")) this.data.type = "Video";
					else this.data.type = "Document";
					this.data.file = reader.result;
				};
				reader.onerror = (error) => {
					console.error("Error: ", error);
				};
			},
		},
	};
</script>

<style scoped></style>

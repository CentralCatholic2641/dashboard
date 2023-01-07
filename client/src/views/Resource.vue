<template>
	<div>
		<v-toolbar dense color="grey darken-4" style="z-index: 1" v-if="resource">
			<v-toolbar-title class="d-flex">
				<v-breadcrumbs v-if="$vuetify.breakpoint.smAndUp" :items="breadcrumbs.concat(path)" divider="/" class="pa-0 ma-0"></v-breadcrumbs>

				<h6 class="text-h6 font-weight-black">{{ resource.filename }}</h6>
			</v-toolbar-title>
		</v-toolbar>

		<div :style="`height: calc(100vh - ${$vuetify.breakpoint.mdAndUp ? '112px' : '104px'}); overflow: auto`">
			<v-container style="max-width: 1185px; height: calc(100% - 16px)" class="px-8 pt-0 mt-4">
				<div id="frame" style="width: 100%; height: calc(100% - 16px)"></div>
			</v-container>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Resource",
		data() {
			return {
				resource: false,
				path: [],
				confirm_delete: false,
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
						text: "Resources",
						disabled: false,
						exact: true,
						to: "/resources",
					},
				];
			},
		},
		methods: {
			refresh() {
				this.$root.loading = true;
				this.$http.get(`/api/resource/${encodeURIComponent(this.$route.params.path)}/${this.$route.params.filename}`).then((response) => {
					if (response.data.type == "Folder") this.$router.push(`/resources/${encodeURIComponent(response.data.path)}%2F${response.data.filename}`);
					else if (response.data.type == "Link") window.location.href = response.data.to;
					this.$root.loading = false;

					if (response.data == null) {
						this.$router.push(`/resources/${encodeURIComponent(this.$route.params.path)}`);
					}
					this.resource = response.data;
					let frame = document.getElementById("frame");
					frame.innerHTML = `<iframe
              width="100%"
              height="100%"
              id="frame"
              frameborder="0"
              src="${this.resource.file}"
            ></iframe>`;

					this.path = [];
					const split = ("/" + decodeURIComponent(this.$route.params.path)).split("/").slice(1);
					for (let i = 0; i < split.length; i++) {
						this.path.push({
							text: split[i],
							to: `/resources/${encodeURIComponent(split.reduce((accumulator, currentValue, currentIndex) => (currentIndex > i ? accumulator : accumulator + "/" + currentValue)))}`,
							exact: true,
						});
					}

					this.path.push({
						text: "",
					});
				});
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
	};
</script>

<style scoped></style>

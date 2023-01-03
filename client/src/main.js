import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import axios from "axios";
const version = require("../package.json").version;

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

Vue.mixin({
	methods: {
		$getCookie(cname) {
			let name = cname + "=";
			let decodedCookie = decodeURIComponent(document.cookie);
			let ca = decodedCookie.split(";");
			for (let i = 0; i < ca.length; i++) {
				let c = ca[i];
				while (c.charAt(0) == " ") {
					c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
					return c.substring(name.length, c.length);
				}
			}
			return "";
		},
	},
});

new Vue({
	router,
	vuetify,
	render: (h) => h(App),
	data() {
		return {
			disableDrawer: false,
			drawer: false,
			loading: true,
			config: false,
			user: false,
			authenticated: false,
			tasks: [],
			title: "",
			version,
		};
	},
	methods: {
		$refresh() {
			this.$root.loading = true;
			this.$http.get("/api").then((response) => {
				this.$root.config = response.data;
				this.$root.url = "/" + this.$root.config.year;
				if (window.location.href.includes("localhost")) {
					document.title = `DEV - TMS | FRC Team ${this.$root.config.team}`;
					if (this.$root.config.initialized) {
						if (this.$vuetify.breakpoint.smAndDown) this.$root.title = "DEV";
						else this.$root.title = `DEV - FRC Team ${this.$root.config.team} TMS`;
					} else {
						this.$root.title = `DEV - Team Management System Initialization`;
					}
				} else {
					document.title = `TMS | FRC Team ${this.$root.config.team}`;
					if (this.$root.config.initialized) {
						if (this.$vuetify.breakpoint.smAndDown) this.$root.title = "";
						else this.$root.title = `FRC Team ${this.$root.config.team} TMS`;
					} else {
						this.$root.title = `Team Management System Initialization`;
					}
				}
				this.$root.loading = false;
			});
		},
	},
	created() {
		if (this.$vuetify.breakpoint.smAndDown) this.$root.drawer = false;
		this.$root.$refresh();

		if (this.$getCookie("jwt")) {
			this.$http.get("/api/auth/verify").then(async (response) => {
				if (response.data.valid) {
					this.$root.user = response.data.user;
					this.$root.tasks = response.data.tasks;
					if (!this.$root.user.resetPasswordOnNextLogin && !this.$root.user.locked) {
						if (!this.$route.path.includes("screen")) this.$root.drawer = true;
						this.$root.authenticated = true;
					}
				}
			});
		}
	},
}).$mount("#app");

import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Home",
		component: () => import("../views/Home.vue"),
	},
	{
		path: "/events",
		name: "Events",
		component: () => import("../views/Events.vue"),
	},
	{
		path: "/events/:code",
		name: "EventIndex",
		component: () => import("../views/Event/EventIndex.vue"),
	},
	{
		path: "/events/:code/schedule",
		name: "EventSchedule",
		component: () => import("../views/Event/EventSchedule.vue"),
	},
	{
		path: "/events/:code/schedule/:match",
		name: "EventMatch",
		component: () => import("../views/Event/EventMatch.vue"),
	},
	{
		path: "/events/:code/teams",
		name: "EventTeams",
		component: () => import("../views/Event/EventTeams.vue"),
	},
	{
		path: "/events/:code/teams/:team",
		name: "EventTeam",
		component: () => import("../views/Event/EventTeam.vue"),
	},
	{
		path: "/events/:code/scouting",
		name: "EventScouting",
		component: () => import("../views/Event/EventScouting.vue"),
	},
	{
		path: "/events/:code/scouting/match",
		name: "EventScoutingMatch",
		component: () => import("../views/Event/EventScoutingMatch.vue"),
	},
	{
		path: "/events/:code/scouting/pit",
		name: "EventScoutingPit",
		component: () => import("../views/Event/EventScoutingPit.vue"),
	},
	{
		path: "/teams",
		name: "Teams",
		component: () => import("../views/Teams.vue"),
	},
	{
		path: "/teams/:team",
		name: "Team",
		component: () => import("../views/Team.vue"),
	},
	{
		path: "/meetings",
		name: "Meetings",
		component: () => import("../views/Meetings.vue"),
	},
	{
		path: "/meetings/:meeting",
		name: "Meeting",
		component: () => import("../views/Meeting.vue"),
	},
	{
		path: "/attendance",
		name: "Attendance",
		component: () => import("../views/Attendance.vue"),
	},
	{
		path: "/members",
		name: "Members",
		component: () => import("../views/Members.vue"),
	},
	{
		path: "/members/:id",
		name: "Member",
		component: () => import("../views/Member.vue"),
	},
	{
		path: "/sponsors",
		name: "Sponsors",
		component: () => import("../views/Sponsors.vue"),
	},
	{
		path: "/sponsors/:id",
		name: "Sponsor",
		component: () => import("../views/Sponsor.vue"),
	},
	{
		path: "/payments",
		name: "Payments",
		component: () => import("../views/Payments.vue"),
	},
	{
		path: "/payments/:id",
		name: "Payment",
		component: () => import("../views/Payment.vue"),
	},
	{
		path: "/mailing",
		name: "Mailing",
		component: () => import("../views/Mailing.vue"),
	},
	{
		path: "/tasks",
		name: "Tasks",
		component: () => import("../views/Tasks.vue"),
	},
	{
		path: "/tasks/:id",
		name: "Task",
		component: () => import("../views/Tasks.vue"),
	},
	{
		path: "/resources/:path",
		name: "Resources",
		component: () => import("../views/Resources.vue"),
	},
	{
		path: "/resources/:path/:filename",
		name: "Resource",
		component: () => import("../views/Resource.vue"),
	},
	{
		path: "/resources",
		redirect: "/resources/2023",
	},
	{
		path: "/account",
		name: "Account",
		component: () => import("../views/Account.vue"),
	},
	{
		path: "/system",
		name: "System",
		component: () => import("../views/System.vue"),
	},
	{
		path: "*",
		name: "Error404",
		component: () => import("../views/Error404.vue"),
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;

<template>
	<div class="ma-auto text-center" style="max-width: 500px; padding-top: 10vh">
		<v-icon size="75" color="secondary">mdi-telescope</v-icon>
		<h3 class="font-weight-black text-h3 mt-6 primary--text">ERROR 404</h3>
		<h4 class="text-h4 secondary--text mt-4">Page Not Found</h4>
		<p class="mt-6">The page you are looking for does not exist.</p>
		<v-btn class="mt-4" color="primary" link to="/"><v-icon left>mdi-home</v-icon>Go Home</v-btn>
	</div>
</template>

<script>
	export default {
		name: "Error404",
	};
</script>

<style scoped></style>

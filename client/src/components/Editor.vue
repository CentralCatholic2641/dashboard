<template>
	<div v-if="tiptap">
		<div>
			<v-btn icon @click="tiptap.chain().focus().toggleBold().run()" :input-value="tiptap.isActive('bold')"><v-icon>mdi-format-bold</v-icon></v-btn>
			<v-btn icon @click="tiptap.chain().focus().toggleItalic().run()" :input-value="tiptap.isActive('italic')"><v-icon>mdi-format-italic</v-icon></v-btn>
			<v-btn icon @click="tiptap.chain().focus().toggleUnderline().run()" :input-value="tiptap.isActive('underline')"><v-icon>mdi-format-underline</v-icon></v-btn>
			<v-btn class="mr-4" icon @click="tiptap.chain().focus().toggleStrike().run()" :input-value="tiptap.isActive('strike')"><v-icon>mdi-format-strikethrough</v-icon></v-btn>
			<v-btn icon @click="tiptap.chain().focus().setParagraph().run()" :input-value="tiptap.isActive('paragraph')"><v-icon>mdi-format-paragraph</v-icon></v-btn>
			<v-btn icon @click="tiptap.chain().focus().toggleHeading({ level: 1 }).run()" :input-value="tiptap.isActive('heading', { level: 1 })"><v-icon>mdi-format-header-1</v-icon></v-btn>
			<v-btn icon @click="tiptap.chain().focus().toggleHeading({ level: 2 }).run()" :input-value="tiptap.isActive('heading', { level: 2 })"><v-icon>mdi-format-header-2</v-icon></v-btn>
			<v-btn class="mr-4" icon @click="tiptap.chain().focus().toggleHeading({ level: 3 }).run()" :input-value="tiptap.isActive('heading', { level: 3 })"><v-icon>mdi-format-header-3</v-icon></v-btn>
			<v-btn icon @click="tiptap.chain().focus().toggleBulletList().run()" :input-value="tiptap.isActive('bulletList')"><v-icon>mdi-format-list-bulleted</v-icon></v-btn>
			<v-btn class="mr-4" icon @click="tiptap.chain().focus().toggleOrderedList().run()" :input-value="tiptap.isActive('orderedList')"><v-icon>mdi-format-list-numbered</v-icon></v-btn>
			<v-btn icon @click="tiptap.chain().focus().setTextAlign('left').run()" :input-value="tiptap.isActive({ textAlign: 'left' })"><v-icon>mdi-format-align-left</v-icon></v-btn>
			<v-btn icon @click="tiptap.chain().focus().setTextAlign('center').run()" :input-value="tiptap.isActive({ textAlign: 'center' })"><v-icon>mdi-format-align-center</v-icon></v-btn>
			<v-btn class="mr-4" icon @click="tiptap.chain().focus().setTextAlign('right').run()" :input-value="tiptap.isActive({ textAlign: 'right' })"><v-icon>mdi-format-align-right</v-icon></v-btn>
		</div>
		<v-divider class="mb-3 mt-1"></v-divider>
		<editor-content style="height: calc(100% - 55px); overflow-y: auto; overflow-x: hidden; max-width: 828px !important" :editor="tiptap" />
	</div>
</template>

<script>
	import { Editor, EditorContent } from "@tiptap/vue-2";
	import Placeholder from "@tiptap/extension-placeholder";
	import StarterKit from "@tiptap/starter-kit";
	import TextStyle from "@tiptap/extension-text-style";
	import FontFamily from "@tiptap/extension-font-family";
	import Underline from "@tiptap/extension-underline";
	import TextAlign from "@tiptap/extension-text-align";
	import Typography from "@tiptap/extension-typography";
	import TaskList from "@tiptap/extension-task-list";
	import TaskItem from "@tiptap/extension-task-item";

	export default {
		name: "Editor",
		props: {
			value: {
				type: String,
				default: null,
			},
			placeholder: {
				type: String,
				default: "Content...",
			},
		},
		data() {
			return {
				tiptap: null,
			};
		},
		watch: {
			value(v) {
				const isSame = this.tiptap.getHTML() === v;

				if (isSame) {
					return;
				}

				this.tiptap.commands.setContent(v, true);
			},
		},
		components: {
			EditorContent,
		},
		mounted() {
			const placeholder = this.placeholder;
			this.tiptap = new Editor({
				content: this.value,
				extensions: [
					StarterKit,
					TextStyle,
					FontFamily,
					Underline,
					TextAlign,
					Typography,
					TaskList,
					TaskItem,
					Placeholder.configure({
						placeholder,
					}),
				],
				onUpdate: () => {
					const html = this.tiptap.getHTML();
					this.$emit("input", html);
				},
			});

			this.$on("clear", () => {
				this.tiptap.commands.setContent("", true);
			});
		},
		beforeDestroy() {
			this.tiptap.commands.setContent("", true);
			this.tiptap.destroy();
		},
	};
</script>

<style>
	.ProseMirror {
		outline: none !important;
		height: 100%;
	}
</style>

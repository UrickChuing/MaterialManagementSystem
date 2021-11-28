<template>
	<div class="flexRowWarp config">


		<category></category>

		<!-- <m-type></m-type> -->

	</div>
</template>

<script>
	import category from './category.vue'
	import mType from './type.vue'

	export default {
		name: 'wupincanshupeizhi',
		components: {
			category,
			mType
		},
		data() {
			return {
				inAdd:false
			}
		},
		created: function() {
			var that = this;


		},
		methods: {

		}
	}
</script>

<style scoped="scoped">
	.config>div{
		margin-right: 15px;
	}
</style>

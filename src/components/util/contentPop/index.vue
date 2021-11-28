<template>

	<div :class="classes" @click="hide = !hide" v-if="!hideLazy">
		<slot></slot>
	</div>

</template>

<script>
	export default {
		data(){
			return {
				classes:['pop-full','hide'],
				hide:true,
				hideLazy:true
			}
		},
		watch:{
			hide:function(newV){
				
				var that = this;
				if(newV){
					that.classes = ['pop-full','hide']
				}else{
					that.classes = ['pop-full','show']
				}
				
				setTimeout(function(){
					that.hideLazy = newV
				},300)
				
			}
		},
		methods: {
			show:function(){
				
				this.hide = false;
			},
			hiden:function(){
				this.hide = true;
			}
		}
	}
</script>

<style>
	.pop-full.hide{
		animation: forwards popHide 0.3s ease;
	}
	.pop-full.show{
		animation: forwards popShow 0.3s ease;
	}
	.pop-full {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0px;
		left: 0px;
		z-index: 2000;
		background: rgba(00, 00, 00, 0.2);
		opacity: 1;
	}
	
	@keyframes popShow{
		from{opacity: 0;}
		to{opacity: 1;}
	}
	@keyframes popHide{
		from{opacity: 1;}
		to{opacity: 0;}
	}
	
</style>

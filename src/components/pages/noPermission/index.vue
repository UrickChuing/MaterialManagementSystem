<template>
  <div :class="baseClasses" :style="baseStyle">
		<h2>对不起，您没有权限访问此页面</h2>
  </div>
</template>

<script>
  export default {
    name: 'name',
    data() {
      return {
        baseClasses:['baseClass'],
        baseStyle:{},



      }
    },
	beforeRouteEnter:function( to , from , next ){
		next(that => {
			
			
			console.log('from',from)
			console.log('to',from)
			that.router
		})
	},
    created: function() {

    },
    methods: {
		
		
		
    }
  }
</script>

<style scoped="scoped">
  .baseClass{

  }
</style>

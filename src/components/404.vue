<template>
  <div>
    <H1>页面丢失</H1>
    <H1>(页面不存在 或 无权限访问页面)</H1>
    <a @click="toLogin" >点击前往登陆页面</a>
  </div>
</template>

<script>
  export default {
    data(){
      return {

      }
    },
    created:function(){

    },
    methods:{
      toLogin:function(){
        const loading = that.$loading({
          lock: true,
          // text: 'Loading...',
          // spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        });
        this.$router.push("/login");
        setTimeout(function(){
          loading.close();
          window.location.reload();
        },50)
      }
    }
  }
</script>

<style>
</style>

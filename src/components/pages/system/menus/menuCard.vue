<template>
  <div>
    <h2>{{$t(bean.title)}}</h2>
    <div>
      
      
      
    </div>
    
  </div>
</template>

<script>
  export default{
    data(){
      return {
        
        bean:{
          component: "",
          display: true,
          fullPath: "/service/purchaseRequest",
          icon: "el-icon-copy-document",
          keepAlive: true,
          menu: true,
          more: false,
          name: "purchaseRequest",
          parent: 2,
          path: "/service/purchaseRequest",
          title: "caigoushenqing",
        }
        
      }
    },
    created:function(){
      
    },
    methods:{
      
    }
  }
</script>

<style>
</style>

<template>
  <div>
    <div class="card-header">
      <template v-if="cruise != null">
        {{cruise.name}}
      </template>
      <template v-else-if="cruise == null">
        <san class="blue">请选择邮轮</san>
      </template>
    </div>

    <template v-if="cruise != null">
      <div class="input-line margin-top10">
        <div class="input-block">
          <span>名称</span>
          <el-input v-model="updateName" :placeholder="cruise.name" clearable></el-input>
          <el-button @click="update" type="warning" size="medium">保存</el-button>
          <el-button @click="updateName=cruise.name" type="success" size="medium">重置</el-button>
        </div>
      </div>

      <el-tabs class="margin-top20" type="border-card">
        <el-tab-pane label="航次设置">
          <route :cruise.sync="cruise"></route>
        </el-tab-pane>
        <el-tab-pane label="邮轮仓库设置">
          <warehouse :cruise.sync="cruise"></warehouse>
        </el-tab-pane>
        <el-tab-pane label="岸上仓库设置">
          <shore-warehouse :cruise.sync="cruise"></shore-warehouse>
        </el-tab-pane>
      </el-tabs>

    </template>


  </div>
</template>

<script>
  import warehouse from './details_warehouse.vue'
  import shoreWarehouse from './details_shore_warehouse.vue'
  import route from './details_route.vue'

  export default {
    components: {
      warehouse,
      route,
      shoreWarehouse
    },
    data() {
      return {

        parent: this.$parent,

        cruise: null,
        updateName: null,


      }
    },
    watch: {


    },
    created: function() {

    },
    methods: {
      update: function() {
        var that = this;

        var msg = '';
        if (that.updateName == '')
          msg = '请输入名称';

        if (that.cruise.id == '' || that.cruise.id == undefined)
          msg = '对象异常，请刷新数据';

        if (msg != '') {
          that.$notify({
            title: '警告',
            message: msg,
            type: 'error',
            duration: 5000,
            dangerouslyUseHTMLString: true
          });
          return;
        }


        var axios = that.axios;
        axios({
          method: 'post',
          url: '/cruise/update',
          data: {
            id: that.cruise.id,
            name: that.updateName
          },
          df: false
        }).then((response) => {
          if (!response)
            return;
          var data = response.data;

          if (data.code == 1) {
            that.updateSuccess(true);
            that.parent.initCruise();
          } else {
            throw data.msg
          }

        }).catch((error) => {
          that.errorhanding(error)
        })
      }



    }
  }
</script>

<style scoped="scoped">
  .card-header {
    border-bottom: solid 1px rgba(0, 0, 0, 0.2);
    padding-bottom: 10px;
    font-size: 20px;
  }
</style>

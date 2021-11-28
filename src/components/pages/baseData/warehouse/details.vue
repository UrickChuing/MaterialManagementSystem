<template>
  <div>
    <div class="card-header">
      <template v-if="!inAdd && warehouse != null">
        {{warehouse.name}}
      </template>
      <template v-else-if="parent.tree.inAdd">
        <san class="blue margin-right10">添加仓库</san> <span style="font-size: 15px;">
          <san class="blue">新仓库</san>
        </span>
      </template>
      <template v-else-if="!parent.tree.inAdd && warehouse == null">
        <san class="blue">请选择仓库</san>
      </template>
    </div>

    <el-tabs type="border-card">
      <el-tab-pane label="基础信息" style="height: 580px;">
        <d-info ref="info"></d-info>
      </el-tab-pane>
      <el-tab-pane label="配置部门" style="height: 580px;" :disabled="warehouse == null">
        <d-org :warehouse="warehouse" v-if="warehouse != null"></d-org>
        <div v-else>添加新仓库，请点击上方‘基础信息’切换并添加</div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import dInfo from './details_info.vue'
  import dOrg from './details_orgnazition.vue'

  export default {
    components: {
      dInfo,
      dOrg
    },
    data() {
      return {

        parent: this.$parent,

        warehouse: null,
        inAdd: false

      }
    },
    watch: {
      'warehouse': {
        handler: function(newV) {
          this.$refs.info.warehouse = newV
        },
        deep: true
      }

    },
    created: function() {

    },
    methods: {
      
    }
  }
</script>

<style scoped="scoped">
  .card-header {
    /* 		border-bottom: solid 1px rgba(0, 0, 0, 0.2); */
    padding-bottom: 10px;
    font-size: 20px;
  }
</style>

<template>
  <div class="flexRowWarp">
    <div class="tree-card">
      <div class="tree-card-header">
        <div></div>
        <div style="margin-left: auto;">
          <!-- <el-button size="mini" @click="tree.inAdd=!tree.inAdd" type="success" v-if="tree.select != null && tree.level != 4 && !tree.inAdd">添加子库</el-button> -->
          <el-button size="mini" @click="tree.select = null;tree.click=null;tree.level=0;" type="primary"
            v-if="tree.select != null">取消选择</el-button>
        </div>
      </div>

      <div class="public-scroll-y">
        <div class="tree-node-block youCanNotChoose" v-for="node1 in tree.list">
          <div :class="['tree-node-item' , tree.click == node1.id? 'fucos':'']" @click="tree.click = node1.id;tree.select = node1;tree.level=1;">
            <div>
              <!-- <i @click="node1.open = !node1.open;" class="el-icon-minus" v-if="node1.children != undefined && node1.open"></i>
        			<i @click="node1.open = !node1.open;" class="el-icon-plus" v-if="node1.children != undefined && !node1.open"></i> -->
            </div>
            <div class="flexCenter">
              {{node1.name}}
            </div>
            <div class="margin-left-auto margin-right15" :class="[node1.organizationNumber==0? 'red':'blue']">

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="agreement-card">
      <div class="card-header">
        <template v-if="tree.select != null && tree.operation == STATUS.CHOSEN">
          {{tree.select.name}}
        </template>
        <template v-else-if="tree.select == null && tree.operation == STATUS.NOCHOSEN">
          <span class="blue">请选择供应商</span>
        </template>
        <template v-else-if="tree.select != null && tree.operation == STATUS.UPDATE">
          {{tree.select.name}} > <span class="font16">{{supplierAgreement.name}} 【 {{supplierAgreement.code}} 】 </span>

          <el-button @click="tree.operation = STATUS.CHOSEN" class="float-right" type="warning" size="mini">返回</el-button>
        </template>
       <template v-else-if="tree.select != null && tree.operation == STATUS.ADD">
          {{tree.select.name}} > <span class="font16">添加协议</span>

          <el-button @click="tree.operation = STATUS.CHOSEN" class="float-right" type="warning" size="mini">返回</el-button>
        </template>
      </div>
      <a-list ref="alist" :style="{display:tree.select != null&&tree.operation==STATUS.CHOSEN? '':'none'}"></a-list>
      <template v-if="tree.select != null && (tree.operation==STATUS.ADD||tree.operation==STATUS.UPDATE)">
        <a-details></a-details>
      </template>
    </div>
  </div>
</template>

<script>
  import aList from './agreementList.vue'
  import aDetails from './agreementDetial.vue'

  export default {
    name: 'gongyingshangxieyi',
    components: {
      aList,
      aDetails
    },
    data() {
      return {

        reason:{
          name:''
        },

        tree: {
          list: [],
          click: null,
          select: null,
          level: 0,
          operation: this.STATUS.NOCHOSEN,
        },

        supplierAgreement: null

      }
    },
    watch: {
      'tree.select': {
        handler: function(newV) {
          var that = this;

          if(newV == null){
            that.tree.operation = that.STATUS.NOCHOSE
            return
          }
          that.tree.operation = that.STATUS.CHOSEN
          that.$refs.alist.supplierId = newV.id;
        },
        deep: true
      },
      'tree.inAdd': {
        handler: function(newV) {
          var that = this;
        },
        deep: true
      }
    },
    beforeRouteEnter: function(to, from, next) {
      next((that) => {

      })
    },
    created: function() {
      var that = this;

      that.initTree();
    },
    methods: {

      initTree: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/supplier/list',
          data: {},
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;

          that.tree.list = data.data

        }).catch((error) => {
          that.errorhanding(error)
        })

      },
      
      initAgreement:function(){
        this.$refs.alist.initTableList();
      },
      
      addAgreement: function(){
        var that = this;

        that.tree.operation = that.STATUS.ADD;
      },

      updateAgreement: function(agreement){
        var that = this;

        that.tree.operation = that.STATUS.UPDATE;
        that.supplierAgreement = agreement;
      }

    }
  }
</script>

<style scoped="scoped">
  .public-scroll-y {
    height: calc(100% - 32px);
  }

  .tree-card{
    width: 25%;
  }

  .agreement-card {
    min-width: 70%;
    min-height: 700px;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.3);
    padding: 10px;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    margin-right: 10px;
  }

  .card-header {
    border-bottom: solid 1px rgba(0, 0, 0, 0.2);
    padding-bottom: 10px;
    font-size: 20px;
  }

</style>

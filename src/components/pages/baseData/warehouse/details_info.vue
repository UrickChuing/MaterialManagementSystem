<template>
  <div>
    <div class="input-line" v-if="warehouse != null && !parent.inAdd">

      <div class="input-block">
        <span>仓库名</span>
        <el-input v-model="warehouse.name" clearable></el-input>
      </div>

      <br>
      <div class="input-block">
        <span>体积</span>
        <el-input-number v-model="warehouse.volum" style="width: 151px;" :max="99999999.999" :precision="3" :step="0.001"
          :controls="false" clearable></el-input-number>
        <span style="width: 24px;">m³</span>
      </div>
      <div class="input-block">
        <span>承重</span>
        <el-input-number v-model="warehouse.bearing" style="width: 151px;" :precision="3" :controls="false" clearable></el-input-number>
        <span style="width: 24px;">kg</span>
      </div>
      <br>
      <div class="input-block">
        <span>可用空间</span>
        <el-input-number v-model="warehouse.effVolum" style="width: 151px;" :precision="3" :controls="false" clearable></el-input-number>
        <span style="width: 24px;">m³</span>
      </div>
      <br>
      <div class="input-block">
        <span>占用空间预警</span>
        <el-input-number v-model="warehouse.warnVolum" style="width: 151px;" :precision="3" :controls="false" clearable></el-input-number>
        <span style="width: 24px;">m³</span>
      </div>
      <div class="input-block">
        <span>占用承重预警</span>
        <el-input-number v-model="warehouse.warnBearing" style="width: 151px;" :precision="3" :controls="false"
          clearable></el-input-number>
        <span style="width: 24px;">kg</span>
      </div>

<!--      <div class="margin-top30">
        <el-checkbox v-model="warehouse.isPurchaseWarehousing" label="采购入库" border></el-checkbox>
        <el-checkbox v-model="warehouse.isWarehousing" label="普通入库" border></el-checkbox>
        <br>
        <el-checkbox v-model="warehouse.isAssignedFrom" class="margin-top20" label="发起调配" border></el-checkbox>
        <el-checkbox v-model="warehouse.isAssignedTo" label="接受调配" border></el-checkbox>
        <br>
        <el-checkbox v-model="warehouse.isReceiving" class="margin-top20" label="领用" border></el-checkbox>
        <el-checkbox v-model="warehouse.isOutOfWarehouse" label="出库" border></el-checkbox>
      </div> -->

      <div class="input-block">
        <span style="float: left; margin-right: 0px;">备注</span>
        <el-input v-model="warehouse.remark" type="textarea" :rows="3" style="width: 535px;" resize="none"></el-input>
      </div>

    </div>

    <div class="input-line" v-if="parent.inAdd">

      <div class="input-block">
        <span>仓库名</span>
        <el-input v-model="bean.name" clearable></el-input>
      </div>

      <br>
      <div class="input-block">
        <span>体积</span>
        <el-input-number v-model="bean.volum" style="width: 151px;" :max="99999999.999" :precision="3" :step="0.001"
          :controls="false" clearable></el-input-number>
        <span style="width: 24px;">m³</span>
      </div>
      <div class="input-block">
        <span>承重</span>
        <el-input-number v-model="bean.bearing" style="width: 151px;" :precision="3" :controls="false" clearable></el-input-number>
        <span style="width: 24px;">kg</span>
      </div>
      <br>
      <div class="input-block">
        <span>可用空间</span>
        <el-input-number v-model="bean.effVolum" style="width: 151px;" :precision="3" :controls="false" clearable></el-input-number>
        <span style="width: 24px;">m³</span>
      </div>
      <br>
      <div class="input-block">
        <span>占用空间预警</span>
        <el-input-number v-model="bean.warnVolum" style="width: 151px;" :precision="3" :controls="false" clearable></el-input-number>
        <span style="width: 24px;">m³</span>
      </div>
      <div class="input-block">
        <span>占用承重预警</span>
        <el-input-number v-model="bean.warnBearing" style="width: 151px;" :precision="3" :controls="false" clearable></el-input-number>
        <span style="width: 24px;">kg</span>
      </div>

   <!--   <div class="margin-top30">
        <el-checkbox v-model="bean.isPurchaseWarehousing" label="采购入库" border></el-checkbox>
        <el-checkbox v-model="bean.isWarehousing" label="普通入库" border></el-checkbox>
        <br>
        <el-checkbox v-model="bean.isAssignedFrom" class="margin-top20" label="发起调配" border></el-checkbox>
        <el-checkbox v-model="bean.isAssignedTo" label="接受调配" border></el-checkbox>
        <br>
        <el-checkbox v-model="bean.isReceiving" class="margin-top20" label="领用" border></el-checkbox>
        <el-checkbox v-model="bean.isOutOfWarehouse" label="出库" border></el-checkbox>
      </div>
 -->
      <div class="input-block">
        <span style="float: left; margin-right: 0px;">备注</span>
        <el-input v-model="bean.remark" type="textarea" :rows="3" style="width: 535px;" resize="none"></el-input>
      </div>

    </div>

    <div class="flexCenter margin-top30">
      <template v-if="!parent.inAdd && warehouse!=null">
        <el-button @click="updateWarehouse" type="success">保存</el-button>
      </template>
      <template v-if="parent.inAdd">
        <el-button @click="addWarehouse" type="success">添加</el-button>
        <el-button @click="parent.inAdd = false" type="warning" plain>取消</el-button>
      </template>
    </div>
  </div>
</template>


<script>
  export default {
    data() {
      var parent = this.$parent.$parent.$parent;
      return {
        parent: parent,

        warehouse: parent.warehouse,
        bean: {
          bearing: 10000,
          effVolum: 20,
          isAssignedFrom: true,
          isAssignedTo: true,
          isOutOfWarehouse: true,
          isPurchaseWarehousing: true,
          isReceiving: true,
          isWarehousing: true,
          location: "",
          name: "",
          organizationId: '',
          remark: "",
          volum: 20,
          warnBearing: 5000,
          warnVolum: 10,
          parentId: ''
        },

        inAdd: false

      }
    },
    watch: {
      '$parent.$parent.$parent.warehouse' : {
        handler:function(newV){
          console.log('Inner',newV)
        },
        deep:true
      }

    },
    created: function() {

    },
    methods: {

      addWarehouse: function() {

        var that = this;
        var axios = that.axios;

        // if (that.parent.tree.click != null) {
        //   that.bean.parentId = that.parent.tree.click;
        // } else {
        //   delete that.bean.parentId;
        // }

        axios({
          method: 'post',
          url: '/warehouse/add',
          data: that.bean,
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          if (data.code == that.STATUS.SUCCESS) {
            that.addSuccess(true)
            that.parent.$parent.initTree();
            that.parent.$parent.tree.click = null;
            that.parent.$parent.tree.select = null;
            that.parent.$parent.tree.inAdd = false;
            that.inAdd = false;
            that.parent.level = 0;
            that.bean = {
              bearing: 10000,
              effVolum: 20,
              isAssignedFrom: true,
              isAssignedTo: true,
              isOutOfWarehouse: true,
              isPurchaseWarehousing: true,
              isReceiving: true,
              isWarehousing: true,
              location: "",
              name: "",
              organizationId: '',
              remark: "",
              volum: 20,
              warnBearing: 5000,
              warnVolum: 10,
              parentId: ''
            }
          }else {
            throw data.msg;
          }
        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      updateWarehouse: function() {

        var that = this;
        var axios = that.axios;

        var warehouse = JSON.parse(JSON.stringify(that.warehouse))

        delete warehouse.createTime;
        delete warehouse.createUser;
        delete warehouse.updateTime;
        delete warehouse.updateUser;
        delete warehouse.isDelete;
        delete warehouse.subUser;
        delete warehouse.subTime;

        axios({
          method: 'post',
          url: '/warehouse/update',
          data: that.warehouse,
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;

          if (data.code == that.STATUS.SUCCESS) {
            that.updateSuccess(true)
            that.parent.$parent.initTree();
            that.parent.$parent.tree.click = null;
            that.parent.$parent.tree.select = null;
            that.parent.$parent.tree.inAdd = false;
            that.parent.$parent.tree.level = 0;
          }else{
            throw data.msg;
          }
        }).catch((error) => {
          that.errorhanding(error)
        })

      }

    }
  }
</script>

<style>
</style>

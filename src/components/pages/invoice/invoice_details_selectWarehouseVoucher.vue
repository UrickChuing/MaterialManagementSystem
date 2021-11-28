<template>
  <div class="select-delivery-request">

    <div class="title">
      选择入库单
    </div>

    <div class="public-table-header">

      <el-input v-model="reason.code" placeholder="单号" size="mini" style="width: 180px;"></el-input>
      <el-button @click="initTableList" icon="el-icon-search" type="primary" size="mini" circle></el-button>

      <div class="right red" v-if="table.inSelect">
        <i class="el-icon-loading"></i>
        请稍等，正在查询。。。
      </div>
    </div>
    <el-table :data="table.list" style="width: 100%" cell-class-name="public-table-cell">
      <el-table-column label="序号" type="index" align="center" min-width="48">
        <template slot-scope="scope">
          <span>{{(table.page - 1) * table.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单号" prop="code" align="center" min-width="210">
      </el-table-column>
      <el-table-column label="采购单号" prop="code" align="center" min-width="210">
        <template slot-scope="scope">
          <span v-if="scope.row.purchaseOrderCode != undefined && scope.row.purchaseOrderCode != null && scope.row.purchaseOrderCode != '' ">
            {{scope.row.purchaseOrderCode}}
          </span>
          <span v-else>
            --
          </span>
        </template>
      </el-table-column>
      <el-table-column label="品项" prop="itemNumber" align="center" min-width="100">
      </el-table-column>
      <el-table-column label="描述" prop="description" align="center" min-width="210">
      </el-table-column>
      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.add">
            <el-button @click="deSelectTarget(scope.row)" type="danger" size="mini">取消选择</el-button>
          </template>
          <template v-else>
            <el-button @click="selectTarget(scope.row)" type="primary" size="mini">选择</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <div class="flexCenter margin-top10">
      <el-pagination @size-change="(val)=>{table.pageSize=val;initTableList()}" @current-change="(val)=>{table.page=val;initTableList()}"
        :current-page="table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="table.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="table.total">
      </el-pagination>
    </div>


  </div>
</template>

<script>
  export default {
    props: ['warehouseVoucher'],
    data() {
      return {


        reason: {
          code: '',
        },

        table: {
          list: [],
          page: 1,
          pageSize: 10,
          total: 0
        }


      }
    },
    beforeRouteEnter: function(to, from, next) {
      next((that) => {
        that.initTableList();
      })
    },
    created: function() {
      var that = this;

      that.initTableList();
    },
    methods: {
      initTableList: function() {
        var that = this;
        var axios = that.axios;
        that.table.inSelect = true;
        axios({
          method: 'post',
          url: '/invoice/option/warehouse/voucher',
          data: {
            page: that.table.page,
            pageSize: that.table.pageSize,
            reason: that.reason
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          that.table.inSelect = false;
          var data = response.data;
          if (data.code === that.STATUS.SUCCESS) {
            var list = data.data;
            for (var index in list) {
              var demo = list[index];
              demo.add = false;
              for (var i in that.warehouseVoucher) {
                var model = that.warehouseVoucher[i];
                if (demo.id == model.id) {
                  demo.add = true;
                }
              }
            }

            that.table.list = list;
            that.table.total = data.total;
          }


        }).catch((error) => {
          that.errorhanding(error)
        });
      },
      selectTarget: function(row) {

        for (var i in this.warehouseVoucher) {
          var demo = this.warehouseVoucher[i];
          if (row.purchaseOrderId != demo.purchaseOrderId) {
            this.$message({
              dangerouslyUseHTMLString: true,
              message: '<strong>请选择<span class="blue">同一</span><span class="green">采购订单</span>的入库单',
              customClass: 'z-index2022',
              type: 'error'
            });
            return;
          }
        }


        row.add = true;
        this.$emit("select", row)
      },
      deSelectTarget: function(row) {
        row.add = false;
        this.$emit("deSelect", row);
      }

    }
  }
</script>

<style scoped="scoped">
  .select-delivery-request {
    padding: 20px;
  }

  .select-delivery-request>.title {
    text-align: center;
    font-size: 17px;
    font-weight: bold;
  }
</style>

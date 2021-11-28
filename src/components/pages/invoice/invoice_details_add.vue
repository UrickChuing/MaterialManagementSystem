<template>
  <div class="card" @click.stop="" @keydown.enter="initTableList()">
    <div>
      <div class="title">新增入库物品</div>
      <div class="public-scroll-y-hide" style="height: calc(100% - 41px);">

        <div class="reason-line">
          <div class="reason-input">
            <span>代码</span>
            <el-input v-model="reason.code" clearable></el-input>
          </div>

          <div class="reason-input">
            <span>名称</span>
            <el-input v-model="reason.name" clearable></el-input>
          </div>

          <div class="reason-input">
            <span>条码</span>
            <el-input v-model="reason.barCode" clearable></el-input>
          </div>

          <el-button @click="table.page=1;initTableList()" :icon=" table.inSelect? 'el-icon-loading':'el-icon-search'"
            class="reason-button" type="primary">搜索</el-button>

        </div>


        <el-table :data="table.list" style="width: 100%;margin-top: 20px;border-top: 1px solid #EBEEF5;" max-height="490px"
          cell-class-name="public-table-cell">
          <el-table-column label="采购订单" prop="code" align="center" min-width="180">
          </el-table-column>
          <el-table-column label="物品编码" prop="code" align="center" min-width="180">
            <template slot-scope="scope">
              {{scope.row.preCode + '' + scope.row.code}}
            </template>
          </el-table-column>
          <el-table-column label="物品名称" prop="name" align="center" min-width="120">
          </el-table-column>
          <el-table-column label="物品名称" prop="barCode" align="center" min-width="120">
          </el-table-column>
          <el-table-column label="品牌" prop="brandName" align="center" min-width="210">
          </el-table-column>
          <el-table-column label="单位" prop="purchaseUnit" align="center" min-width="80">
            <template slot-scope="scope">
              {{ scope.row.purchaseUnit }}
            </template>
          </el-table-column>
          <el-table-column label="类别" prop="categoryName" align="center" min-width="120">
          </el-table-column>
          <el-table-column label="可用" prop="applicantName" align="center" min-width="120">
            <template slot-scope="scope">
              {{ scope.row.availStock }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" min-width="80">
            <template slot-scope="scope">

              <el-button @click="addItems(scope.row)" size="mini" icon="el-icon-shopping-cart-2" type="primary" circle
                v-if="!scope.row.add"></el-button>
              <div @click="itemSplice(scope.row)" class="chice-ware pointer youCanNotChoose" v-if="scope.row.add">
                <i class="el-icon-check"></i>
                <i class="el-icon-s-release"></i>
              </div>

            </template>
          </el-table-column>
        </el-table>


        <div class="flexCenter px-marginTop10">
          <el-pagination @size-change="(val)=>{table.pageSize=val;initTableList()}" @current-change="(val)=>{table.page=val;initTableList()}"
            :current-page="table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="table.pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="table.total">
          </el-pagination>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      var parent = this.$parent.$parent;
      return {

        parent: parent,

        reason: {
          name: '',
          code: '',
          barCode: '',

          supplier: parent.bean.supplierAgreementId == '' ? false : true,
          supplierAgreementId: parent.bean.supplierAgreementId,

          purchaseOrderId: parent.bean.purchaseOrderId
        },

        table: {
          list: [],
          page: 1,
          pageSize: 10,
          total: 0,
          inSelect: false
        }

      }
    },
    created: function() {

      this.initTableList();
    },
    methods: {

      itemSplice: function(row) {

        row.add = false;


        this.$emit('itemSplice', row)
      },

      addItems: function(demo) {
        demo.add = true;

        var target = {
          materialId: demo.id,
          materialCode: demo.code,
          materialPreCode: demo.preCode,
          materialName: demo.name,
          barCode: demo.barCode,
          brandName: demo.brandName,
          availStock: demo.availStock,
          totalStock: demo.totalStock,
          price: demo.price == undefined ? 0 : demo.price,
          number: demo.remainNumber,
          expiration: this.getCreateDateStr(new Date()),
          purchaseUnit: demo.purchaseUnit,
          categoryName: demo.categoryName,
          typeName: demo.typeName,
          purchaseOrderMaterialId: demo.purchaseOrderMaterialId,
          remainNumber: demo.remainNumber
        }



        this.$emit("itemAppend", target)
      },

      initTableList: function() {
        var that = this;
        var axios = that.axios;
        that.table.inSelect = true;
        axios({
          method: 'post',
          url: '/stock/in/add/materials/purchaseOrder',
          data: {
            reason: that.reason,
            page: that.table.page,
            pageSize: that.table.pageSize
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          that.table.inSelect = false;
          var data = response.data;

          var items = data.data;

          for (var itemIndex in items) {
            var itemDemo = items[itemIndex];
            itemDemo.add = false;
            var addItems = that.parent.addItems;
            for (var addIndex in addItems) {
              var addDemo = addItems[addIndex];

              if (itemDemo.id == addDemo.materialId) {
                itemDemo.add = true;
              }

            }
          }


          that.table.list = items;
          that.table.total = data.total;
          // that.mapzz = data.mapzz;
          // that.validityWarningList = data.validityWarningList;
          // that.inventoryWarningList = data.inventoryWarningList;


        }).catch((error) => {
          that.table.inSelect = false;
        });
      },


    }
  }
</script>

<style scoped="scoped">
  .chice-ware {
    margin-left: auto;
    margin-right: auto;
    width: 28px;
    height: 28px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 50%;
    background: rgba(103, 194, 58, 1);
    color: white;
    line-height: 28px;
    transition: .2s;
  }

  .chice-ware>i {
    transition: .2s;
  }

  .chice-ware:hover {
    background: rgba(245, 108, 108, 1)
  }

  .chice-ware:hover>i:first-child {
    opacity: 0;
    display: none;
  }

  .chice-ware:hover>i:last-child {
    opacity: 1;
  }

  .chice-ware>i:last-child {
    opacity: 0;
  }

  .reason-input>div {
    width: 150px !important;
  }


  .title {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    border-bottom: rgba(200, 200, 200, 1) solid 1px;
    text-align: center;
  }

  .card>div {
    height: calc(100% - 30px);
    width: calc(100% - 40px);
    background: white;
    border-radius: 5px;
    transition: 0.2s;

    padding: 10px 20px 20px 20px;
  }
</style>

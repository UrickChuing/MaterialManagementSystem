<template>
  <div class="card" @click.stop="" @keydown.enter="initTableList()">
    <div>
      <div class="title">选择领用物品</div>
      <div class="public-scroll-y-hide" style="height: calc(100% - 41px);">

        <div class="reason-line">

          <div class="reason-input">
            <span>入库单</span>
            <el-input v-model="reason.warehouseVoucherCode" clearable></el-input>
          </div>

          <div class="reason-input">
            <span>物品名称</span>
            <el-input v-model="reason.materialName" clearable></el-input>
          </div>

         <!-- <div class="reason-input">
            <span>相关单号</span>
            <el-input v-model="reason.sourceCode" clearable></el-input>
          </div>
 -->
          <div class="reason-input">
            <span>仓库</span>
            <el-button @click="inSelect.show=true;inSelect.type='WAREHOUSE'" type="warning" style="width: 150px;" plain>
              {{reason.warehouseId != null && reason.warehouseId != ''? warehouseName:'点击选择仓库'}}
            </el-button>
          </div>

          <div class="reason-input">
            <span>过期时间</span>
            <el-date-picker v-model="expirations" style="width: 230px !important;" type="daterange" value-format="yyyy-MM-dd"
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>

          <el-button @click="table.page=1;initTableList()" :icon=" table.inSelect? 'el-icon-loading':'el-icon-search'"
            class="reason-button" type="primary">搜索</el-button>

        </div>


        <el-table :data="table.list" style="width: 100%;margin-top: 20px;border-top: 1px solid #EBEEF5;" max-height="490px"
          cell-class-name="public-table-cell">
          <el-table-column label="批次号" prop="code" align="center" min-width="190">
            <template slot-scope="scope">
              {{scope.row.code}}
            </template>
          </el-table-column>
          <el-table-column label="入库单" prop="code" align="center" min-width="190">
            <template slot-scope="scope">
              {{scope.row.warehouseVoucherCode}}
            </template>
          </el-table-column>
          <el-table-column label="物品" align="center" min-width="270">
            <template slot-scope="scope">
              <div class="text-align-center">
                {{scope.row.materialName}}<br>
                【<span class="blue">{{scope.row.materialCode}}</span>】
              </div>
            </template>
          </el-table-column>
          <el-table-column label="仓库" align="center" min-width="210">
            <template slot-scope="scope">
              {{scope.row.warehouseName}}<br>
              【<span class="blue">{{scope.row.warehouseTypeName == undefined || scope.row.warehouseTypeName == ''? '--':scope.row.warehouseTypeName}}</span>】
            </template>
          </el-table-column>
           <el-table-column label="规格" prop="purchaseSpecification" align="center" min-width="120">
          </el-table-column>
          <el-table-column label="单位" prop="purchaseUnit" align="center" min-width="80">
            <template slot-scope="scope">
              {{ scope.row.purchaseUnit }}
            </template>
          </el-table-column>
          <el-table-column label="过期时间" prop="expiration" align="center" min-width="150">
          </el-table-column>
          <el-table-column label="可用库存(实际库存)" align="center" min-width="180">
            <template slot-scope="scope">
              {{ scope.row.remainNumber }} (<span class="blue">{{scope.row.actNumber}}</span>)
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" min-width="80">
            <template slot-scope="scope">

              <template v-if="scope.row.lock">
                <el-button size="mini" icon="el-icon-shopping-cart-2" title="物品正在被盘点中,已被锁定" type="info" circle disabled key></el-button>
              </template>
              <template v-else>
                <el-button @click="addItems(scope.row)" size="mini" icon="el-icon-shopping-cart-2" type="primary" circle
                  v-if="!scope.row.add"></el-button>
                <div @click="itemSplice(scope.row)" class="chice-ware pointer youCanNotChoose" v-if="scope.row.add">
                  <i class="el-icon-check"></i>
                  <i class="el-icon-s-release"></i>
                </div>
              </template>

            </template>
          </el-table-column>
        </el-table>


        <div class="flexCenter px-marginTop10">
          <el-pagination @size-change="(val)=>{table.pageSize=val;initTableList()}" @current-change="(val)=>{table.page=val;initTableList()}"
            :current-page="table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="table.pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="table.total">
          </el-pagination>
        </div>

        <el-dialog :custom-class="['dialog-card','self-card','mini','pop-in-pop']" :visible.sync="inSelect.show"
          :append-to-body="true">
          <add-select @select="selectReason" :id="reason.warehouseId" slot v-if="inSelect.show"></add-select>
        </el-dialog>

      </div>
    </div>
  </div>
</template>

<script>
  import addSelect from './getUsing_details_add_select.vue'

  export default {
    components: {
      addSelect,
    },
    data() {
      var parent = this.$parent.$parent;
      return {

        parent: parent,

        reason: {
          materialName: '',
          warehouseVoucherCode: '',
          sourceCode: '',
          warehouseId: '',
          warehouseTypeId: '',
          warehouseTypeTaskId: '',
          startTime: '',
          endTime: ''
        },

        expirations: [],

        inSelect: {
          show: false,
          type: 'WAREHOUSE'
        },

        warehouseName: '',

        table: {
          list: [],
          page: 1,
          pageSize: 10,
          total: 0,
          inSelect: false
        }

      }
    },
    watch: {
      expirations: {
        handler: function(newV) {

          if (newV != null) {
            this.reason.startTime = newV[0];
            this.reason.endTime = newV[1];
          } else {
            this.reason.startTime = '';
            this.reason.endTime = '';
          }
        },
        deep: true
      }
    },
    created: function() {

      this.initTableList();
    },
    methods: {

      selectReason: function(type, data) {

        if (type == 'WAREHOUSE') {
          this.reason.warehouseId = data.id;
          this.warehouseName = data.name;
        }

      },

      itemSplice: function(row) {

        row.add = false;

        this.$emit('itemSplice', row)
      },

      addItems: function(demo) {
        demo.add = true;

        var target = demo;
        target.stockInCode = target.code;


        this.$emit("itemAppend", target)
      },

      initTableList: function() {
        var that = this;
        var axios = that.axios;
        that.table.inSelect = true;
        axios({
          method: 'post',
          url: '/stock/out/getUsing/add/materials',
          data: {
            reason: that.reason,
            page: that.table.page,
            pageSize: that.table.pageSize
          },
          df: false
        }).then((response) => {

          that.table.inSelect = false;
          var data = response.data;

          var items = data.data;
          for (var itemIndex in items) {
            var itemDemo = items[itemIndex];
            itemDemo.add = false;
            itemDemo.number = itemDemo.actNumber;
            var addItems = that.parent.addItems;
            for (var addIndex in addItems) {
              var addDemo = addItems[addIndex];

              if (itemDemo.stockInId == addDemo.stockInId) {
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

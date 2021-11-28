<template>
  <div class="flexColumn">
    <div class="relation-line">
      <div @keydown.enter="initMainCard()">
        <div class="flexRowWarp">
          <div class="input-line font12 margin-top10 margin-right10">
            <span>单据类型</span>
            <el-select v-model="mainCard.reason.type" placeholder="请选择" size="mini" style="width: 180px;">
              <el-option v-for="item in options.orderType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="input-line font12 margin-top10 margin-right10">
            <span>单号</span>
            <el-input v-model="mainCard.reason.code" size="mini" style="width: 180px;" clearable></el-input>
          </div>

          <div class="input-line font12 margin-top10 margin-right10">
            <span>提交时间</span>
            <el-date-picker v-model="mainCard.timeList" type="datetimerange" range-separator="至" start-placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss" size="mini" end-placeholder="结束日期" style="width: 360px;">
            </el-date-picker>
          </div>

          <br>

          <div class="input-line font12 margin-top10 margin-right10">
            <el-button @click="initMainCard" size="mini" type="primary">查询</el-button>
          </div>

          <div class="input-line font12 margin-top10">
            <el-button @click="clearMainCard" size="mini" type="warning">清除</el-button>
          </div>
        </div>

        <el-table :data="mainCard.table.list" style="width: 100%;margin-top: 10px;" height="450px" border
          cell-class-name="public-table-cell" row-class-name="select" highlight-current-row @current-change="mainCardCurrentChange">
          <el-table-column label="单号" type="code" align="center" min-width="200">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.code}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="说明" prop="description" align="center" min-width="210">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.description}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                <template v-if="scope.row.status == STATUS.UNCOMMIT">
                  未提交
                </template>
                <template v-if="scope.row.status == STATUS.AUDIT">
                  正在审批(提交时间{{DateToStr(new Date(scope.row.subTime))}})
                </template>
                <template v-if="scope.row.status == STATUS.PASS">
                  已通过(最后更新时间{{DateToStr(new Date(scope.row.subTime))}})
                </template>
                <template v-if="scope.row.status == STATUS.NOPASS">
                  未通过(最后更新时间{{DateToStr(new Date(scope.row.updateTime))}})
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="flexCenter margin-top10">
          <el-pagination @size-change="(val)=>{mainCard.table.pageSize=val;initMainCard()}" @current-change="(val)=>{mainCard.table.page=val;initMainCard()}"
            :current-page="mainCard.table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="mainCard.table.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="mainCard.table.total">
          </el-pagination>
        </div>

      </div>
      <div>

        <div class="card-header margin-bottom10">
          清单
        </div>

        <el-table :data="materialCard.table.list" style="width: 100%" height="520" border cell-class-name="public-table-cell"
          row-class-name="select" highlight-current-row>
          <el-table-column label="物品代码" type="code" align="center" min-width="220">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                <template v-if="mainCard.reason.type == 0">
                  {{scope.row.code}}
                </template>
                <template v-else>
                  {{scope.row.materialCode}}
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="物品" align="center" min-width="220">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                <template v-if="mainCard.reason.type == 0">
                  {{scope.row.name}}
                </template>
                <template v-else>
                  {{scope.row.materialName}}
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="条码"  align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                <template v-if="mainCard.reason.type == 0">
                  {{scope.row.barCode}}
                </template>
                <template v-else>
                  {{scope.row.materialBarCode}}
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="品牌"  align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                <template v-if="mainCard.reason.type == 0 || mainCard.reason.type == 1">
                  {{scope.row.materialBrandName}}
                </template>
                <template v-else>
                  {{scope.row.brandName}}
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.number}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.purchaseUnit}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                <template v-if="scope.row.status == STATUS.UNCOMMIT">
                  未提交
                </template>
                <template v-if="scope.row.status == STATUS.AUDIT">
                  正在审批(提交时间{{DateToStr(new Date(scope.row.subTime))}})
                </template>
                <template v-if="scope.row.status == STATUS.PASS">
                  已通过(最后更新时间{{DateToStr(new Date(scope.row.updateTime))}})
                </template>
                <template v-if="scope.row.status == STATUS.NOPASS">
                  未通过(最后更新时间{{DateToStr(new Date(scope.row.updateTime))}})
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </div>

    <!-- 采购订单:purchaseOrderCard -->
    <div class="relation-line" v-if="mainCard.reason.type == 0 || mainCard.reason.type == 2">
      <div>
        <div class="card-header margin-bottom10">
          采购订单
        </div>
        <el-table :data="purchaseOrder.main.list" style="width: 100%;" height="520" border cell-class-name="public-table-cell"
          row-class-name="select" highlight-current-row @current-change="purchaseOrderCurrentChange">
          <el-table-column label="单号" type="code" align="center" min-width="200">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.code}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="说明" prop="description" align="center" min-width="210">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.description}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="提交时间" prop="subTime" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{DateToStr(new Date(scope.row.subTime))}}
              </div>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <div>
        <div class="card-header margin-bottom10">
          采购订单详情
        </div>
        <el-table :data="purchaseOrder.material.list" style="width: 100%" height="520" border cell-class-name="public-table-cell"
          row-class-name="select" highlight-current-row>
          <el-table-column label="物品代码" type="code" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.materialCode}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="物品" align="center" min-width="220">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.materialName}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="条码"  align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.materialBarCode}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="品牌"  align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.materialBrandName}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.number}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.purchaseUnit}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                <template v-if="scope.row.status == STATUS.UNCOMMIT">
                  未提交
                </template>
                <template v-if="scope.row.status == STATUS.AUDIT">
                  正在审批(提交时间{{DateToStr(new Date(scope.row.subTime))}})
                </template>
                <template v-if="scope.row.status == STATUS.PASS">
                  已通过(最后更新时间{{DateToStr(new Date(scope.row.updateTime))}})
                </template>
                <template v-if="scope.row.status == STATUS.NOPASS">
                  未通过(最后更新时间{{DateToStr(new Date(scope.row.updateTime))}})
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </div>

    <!-- 采购申请:purchaseOrderCard -->
    <div class="relation-line" v-if="mainCard.reason.type == 1 || mainCard.reason.type == 2">
      <div>
        <div class="card-header margin-bottom10">
          采购申请订单
        </div>
        <el-table :data="purchaseRequest.main.list" style="width: 100%;" height="520" border cell-class-name="public-table-cell"
          row-class-name="select" highlight-current-row @current-change="purchaseRequestCurrentChange">
          <el-table-column label="单号" type="code" align="center" min-width="210">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.code}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="说明" prop="description" align="center" min-width="210">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.description}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                <template v-if="scope.row.status == STATUS.UNCOMMIT">
                  未提交
                </template>
                <template v-if="scope.row.status == STATUS.AUDIT">
                  正在审批(提交时间{{DateToStr(new Date(scope.row.subTime))}})
                </template>
                <template v-if="scope.row.status == STATUS.PASS">
                  已通过(最后更新时间{{DateToStr(new Date(scope.row.updateTime))}})
                </template>
                <template v-if="scope.row.status == STATUS.NOPASS">
                  未通过(最后更新时间{{DateToStr(new Date(scope.row.updateTime))}})
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <div>
        <div class="card-header margin-bottom10">
          采购申请详情
        </div>
        <el-table :data="purchaseRequest.material.list" style="width: 100%" height="520" border cell-class-name="public-table-cell"
          row-class-name="select" highlight-current-row>
          <el-table-column label="物品代码" type="code" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.code}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="物品" align="center" min-width="220">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.name}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="条码"  align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.barCode}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="品牌"  align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.materialBrandName}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.number}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.purchaseUnit}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                <template v-if="scope.row.status == STATUS.UNCOMMIT">
                  未提交
                </template>
                <template v-if="scope.row.status == STATUS.AUDIT">
                  正在审批(提交时间{{DateToStr(new Date(scope.row.subTime))}})
                </template>
                <template v-if="scope.row.status == STATUS.PASS">
                  已通过(最后更新时间{{DateToStr(new Date(scope.row.updateTime))}})
                </template>
                <template v-if="scope.row.status == STATUS.NOPASS">
                  未通过(最后更新时间{{DateToStr(new Date(scope.row.updateTime))}})
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </div>

    <!-- 采购入库订单:purchaseOrderCard -->
    <div class="relation-line" v-if="mainCard.reason.type == 0 || mainCard.reason.type == 1">
      <div>
        <div class="card-header margin-bottom10">
          采购入库
        </div>
        <el-table :data="warehouseVoucher.main.list" style="width: 100%;" height="520" border cell-class-name="public-table-cell"
          row-class-name="select" highlight-current-row @current-change="warehouseVoucherCurrentChange">
          <el-table-column label="单号" type="code" align="center" min-width="200">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.code}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="说明" prop="description" align="center" min-width="210">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.description}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                <template v-if="scope.row.status == STATUS.UNCOMMIT">
                  未提交
                </template>
                <template v-if="scope.row.status == STATUS.AUDIT">
                  正在审批(提交时间{{DateToStr(new Date(scope.row.subTime))}})
                </template>
                <template v-if="scope.row.status == STATUS.PASS">
                  已通过(最后更新时间{{DateToStr(new Date(scope.row.updateTime))}})
                </template>
                <template v-if="scope.row.status == STATUS.NOPASS">
                  未通过(最后更新时间{{DateToStr(new Date(scope.row.updateTime))}})
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <div>
        <div class="card-header margin-bottom10">
          采购入库详情
        </div>
        <el-table :data="warehouseVoucher.material.list" style="width: 100%" height="520" border cell-class-name="public-table-cell"
          row-class-name="select" highlight-current-row>
          <el-table-column label="物品代码" type="code" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.materialCode}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="物品" align="center" min-width="220">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.materialName}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="条码"  align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.materialBarCode}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="品牌"  align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.brandName}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.number}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.purchaseUnit}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" min-width="180">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                <template v-if="scope.row.status == STATUS.UNCOMMIT">
                  未提交
                </template>
                <template v-if="scope.row.status == STATUS.AUDIT">
                  正在审批(提交时间{{DateToStr(new Date(scope.row.subTime))}})
                </template>
                <template v-if="scope.row.status == STATUS.PASS">
                  已通过(最后更新时间{{DateToStr(new Date(scope.row.updateTime))}})
                </template>
                <template v-if="scope.row.status == STATUS.NOPASS">
                  未通过(最后更新时间{{DateToStr(new Date(scope.row.updateTime))}})
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </div>


  </div>
</template>

<script>
  export default {
    name: 'guanlianchaxun',
    data() {
      return {

        options: {
          orderType: [{
              label: '采购申请',
              value: 0
            },
            {
              label: '采购订单',
              value: 1
            },
            {
              label: '采购入库',
              value: 2
            },
          ]
        },


        mainCard: {

          reason: {
            type: 0,
            code: '',
            subStartTime: '',
            subEndTime: ''
          },

          timeList: [],

          table: {
            list: [],
            total: 0,
            page: 1,
            pageSize: 10
          }

        },


        materialCard: {
          table: {
            list: [],
            total: 0,
            page: 1,
            pageSize: 10
          }
        },


        //采购申请
        purchaseRequest:{
          main: {
            list: [],
            total: 0,
            page: 1,
            pageSize: 10
          },
          material:{
            list: [],
            total: 0,
            page: 1,
            pageSize: 10
          }

        },

        purchaseOrder:{
          main: {
            list: [],
            total: 0,
            page: 1,
            pageSize: 10
          },
          material:{
            list: [],
            total: 0,
            page: 1,
            pageSize: 10
          }

        },

        warehouseVoucher:{
          main: {
            list: [],
            total: 0,
            page: 1,
            pageSize: 10
          },
          material:{
            list: [],
            total: 0,
            page: 1,
            pageSize: 10
          }

        }



      }
    },
    watch:{
      'mainCard.reason.type':{
        handler:function(){
          this.initMainCard();
          this.materialCard.table.list = [];
          this.purchaseOrder.main.list = [];
          this.purchaseRequest.main.list = [];
          this.warehouseVoucher.main.list = [];
        },
        deep: true
      },
      'mainCard.timeList':{
        handler: function(newV){
          if(newV == null){
            this.mainCard.reason.subStartTime = '';
            this.mainCard.reason.subEndTime = '';
          }else{
            this.mainCard.reason.subStartTime = newV[0];
            this.mainCard.reason.subEndTime = newV[1];
          }
        }
      }
    },
    created: function() {
      this.initMainCard();
    },
    methods: {
      initMainCard: function() {
        var that = this;
        var axios = that.axios;
        axios({
          method: 'post',
          url: '/relation/basics/list',
          data: {
            page: that.mainCard.table.page,
            pageSize: that.mainCard.table.pageSize,
            reason: that.mainCard.reason
          },
          df: false
        }).then((response) => {
          if (!response)
            return;
          var data = response.data;

          if (data.code == that.STATUS.SUCCESS) {
            that.mainCard.table.list = data.data;
            that.mainCard.table.total = data.total;
          } else {
            throw data.msg;
          }

        }).catch((error) => {
          that.errorhanding(error)
        })
      },
      initMainCardMaterial: function(id){
        var that = this;
        var axios = that.axios;
        axios({
          method: 'post',
          url: '/relation/basics/materials',
          data: {
            type:that.mainCard.reason.type,
            id:id
          },
          df: true
        }).then((response) => {
          if (!response)
            return;
          var data = response.data;

          if (data.code == that.STATUS.SUCCESS) {
            that.materialCard.table.list = data.data;
            that.materialCard.table.total = data.total;
          } else {
            throw data.msg;
          }

        }).catch((error) => {
          that.$notify({
            title: '错误',
            message: '<div><span class="red">错误内容：</span>' + error +
              '<br> <span class="blue">(若无错内容，联系管理员)</span></div>',
            type: 'error',
            duration: 5000,
            dangerouslyUseHTMLString: true
          });
        })
      },

      initListCard: function(type,reasonType,id){
        var reason;
        //查采购申请
        if(type == 'PR'){
          reason = {
            type: 0,
            //采购订单 为基准
            purchaseOrderId: reasonType == 1? id:null,
            //采购入库 为基准
            warehouseVoucherId: reasonType == 2? id:null
          }
        }

        //查采购订单
        if(type == 'PO'){
          reason = {
            type: 1,
            //采购申请 为基准
            purchaseRequestId: reasonType == 0? id:null,
            //采购入库
            warehouseVoucherId: reasonType == 2? id:null
          }
        }

        //查采购入库
        if(type == 'WV'){
          reason = {
            type: 2,
            //采购申请 为基准
            purchaseRequestId: reasonType == 0? id:null,
            //采购订单 为基准
            purchaseOrderId: reasonType == 1? id:null
          }
        }
        console.log(reason)
        var that = this;
        var axios = that.axios;
        axios({
          method: 'post',
          url: '/relation/basics/list',
          data: {
            reason: reason
          },
          df: false
        }).then((response) => {
          if (!response)
            return;
          var data = response.data;

          if (data.code == that.STATUS.SUCCESS) {

            if(type == 'PO'){
              that.purchaseOrder.main.list = data.data;
              that.purchaseOrder.main.total = data.total;
            }
            if(type == 'WV'){
              that.warehouseVoucher.main.list = data.data;
              that.warehouseVoucher.main.total = data.total;
            }
            if(type == 'PR'){
              that.purchaseRequest.main.list = data.data;
              that.purchaseRequest.main.total = data.total;
            }


          } else {
            throw data.msg;
          }

        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      initMaterialCard: function(type,id){
        var reason;
        if(type == 'PR'){
          reason = {
            type: 0,
            id: id
          }
        }

        if(type == 'PO'){
          reason = {
            type: 1,
            id: id
          }
        }

        if(type == 'WV'){
          reason = {
            type: 2,
            id: id
          }
        }


        var that = this;
        var axios = that.axios;
        axios({
          method: 'post',
          url: '/relation/basics/materials',
          data: reason,
          df: true
        }).then((response) => {
          if (!response)
            return;
          var data = response.data;

          if (data.code == that.STATUS.SUCCESS) {
            if(type == 'PO'){
              that.purchaseOrder.material.list = data.data;
              that.purchaseOrder.material.total = data.total;
            }

            if(type == 'WV'){
              that.warehouseVoucher.material.list = data.data;
              that.warehouseVoucher.material.total = data.total;
            }

            if(type == 'PR'){
              that.purchaseRequest.material.list = data.data;
              that.purchaseRequest.material.total = data.total;
            }

          } else {
            throw data.msg;
          }

        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      mainCardCurrentChange: function(row){
        if(row == null)
          return;
        this.initMainCardMaterial(row.id);
        //采购申请 为基准
        if(this.mainCard.reason.type == 0){
          this.initListCard('PO',this.mainCard.reason.type,row.id)
          this.initListCard('WV',this.mainCard.reason.type,row.id)
        }
        //采购订单 为基准
        if(this.mainCard.reason.type == 1){
          this.initListCard('PR',this.mainCard.reason.type,row.id)
          this.initListCard('WV',this.mainCard.reason.type,row.id)
        }
        //采购入库 为基准
        if(this.mainCard.reason.type == 2){
          this.initListCard('PR',this.mainCard.reason.type,row.id)
          this.initListCard('PO',this.mainCard.reason.type,row.id)
        }
      },
      purchaseRequestCurrentChange: function(row){
        if(row == null){
          this.purchaseRequest.material.list = [];
          return;
        }
        this.initMaterialCard('PR',row.id)
      },
      purchaseOrderCurrentChange:function(row){
        if(row == null){
          this.purchaseOrder.material.list = [];
          return;
        }
        this.initMaterialCard('PO',row.id)
      },
      warehouseVoucherCurrentChange:function(row){
        if(row == null){
          this.warehouseVoucher.material.list = [];
          return;
        }
        this.initMaterialCard('WV',row.id)
      },
      clearMainCard: function() {
        this.mainCard.reason.code = '';
        this.mainCard.reason.subStartTime = '';
        this.mainCard.reason.subEndTime = '';
        this.mainCard.timeList = [];
      },

    }
  }
</script>

<style scoped="scoped">
  .card-header {
    padding: 10px;
    border-bottom: 1px solid rgba(00, 00, 00, 0.2);
  }

  .relation-line {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .relation-line>div {
    flex: 1;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.3);
    padding: 0px 10px 10px 10px;

  }

  .relation-line>div:first-child {
    width: 30%;
    min-width: 400px;
    margin-right: 10px;
  }


  .relation-line>div:last-child {
    min-width: 65%;
  }
</style>

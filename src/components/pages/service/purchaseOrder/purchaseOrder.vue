<template>
  <div @keydown.enter="initTableList" v-if="otherPage.PAGE == 'INDEX'">

    <div class="input-line">

      <div class="input-block">
        <span>单号</span>
        <el-input v-model="reason.code" clearable></el-input>
      </div>

      <div class="input-block">
        <span>提交人</span>
        <el-input v-model="reason.subUserName" clearable></el-input>
      </div>

      <div class="input-block">
        <span>部门</span>
        <el-select v-model="reason.organizationId" placeholder="全部" clearable>
          <el-option v-for="item in options.organization" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>提交时间</span>
        <el-date-picker v-model="subTime" style="width: 250px;" type="daterange" range-separator="至" start-placeholder="开始日期"
          value-format="yyyy-MM-dd" end-placeholder="结束日期" clearable>
        </el-date-picker>
      </div>

      <br>

      <div class="input-block">
        <span>采购类型</span>
        <el-select v-model="reason.type" placeholder="全部" clearable>
          <el-option v-for="item in options.purchaseType" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>状态</span>
        <el-select v-model="reason.status" placeholder="全部" clearable>
          <el-option v-for="item in options.status" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>


      <div class="input-block">
        <span>供应商</span>
        <el-select v-model="reason.supplierId" placeholder="全部" clearable>
          <el-option v-for="item in options.supplier" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>供应商代码</span>
        <el-input v-model="reason.supplierCode" clearable></el-input>
      </div>

      <br>


      <div class="input-block">
        <span>邮轮</span>
        <el-select v-model="reason.warehouseTypeId" :placeholder="$t('quanbu')" clearable>
          <el-option v-for="item in options.cruise" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>航次</span>
        <el-select v-model="reason.warehouseTypeTaskId" placeholder="全部" :disabled="reason.warehouseTypeId==''"
          clearable>
          <el-option style="height: 50px;" v-for="item in options.route" :key="item.id" :label="item.taskName" :value="item.id">
            <div style="line-height: 25px;">
              <span>{{item.taskName}}</span> <br>
              <span class="font6"><span class="blue">{{item.startTime}}</span><span class="red">~~</span><span class="blue">{{item.endTime}}</span></span>
            </div>
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>交货日期</span>
        <el-date-picker v-model="deliveryTime" type="daterange" range-separator="至" start-placeholder="开始日期"
          value-format="yyyy-MM-dd" end-placeholder="结束日期" clearable>
        </el-date-picker>
      </div>

      <div class="input-block">
        <span>交货地点</span>
        <el-input v-model="reason.deliveryLocation" clearable></el-input>
      </div>

      <br>

      <div class="input-block">
        <span>说明</span>
        <el-input v-model="reason.description" clearable></el-input>
      </div>

      <el-button @click="table.page=1;initTableList()" icon="el-icon-search" type="primary" class="reason-button">搜索</el-button>

    </div>

    <div class="public-table-header">
      <el-button @click="otherPage.PAGE = 'ONEONE';otherPage.status = STATUS.ADD" type="primary" size="mini">新增采购单</el-button>
      <!-- <el-button @click="inModelChoose = true" type="primary" size="mini">新增采购单模式选择</el-button> -->


      <div class="right red" v-if="table.inSelect">
        <i class="el-icon-loading"></i>
        请稍等，正在查询。。。
      </div>
    </div>

    <el-table :data="table.list" style="width: 100%" cell-class-name="public-table-cell">
      <el-table-column label="单号" prop="code" align="center" min-width="200">
        <template slot-scope="scope">
          <i-label :target="scope.row" :type="AuditType.value.PURCHASE_ORDER" :info="false" key></i-label>
        </template>
      </el-table-column>
      <el-table-column label="品项" prop="itemNumber" align="center" min-width="50">
      </el-table-column>
      <el-table-column label="采购类型" prop="purchaseType" align="center" min-width="120">
        <template slot-scope="scope">
          {{ getType(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="说明" prop="description" align="center" min-width="150">
      </el-table-column>
      <el-table-column label="供应商" prop="supplierName" align="center" min-width="120">
      </el-table-column>
      <el-table-column label="供应商代码" prop="supplierCode" align="center" min-width="150">
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center" min-width="80">
        <template slot-scope="scope">
          {{ getSTATUS(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="部门" prop="organizationName" align="center" min-width="200">
      </el-table-column>
      <el-table-column label="航次" prop="taskName" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="创建人" prop="createUserName" align="center" min-width="350">
        <template slot-scope="scope">
          {{ scope.row.createUserName+'('+getCreateDateStr(new Date(scope.row.createTime))+')' }}
        </template>
      </el-table-column>
      <el-table-column label="提交人" prop="subUserName" align="center" min-width="350">
        <template slot-scope="scope">
          <template v-if="scope.row.status == STATUS.UNCOMMIT">
            未提交
          </template>
          <template v-else>
            {{ scope.row.subUserName+'('+getCreateDateStr(new Date(scope.row.subTime))+')' }}
          </template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="入库率" prop="status" align="center" min-width="180">
        <template slot-scope="scope">
          <div @click="radioInfo.show = !radioInfo.show;initPurchaseOrderMaterils(scope.row.id)">
            <el-progress class="pointer" :text-inside="true" :stroke-width="26" :percentage="getRatio(scope.row.ratio*100)"></el-progress>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="310">
        <template slot-scope="scope">
          <template v-if="scope.row.audit == 1">
            <template v-if="scope.row.status == STATUS.UNCOMMIT">
              <el-button @click="edit(scope.row)" type="warning" size="mini">编辑</el-button>
              <el-button @click="submit(scope.row)" type="success" size="mini">提交</el-button>
              <el-button @click="deleteBean(scope.row)" type="danger" size="mini">删除</el-button>
            </template>
            <template v-if="scope.row.status == STATUS.AUDIT">
              <el-button type="warning" size="mini" disabled>编辑(审核中)</el-button>
              <el-button @click="view(scope.row)" type="primary" size="mini">查看</el-button>
            </template>
            <template v-if="scope.row.status == STATUS.PASS">
              <el-button type="success" size="mini" disabled>审核通过</el-button>
              <el-button @click="view(scope.row)" type="primary" size="mini">查看</el-button>
            </template>
            <template v-if="scope.row.status == STATUS.NOPASS">
              <el-button type="danger" size="mini" disabled>被驳回</el-button>
              <el-button @click="submit(scope.row)" type="success" size="mini">提交</el-button>
              <el-button @click="edit(scope.row)" type="warning" size="mini">编辑</el-button>
              <el-button @click="deleteBean(scope.row)" type="danger" size="mini">删除</el-button>
            </template>
          </template>
          <template v-else>
            <el-button @click="view(scope.row)" type="primary" size="mini">查看</el-button>
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

    <el-dialog custom-class="dialog-card self-card" :visible.sync="radioInfo.show" :append-to-body="true">
      <el-table :data="radioInfo.list" style="width: 100%" cell-class-name="public-table-cell" height="500">
        <el-table-column label="代码" prop="code" align="center" min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.preCode + '' + scope.row.materialCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="materialName" align="center" min-width="150">
        </el-table-column>
        <el-table-column label="类别" prop="materialCategoryName" align="center" min-width="150">
        </el-table-column>
        <el-table-column label="品牌" prop="materialBrandName" align="center" min-width="180">
        </el-table-column>
        <el-table-column label="采购单位" prop="purchaseUnit" align="center" min-width="120">
        </el-table-column>
        <el-table-column label="剩余采购数量" prop="remainNumber" align="center" min-width="72">
          <template slot-scope="scope">
            {{ scope.row.remainNumber }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" min-width="120">
          <template slot-scope="scope">
            <span class="blue font-bold" v-if="scope.row.remainNumber == 0">
              完成
            </span>
            <span class="red font-bold" v-else>
              未完成
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :custom-class="['dialog-card','purchase-order-model-dilog']" :visible.sync="inModelChoose"
      append-to-body>

      <div class="model-block youCanNotChoose">

        <el-popover popper-class="z-index2022" placement="bottom-start" width="140" trigger="hover">
          <div>
            采购单中只包含<br>一个采购申请中且同一供应商协议的采购物品。
          </div>
          <button @click.stop="page_go('ONEONE')" class="text-align-center pointer" slot="reference">
            <span class="font10">
              <span class="blue">单</span>采购申请<br>
            </span>

            <span class="font16 font-bold">创建采购单</span><br>

            <span class="font10">
              <span class="blue">单</span>供应商
            </span>
          </button>
        </el-popover>

        <el-popover popper-class="z-index2022" placement="bottom-start" width="140" trigger="hover">
          <div>
            采购单中可包含<br>多个采购申请中同一供应商协议的采购物品。
          </div>
          <button @click.stop="page_go('ONEMORE')" class="text-align-center pointer" slot="reference">
            <span class="font10">
              <span class="blue">多</span>采购申请<br>
            </span>

            <span class="font16 font-bold">创建采购单</span><br>

            <span class="font10">
              <span class="blue">单</span>供应商
            </span>
          </button>
        </el-popover>

        <!--        <el-popover popper-class="z-index2022" placement="bottom-start" width="140" trigger="hover" >
          <div>
            采购单中可包含<br>同一供应商协议的物品。
          </div>
          <button class="text-align-center pointer" slot="reference">
            <span class="font10">
              <span class="blue">无</span>采购申请<br>
            </span>

            <span class="font16 font-bold">创建采购单</span><br>

            <span class="font10">
              <span class="blue">单</span>供应商
            </span>
          </button>
        </el-popover>

        <el-popover popper-class="z-index2022" placement="bottom-start" width="140" trigger="hover" >
          <div>
            采购单中包含<br>一个采购申请中不同供应商协议的采购物品。
          </div>
          <button class="text-align-center pointer" slot="reference">
            <span class="font10">
              <span class="blue">单</span>采购申请<br>
            </span>

            <span class="font16 font-bold">创建采购单</span><br>

            <span class="font10">
              <span class="blue">多</span>供应商
            </span>
          </button>
        </el-popover>

        <el-popover popper-class="z-index2022" placement="bottom-start" width="140" trigger="hover" >
          <div>
            采购单中包含<br>多个采购申请中不同供应商协议的采购物品。
          </div>
          <button class="text-align-center pointer" slot="reference">
            <span class="font10">
              <span class="blue">多</span>采购申请<br>
            </span>

            <span class="font16 font-bold">创建采购单</span><br>

            <span class="font10">
              <span class="blue">多</span>供应商
            </span>
          </button>
        </el-popover>

        <el-popover popper-class="z-index2022" placement="bottom-start" width="140" trigger="hover" >
          <div>
            采购单中包含<br>不同采购物品的采购物品。
          </div>
          <button class="text-align-center pointer" slot="reference">
            <span class="font10">
              <span class="blue">无</span>采购申请<br>
            </span>

            <span class="font16 font-bold">创建采购单</span><br>

            <span class="font10">
              <span class="blue">多</span>供应商
            </span>
          </button>
        </el-popover>

        <el-popover popper-class="z-index2022" placement="bottom-start" width="140" trigger="hover" >
          <div>
            自由选择物品采购<br>无需采购申请<br>
          </div>
          <button class="text-align-center pointer" slot="reference">
            <span class="font10">
              <span class="blue">无</span>采购申请<br>
            </span>

            <span class="font16 font-bold">创建采购单</span><br>

            <span class="font10">
              <span class="blue">无</span>供应商
            </span>
          </button>
        </el-popover>
      -->
      </div>

    </el-dialog>

  </div>
  <!-- <one-more v-else-if="otherPage.PAGE=='ONEMORE'"></one-more> -->
  <one-one v-else-if="otherPage.PAGE=='ONEONE'"></one-one>
</template>

<script>
  // import oneMore from './oneReq_moreSup/details.vue'
  import oneOne from './oneReq_oneSup/oneReq_oneSup.vue'
  import iLabel from '../../../util/infoLabel.vue'

  export default {
    name: 'caigoudingdan',
    components: {
      // oneMore,
      oneOne,
      iLabel,
    },
    data() {
      return {


        otherPage: {
          PAGE: 'INDEX',
          pages: ['INDEX', 'ONEONE', 'ONEMORE'],
          status: this.STATUS.ADD, //  ['ADD','UPDATE','FINISH'],
          data: {
            details: {
              id: ''
            }
          }
        },


        reason: {
          //查看品项数
          itemNumber: true,
          //查看完成度
          ratio: true,
          //单号
          code: '',
          subUserName: '',
          organizationId: '',
          status: '',
          type: '',
          supplierId: '',
          supplierCode: '',
          description: '',
          subStartTime: '',
          subEndTime: '',
          warehouseTypeId: '',
          warehouseTypeTaskId: '',
          deliveryStartTime: '',
          deliveryEndTime: '',
          deliveryLocation: ''
        },

        subTime: [],
        deliveryTime: [],

        options: {
          organization: [],
          status: this.ORDER_STATUS,
          purchaseType: [{
              name: '协议采购',
              value: 1
            },
            {
              name: '普通采购',
              value: 0
            }
          ],
          supplier: [],
          route: [],
          cruise: []
        },

        table: {
          list: [],
          page: 1,
          pageSize: 10,
          total: 0
        },

        getType: function(index) {
          if (index === 0)
            return '普通采购';
          if (index === 1)
            return '协议采购';
        },

        getRatio:function(ratio){
          return parseFloat(ratio).toFixed(2)
        },

        inModelChoose: false,

        radioInfo: {
          show: false,
          list: []
        },


      }
    },
    beforeRouteEnter: function(to, from, next) {
      next((that) => {
        var query = to.query;
        if (query.type == 'SEARCH') {
          that.reason.status = query.reason.status;
        } else if (query.type == 'INFO') {
          that.view({
            id: query.id
          })
        }
        that.initTableList();
      })
    },
    watch: {
      'reason.warehouseTypeId': {
        handler: function(newV) {
          if (newV != '') {
            this.initOptionsRoute();
          } else {
            this.reason.taskId = '';
          }
        },
        deep: true
      },
      'otherPage.PAGE': {
        handler: function(newV) {
          if (newV === 'INDEX')
            this.initTableList();
        },
        deep: true
      },
      subTime: {
        handler: function(newV) {
          if (newV != null) {
            this.reason.subStartTime = newV[0] + ' 00:00:00';
            this.reason.subEndTime = newV[1] + ' 23:59:59';
          } else {
            this.reason.subStartTime = '';
            this.reason.subEndTime = '';
          }
        },
        deep: true
      },
      deliveryTime: {
        handler: function(newV) {
          if (newV != null) {
            this.reason.deliveryStartTime = newV[0] + ' 00:00:00';
            this.reason.deliveryEndTime = newV[1] + ' 23:59:59';
          } else {
            this.reason.deliveryStartTime = '';
            this.reason.deliveryEndTime = '';
          }
        },
        deep: true
      },

    },
    created: function() {
      var that = this;

      that.initTableList();
      that.initOptions()
    },
    methods: {
      initTableList: function() {

        var that = this;
        var axios = that.axios;
        that.table.inSelect = true;
        axios({
          method: 'post',
          url: '/purchaseOrder/list',
          data: {
            page: that.table.page,
            pageSize: that.table.pageSize,
            reason: that.reason
          },
          df: false
        }).then((response) => {
          that.table.inSelect = false;
          if (!response) {
            return
          }
          var data = response.data;

          that.table.list = data.data;
          that.table.total = data.total;
        }).catch((error) => {
          that.errorhanding(error)
        });
      },

      initOptions: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/purchaseOrder/options',
          data: {
            supplier: true,
            cruise: true,
            organization: true
          }
        }).then((response) => {
          if (!response) {
            return
          }


          var data = response.data;
          that.options.cruise = data.data.cruise;
          that.options.supplier = data.data.supplier;
          that.options.organization = data.data.organization;

        }).catch((error) => {
          that.errorhanding(error)
        });

      },

      //航次
      initOptionsRoute: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/purchaseOrder/options/route',
          data: {
            reason: {
              warehouseTypeId: that.reason.warehouseTypeId
            }
          },
          df: false
        }).then((response) => {

          if (!response) {
            return
          }

          var data = response.data;
          that.options.route = data.data;

        });
      },

      initPurchaseOrderMaterils: function(id) {
        var that = this;
        var axios = that.axios;

        that.table.inSelect = true;
        axios({
          method: 'post',
          url: '/purchaseOrder/materials',
          data: {
            id: id
          }
        }).then((response) => {
          that.table.inSelect = false;
          if (!response) {
            return
          }
          var data = response.data;

          that.radioInfo.list = data.data;

        }).catch((error) => {
          that.table.inSelect = false;
        });
      },

      submit: function(row) {
        var that = this;
        var axios = that.axios;
        //purchaseRequestid

        axios({
          method: 'post',
          url: '/purchaseOrder/order/commit',
          data: {
            id: row.id,
            auditProcessId: row.auditProcessId
          },
          df: false
        }).then((response) => {
          that.initTableList()
          setTimeout(function() {

            var data = response.data;
            if (data.code == that.STATUS.SUCCESS) {
              that.$notify({
                title: '提交成功',
                message: '<div><span class="green">提交</span>采购单成功!<br>单号:【' + row.code + '】</div>',
                type: 'success',
                duration: 5000,
                dangerouslyUseHTMLString: true
              });
            }
          }, 300)


        }).catch((error) => {
          that.errorhanding(error)
        });
      },

      edit: function(row) {

        var that = this;
        that.otherPage.data.details.id = row.id;


        that.otherPage.status = that.STATUS.UPDATE


        that.otherPage.PAGE = 'ONEONE'

      },

      view: function(row) {
        var that = this;
        that.otherPage.data.details.id = row.id;

        that.otherPage.status = that.STATUS.READ


        that.otherPage.PAGE = 'ONEONE'
      },

      deleteBean: function(row) {

        var that = this;
        var axios = that.axios;

        that.$confirm('您确定要删除吗？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: '/purchaseOrder/order/delete',
              data: {
                id: row.id
              },
              df: false
            }).then((response) => {
              if (!response) {
                return;
              }
              var data = response.data;
              if (data.code == that.STATUS.SUCCESS) {
                that.deleteSuccess(true);
                that.initTableList();
              } else {
                that.deleteSuccess(false)
              }
            }).catch((error) => {
              that.errorhanding(error)
            })
            done();
          })
          .catch(_ => {});
      },

      updateStatus: function(id, status) {
        return

        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/user/update',
          data: {
            user: {
              id: id,
              status: status
            }
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          if (data.code == that.STATUS.SUCCESS) {
            that.updateSuccess(true)
            that.initTableList();
          }
        }).catch((error) => {
          that.errorhanding(error)
        })

      },


      page_go: function(page) {
        var that = this;

        that.inModelChoose = false;
        that.otherPage.PAGE = page;
        that.otherPage.status = that.STATUS.ADD;
      }

    }
  }
</script>

<style scoped="scoped">
  .model-block {
    width: 520px;
    height: 400px;
    display: flex;
    flex-wrap: wrap;
    margin-left: auto;
    margin-right: auto;
    /* background: olive; */
  }

  .model-block>span>button {
    background: white;
    border: solid 1px rgba(150, 150, 150, 1);
    width: 140px;
    height: 70px;
    border-radius: 5px;
    box-shadow: 0px 1px 1px rgba(150, 150, 150, 1);
    line-height: 23px;


    transition: .3s;
    margin-top: 50px;
  }

  .model-block>span>button:hover {
    background: rgba(235, 252, 255, 1);
    box-shadow: 0px 3px 3px rgba(100, 100, 100, 1);
  }

  .model-block>span>button:active {
    background: rgba(230, 250, 255, 1);
    box-shadow: 4px 7px 7px rgba(100, 100, 100, 1);
  }

  .model-block>span:nth-child(3n - 1)>button {
    margin-left: 50px;
  }

  .model-block>span:nth-child(3n)>button {
    margin-left: 50px;
  }

  .model-block>span {
    margin-left: auto;
    margin-right: auto;
  }

  .input-block>div {
    width: 250px;
  }
</style>

<style>
  .purchase-order-model-dilog {
    width: 520px;
  }
</style>

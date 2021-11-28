<template>
  <div @keydown.enter="initTableList" v-if="otherPage.PAGE == 'INDEX'">

    <div class="input-line">
      <div class="input-block">
        <span>入库单号</span>
        <el-input v-model="reason.code" clearable></el-input>
      </div>

      <div class="input-block">
        <span>提交人</span>
        <el-input v-model="reason.createUserName" clearable></el-input>
      </div>

      <div class="input-block">
        <span>部门</span>
        <el-input v-model="reason.organizationName" clearable></el-input>
      </div>

      <div class="input-block">
        <span>状态</span>
        <el-select v-model="reason.status" placeholder="全部" clearable>
          <el-option v-for="item in options.status" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <br>

      <div class="input-block">
        <span>供应商</span>
        <el-input v-model="reason.supplierName" clearable></el-input>
      </div>

      <div class="input-block">
        <span>供应商代码</span>
        <el-input v-model="reason.supplierCode" clearable></el-input>
      </div>

      <br>

      <div class="input-block">
        <span>说明</span>
        <el-input v-model="reason.description" clearable></el-input>
      </div>


      <div class="input-block">
        <span>提交时间</span>
        <el-date-picker v-model="subTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>


      <el-button @click="table.page=1;initTableList()" icon="el-icon-search" type="primary" class="reason-button">搜索</el-button>

    </div>

    <div class="public-table-header">
      <el-button @click="otherPage.PAGE = 'DETAILS';otherPage.status = STATUS.ADD" type="primary" size="mini">新增入库</el-button>
      <!-- <el-button @click="inModelChoose = true" type="primary" size="mini">新增采购单模式选择</el-button> -->


      <div class="right red" v-if="table.inSelect">
        <i class="el-icon-loading"></i>
        请稍等，正在查询。。。
      </div>
    </div>

    <el-table :data="table.list" style="width: 100%" cell-class-name="public-table-cell">
      <el-table-column label="单号" prop="code" align="center" min-width="210">
        <template slot-scope="scope">
          <i-label :target="scope.row" :type="AuditType.value.EXCHANGE_IN" :info="false" key></i-label>
        </template>
      </el-table-column>
      <el-table-column label="品项" prop="itemNumber" align="center" min-width="50">
      </el-table-column>
      <el-table-column label="说明" prop="description" align="center" min-width="150">
      </el-table-column>
      <el-table-column label="供应商" prop="supplierName" align="center" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.supplierName == ''? '---':scope.row.supplierName }}
        </template>
      </el-table-column>
      <el-table-column label="供应商代码" prop="supplierCode" align="center" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.supplierCode == ''? '---':scope.row.supplierCode }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="createTime" align="center" min-width="180">
        <template slot-scope="scope">
          {{ getSTATUS(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="部门" prop="organizationName" align="center" min-width="180">
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

  </div>
  <s-details v-else-if="otherPage.PAGE == 'DETAILS'"></s-details>
</template>

<script>
  import sDetails from './exchangeIn_details.vue';
  import iLabel from '../../../../util/infoLabel.vue';

  export default {
    name: 'huanhuoruku',
    components: {
      sDetails,
      iLabel,
    },
    data() {
      return {


        otherPage: {
          PAGE: 'INDEX',
          pages: ['INDEX', 'DETAILS'],
          status: this.STATUS.ADD, //  ['ADD','UPDATE','FINISH'],
          data: {
            details: {
              id: ''
            }
          }
        },


        reason: {
          //单号
          code: '',
          //创建人
          createUserName: '',
          //部门名称
          organizationName: '',
          //提交人
          supplierName: '',
          //提交部门
          supplierCode: '',
          //说明
          description: '',
          //采购申请
          code: '',
          //状态
          status: '',
          //航次名称
          taskName: '',
          //提交日期
          subStartTime: '',
          subEndTime: '',


        },

        //提交时间，数组容器
        subTime: [],

        options: {
          organization: [],
          status: this.ORDER_STATUS,
          type: [{
              name: '普通入库',
              value: 0
            },
            {
              name: '采购入库',
              value: 1
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

        inModelChoose: false,


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
      'subTime': {
        handler: function(newV) {
          if (Array.isArray(newV) && newV.length == 2) {
            this.reason.subStartTime = newV[0] + ' 00:00:00';
            this.reason.subEndTime = newV[1] + ' 23:59:59';
          }
        },
        deep: true
      },
      'otherPage.PAGE': {
        handler: function(newV) {
          if (newV === 'INDEX')
            this.initTableList();
        }
      }
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
          url: '/exchange/in/list',
          data: {
            page: that.table.page,
            pageSize: that.table.pageSize,
            reason: that.reason
          },
          df: false
        }).then((response) => {
          if (!response) {
            return
          }
          that.table.inSelect = false;
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
          url: '/stock/in/commit',
          data: {
            id: row.id,
            auditProcessId: row.auditProcessId,
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
            } else {
              that.notic(false, "提交", data.msg);
            }
          }, 300)


        }).catch((error) => {
          that.errorhanding(error)
        });
      },

      edit: function(row) {

        var that = this;
        that.otherPage.data.details.id = row.id;

        that.otherPage.status = that.STATUS.UPDATE;

        that.otherPage.PAGE = 'DETAILS'

      },

      view: function(row) {
        var that = this;
        that.otherPage.data.details.id = row.id;

        that.otherPage.status = that.STATUS.READ
        that.otherPage.PAGE = 'DETAILS'
      },

      deleteBean: function(row) {

        var that = this;
        var axios = that.axios;

        that.$confirm('您确定要删除吗？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: '/stock/in/delete',
              data: {
                id: row.id
              },
              df: true,
              loading: true
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

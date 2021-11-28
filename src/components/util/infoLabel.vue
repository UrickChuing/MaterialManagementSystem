<template>
  <div>
    <a @click="labelClick" class="pointer">{{target.code}}</a>
    <template v-if="showInfo() == 'CODE_NULL'">
      <div @click="closeCard" :class="bgClasses" v-if="show">
        <div class="info-card">
          <h2>获取相关代码失败</h2>
          <h3>请刷新数据重新获取</h3>
        </div>
      </div>
    </template>
    <template v-else-if="showInfo() == 'TYPE_NULL'">
      <div @click="closeCard" :class="bgClasses" v-if="show">
        <div class="info-card">
          <h2>{{AuditType.getStr(type)}}{{AuditType.value.PURCHASE_ORDER != type ? '单':''}}</h2>
          <h3>请刷新数据重新获取</h3>
        </div>
      </div>
    </template>
    <template v-else-if="showInfo() == 'ID_NULL'">
      <div @click="closeCard" :class="bgClasses" v-if="show">
        <div class="info-card">
          <h2>获取相关唯一标识失败</h2>
          <h3>请刷新数据重新获取</h3>
        </div>
      </div>
    </template>
    <template v-else>
      <div @click="closeCard" :class="bgClasses" v-if="show && task != undefined">
        <div class="info-card" @click.stop="">
          <h2>{{AuditType.getStr(type)}}{{AuditType.value.PURCHASE_ORDER != type ? '单':''}}</h2>
          <div class="info-card-body">
            <div class="code-line">
              <span style="background-color: white;">代码：</span>
              <div>{{target.code}}</div>
            </div>
            <div class="code-line" v-if="task.finished != undefined">
              <span style="background-color: white;">状态：</span>
              <div>{{task.finished? '已完成':'正在审核'}}</div>
            </div>
            <div class="code-line" v-if="target.status == STATUS.AUDIT && task != null">
              <span style="background-color: white;">当前审批：</span>
              <div>{{task.name}} (<span class="green">{{task.code}}</span>)</div>
            </div>
            <div class="code-line" v-if="target.status == STATUS.AUDIT && task != null">
              <span style="background-color: white;">当前审批步骤：</span>
              <div class="green pointer" @click="showStepUser = true;initStep()">{{task.currentStepName}} <i class="el-icon-view yellow font16 margin-left10"></i></div>
            </div>

            <div v-if="task != null && task.list.length != 0">
              <el-table :data="task.list" height="300" class="dis" style="width: 100%;margin-top: 10px;" border
                cell-class-name="public-table-cell" highlight-current-row>
                <el-table-column label="审批人" type="code" align="center" min-width="200">
                  <template slot-scope="scope">
                    <div class="text-ellipsls">
                      {{scope.row.userName}}
                      (
                      <span class="green" v-if="scope.row.status">通过</span>
                      <span class="red" v-else>驳回</span>
                      )
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="步骤" prop="name" align="center" min-width="210">
                  <template slot-scope="scope">
                    <div class="text-ellipsls">
                      {{scope.row.name}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="审批时间" align="center" min-width="210">
                  <template slot-scope="scope">
                    <div class="text-ellipsls">
                      {{DateToStr(new Date(scope.row.createTime))}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="备注" align="center" min-width="210">
                  <template slot-scope="scope">
                    <div class="text-ellipsls">
                      <el-popover placement="bottom" width="200" trigger="hover" :content="scope.row.remarks">
                        <a class="pointer" slot="reference">{{scope.row.remarks}}</a>
                      </el-popover>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="flexCenter margin-top10" v-if="info">
              <el-button @click="goPage" type="primary" size="mini">查看详情</el-button>
            </div>

          </div>
        </div>
      </div>
    </template>

    <template v-if="show && showStepUser">

      <div class="step-user-card">
        <div class="flexRow">
          <div class="font16 font-bold flexCenter flex1">
            当前步骤还需要 <span class="red">&nbsp;{{step.number}}&nbsp;</span> 人审批
          </div>
          <el-button type="warning" size="medium" @click="showStepUser = false;">关闭</el-button>
        </div>
        <el-table :data="step.list" height="100%" class="dis" style="width: 100%;" border cell-class-name="public-table-cell"
          highlight-current-row>
          <el-table-column label="用户" prop="name" align="center" min-width="210">
            <template slot-scope="scope">
              <div class="text-ellipsls">
                {{scope.row.name}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="审批时间" align="center" min-width="210">
            <template slot-scope="scope">

              <span class="blue" v-if="scope.row.number> 0">已审批</span>
              <span class="yellow" v-else>可审批</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </template>

  </div>
</template>

<script>
  export default {
    props: ['target', 'type', 'info', 'auditTaskId'],
    data() {
      return {

        bgClasses: ['card-bg', 'hide'],

        show: false,

        times: [],

        task: null,

        showStepUser: false,
        step: {
          number: 0,
          list: []
        }


      }
    },
    watch: {
      show: {
        handler: function(newV) {
          var that = this;
          if (newV && that.showInfo()) {
            that.initAuditTask();
          }
        },
        deep: true
      }
    },
    methods: {
      goPage: function() {
        var that = this;
        var type = that.type;
        var types = that.AuditType.value;
        var path;
        switch (type) {
          case types.PURCHASE_REQUEST:
            path = '/service/purchaseRequest'
            break;
          case types.PURCHASE_ORDER:
            path = '/service/purchaseOrder'
            break;
          case types.STOCKIN_ORDINARY:
            path = '/service/stockInOrdinary'
            break;
          case types.STOCKIN_PURCHASE:
            path = '/service/stockInPurchaseOrder'
            break;
          case types.DELIVERY_REQUEST:
            path = '/service/returnRequest'
            break;
          case types.DELIVERY_VOUCHER:
            path = '/service/returnStockOut'
            break;
          case types.EXCHANGE_REQUEST:
            path = '/service/exchange/request'
            break;
          case types.EXCHANGE_OUT:
            path = '/service/exchange/out';
            break;
          case types.EXCHANGE_IN:
            path = '/service/exchange/in';
            break;
          case types.RECEIVING_MATERIAL:
            path = '/getUsing/get';
            break;
          case types.RECIVEING_MATERIAL_RETURN:
            path = '/getUsing/back';
            break;
          case types.MATERIAL_MOVE:
            path = '/stock/allocation';
            break;
          case types.STOCK_LOSS:
            path = '/stock/loss';
            break;
          case types.INVOICE_PURCHASE:
          case types.INVOICE_FREIGHT:
          case types.INVOICE_RED_PURCHASE:
          case types.INVOICE_RED_FREIGHT:
            path = '/invoice';
            break;
        }

        this.$router.push({
          path: path,
          query: {
            type: 'INFO',
            id: that.target.id
          }
        });

        that.show = false;
      },

      showInfo: function() {
        if (this.target.code == undefined || this.target.code == null || this.target.code === '') {
          return 'CODE_NULL';
        }
        if (this.type == undefined || this.type == null || this.type === '') {
          return 'TYPE_NULL';
        }
        if (this.target.id == undefined || this.target.id == null || this.target.id === '') {
          return 'ID_NULL';
        }

        return true;
      },

      cardBlur: function() {
        this.show = false;
      },

      labelClick: function() {
        if (this.target.status == this.STATUS.UNCOMMIT) {
          this.notics.warning('目标尚未提交');
          return;
        }

        this.show = true;
        if (this.show) {
          this.bgClasses = ['card-bg', 'show']
        }
      },

      closeCard: function() {
        var that = this;
        that.bgClasses = ['card-bg', 'hide'];
        that.showStepUser = false;
        setTimeout(_ => {

          if (that.show) {
            that.show = false;
          }

        }, 300)
      },

      initAuditTask: function() {
        var that = this;
        var axios = that.axios;
        axios({
          method: 'post',
          url: '/myAudit/getAuditTask',
          data: {
            id: that.target.id,
            type: that.type,
            auditTaskId: that.auditTaskId
          },
          df: true
        }).then((response) => {
          if (!response)
            return;
          var data = response.data;

          if (data.code === that.STATUS.SUCCESS) {
            var task = data.data;
            that.task = task;
          } else {
            that.closeCard();
            that.notics.warning('加载审批任务失败', data.msg);
          }
        }).catch((error) => {
          that.errorhanding(error);
        });

      },

      initStep: function() {
        var that = this;
        var axios = that.axios;
        axios({
          method: 'post',
          url: '/myAudit/getStepUser',
          data: {
            taskId: that.task.id,
            stepId: that.task.currentStep,
          },
          df: true
        }).then((response) => {
          if (!response)
            return;
          var data = response.data;

          console.log(data);

          var step = data.data;
          that.step = step;

        }).catch((error) => {
          that.errorhanding(error);
        });

      },

    }
  }
</script>

<style scoped="scoped">
  .step-user-card {
    position: fixed;
    width: 400px;
    height: 500px;
    top: calc(50% - 250px);
    left: calc(50% - 200px);
    background: white;
    z-index: 2021;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .2);
    border: solid 1px rgba(00, 00, 00, 0.2);
    border-radius: 5px;
  }

  .code-line {
    display: flex;
    text-align: left;
  }

  .code-line>span {
    min-width: 70px;
  }

  .info-card-body {
    padding: 0px 20px 20px 20px;
  }

  .card-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 2021;
    transition: .3s;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .info-card {
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    overflow: hidden;
    color: #303133;
    position: fixed;
    /* height: 500px; */
    width: 600px;
    background-color: white;
    z-index: 2022;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    top: calc(50% - 300px);
    left: calc(50% - 300px);
  }

  .card-bg.hide {
    opacity: 0;
  }

  .card-bg.show {
    opacity: 1;
    transition: .25s;
  }
</style>

<template>
  <div @keydown.enter="initTableList" v-if="otherPage.PAGE == 'INDEX'">

    <div class="reason-line">

      <div class="reason-input">
        <span>审核码</span>
        <el-input v-model="reason.code"></el-input>
      </div>

      <div class="reason-input">
        <span>审核目标代码</span>
        <el-input v-model="reason.sourceCode"></el-input>
      </div>

      <div class="reason-input">
        <span>状态</span>
        <el-select v-model="reason.showWhat" placeholder="全部">
          <el-option v-for="item in options.status" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <el-button @click="table.page=1;initTableList()" icon="el-icon-search" type="primary" class="reason-button">搜索</el-button>

    </div>

    <div class="public-table-header">
      <!-- <el-button @click="otherPage.PAGE = 'DETAILS';otherPage.status.details = STATUS.ADD" type="primary" size="mini">新增XXX</el-button> -->

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
      <el-table-column label="代码" prop="code" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="审核类型" align="center" min-width="180">
        <template slot-scope="scope">
          {{ AuditType.getStr(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="审核目标代码" prop="sourceCode" align="center" min-width="240">
        <template slot-scope="scope">
          <i-label :target="{id:scope.row.sourceId,code:scope.row.sourceCode,status:STATUS.AUDIT}" :auditTaskId="scope.row.id"
            :type="scope.row.type" :info="true" key></i-label>
        </template>
      </el-table-column>
      <el-table-column label="提交人" prop="subUserName" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" min-width="180">
        <template slot-scope="scope">
          {{ getCreateDateStr(new Date(scope.row.createTime)) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="300">
        <template slot-scope="scope">

          <template v-if="scope.row.finished">
            <el-button size="mini" type="info" plain disabled>已完成审批</el-button>
          </template>
          <template v-else>

            <template v-if="reason.showWhat == 0">
              <el-button @click="pass(scope.row)" type="warning" size="mini">通过</el-button>
              <el-button @click="refuse(scope.row)" type="danger" size="mini">驳回</el-button>
            </template>
            <template v-else>
              <!-- 已经审核过了 -->
              <template v-if="scope.row.audit == 1 && scope.row.permssion == 1">
                <el-button @click="pass(scope.row)" size="mini" type="warning" plain disabled>已审核</el-button>
              </template>
              <template v-if="scope.row.audit == 0 && scope.row.permssion == 1">
                <el-button @click="pass(scope.row)" type="warning" size="mini">通过</el-button>
                <el-button @click="refuse(scope.row)" type="danger" size="mini">驳回</el-button>
              </template>
              <template v-else-if="scope.row.permssion == 0">
                <el-button size="mini" type="info" plain disabled>无权限审核</el-button>
              </template>
            </template>

          </template>



          <!-- 未提交 -->
        </template>
      </el-table-column>
    </el-table>

    <div class="flexCenter margin-top10">
      <el-pagination @size-change="(val)=>{table.pageSize=val;initTableList()}" @current-change="(val)=>{table.page=val;initTableList()}"
        :current-page="table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="table.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="table.total">
      </el-pagination>
    </div>

    <audit-card @close="closeAuditCard" @initTable="initTableList" :target="auditTarget" :type="auditCardType" v-if="showAuditCard"></audit-card>

  </div>
</template>

<script>
  import iLabel from '../../util/infoLabel.vue';
  import auditCard from './auditListCard.vue'

  export default {
    name: 'wodeshenpi',
    components: {
      iLabel,
      auditCard
    },
    data() {
      return {


        otherPage: {
          PAGE: 'INDEX',
          pages: ['INDEX', 'DETAILS'],
          status: {
            details: this.STATUS.ADD, //  ['ADD','UPDATE','FINISH']
          },
          data: {
            details: {
              id: ''
            }
          }
        },


        options: {
          status: [{
              name: '未审批',
              value: 0
            },
            {
              name: '已审批',
              value: 1
            },
            {
              name: '全部',
              value: 2
            },
          ]
        },

        reason: {
          code: '',
          showWhat: 0,
          sourceCode: ''
        },

        table: {
          list: [],
          page: 1,
          pageSize: 10,
          total: 0
        },

        showAuditCard: false,
        auditCardType: null,
        auditTarget: null,


      }
    },
    beforeRouteEnter: function(to, from, next) {
      next((that) => {
        that.initTableList();
      })
    },
    watch: {
      'reason.showWhat': function(newV) {
        this.initTableList()
      }
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
          url: '/myAudit/list',
          data: {
            page: that.table.page,
            pageSize: that.table.pageSize,
            reason: that.reason
          },
          df: false
        }).then((response) => {
          that.table.inSelect = false;
          if (!response)
            return;
          var data = response.data;

          that.table.list = data.data;
          that.table.total = data.total;
        }).catch((error) => {
          that.errorhanding(error)
        });
      },

      pass: function(row) {

        this.auditTarget = row;
        this.auditCardType = 'PASS';
        this.showAuditCard = true;

        return;

        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/myAudit/pass',
          data: {
            auditTaskId: row.id,
            auditProcessId: row.auditProcessId
          },
          df: true
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          if (data.code == that.STATUS.SUCCESS) {
            that.notic(true, "审批");
            that.initTableList();
          } else {
            that.notic(false, "审批", data.msg)
          }
        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      refuse: function(row) {
        this.auditTarget = row;
        this.auditCardType = 'RF';
        this.showAuditCard = true;

        return;

        var that = this;
        var axios = that.axios;
        that.$confirm('确定驳回审批吗？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: '/myAudit/refuse',
              data: {
                auditTaskId: row.id,
                auditProcessId: row.auditProcessId
              },
              df: true
            }).then((response) => {
              if (!response) {
                return;
              }
              var data = response.data;
              if (data.code == that.STATUS.SUCCESS) {
                that.notic(true, '驳回');
                that.initTableList();
              } else {
                that.notic(false, '驳回');
              }
            }).catch((error) => {
              that.errorhanding(error)
            })
            done();
          })
          .catch(_ => {});
      },

      closeAuditCard: function() {
        this.showAuditCard = false;
      }
    }
  }
</script>

<style scoped="scoped">
</style>

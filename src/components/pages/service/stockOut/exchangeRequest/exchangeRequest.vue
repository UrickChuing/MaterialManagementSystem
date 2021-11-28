<template>
  <div @keydown.enter="initTableList" v-if="otherPage.PAGE == 'INDEX'">

    <div class="input-line">

      <div class="input-block">
        <span>换货申请单号</span>
        <el-input v-model="reason.code"></el-input>
      </div>

      <div class="input-block">
        <span>入库单号</span>
        <el-input v-model="reason.warehouseVoucherCode"></el-input>
      </div>


      <div class="input-block">
        <span>提交时间</span>
        <el-date-picker v-model="subTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>

      <div class="input-block">
        <span>说明</span>
        <el-input v-model="reason.description"></el-input>
      </div>

      <el-button @click="table.page=1;initTableList()" icon="el-icon-search" type="primary" class="reason-button">搜索</el-button>

    </div>

    <div class="public-table-header">
      <el-button @click="otherPage.PAGE = 'DETAILS';otherPage.status.details = STATUS.ADD" type="primary" size="mini">新增换货申请</el-button>

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
      <el-table-column label="单号" prop="code" align="center" min-width="220">
        <template slot-scope="scope">
          <i-label :target="scope.row" :type="AuditType.value.EXCHANGE_REQUEST" :info="false" key></i-label>
        </template>
      </el-table-column>
      <el-table-column label="品项数" prop="itemNumber" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="状态" prop="createTime" align="center" min-width="180">
        <template slot-scope="scope">
          {{ getSTATUS(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="部门" prop="organizationName" align="center" min-width="180">
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
              <el-button @click="deleteBean(scope.row.id)" type="danger" size="mini">删除</el-button>
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
              <el-button @click="deleteBean(scope.row.id)" type="danger" size="mini">删除</el-button>
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
  <r-details v-else-if="otherPage.PAGE == 'DETAILS'"></r-details>
</template>

<script>
  import rDetails from './exchangeRequest_details.vue';
  import iLabel from '../../../../util/infoLabel.vue';

  export default {
    name: 'huanhuoshenqing',
    components: {
      rDetails,
      iLabel,
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


        reason: {
          //换货申请
          type: 1,
          code: '', //申请编码
          warehouseVoucherCode: '',
          description: '',

          //提交日期
          subStartTime: '',
          subEndTime: '',
        },

        //提交时间，数组容器
        subTime: [],

        table: {
          list: [],
          page: 1,
          pageSize: 10,
          total: 0
        }


      }
    },
    watch:{
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
        deep:true
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
          url: '/exchange/request/list',
          data: {
           reason: that.reason,
           page: that.table.page,
           pageSize: that.table.pageSize
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

      submit: function(row) {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/delivery/request/commit',
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

      deleteBean: function(id) {
        var that = this;
        var axios = that.axios;

        that.$confirm('您确定要删除吗？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: '/delivery/request/delete',
              data: {
                id: id
              },
              df: true
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

        delete warehouse.createTime;
        delete warehouse.createUser;
        delete warehouse.updateTime;
        delete warehouse.updateUser;
        delete warehouse.isDelete;
        delete warehouse.subUser;
        delete warehouse.subTime;

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

      edit: function(row) {

        var that = this;
        that.otherPage.data.details.id = row.id;

        that.otherPage.PAGE = 'DETAILS';
        that.otherPage.status.details = that.STATUS.UPDATE;

      },


      view: function(row) {
        var that = this;
        that.otherPage.data.details.id = row.id;

        that.otherPage.status.details = that.STATUS.READ;

        that.otherPage.PAGE = 'DETAILS'
      },

    }
  }
</script>

<style scoped="scoped">
</style>

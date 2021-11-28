<template>


  <div class="flexCenter type-choose-block" v-if="reason.type == null">
    <div class="flexRowWarp">
      <template v-for="type in auditType">
        <div class="type-block youCanNotChoose">
          <div @click="reason.type = type.value">
            {{type.name}}审批
          </div>
        </div>
      </template>
    </div>
  </div>

  <div v-else>

    <div class="title">
      <el-button type="warning" @click="reason.type = null" plain>返回审批类型选择</el-button>
      <div> > {{AuditType.getStr(reason.type)}}审批流程</div>
    </div>


    <div class="reason-line">
      <div class="reason-input">
        <span>
          流程名称
        </span>
        <el-input v-model="reason.name"></el-input>
      </div>
      <el-button @click="initTableList" :icon="table.inSearch? 'el-icon-refresh':'el-icon-search'" class="reason-button"
        :type="table.inSearch? 'warning':'primary'" :disabled="table.inSearch">查询</el-button>
    </div>

    <div class="public-table-header">

      <el-button @click="craeteProcess" size="mini" type="success" class="right">添加流程</el-button>
    </div>

    <el-table :data="table.list" style="width: 100%" cell-class-name="public-table-cell">
      <el-table-column label="序号" type="index" align="center" min-width="48">
        <template slot-scope="scope">
          <span>{{(table.page - 1) * table.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程名称" prop="name" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="步骤数" prop="step" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="更新人" prop="updateUserName" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="更新时间" align="center" min-width="180">
        <template slot-scope="scope">
          {{ DateToStr(new Date(scope.row.updateTime)) }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createUserName" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="创建时间" prop="createUserTime" align="center" min-width="180">
        <template slot-scope="scope">
          {{ DateToStr(new Date(scope.row.updateTime)) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="180">
        <template slot-scope="scope">
          <el-button @click="process.id = scope.row.id;process.inInfo = true;" type="warning" size="mini">编辑</el-button>
          <!-- 未提交 -->
          <el-button @click="deleteProcess(scope.row)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <div class="flexCenter margin-top15">
      <el-pagination @size-change="(val)=>{table.pageSize=val;initTableList()}" @current-change="(val)=>{table.page=val;initTableList()}"
        :current-page="table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="table.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="table.total">
      </el-pagination>
    </div>


    <el-dialog width="60%" :custom-class="['dialog-card','self-card','min-width880px']" :visible.sync="process.inInfo"
      :append-to-body="true">
      <process-de :processId="process.id" @initTableList="initTableList" v-if="process.inInfo"></process-de>
    </el-dialog>


  </div>



</template>

<script>
  import processDe from './process.vue'

  export default {
    components: {
      processDe
    },
    name: 'shenpiguanli',
    data() {
      return {

        auditType: this.AuditType.data,

        reason: {
          type: null,
          name: ''
        },

        table: {
          list: [],
          page: 1,
          pageSize: 10,
          total: 0,
          inSearch: false
        },

        //流程
        process: {
          //在详细信息中
          inInfo: false,
          //如果id不为null，则是添加
          id: null
        }

      }
    },
    watch: {
      'reason.type': {
        handler: function(newV) {

          if (newV != null) {
            this.initTableList()
          }

        }
      }
    },
    created: function() {

    },
    methods: {
      initTableList: function() {
        var that = this;
        var axios = that.axios;

        that.table.inSearch = true;

        axios({
          method: 'post',
          url: '/audit/process/list',
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

          setTimeout(function() {
            var data = response.data;
            that.table.list = data.data;
            that.table.total = data.total;
            that.table.inSearch = false;
          }, 200)


        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      craeteProcess: function() {
        var that = this;
        var axios = that.axios;

        that.$confirm('是否创建流程？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: '/audit/process/bean/add',
              data: {
                type: that.reason.type
              },
              df: true,
              loading: true
            }).then((response) => {
              if (!response) {
                return;
              }
              var data = response.data;
              if (data.code == that.STATUS.SUCCESS) {
                that.notic(true, '创建');
                that.initTableList();
                that.process.id = data.data;
                that.process.inInfo = true;


              } else {
                that.notic(false, '创建');
              }
            }).catch((error) => {
              that.errorhanding(error)
            })
          })
          .catch(_ => {});
      },

      deleteProcess: function(row) {
        var that = this;
        var axios = that.axios;
								/* (永久删除) */
        that.$confirm('是否删除，流程，不可逆，是否继续？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: '/audit/process/bean/delete',
              data: {
                id: row.id
              },
              df: false,
              loading: true
            }).then((response) => {
              if (!response) {
                return;
              }
              var data = response.data;
              if (data.code == that.STATUS.SUCCESS) {
                that.deleteSuccess(true)
                that.initTableList();
              } else {
                that.notics.error('删除失败',data.msg);
              }
            }).catch((error) => {
              that.errorhanding(error)
            })
          })
          .catch(_ => {});
      },
    }
  }
</script>

<style scoped="scoped">
  .type-block>div:hover {
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.8);
  }

  .type-block>div {
    background: rgba(105, 185, 255, 1);
    color: white;
    border-radius: 25px;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }

  .type-block {
    width: 200px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    padding: 10px;
  }

  .type-choose-block {
    min-height: 600px;
  }

  .type-choose-block>div {
    padding: 40px;
  }

  .title {

    height: 40px;
    line-height: 40px;
    font-size: 20px;

    border-bottom: rgba(240, 240, 240, 1) solid 1px;

    display: flex;
  }

  .title>div:last-child {
    margin-left: 10px;
  }
</style>

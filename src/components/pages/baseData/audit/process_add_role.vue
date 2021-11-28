<template>
  <div class="card">

    <div class="text-align-center font16 font-bold">
      添加角色
    </div>

    <div class="public-table-header">
      <el-input v-model="reason.name" placeholder="角色名称" style="width: 150px;" size="mini" clearable :disabled="table.inSearch"></el-input>
      <el-select v-model="reason.beAdd" popper-class="z-index2022" placeholder="全部" size="mini" clearable :disabled="table.inSearch">
        <el-option :key="true" label="已添加" :value="true">
        </el-option>
        <el-option :key="false" label="未添加" :value="false">
        </el-option>
      </el-select>
      <el-button @click="initTableList()" :icon="table.inSearch? 'el-icon-refresh':'el-icon-search'" size="mini" :type="table.inSearch? 'warning':'success'"
        :disabled="table.inSearch" circle></el-button>
    </div>

    <el-table :data="table.list" style="width: 100%" height="400px" cell-class-name="public-table-cell">
      <el-table-column label="序号" type="index" align="center" min-width="48">
        <template slot-scope="scope">
          <!-- <span>{{(table.page - 1) * table.pageSize + scope.$index + 1}}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="角色名称" prop="name" align="center" min-width="180">
      </el-table-column>
      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="150">
        <template slot="header" slot-scope="scope">
          <div class="margin-right30">
            操作
          </div>
        </template>
        <template slot-scope="scope">
          <div class="flexCenter margin-right30" v-if="scope.row.numberReason == 0">
            <el-button @click="addRole(scope.row)" size="mini" icon="el-icon-plus" type="primary" circle></el-button>
          </div>
          <div class="flexRow" v-if="scope.row.numberReason != 0">
            <div @click="removeRole(scope.row)" class="chice-ware pointer youCanNotChoose margin-left30">
              <i class="el-icon-check"></i>
              <i class="el-icon-close"></i>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="最少审核数" prop="applicationNo" align="center" width="150">
        <template slot-scope="scope">
          <template v-if="scope.row.numberReason != 0">
            <el-input-number v-model="scope.row.number" :min="0" @change="($event) => { roleNumber($event,scope.row); }" controls-position="right" size="mini" style="width: 100px;"></el-input-number>
          </template>
          <template v-if="scope.row.numberReason == 0">
            未选择
          </template>
        </template>
      </el-table-column>
    </el-table>

    <div class="flexCenter margin-top15">
      <el-pagination @size-change="(val)=>{table.pageSize=val;initTableList()}" @current-change="(val)=>{table.page=val;initTableList()}"
        :current-page="table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="table.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="table.total">
      </el-pagination>



    </div>

  </div>
</template>

<script>
  export default {
    props: ['stepId', 'processId'],
    data() {
      return {

        reason: {
          name: '',
          account: '',
          beAdd: '',
          stepId: null
        },

        table: {
          list: [],
          page: 1,
          pageSize: 10,
          total: 0,
          inSearch: false
        },

      }
    },
    watch: {
      'reason.beAdd': {
        handler: function(newV) {
          if (newV == null)
            return
          this.initTableList()
        },
        deep: true
      }
    },
    created: function() {
      var that = this;

      that.reason.stepId = that.stepId;
      that.initTableList();
    },
    methods: {

      initTableList: function() {
        var that = this;
        var axios = that.axios;

        that.inSearch = true;

        axios({
          method: 'post',
          url: '/audit/process/bean/role',
          data: {
            reason: that.reason,
            page: that.table.page,
            pageSize: that.table.pageSize
          },
          df: false
        }).then((response) => {

          setTimeout(function() {
            that.inSearch = false;
            if (!response) {
              return;
            }

            var data = response.data;

            that.table.list = data.data;
            that.table.total = data.total;
          }, 200)


        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      addRole: function(row) {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/audit/process/bean/role/add',
          data: {
            processId: that.processId,
            stepId: that.stepId,
            roleId: row.id
          },
          df: true,
          loading: true
        }).then((response) => {

          setTimeout(function() {
            that.inSearch = false;
            if (!response) {
              return;
            }

            var data = response.data;

            if (data.code == that.STATUS.SUCCESS) {
              that.addSuccess(true);
            } else {
              that.addSuccess(false)
            }
            that.initTableList();

          }, 200)


        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      roleNumber: function(number, row) {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/audit/process/bean/role/min',
          data: {
            id: row.auditProcessStepRoleId,
            number: number,
            auditProcessStepId: that.stepId
          },
          df: false,
          loading: true
        }).then((response) => {

          setTimeout(function() {
            that.inSearch = false;
            if (!response) {
              return;
            }

            var data = response.data;

            if (data.code == that.STATUS.SUCCESS) {
              that.updateSuccess(true);
            } else {
              that.updateSuccess(false,'<span>最少审核数总数不得大于当前步骤的审核人数</span>');
            }
            that.initTableList();

          }, 200)


        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      removeRole: function(row) {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/audit/process/bean/role/delete',
          data: {
            stepId: that.stepId,
            roleId: row.id
          },
          df: true,
          loading: true
        }).then((response) => {

          setTimeout(function() {
            that.inSearch = false;
            if (!response) {
              return;
            }

            var data = response.data;

            if (data.code == that.STATUS.SUCCESS) {
              that.notic(true, '移除', row.name + '已被移除');
            } else {
              that.notic(false, '移除', row.name + '被移除失败');
            }
            that.initTableList();

          }, 200)


        }).catch((error) => {
          that.errorhanding(error)
        })
      },
    }
  }
</script>

<style scoped="scoped">
  .card {
    border: solid 1px rgba(210, 210, 210, .8);
    box-shadow: 0px 1px 5px rgba(202, 202, 202, 1);
    padding: 20px;
  }

  .chice-ware {
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
</style>

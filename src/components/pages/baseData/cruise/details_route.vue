<template>
  <div>

    <div class="public-table-header">
      <div>
        <el-input v-model="reason.name" size="mini" style="width: 150px;" placeholder="搜索航次名" clearable></el-input>
        <el-button id="route" @click="initTableList" size="mini" :icon="table.inSelect? 'el-icon-refresh' :'el-icon-search'"
          :type="table.inSelect? 'warning' :'success'" :disabled="table.inSelect" circle></el-button>
      </div>

      <el-button @click="table.inAdd = true;" type="success" class="margin-right10" style="margin-left: auto;" size="mini">添加航次</el-button>

    </div>
    <el-table :data="table.list" style="width: 100%" height="450px" cell-class-name="public-table-cell">
      <el-table-column label="序号" type="index" align="center" min-width="48">
        <template slot-scope="scope">
          <span>{{(table.page - 1) * table.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="航次名" prop="taskName" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="开始日期" prop="startTime" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="结束日期" prop="endTime" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="添加时间" prop="createTime" align="center" min-width="180">
        <template slot-scope="scope">
          {{ getCreateDateStr(new Date(scope.row.createTime)) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="120">
        <template slot-scope="scope">
          <el-button @click="deleteRoute(scope.row)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="flexCenter margin-top10">
      <el-pagination @size-change="(val)=>{table.pageSize=val;initTableList()}" @current-change="(val)=>{table.page=val;initTableList()}"
        :current-page="table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="table.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="table.total">
      </el-pagination>
    </div>

    <el-dialog title="添加航次" :modal-append-to-body="false" :append-to-body="true" :visible.sync="table.inAdd" width="600px"
      center>

      <div class="input-block">
        <span>航次名</span>
        <el-input v-model="route.name" clearable></el-input>
      </div>
      <br>
      <div class="input-block">
        <span>航次日期</span>
        <el-date-picker v-model="routeDate" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="flexCenter margin-top20">
        <el-button @click="addRoute" type="success">添加</el-button>
      </div>

    </el-dialog>


  </div>
</template>

<script>
  export default {
    props: ["cruise"],
    data() {
      return {


        reason: {
          name: '',

        },

        table: {
          list: [],
          page: 1,
          pageSize: 10,
          inSelect: false,
          inAdd: false
        },

        route: {
          name: '',
          startTime: '',
          endTime: ''
        },

        routeDate: []

      }
    },
    watch: {
      'cruise': {
        handler: function() {
          this.initTableList()
        },
        deep: true
      },
      'routeDate': {
        handler: function(newV) {
          if (newV.length == 2) {
            var that = this;
            that.route.startTime = newV[0];
            that.route.endTime = newV[1]
          } else {
            that.route.startTime = '';
            that.route.endTime = '';
          }
        },
        deep: true
      }
    },
    created: function() {
      this.initTableList()
    },
    methods: {

      initTableList: function() {
        var that = this;
        var axios = that.axios;
        that.table.inSelect = true;

        axios({
          method: 'post',
          url: '/route/list',
          data: {
            reason: {
              warehouseTypeId: that.cruise.id,
              name: that.reason.name
            },
            page: that.table.page,
            pageSize: that.table.pageSize
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }

          setTimeout(function() {

            that.table.inSelect = false;
            var data = response.data;

            that.table.list = data.data;
            that.table.total = data.total;
          }, 300)

        }).catch((error) => {
          that.table.inSelect = false;
          that.errorhanding(error)
        })
      },

      addRoute: function() {
        var that = this;
        var axios = that.axios;

        var target = that.route;

        target.name = target.name == undefined ? '' : target.name + '';
        if (target.name.trim() == '') {
          that.notics.warning('请输入航次名称');
          return;
        }

        axios({
          method: 'post',
          url: '/route/add',
          data: {
            bean: target,
            warehouseTypeId: that.cruise.id
          },
          loading: true,
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          if (data.code == that.STATUS.SUCCESS) {
            that.addSuccess(true);
            that.initTableList(true);
            that.table.inAdd = false;
          }
        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      deleteRoute: function(row, inner) {
        var that = this;
        var axios = that.axios;

        that.$confirm('是否删除该项？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: '/route/delete',
              data: {
                routeId: row.id,
                bean: {
                  id: row.taskId
                }
              },
              loading: true,
              df: false
            }).then((response) => {
              if (!response) {
                return;
              }
              var data = response.data;
              if (data.code == that.STATUS.SUCCESS) {
                that.deleteSuccess(true);
                that.initTableList(true);
                row.add = true;
              }
            }).catch((error) => {
              that.errorhanding(error)
            })
          }).catch(_ => {});

      },



    }
  }
</script>

<style>
</style>

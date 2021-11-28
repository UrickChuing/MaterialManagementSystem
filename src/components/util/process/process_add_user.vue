<template>
  <div class="card">

    <div class="text-align-center font16 font-bold">
      添加用户
    </div>

    <div class="public-table-header">
      <el-input v-model="reason.name" placeholder="用户名" style="width: 150px;" size="mini" clearable :disabled="table.inSearch"></el-input>
      <el-input v-model="reason.account" placeholder="账号" style="width: 150px;" size="mini" clearable :disabled="table.inSearch"></el-input>
      <el-select v-model="reason.beAdd" popper-class="z-index2022" placeholder="全部" size="mini" clearable :disabled="table.inSearch">
        <el-option :key="true" label="已添加" :value="true">
        </el-option>
        <el-option :key="false" label="未添加" :value="false">
        </el-option>
      </el-select>
      <el-button @click="table.page=1;initTableList()" :icon="table.inSearch? 'el-icon-refresh':'el-icon-search'" size="mini" :type="table.inSearch? 'warning':'success'"
        :disabled="table.inSearch" circle></el-button>
    </div>

    <el-table :data="table.list" style="width: 100%" height="400px" cell-class-name="public-table-cell">
      <el-table-column label="序号" type="index" align="center" min-width="48">
        <template slot-scope="scope">
          <span>{{(table.page - 1) * table.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名称" prop="name" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="账号" prop="account" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="操作" prop="applicationNo" align="center" width="150">
        <template slot="header" slot-scope="scope">
          <div class="margin-right30">
            操作
          </div>
        </template>
        <template slot-scope="scope">
          <div class="flexCenter margin-right30" v-if="!scope.row.inAdd">
            <el-button @click="addUser(scope.row,scope.$index)" size="mini" icon="el-icon-plus" type="primary" circle></el-button>
          </div>
          <div class="flexRow" v-else>
            <div @click="removeUser(scope.row)" class="chice-ware pointer youCanNotChoose margin-left30">
              <i class="el-icon-check"></i>
              <i class="el-icon-close"></i>
            </div>
            <!--            <div class="flexCenter">
              <el-checkbox v-model="scope.row.essential" @change="($event) => {mustUser($event,scope.row)}" :true-label="true">必要</el-checkbox>
            </div> -->

          </div>
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
    props: ['stepId', 'stepIndex', 'processId', 'users'],
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
            return;

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


        var showBeAdd = that.reason.beAdd;
        if(that.stepId == undefined || that.processId == undefined){
          showBeAdd = showBeAdd === ''? undefined:showBeAdd;
        }

        var requestData = {
          reason: that.reason
        }

        if(showBeAdd === undefined){
          requestData['page'] = that.table.page;
          requestData['pageSize'] = that.table.pageSize;
        }

        axios({
          method: 'post',
          url: '/audit/process/bean/step/user',
          data: requestData,
          df: false,
          loading:true
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          if (data.code != that.STATUS.SUCCESS) {
            throw data.msg;
          }
          setTimeout(function() {


            var list = data.data;

            for(var i in list){
              var demo = list[i];
              demo.inAdd = false;
              for(var index in that.users){
                var user = that.users[index];
                if(user.userId === demo.id){
                  demo.inAdd = true;
                }
              }
            }

            if(showBeAdd != undefined){
              for(var i = 0 ; i < list.length ; i++){
                var demo = list[i];
                if(showBeAdd && !demo.inAdd){
                  list.splice(i,1);
                  i--;
                }else if(!showBeAdd && demo.inAdd){
                  list.splice(i,1);
                  i--;
                }
              }

              data.total = list.length;

              var newList = [];

              var page = that.table.page;
              var pageSize = that.table.pageSize;

              for(var i = 0 ; i < list.length ; i++){
                //判断是否在 页面区间中
                if( (page - 1) * pageSize <= i && page * pageSize -1){
                  newList.push(list[i]);
                }
              }

              list = newList;

            }


            that.table.list = list;
            that.table.total = data.total;

          }, 200)


        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      addUser: function(row,index) {
        var that = this;
        if(that.stepId == undefined || that.processId == undefined){

          row.inAdd = true;
          that.$emit('set',{userId:row.id,name:row.name},that.stepId,that.stepIndex)

          return;
        }

        var axios = that.axios;

        axios({
          method: 'post',
          url: '/audit/process/bean/step/user/add',
          data: {
            processId: that.processId,
            stepId: that.stepId,
            userId: row.id,
            reSetNumber: true
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
              that.addSuccess(false,data.msg);
            }

            that.$emit('init',that.processId,true,that.initTableList);

          }, 200)


        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      removeUser: function(row) {
        var that = this;

        if(that.stepId == undefined || that.processId == undefined){

          row.inAdd = false;
          that.$emit('remove',row.id,that.stepIndex);

          return;
        }


        var axios = that.axios;

        axios({
          method: 'post',
          url: '/audit/process/bean/step/user/delete',
          data: {
            stepId: that.stepId,
            userId: row.id,
            reSetNumber:true
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
            that.$emit('init',that.processId,true,that.initTableList);

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

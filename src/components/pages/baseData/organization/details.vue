<template>
  <div>
    <div class="card-header">
      <template v-if="organization != null">
        {{organization.name}}
      </template>
      <template v-else-if="organization == null">
        <san class="blue">请选择部门</san>
      </template>
    </div>

    <template v-if="organization != null">
      <div class="input-line margin-top10">
        <div class="input-block">
          <span>名称</span>
          <el-input v-model="updateName" :placeholder="organization.name" clearable></el-input>
          <el-button @click="update" type="warning" size="medium">保存</el-button>
          <el-button @click="updateName=organization.name" type="success" size="medium">重置</el-button>
        </div>
      </div>



      <div class="public-table-header" @keydown.enter="initTableList()">
        <div>
          <el-input v-model="reason.userName" size="mini" style="width: 150px;" placeholder="搜索用户名" clearable></el-input>
          <el-input v-model="reason.account" size="mini" style="width: 150px;" placeholder="搜索用户账号" clearable></el-input>
          <el-button @click="initTableList" size="mini" :icon="table.inSelect? 'el-icon-refresh' :'el-icon-search'"
            :type="table.inSelect? 'warning' :'success'" :disabled="table.inSelect" circle></el-button>
        </div>

        <el-button @click="table.inAdd = true;" type="success" class="margin-right10" style="margin-left: auto;" size="mini">添加用户</el-button>

      </div>

      <el-table :data="table.list" style="width: 100%" cell-class-name="public-table-cell">
        <el-table-column label="序号" type="index" align="center" min-width="48">
          <template slot-scope="scope">
            <span>{{(table.page - 1) * table.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="userName" align="center" min-width="180">
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" align="center" min-width="180">
          <template slot-scope="scope">
            {{ getCreateDateStr(new Date(scope.row.createTime)) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="120">
          <template slot-scope="scope">  <!-- scope.row,false -->
            <el-button @click="deleteUser(scope.row,false)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </template>

    <el-dialog title="添加用户" :modal-append-to-body="false" :append-to-body="true" :visible.sync="table.inAdd" width="700px"
      center>

      <div class="public-table-header" style="margin-top: 0px;" @keydown.enter="initUser">
        <div>
          <el-input v-model="user.reason.name" size="mini" style="width: 150px;" placeholder="搜索用户名" clearable></el-input>
          <el-input v-model="user.reason.account" size="mini" style="width: 150px;" placeholder="搜索用户账号" clearable></el-input>
          <el-button @click="initUser()" size="mini" :icon="user.table.inSelect? 'el-icon-refresh' :'el-icon-search'"
            :type="user.table.inSelect? 'warning' :'success'" :disabled="user.table.inSelect" circle></el-button>
        </div>

      </div>

      <el-table :data="user.table.list" style="width: 100%" height="450px" cell-class-name="public-table-cell">
        <el-table-column label="序号" type="index" align="center" min-width="48">
          <template slot-scope="scope">
            <span>{{(user.table.page - 1) * user.table.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="name" align="center" min-width="180">
        </el-table-column>
        <el-table-column label="用户账号" prop="account" align="center" min-width="180">
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" align="center" min-width="180">
          <template slot-scope="scope">
            {{ getCreateDateStr(new Date(scope.row.createTime)) }}
          </template>
        </el-table-column>
        <!-- 				<el-table-column label="承重(KG)" prop="bearing" align="center" min-width="180">
				</el-table-column> -->
        <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="60">
          <template slot-scope="scope">
            <el-button icon="el-icon-plus" v-if="!scope.row.add" @click="addUser(scope.row)" type="success" size="mini"
              :disabled="user.table.inSelect" circle></el-button>     <!-- scope.row,true -->
            <el-button icon="el-icon-minus" v-else @click="deleteUser(scope.row,true)" type="danger" size="mini"
              :disabled="user.table.inSelect" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flexCenter margin-top20">
        <el-pagination @size-change="(val)=>{user.table.pageSize=val;initUser()}" @current-change="(val)=>{user.table.page=val;initUser()}"
          :current-page="user.table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="user.table.pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="user.table.total">
        </el-pagination>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {

        parent: this.$parent,

        organization: null,
        updateName: null,

        reason: {
          userId: null,
          organizationId: null,
          userName: '',
          account: ''
        },
        table: {
          list: [],
          total: 0,
          page: 1,
          pageSize: 10,
          inSelect: false,
          inAdd: false
        },

        user: {
          reason: {
            name: ''
          },
          table: {
            list: [],
            page: 1,
            pageSize: 10,
            total: 0,
            inSelect: false,
          }
        }


      }
    },
    watch: {
      'table.inAdd': {
        handler: function(newV) {
          if (newV) {
            this.initUser();
          } else {
            this.user.reason.name = '';
            this.user.table.page = 1;
            this.user.table.pageSize = 10;
          }
        },
        deep: true
      }

    },
    created: function() {

    },
    methods: {

      initTableList: function(initUser) {
        var that = this;
        var axios = that.axios;
        that.table.inSelect = true;

        axios({
          method: 'post',
          url: '/organization/user/list',
          data: {
            reason: {
              organizationId: that.organization.id,
              userName: that.reason.userName,
              account: that.reason.account
            },
            page: that.table.page
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
            if (initUser) {
              that.initUser();
            }
          }, 300)

        }).catch((error) => {
          that.table.inSelect = false;
          that.errorhanding(error)
        })
      },


      initUser: function() {
        var that = this;
        var axios = that.axios;
        that.user.table.inSelect = true;

        axios({
          method: 'post',
          url: '/organization/user/add/list',
          data: {
            page: that.user.table.page,
            pageSize: that.user.table.pageSize,
            reason: {
              organizationId: that.organization.id,
              name: that.user.reason.name,
              account: that.user.reason.account
            }
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }

          setTimeout(function() {

            that.user.table.inSelect = false;
            var data = response.data;

            var userList = data.data;
            that.user.table.total = data.total;

            that.user.table.list = userList;
          }, 300)

        }).catch((error) => {
          that.table.inSelect = false;
          that.errorhanding(error)
        })

      },

      addUser: function(row) {

        var that = this;
        var axios = that.axios;
        row.add = true;


        axios({
          method: 'post',
          url: '/organization/user/add',
          data: {
            userId: row.id,
            organizationId: that.organization.id
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
            row.add = true;
          }
        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      update: function() {

        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/organization/update',
          data: {
            name: that.updateName,
            id: that.organization.id
          },
          loading: true,
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          if (data.code == that.STATUS.SUCCESS) {
            that.updateSuccess(true);
            that.organization.name = that.updateName;
            that.parent.initOrganization(that.organization.id)
          } else {
            that.updateSuccess(false)
          }
        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      deleteUser: function(row, inner) {
        var that = this;
        var axios = that.axios;

       var id;
        if (inner) {
          row.add = true;
          id = row.userOrganizationId;
        } else {
          id = row.id
        }
        that.$confirm('您确定要删除吗？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: '/organization/user/delete',
              data: {
                id: id
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

                if (inner) {
                  row.add = true;
                }
                that.initTableList(true);

              }
            }).catch((error) => {
              that.errorhanding(error)
            })
            done();
          })
          .catch(_ => {});

      },

    }
  }
</script>

<style scoped="scoped">
  .card-header {
    border-bottom: solid 1px rgba(0, 0, 0, 0.2);
    padding-bottom: 10px;
    font-size: 20px;
  }
</style>

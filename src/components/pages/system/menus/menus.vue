<template>
  <div @keydown.enter="initTableList" v-if="otherPage.PAGE == 'INDEX'">

    <div class="reason-line">

      <div class="reason-input">
        <span>菜单名称</span>
        <el-input v-model="reason.name"></el-input>
      </div>

      <div class="reason-input">
        <span>菜单组件</span>
        <el-input v-model="reason.component"></el-input>
      </div>

      <div class="reason-input">
        <span>父级菜单名称</span>
        <el-input v-model="reason.parent"></el-input>
      </div>

      <el-button @click="table.page=1;initTableList()" icon="el-icon-search" type="primary" class="reason-button">搜索</el-button>

    </div>

    <div class="public-table-header">
      <el-button @click="otherPage.PAGE = 'DETAILS';otherPage.status.details = STATUS.ADD" type="primary" size="mini">新增菜单</el-button>

      <div class="right red" v-if="table.inSelect">
        <i class="el-icon-loading"></i>
        请稍等，正在查询。。。
      </div>
    </div>
    <el-table :data="table.list" style="width: 100%" cell-class-name="public-table-cell">
      <el-table-column label="序号" type="index" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{(table.page - 1) * table.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="页面名称" prop="name" align="center" min-width="180">
        <template slot-scope="scope">
          {{$t(scope.row.title)}}
        </template>
      </el-table-column>
      <el-table-column label="icon" prop="code" align="center" min-width="180">
        <template slot-scope="scope">
          <i :class="scope.row.icon" @click="card.open = true;card.id = scope.row.id"></i>
        </template>
      </el-table-column>
      <el-table-column label="开启缓存" prop="keepAlive" align="center" min-width="180">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.keepAlive" @change="update(scope.row.id,'keepAlive',$event)" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="启用" prop="display" align="center" min-width="180">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.display" @change="update(scope.row.id,'display',$event)" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="180">
        <template slot-scope="scope">
          <el-button @click="card.type='INFO';card.open=true;" type="warning" size="mini">编辑</el-button>
          <!-- 未提交 -->
          <el-button @click="submit(scope.row)" type="success" size="mini" v-if="scope.row.auditStatus == 0">提交</el-button>
          <el-button @click="deleteBean(scope.row.id)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="flexCenter margin-top10">
      <el-pagination @size-change="(val)=>{table.pageSize=val;initTableList()}" @current-change="(val)=>{table.page=val;initTableList()}"
        :current-page="table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="table.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="table.total">
      </el-pagination>
    </div>

    <el-dialog :custom-class="['dialog-card','self-card','mini']" :visible.sync="card.open" :append-to-body="true">
      <icon-list @icon="iconChange" v-if="card.type == 'ICON' && card.open"></icon-list>
      <info-card v-if="card.type == 'INFO' && card.open"></info-card>
    </el-dialog>


  </div>
</template>

<script>
  import iconList from '../../../util/icon-list.vue';
  import infoCard from './menuCard.vue'

  export default {
    components:{
      iconList,
      infoCard,
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
          status: this.STATUS,
        },

        reason: {

        },

        card:{
          open:false,
          type: 'ICON',
          id: null,
          bean:null,
        },


        table: {
          list: [],
          page: 1,
          pageSize: 10,
          total: 0
        }


      }
    },
    beforeRouteEnter: function(to, from, next) {
      next((that) => {
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
          url: '/menuView/list',
          data: {
            page: that.table.page,
            pageSize: that.table.pageSize,
            reason: that.reason
          },
          df: false
        }).then((response) => {
          if (!response)
            return;
          that.table.inSelect = false;
          var data = response.data;

          that.table.list = data.data;
          that.table.total = data.total;
        }).catch((error) => {
          that.errorhanding(error)
        });
      },

      commit: function(id) {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/supplier/commit',
          data: {
            id: id
          },
          df: false
        }).then((response) => {
          var data = response.data;

          that.table.list = data.data;
          that.table.total = data.total;
        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      deleteBean: function(id) {
        var that = this;
        var axios = that.axios;

        that.$confirm('您确定要删除吗？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: '/user/delete',
              data: {
                id: id
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

      update: function(id, key, value) {

        var bean = {
          id: id
        }
        bean[key] = value;

        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/menuView/update',
          data: bean,
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

      iconChange: function(newV){
        this.update(this.card.id,'icon',newV);
        this.card.open = false;
        this.card.id = null;
        this.initTableList();
      }

    }
  }
</script>

<style scoped="scoped">
</style>

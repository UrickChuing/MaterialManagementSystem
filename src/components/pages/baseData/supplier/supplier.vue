<template>
  <div @keydown.enter="initTableList" v-if="otherPage.PAGE == 'INDEX'">
    <div class="reason-line">

      <div class="reason-input">
        <span>供应商代码</span>
        <el-input v-model="reason.code" clearable></el-input>
      </div>

      <div class="reason-input">
        <span>供应商名称</span>
        <el-input v-model="reason.name" clearable></el-input>
      </div>

      <div class="reason-input">
        <span>状态</span>
        <el-select v-model="reason.status" placeholder="全部" clearable>
          <el-option v-for="(item,index) in options.status" :key="index" :label="item" :value="index">
          </el-option>
        </el-select>
      </div>

      <el-button @click="initTableList()" icon="el-icon-search" type="primary" class="reason-button">搜索</el-button>

    </div>

    <div class="public-table-header">
      <el-button @click="otherPage.PAGE = 'DETAILS';otherPage.status.details = STATUS.ADD" type="primary" size="mini">新增供应商</el-button>

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
      <el-table-column label="供应商" prop="name" align="center" min-width="200">
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center" min-width="80">
        <template slot-scope="scope">
          {{ options.status[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" min-width="180">
        <template slot-scope="scope">
          {{ getCreateDateStr(new Date(scope.row.createTime)) }}
        </template>
      </el-table-column>
      <el-table-column label="创建者" prop="createUserName" align="center" min-width="180">
      </el-table-column>
      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="180">
        <template slot-scope="scope">
          <el-button @click="page_DetailsUpdate(scope.row)" type="warning" size="mini">编辑</el-button>
          <!-- 未提交 -->
          <el-button @click="submit(scope.row)" type="success" size="mini" v-if="scope.row.auditStatus == 0">提交</el-button>
          <el-button @click="deleteFromList(scope.row)" type="danger" size="mini">删除</el-button>
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
  <detail-card v-else-if="otherPage.PAGE == 'DETAILS'">
  </detail-card>
</template>

<script>
  import popBg from '../../../util/contentPop/index.vue'
  import detailCard from './details.vue'

  export default {
    name: 'gongyingshang',
    components: {
      popBg,
      detailCard
    },
    data() {
      return {

        //是否在其他页面
        otherPage: {
          PAGE: 'INDEX',
          pages: ['INDEX', 'DETAILS'],
          status: {
            details: this.STATUS.ADD, //  ['ADD','UPDATE','FINISH']
          },
          data: {
            details: {
              id: null
            }
          }
        },

        reason: {
          name: '',
          code: '',
          status: ''
        },


        table: {
          list: [],
          page: 1,
          pageSize: 10,
          inSelect: false
        },

        options: {
          status: ['不可用', '可用']
        }

      }
    },
    watch: {
      'otherPage.PAGE': function(newV) {
        if (newV == 'INDEX') {
          this.initTableList()
        }
      }
    },
    created: function() {

      this.initTableList();
    },
    methods: {

      initTableList: function() {
        var that = this;
        var axios = that.axios;
        that.table.inSelect = true;
        axios({
          method: 'post',
          url: '/supplier/list',
          data: {
            page: that.table.page,
            pageSize: that.table.pageSize,
            reason: that.reason
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          that.table.inSelect = false;
          var data = response.data;

          that.table.list = data.data;
          that.table.total = data.total;
        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      deleteFromList: function(row) {
        var that = this;
        var axios = that.axios;

        that.$confirm('确定删除当前供应商吗？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: '/supplier/delete',
              data: {
                id: row.id
              },
              df: false
            }).then((response) => {
              if (!response) {
                return;
              }
              var data = response.data;
              if (data.code == that.STATUS.SUCCESS) {
                that.deleteSuccess(true, '被删除的供应商代码为：<br><span class="blue">' + row.code + '</span>');
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

      page_DetailsUpdate: function(row) {
        var that = this;

        that.otherPage.data.details.id = row.id;

        that.otherPage.status.details = that.STATUS.UPDATE

        that.otherPage.PAGE = 'DETAILS'
      }

    }
  }
</script>

<style>
</style>

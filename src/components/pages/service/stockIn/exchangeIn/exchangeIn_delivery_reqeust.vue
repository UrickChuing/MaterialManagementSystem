<template>
  <div class="select-delivery-request">

    <div class="title">
      选择换货申请
    </div>

    <div class="public-table-header">

      <el-input placeholder="换货申请单号" size="mini" style="width: 180px;"></el-input>
      <el-button @click="initTableList" icon="el-icon-search" type="primary" size="mini" circle></el-button>

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
      <el-table-column label="说明" prop="code" align="center" min-width="200">
        <template slot-scope="scope">
          <div class="text-ellipsls">
            <el-popover placement="bottom" width="200" trigger="hover" :content="scope.row.description">
              <a class="pointer" slot="reference">{{scope.row.description}}</a>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="入库单号(换货)" prop="warehouseVoucherCode" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="换货申请提交时间" prop="createTime" align="center" min-width="180">
        <template slot-scope="scope">
          {{ getCreateDateStr(new Date(scope.row.subTime)) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="300">
        <template slot-scope="scope">
          <el-button @click="selectTarget(scope.row)" :type="targetId == scope.row.id? 'success':'primary'" size="mini">{{targetId == scope.row.id? '已选择':'选择'}}</el-button>
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


  </div>
</template>

<script>
  export default {
    props: ['targetId'],
    data() {
      return {


        reason: {
          
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
          url: '/exchange/in/delivery/request',
          data: {
            page: that.table.page,
            pageSize: that.table.pageSize,
            reason: that.reason
          },
          df: false
        }).then((response) => {
          that.table.inSelect = false;
		  if(!response)
		    return;
          var data = response.data;

          that.table.list = data.data;
          that.table.total = data.total;
        }).catch((error) => {
          that.errorhanding(error)
        });
      },
      selectTarget: function(row) {
        
        if(row.id == this.targetId)
          return
        
        this.$emit("deliveryReuqest",row)

      }

    }
  }
</script>

<style scoped="scoped">
  .select-delivery-request {
    padding: 20px;
  }

  .select-delivery-request>.title {
    text-align: center;
    font-size: 17px;
    font-weight: bold;
  }
</style>

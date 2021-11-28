<template>
  <div @keydown.enter="initTableList" v-if="otherPage.PAGE == 'INDEX'">

    <div class="input-line">

      <div class="input-block">
        <span>采购申请</span>
        <el-input v-model="reason.code" clearable></el-input>
      </div>

      <div class="input-block">
        <span>物品名称</span>
        <el-input v-model="reason.name" clearable></el-input>
      </div>

      <div class="input-block">
        <span>物品代码</span>
        <el-input v-model="reason.materialCode" clearable></el-input>
      </div>

      <!-- 			<div class="reason-input">
				<span>XXXX</span>
				<el-select v-model="reason.xxxx" placeholder="全部">
					<el-option v-for="(item,index) in options.status" :key="index" :label="item" :value="index">
					</el-option>
				</el-select>
			</div> -->

      <el-button @click="table.page=1;initTableList()" icon="el-icon-search" type="primary" class="reason-button">搜索</el-button>

    </div>

    <div class="public-table-header">

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
      <el-table-column label="采购申请单" prop="code" align="center" min-width="210">
        <template slot-scope="scope">
          <i-label :target="{code:scope.row.code,id:scope.row.purchaseRequestId}" :type="AuditType.value.PURCHASE_REQUEST"
            :info="true" key></i-label>
        </template>
      </el-table-column>
      <el-table-column label="物品" prop="name" align="center" min-width="210">
      </el-table-column>
      <el-table-column label="物品代码" prop="materialCode" align="center" min-width="210">
      </el-table-column>
      <el-table-column label="规格" prop="purchaseSpecification" align="center" min-width="120">
      </el-table-column>
      <el-table-column label="需求采购数量" prop="number" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="剩余采购数量" prop="remainNumber" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" min-width="180">
        <template slot-scope="scope">
          {{ getCreateDateStr(new Date(scope.row.createTime)) }}
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
import iLabel from '../../../util/infoLabel.vue'

export default {
  name: 'caigoushenqing',
  components: {
    iLabel
  },
  data () {
    return {

      otherPage: {
        PAGE: 'INDEX',
        pages: ['INDEX', 'DETAILS'],
        status: {
          details: this.STATUS.ADD //  ['ADD','UPDATE','FINISH']
        },
        data: {
          details: {
            id: ''
          }
        }
      },

      options: {
        status: this.STATUS
      },

      reason: {
        code: '',
        name: '',
        materialCode: ''
      },

      table: {
        list: [],
        page: 1,
        pageSize: 10,
        total: 0
      }

    }
  },
  beforeRouteEnter: function (to, from, next) {
    next((that) => {
      that.initTableList()
    })
  },
  created: function () {
    var that = this

    that.initTableList()
  },
  methods: {
    initTableList: function () {
      var that = this
      var axios = that.axios
      that.table.inSelect = true
      axios({
        method: 'post',
        url: '/purchaseRequest/toBePurchased',
        data: {
          page: that.table.page,
          pageSize: that.table.pageSize,
          reason: that.reason
        },
        df: false
      }).then((response) => {
        that.table.inSelect = false

        if (!response) { return }

        var data = response.data

        that.table.list = data.data
        that.table.total = data.total
      }).catch((error) => {
        that.errorhanding(error)
      })
    },

    commit: function (id) {
      var that = this
      var axios = that.axios

      axios({
        method: 'post',
        url: '/supplier/commit',
        data: {
          id: id
        },
        df: false
      }).then((response) => {
        var data = response.data

        that.table.list = data.data
        that.table.total = data.total
      }).catch((error) => {
        that.errorhanding(error)
      })
    },

    deleteBean: function (id) {
      var that = this
      var axios = that.axios

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
              return
            }
            var data = response.data
            if (data.code == that.STATUS.SUCCESS) {
              that.deleteSuccess(true)
              that.initTableList()
            } else {
              that.deleteSuccess(false)
            }
          }).catch((error) => {
            that.errorhanding(error)
          })
          done()
        })
        .catch(_ => {})
    },

    updateStatus: function (id, status) {
      delete warehouse.createTime
      delete warehouse.createUser
      delete warehouse.updateTime
      delete warehouse.updateUser
      delete warehouse.isDelete
      delete warehouse.subUser
      delete warehouse.subTime

      var that = this
      var axios = that.axios

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
          return
        }
        var data = response.data
        if (data.code == that.STATUS.SUCCESS) {
          that.updateSuccess(true)
          that.initTableList()
        }
      }).catch((error) => {
        that.errorhanding(error)
      })
    }

  }
}
</script>

<style scoped="scoped">
</style>

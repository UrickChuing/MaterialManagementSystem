<template>
  <div :class="baseClasses" :style="baseStyle" v-if="otherPage.PAGE === 'INDEX'">

    <div class="input-line">

      <div class="input-block">
        <span>申请单号</span>
        <el-input v-model="reason.code" clearable></el-input>
      </div>

      <div class="input-block">
        <span>提交人</span>
        <el-input v-model="reason.subUserName" clearable></el-input>
      </div>

      <div class="input-block">
        <span>部门</span>
        <el-select v-model="reason.organizationId" :placeholder="$t('quanbu')" clearable>
          <el-option v-for="item in options.organizations" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>



      <br>

      <div class="input-block">
        <span>状态</span>
        <el-select v-model="reason.status" :placeholder="$t('quanbu')" clearable>
          <el-option v-for="(item,statusIndex) in options.status" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>时间</span>
        <el-date-picker v-model="reasonTime" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>

      <br>


      <div class="input-block">
        <span>邮轮</span>
        <el-select v-model="reason.warehouseTypeId" :placeholder="$t('quanbu')" clearable>
          <el-option v-for="item in options.cruise" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>航次</span>
        <el-select v-model="reason.taskId" title="请选择航次" :placeholder="reason.warehouseTypeId==''? '请选择航次':$t('quanbu')"
          clearable :disabled="reason.warehouseTypeId==''">
          <el-option style="height: 50px;" v-for="item in options.routes" :key="item.id" :label="item.taskName" :value="item.id">
            <div style="line-height: 25px;">
              <span>{{item.taskName}}</span> <br>
              <span class="font6"><span class="blue">{{item.startTime}}</span><span class="red">~~</span><span class="blue">{{item.endTime}}</span></span>
            </div>
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>申请说明</span>
        <el-input v-model="reason.description" clearable></el-input>
      </div>

      <div class="input-block">
        <span>创建人</span>
        <el-input v-model="reason.createUserName" clearable></el-input>
      </div>

      <el-button @click="function(){
				table.page = 1;
				initTableList()
			}" icon="el-icon-search" class="reason-button"
        type="success">查询</el-button>
      <el-button @click="reasonClear()" class="reason-button" type="warning">清空</el-button>

    </div>


    <div class="public-table-header">

      <el-button @click="add()" icon="el-icon-plus" size="mini" type="success">新增采购清单</el-button>

      <div class="right redFont" v-if="table.inSelect">
        <i class="el-icon-loading"></i>
        请稍等，正在查询。。。
      </div>

    </div>
    <el-table :data="table.list" style="width: 100%" cell-class-name="public-table-cell" height="500">
      <!-- 			<el-table-column type="expand" width="50">
				<template slot-scope="scope">
					<pro-item :wareId="scope.row.purchaseRequisitionID"></pro-item>
				</template>
			</el-table-column> -->
      <el-table-column label="序号" type="index" align="center" min-width="48">
        <template slot-scope="scope">
          <span>{{(table.page - 1) * table.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单号" prop="code" align="center" min-width="210">
        <template slot-scope="scope">
          <i-label :target="scope.row" :type="AuditType.value.PURCHASE_REQUEST" :info="false" key></i-label>
        </template>
      </el-table-column>
      <el-table-column label="申请说明" prop="description" align="center" min-width="250">
      </el-table-column>
      <el-table-column label="品项数" prop="itemNumber" align="center" min-width="80">
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center" min-width="100">
        <template slot-scope="scope">{{getSTATUS(scope.row.status)}}</template>
      </el-table-column>
      <el-table-column label="采购率" align="center" min-width="200">
        <template slot-scope="scope">
          <div @click="radioInfo.show = !radioInfo.show;initPurchaseRequestMaterils(scope.row.id)">
            <el-progress class="pointer" :text-inside="true" :stroke-width="26" :percentage="getRatio(scope.row.ratio)"></el-progress>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="部门" prop="organizationName" align="center" min-width="200">
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
              <el-button @click="deleteFromList(scope.row)" type="danger" size="mini">删除</el-button>
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
              <el-button @click="deleteFromList(scope.row)" type="danger" size="mini">删除</el-button>
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

    <el-dialog custom-class="dialog-card self-card" :visible.sync="radioInfo.show" :append-to-body="true">
      <el-table :data="radioInfo.list" style="width: 100%" cell-class-name="public-table-cell" height="500">
        <el-table-column label="代码" prop="code" align="center" min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.preCode + '' + scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" align="center" min-width="150">
        </el-table-column>
        <el-table-column label="类别" prop="materialCategoryName" align="center" min-width="150">
        </el-table-column>
        <el-table-column label="品牌" prop="materialBrandName" align="center" min-width="180">
        </el-table-column>
        <el-table-column label="采购单位" prop="purchaseUnit" align="center" min-width="120">
        </el-table-column>
        <el-table-column fixed="right" label="剩余采购数量" prop="remainNumber" align="center" min-width="72">
          <template slot-scope="scope">
            {{ scope.row.remainNumber }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="状态" align="center" min-width="120">
          <template slot-scope="scope">
            <span class="blue font-bold" v-if="scope.row.remainNumber == 0">
              完成
            </span>
            <span class="red font-bold" v-else>
              未完成
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>

  <add-edite v-else-if="otherPage.PAGE === 'DETAILS'">
  </add-edite>
</template>

<script>
  import proItem from './PurchaseItem.vue'
  import addEdite from './details.vue'
  import iLabel from '../../../util/infoLabel.vue'

  export default {
    name: 'purchaseRequest',
    components: {
      proItem,
      addEdite,
      iLabel
    },
    data() {
      return {

        baseClasses: ['baseClass'],
        baseStyle: {},

        auth: {
          '新增采购申请': false,
        },

        //是否
        otherPage: {
          PAGE: 'INDEX',
          pages: ['INDEX', 'DETAILS'],
          status: {
            details: this.STATUS.ADD, //  ['ADD','UPDATE','FINISH']
          },
          data: {
            details: {
              purchaseRequestId: ''
            }
          }
        },

        reason: {
          code: '',
          subUserName: '',
          status: '',
          subStartTime: '',
          subEndTime: '',
          //部门
          organizationId: '',
          //邮轮
          warehouseTypeId: '',
          //航次
          taskId: '',
          //描述
          description: '',
          ratio: true,
          itemNumber: true
        },

        reasonTime: [],

        options: {
          cruise: [],
          status: this.ORDER_STATUS,
          organizations: [],
          routes: []
        },

        //table list
        table: {
          list: [],
          page: 1,
          pageSize: 10,
          total: 0,
          inSelect: false
        },

        radioInfo: {
          show: false,
          list: []
        },

      }
    },
    watch: {
      reasonTime: {
        handler: function(newV) {
          if (newV != null && newV[0] != undefined && newV[1] != undefined) {
            this.reason.subStartTime = newV[0] + ' 00:00:00';
            this.reason.subEndTime = newV[1] + ' 23:59:59';
          } else {
            this.reason.subStartTime = '';
            this.reason.subEndTime = '';
          }
        },
        deep: true
      },
      'reason.warehouseTypeId': {
        handler: function(newV) {
          if (newV != '') {
            this.initOptionsRoute();
          } else {
            this.reason.taskId = '';
          }
        },
        deep: true
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
          });
        }

        that.initTableList();
      })
    },
    created: function(test) {
      var that = this;

      that.initOptions();
      that.initTableList();
    },
    methods: {
      initTableList: function() {
        var that = this;
        var axios = that.axios;
        that.table.inSelect = true;
        axios({
          method: 'post',
          url: '/purchaseRequest/list',
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
          that.table.inSelect = false;
        });
      },

      //初始化options数据
      initOptions: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/purchaseRequest/options',
          data: {
            organization: true,
            cruise: true,
            warehouse: false,
          }
        }).then((response) => {


          var data = response.data;

          that.options.organizations = data.data.organization;
          that.options.cruise = data.data.cruise;

        });
      },
      //航次
      initOptionsRoute: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/purchaseRequest/options/task',
          data: {
            reason: {
              warehouseTypeId: that.reason.warehouseTypeId
            }
          },
          df: false
        }).then((response) => {

          if (!response) {
            return
          }

          var data = response.data;
          that.options.routes = data.data;

        });
      },

      initPurchaseRequestMaterils: function(id) {
        var that = this;
        var axios = that.axios;

        that.table.inSelect = true;
        axios({
          method: 'post',
          url: '/purchaseRequest/materials',
          data: {
            id: id
          }
        }).then((response) => {
          that.table.inSelect = false;
          if (!response)
            return;
          var data = response.data;

          that.radioInfo.list = data.data;

        }).catch((error) => {
          that.table.inSelect = false;
        });
      },

      reasonClear: function() {
        var that = this;
        that.reason = {
          code: '',
          subUserName: '',
          status: '',
          startTime: '',
          endTime: '',
          //部门
          organizationId: '',
          //邮轮
          warehouseTypeId: '',
          //航次
          taskId: '',
          //描述
          description: '',
          ratio: true,
          itemNumber: true
        }
        that.table.page = 1;
        that.reasonTime = null;
        that.initTableList();
      },


      add: async function() {
        var that = this;

        var code = 200;
        // var code = await that.checkPermissions(['新增采购申请'], function() {});
        if (code == 200) {
          that.otherPage.PAGE = "DETAILS";
          that.otherPage.status.details = that.STATUS.ADD;
        }
      },

      edit: function(row) {

        var that = this;
        that.otherPage.data.details.purchaseRequestId = row.id;

        that.otherPage.status.details = that.STATUS.UPDATE


        that.otherPage.PAGE = 'DETAILS'

      },

      view: function(row) {
        var that = this;
        that.otherPage.data.details.purchaseRequestId = row.id;

        that.otherPage.status.details = that.STATUS.READ


        that.otherPage.PAGE = 'DETAILS'
      },

      submit: function(row) {
        var that = this;
        var axios = that.axios;
        //purchaseRequestid

        axios({
          method: 'post',
          url: '/purchaseRequest/order/commit',
          data: {
            id: row.id,
            auditProcessId: row.auditProcessId
          },
          df: false
        }).then((response) => {
          that.initTableList()
          setTimeout(function() {

            var data = response.data;
            if (data.code == that.STATUS.SUCCESS) {
              that.$notify({
                title: '提交成功',
                message: '<div><span class="green">提交</span>采购清单成功!<br>单号:【' + row.code +
                  '】<br>审核编号</div>',
                type: 'success',
                duration: 5000,
                dangerouslyUseHTMLString: true
              });
            } else {
              that.notic(false,
                "提交",
                data.msg
              )
            }

          }, 300)


        }).catch((error) => {
          that.errorhanding(error)
        });
      },

      deleteFromList: function(row) {
        var that = this;
        var axios = that.axios;
        
        that.notics.confirm(that,'是否删除采购申请？',function(){
          //purchaseRequestid
          axios({
            method: 'post',
            url: '/purchaseRequest/order/delete',
            data: row,
            df: false,
            loading: true
          }).then((response) => {
            if(!response)
              return;
            that.initTableList()
            setTimeout(function() {
              var data = response.data;
              if (data.code == that.STATUS.SUCCESS) {
          
                that.deleteSuccess(true, '<div><span class="red">删除</span>采购清单成功!<br>单号:【' + row.code +
                  '】</div>')
          
              }else{
                that.deleteSuccess(false,data.msg)
              }
            }, 300)
          }).catch((error) => {
            that.errorhanding(error)
          });
        });
        

      },
      getRatio:function(ratio){
        return parseFloat(ratio*100).toFixed(2)
      }

    }
  }
</script>

<style scoped="scoped">
  .baseClass {}
</style>

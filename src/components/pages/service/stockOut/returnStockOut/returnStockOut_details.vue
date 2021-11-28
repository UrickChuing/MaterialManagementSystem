<template>
  <div>
    <div>
      <el-button type="primary" :plain="true" @click="$parent.otherPage.PAGE='INDEX'">返回</el-button>
      <el-button icon="el-icon-loading" class="blue" v-if="initData" type="warning" :plain="true"><span class="red">正在初始化，请稍等。。。</span></el-button>
    </div>
    <div class="input-line">
      <div class="input-block">
        <span>退货单号</span>
        <el-input value="自动生成" disabled v-if="operation == STATUS.ADD"></el-input>
        <el-input v-model="bean.code" disabled v-else></el-input>
      </div>

      <div class="input-block">
        <span>创建人</span>
        <el-input :value="userInfo.name" disabled v-if="operation == STATUS.ADD"></el-input>
        <el-input :value="bean.createUserName" disabled v-else></el-input>
      </div>

      <div class="input-block">
        <span>部门</span>
        <el-input :value="userInfo.organizationName" disabled v-if="operation == STATUS.ADD"></el-input>
        <el-input :value="bean.organizationName" disabled v-else></el-input>
      </div>

      <div class="input-block">
        <span>状态</span>
        <el-select v-model="bean.status" :placeholder="$t('quanbu')" disabled>
          <el-option v-for="(item,statusIndex) in options.status" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <br>

      <!--   <div class="input-block" v-if="operation == STATUS.ADD">
        <span>退货申请</span>
        <el-select v-model="bean.deliveryRequestId" title="请选择入库单" placeholder="请选择供应商">
          <el-option v-for="item in options.deliveryRequest" :key="item.id" :label="item.code" :value="item.id">
          </el-option>
        </el-select>
      </div> -->

      <div class="input-block" v-if="operation == STATUS.UPDATE">
        <span>退货申请</span>
        <el-input v-model="bean.deliveryRequestCode" disabled></el-input>
      </div>

      <div class="input-block">
        <span class="text-align-left">
          <el-button @click="openWarehouseVoucherPop" type="warning" size="mini" style="padding: 5px 5px;" :disabled="operation != STATUS.ADD">
            选择
          </el-button>
          <span class="font10">退货申请</span>
        </span>
        <el-input v-model="bean.deliveryRequestCode" disabled title="退货单" placeholder="退货单" disabled>
        </el-input>
      </div>


      <div class="input-block">
        <span>
          说明
        </span>
        <el-input v-model="bean.description" style="width: 535px" clearable :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input>
      </div>

      <br>

      <div class="input-block">
        <span>供应商</span>
        <el-input v-model="bean.supplierName" placeholder="请选择入库单" disabled></el-input>
      </div>

      <div class="input-block">
        <span>供应商代码</span>
        <el-input v-model="bean.supplierCode" disabled></el-input>
      </div>

      <div class="input-block">
        <span>供应商协议</span>
        <el-input v-model="bean.supplierAgreementName" disabled></el-input>
      </div>

      <br>

      <div class="input-block">
        <span>邮轮</span>
        <el-input v-model="bean.warehouseTypeName" disabled></el-input>
      </div>

      <div class="input-block">
        <span>航次</span>
        <el-input v-model="bean.warehouseTypeTaskName" disabled></el-input>
      </div>

      <div class="input-block">
        <span>审核选择</span>
        <!--        <el-select class="el-select-font12" v-model="bean.auditProcessId" title="请选择" :placeholder="$t('quanbu')" style="width: 155px;"
          clearable :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">
          <el-option v-for="item in options.auditProcess" :key="item.id" :label="item.name == ''? '未命名流程':item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button @click="initOptions" icon="el-icon-refresh" plain type="primary" circle :disabled="operation == STATUS.READ"></el-button> -->
        <el-button @click="inAdd = true ; inWhat = 'AP'" plain :disabled="operation == STATUS.READ">管理</el-button>
      </div>

      <br>

    </div>

    <div class="public-table-header">
      <div class="flexRow" v-if="bean.status != STATUS.UNCOMMIT">
        <el-button size="mini" type="warning" v-if="bean.status == STATUS.AUDIT">审核中</el-button>
        <el-button size="mini" type="warning" v-else>已通过审核</el-button>
        <span>最后提交人：{{bean.subUserName}} ( {{getCreateDateStr(new Date(bean.subTime))}} )</span>
      </div>

      <template v-if="bean.status == STATUS.UNCOMMIT">
        <el-button icon="" @click="add()" size="mini" type="success" v-if="operation == STATUS.ADD">保存</el-button>
        <el-button icon="" @click="update()" size="mini" type="success" v-if="operation == STATUS.UPDATE">保存</el-button>
      </template>

      <!-- <el-button @click="add(true)" icon="" size="mini" type="warning" v-if="operation == STATUS.ADD && bean.status == STATUS.UNCOMMIT">直接提交</el-button> -->
      <el-button @click="update(true)" icon="" size="mini" type="warning" v-if="operation == STATUS.UPDATE && bean.status == STATUS.UNCOMMIT">直接提交</el-button>

      <el-button @click="openAddPop" icon="el-icon-s-order" class="right" size="mini" type="success" v-if="bean.status == STATUS.UNCOMMIT  && operation != STATUS.READ">添加物品</el-button>

      <div class="upload-button-div pointer" @click="uploadClick" v-if="falsess">
        <i class="el-icon-upload"></i>
        <span :style="{padding:upload.fileName == null?'0px 20px':''}">
          {{upload.fileName == null? '没有文件...':upload.fileName}}
        </span>
        <button class="pointer">选择</button>
      </div>

      <input style="display: none;" id="excel" type="file" @change="excelChange" accept="application/vnd.ms-excel" />
      <el-button @click="excelToTable" icon="el-icon-plus" size="mini" type="primary" v-if="false">通过文件导入</el-button>

      <el-button @click="downloadExcelDemo" icon="el-icon-download" size="mini" type="primary" v-if="false">下载模板</el-button>

      <a id="excelHref" :href="excelHref" target="_blank" style="display: none;"></a>
    </div>

    <el-table :data="addItems" style="width: 100%" default-expand-all cell-class-name="public-table-cell" height="500">
      <el-table-column label="物品" prop="code" align="center" min-width="150">
        <template slot-scope="scope">
          <div class="font12">
            {{scope.row.materialCode}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="物品" prop="materialName" align="center" min-width="230">
        <template slot-scope="scope">
          <div class="font12 text-align-center">
            {{scope.row.materialName}}(<span class="green">{{scope.row.purchaseUnit}}</span>)<br>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="过期时间" prop="expiration" align="center" min-width="180">
      </el-table-column>
       <el-table-column label="规格" prop="purchaseSpecification" align="center" min-width="120">
      </el-table-column>
      <el-table-column label="单位" prop="purchaseUnit" align="center" min-width="100">
      </el-table-column>

      <el-table-column fixed="right" label="出库" prop="basisPrice" align="center" min-width="140">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.number" :min="1" style="width: 110px;" :step="1.0" controls-position="right"
            size="mini" :disabled="bean.warehouseTypeId=='' || bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input-number>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="仓库" prop="warehouseName" align="center" min-width="180">
        <template slot-scope="scope">
          {{scope.row.warehouseName}}<br>
          【<span class="blue">{{scope.row.warehouseTypeName}}</span>】
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" prop="
      plicationNo" align="center" width="120">
        <template slot-scope="scope">
          <el-button @click="itemSplice(scope.row)" size="mini" type="danger" icon="el-icon-s-release" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"
            circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 		<pop-bg ref="addItems">
			<add-item></add-item>
		</pop-bg> -->
    <el-dialog :custom-class="['dialog-card','self-card']" :visible.sync="inAdd" :append-to-body="true">
      <add-item slot @itemAppend="itemAppend" @itemSplice="itemSplice" v-if="inAdd && inWhat === 'ADD'"></add-item>
      <audit-process @set="setPorcess" :processId="bean.auditProcessId" :auditProcess="bean.auditProcess" :type="AuditType.value.DELIVERY_VOUCHER"
        v-if="inAdd && inWhat === 'AP'"></audit-process>
      <select-request @select="selectRequestFun" :id="bean.deliveryRequestId" v-if="inAdd && inWhat === 'SR'"></select-request>
    </el-dialog>
  </div>
</template>

<script>
  import addItem from './returnStockOut_details_add.vue';
  import auditProcess from '../../../../util/process/process.vue';
  import selectRequest from './returnStockOut_selectRequest.vue';

  export default {
    components: {
      addItem,
      auditProcess,
      selectRequest
    },
    data() {
      return {

        operation: this.$parent.otherPage.status.details,

        userInfo: JSON.parse(sessionStorage.userInfo),

        upload: {
          files: null,
          fileName: null
        },

        options: {
          // 入库单
          deliveryRequest: [],
          status: this.ORDER_STATUS,
          auditProcess: []
        },

        addItems: [],
        inAdd: false,
        inWhat: null,

        bean: {
          code: '',
          subUserName: '',
          organizationName: '',
          status: 0,
          deliveryRequestId: '',
          warehouseVoucherCode: '',
          warehouseTypeName: '',
          warehouseTypeTaskName: '',
          supplierName: '',
          supplierCode: '',
          supplierAgreementName: '',
          description: '',
          auditProcessId: '',
          auditProcess: null
        },

        history: {
          type: 1
        },

        // 正在初始化
        initData: false,

        authAPI: {
          isEdit: true
        }

      }
    },
    watch: {
      'bean.deliveryRequestId': {
        handler: function(newV) {
          if (this.options.deliveryRequest) {
            return
          }
          var that = this
          if (newV !== '' && that.operation != that.STATUS.READ) {
            var target
            for (var i in that.options.deliveryRequest) {
              var demo = that.options.deliveryRequest[i]
              if (demo.id === newV) {
                target = demo
                break
              }
            }

            that.bean.supplierName = target.supplierName
            that.bean.supplierCode = target.supplierCode
            that.bean.supplierAgreementName = target.supplierAgreementName
            that.bean.warehouseName = target.warehouseName
            that.bean.warehouseTypeName = target.warehouseTypeName
            that.bean.warehouseTypeTaskName = target.warehouseTypeTaskName
            that.bean.supplierName = target.supplierName
            that.bean.warehouseVoucherCode = target.warehouseVoucherCode
          }
        },
        deep: true
      }
    },
    activated: function() {
      var that = this
      that.initOptions()
      if (that.operation !== that.STATUS.ADD) {
        that.bean = {}
        that.initDeliveryVouchar()
      }
    },
    created: function() {
      var that = this

      if (that.operation !== that.STATUS.ADD) {
        that.initDeliveryVouchar()
      } else {
        that.initOptions()
      }
    },
    methods: {

      initDeliveryVouchar: function() {
        var that = this
        var axios = that.axios

        if (that.$parent.otherPage.data.details.id == '') {
          return
        }

        const init = function(that) {
          that.initData = true

          axios({
            method: 'post',
            url: '/delivery/voucher/return/bean',
            data: {
              id: that.$parent.otherPage.data.details.id
            }
          }).then((response) => {
            if (!response) {
              return
            }

            var data = response.data
            if (data.code === -304) {
              that.$parent.otherPage.PAGE = 'INDEX'
              that.initData = false
              throw data.msg
            }

            setTimeout(function() {
              var bean = data.data

              if (bean.status == that.STATUS.NOPASS) {
                bean.status = that.STATUS.UNCOMMIT
              }

              that.bean = bean

              var addItems = JSON.parse(JSON.stringify(data.data.list))
              that.addItems = addItems

              that.initData = false
            }, 300)
          }).catch((error) => {
            that.errorhanding(error)
          })
        }

        that.initOptions(init)
      },

      add: function() {
        var that = this

        if (!that.checkSaveAndUpdate()) {
          return
        }

        var axios = that.axios

        var addData = that.details

        var addItems = that.addItems

        var list = []
        for (var i in addItems) {
          list.push(addItems[i])
        }

        axios({
          method: 'post',
          url: '/delivery/voucher/return/add',
          data: {
            // 入库单Id
            deliveryRequestId: that.bean.deliveryRequestId,
            // 说明
            description: that.bean.description,
            // 采购类数量
            list: list,
            // 审核流程Id
            auditProcess: that.bean.auditProcess
          },
          df: false
        }).then((response) => {
          if (!response) {
            return
          }

          setTimeout(function() {
            var data = response.data

            if (data.code == that.STATUS.SUCCESS) {
              var msg = '<div>单号为:<span class="blue">' + data.data + '</span></div>'
              that.$parent.initTableList()
              that.$parent.otherPage.PAGE = 'INDEX'
            } else {
              msg = data.msg
            }

            that.addSuccess(data.code == that.STATUS.SUCCESS, msg)
          }, 300)
        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      update: function(commit) {
        var that = this

        if (!that.checkSaveAndUpdate()) {
          return
        }

        var axios = that.axios

        var addItems = that.addItems

        var list = []
        for (var i in addItems) {
          list.push(addItems[i])
        }

        axios({
          method: 'post',
          url: '/delivery/voucher/return/update',
          data: {
            id: that.bean.id,
            // 入库单Id
            deliveryRequestId: that.bean.deliveryRequestId,
            // 说明
            description: that.bean.description,
            // 采购类数量
            list: list,
            // 审核流程Id
            auditProcessId: that.bean.auditProcessId,
            // 是否直接提交
            commit: commit
          },
          df: false
        }).then((response) => {
          setTimeout(function() {
            var data = response.data

            if (data.code == that.STATUS.SUCCESS) {
              that.addItems = []
              that.bean.items = []
              that.updateSuccess(true, '修改成功<br>修改人:<span class="green">' + that.userInfo.name +
                '</span><br>修改时间:<span class="blue">' + that.getCreateDateStr(new Date()) + '</span>')
              that.initDeliveryVouchar()
              that.$parent.initTableList()
              if (commit) {
                that.$parent.otherPage.PAGE = 'INDEX'
              }
            } else {
              that.updateSuccess(false, data.msg)
            }
          }, 300)
        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      // 初始化options数据
      initOptions: function(callBack) {
        var that = this;

        if (callBack != undefined && callBack != null) {
          callBack(that)
        }

        return;

        var axios = that.axios

        that.initData = false

        axios({
          method: 'post',
          url: '/delivery/voucher/return/options',
          data: {}
        }).then((response) => {
          if (!response) {
            return
          }

          that.initData = false
          var data = response.data

          that.options.deliveryRequest = data.data.deliveryRequest
          // that.options.auditProcess = data.data.auditProcess;

          if (that.operation == that.STATUS.ADD && that.bean.deliveryRequestId == '' && data.data.deliveryRequest
            .length != 0) {
            that.bean.deliveryRequestId = data.data.deliveryRequest[0].id
          }

          // if (that.operation == that.STATUS.ADD && that.bean.auditProcessId == '' && data.data.auditProcess.length !=
          //   0) {
          //   that.bean.auditProcessId = data.data.auditProcess[0].id;
          // }

          if (callBack != undefined && callBack != null) {
            callBack(that)
          }
        })
      },

      checkSaveAndUpdate: function() {
        var that = this

        var pass = true

        if (that.bean.deliveryRequestId == '') {
          var msg = '请选择<span class="blue">退货申请</span>'
          pass = false
        }

        if (!pass) {
          that.$notify({
            title: '警告',
            type: 'warning',
            message: msg,
            duration: 3000,
            dangerouslyUseHTMLString: true
          })
        }

        return pass
      },

      uploadClick: function() {
        document.getElementById('excel').click()
      },
      excelChange: function() {
        var that = this

        let files = document.getElementById('excel').files
        let file = document.getElementById('excel').files[0]

        if (files == undefined) {
          return
        }

        that.upload.file = file
        that.upload.fileName = file.name
      },

      itemAppend: function(target) {
        var that = this
        var demoParsee = JSON.parse(JSON.stringify(target))

        var addItems = that.addItems

        var isHere = -1
        for (var index in addItems) {
          var demo = addItems[index]
          if (demo.id == demoParsee.id) {
            isHere = index
          }
        }

        target.number = target.remainNumber

        if (isHere == -1) {
          that.addItems.push(target)
        }
      },
      itemSplice: function(demo) {
        var that = this

        var addItems = that.addItems

        that.$confirm('您确定要删除吗？', '提示')
          .then(_ => {
            for (var index = 0; index < addItems.length; index++) {
              var itemDemo = addItems[index]
              if (demo.id == itemDemo.id) {
                that.addItems.splice(index, 1)
                break
              }
            }
          }).catch(_ => {});

      },

      openAddPop: function() {
        var that = this

        if (that.bean.deliveryRequestId === '') {
          that.$notify({
            title: '警告',
            type: 'warning',
            message: '请选择<span class="blue">退货申请</span>',
            duration: 3000,
            dangerouslyUseHTMLString: true
          })

          return
        }

        this.inAdd = true
        this.inWhat = 'ADD'
      },

      downloadExcelDemo: function() {
        var that = this
        var href = that.axios.defaults.baseURL + '/excel/excelCaiGouShenQingDang.xlsx'
        window.open(href)
      },

      setPorcess: function(process) {
        this.bean.auditProcess = process
      },

      openWarehouseVoucherPop: function() {
        var that = this

        that.inAdd = true
        that.inWhat = 'SR'
      },

      selectRequestFun: function(target) {
        console.log(target);
        this.bean.deliveryRequestId = target.id;
        this.bean.deliveryRequestCode = target.code;
      }

    }
  }
</script>

<style scoped="scoped">
  .table-in-table {
    height: 36px;
  }

  .table-in-table>div {
    height: 36px;
    line-height: 36px;
  }

  .table-input-number.disabled {
    background: rgba(245, 247, 250, 1);
  }

  .table-input-number:focus {
    border: 1px solid rgba(64, 158, 255, 1);
    background: white;
  }

  .table-input-number {
    padding: 0px 15px;
    border-radius: 5px;
    border: 1px solid #DCDFE6;
    width: 48px;
    height: 30px;
    transition: .2s;
    text-align: center;
    width: 39px;
  }

  .more-width {
    width: 600px !important;
  }

  .upload-button-div {
    border: solid 1px rgba(220, 220, 220, 1);
    background: white;
    height: 28px;
    line-height: 28px;
    margin-top: 5px;
    margin-bottom: 5px;
    padding: 0px 10px;
    border-radius: 5px;
  }

  .upload-button-div>span {
    border-radius: 3px;
    border: solid 1px rgba(220, 220, 220, 1);
    height: 20px;
    margin-top: 4px;
    margin-bottom: 4px;
    font-size: 12px;
    padding: 0px 10px;
    background: white;
  }

  .upload-button-div>button {
    font-size: 12px;
    background: rgba(64, 158, 255, 1);
    color: white;
    height: 20px;
    margin-top: 2px;
    margin-bottom: 2px;
    border-radius: 2px;
    padding: 0px 5px;
    margin-left: 5px;
  }

  .upload-button-div>button:hover {
    background: rgba(102, 177, 255, 1);
  }

  .upload-button-div:hover {
    background: rgba(220, 250, 255, 1);
  }
</style>

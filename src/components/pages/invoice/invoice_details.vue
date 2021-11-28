<template>

  <div>
    <div>
      <el-button type="primary" :plain="true" @click="$parent.otherPage.PAGE='INDEX'">返回</el-button>
      <el-button icon="el-icon-loading" class="blue" v-if="initData" type="warning" :plain="true"><span class="red">正在初始化，请稍等。。。</span></el-button>
    </div>


    <div class="input-line">

      <div class="input-block">
        <span>类型</span>
        <el-select v-model="bean.type" :placeholder="$t('quanbu')" :disabled="operation == STATUS.READ">
          <el-option v-for="item in options.type" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>发票类型</span>
        <el-select v-model="bean.category" :placeholder="$t('quanbu')" :disabled="operation == STATUS.READ">
          <el-option v-for="item in options.category" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
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

      <div class="input-block">
        <el-button @click="openWarehouseVoucher" type="primary" :disabled="operation == STATUS.READ">选择入库单</el-button>
      </div>

      <div class="input-block">
        <span>
          说明
        </span>
        <el-input v-model="bean.description" style="width: 535px" clearable :disabled="operation == STATUS.READ"></el-input>
      </div>

      <br>

      <div class="input-block">
        <span>发票号</span>
        <el-input v-model="bean.code" :disabled="operation == STATUS.READ"></el-input>
      </div>

      <div class="input-block">
        <span>
          开票日期
        </span>
        <el-date-picker v-model="bean.makeTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 200px;"
          :disabled="operation == STATUS.READ">
        </el-date-picker>
      </div>

      <div class="input-block">
        <span>
          代垫单位
        </span>
        <el-input v-model="bean.payer" clearable :disabled="operation == STATUS.READ"></el-input>
      </div>

      <div class="input-block" v-if="bean.type == 2 || bean.type == -2">
        <span>
          承运方
        </span>
        <el-input v-model="bean.carrier" clearable :disabled="operation == STATUS.READ"></el-input>
      </div>

      <br>

      <div class="input-block">
        <span>
          <el-button @click="sysn('RATE')" type="warning" size="mini" style="padding: 5px 5px;margin-right: 10px;"
            :disabled="operation == STATUS.READ">同步</el-button>税率
        </span>
        <el-input-number v-model="bean.taxRate" controls-position="right" :step="0.01" :min="0" :max="100" style="width: 110px;"
          step-strictly :disabled="operation == STATUS.READ"></el-input-number>
        <span class="font12">(单位百分比<span class="red"> % </span>)</span>
      </div>

      <div class="input-block">
        <span>审批</span>
        <!-- <el-select class="el-select-font12" v-model="bean.auditProcessId" title="请选择" :placeholder="$t('quanbu')" style="width: 155px;"
          clearable :disabled="operation == STATUS.READ">
          <el-option v-for="item in options.auditProcess" :key="item.id" :label="item.name == ''? '未命名流程':item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button @click="initOptions" icon="el-icon-refresh" plain type="primary" circle :disabled="bean.status == STATUS.UNCOMMIT"></el-button> -->
        <el-button @click="inAdd = true ; inWhat = 'AP'" plain :disabled="operation == STATUS.READ">管理</el-button>
      </div>



      <br>

      <div class="input-block">
        <span>
          备注
        </span>
        <el-input v-model="bean.remark" style="width: 535px" clearable :disabled="operation == STATUS.READ"></el-input>
      </div>

    </div>

    <div class="public-table-header">
      <el-button size="mini" type="warning" v-if="bean.status == STATUS.AUDIT" key>审核中</el-button>
      <el-button size="mini" @click.stop="" type="success" v-if="bean.status == STATUS.PASS" key>已通过审核</el-button>



      <el-button icon="" @click="add()" size="mini" type="success" v-if="operation == STATUS.ADD">保存</el-button>
      <el-button icon="" @click="update()" size="mini" type="success" v-if="operation == STATUS.UPDATE">保存</el-button>

      <!-- <el-button @click="add(true)" icon="" size="mini" type="warning" v-if="operation == STATUS.ADD && bean.status == STATUS.UNCOMMIT">直接提交</el-button> -->
      <el-button @click="update(true)" icon="" size="mini" type="warning" v-if="operation == STATUS.UPDATE && bean.status == STATUS.UNCOMMIT">直接提交</el-button>

      <div class="upload-button-div pointer" @click="openFiles" v-if="false">
        <i class="el-icon-upload"></i>
        <span>
          {{uploadFiles.length == 0? '暂无附件...':uploadFiles.length}}
        </span>
        <button class="pointer">选择</button>
      </div>

      <el-button @click="openFiles" type="primary" size="mini" v-if="operation != STATUS.ADD" key>文件管理</el-button>

      <!-- <el-button @click="createRow" icon="el-icon-s-order" class="right" size="mini" type="success" v-if="operation != STATUS.READ">添加项目</el-button> -->
      <el-button @click="createRow" icon="el-icon-s-order" class="right" size="mini" type="success" v-if="bean.status == STATUS.UNCOMMIT && operation != STATUS.READ">添加项目</el-button>
      <el-button @click="excelToTable" icon="el-icon-plus" size="mini" type="primary" v-if="false">通过文件导入</el-button>

      <el-button @click="downloadExcelDemo" icon="el-icon-download" size="mini" type="primary" v-if="false">下载模板</el-button>

      <a id="excelHref" :href="excelHref" target="_blank" style="display: none;"></a>
    </div>
                      <!-- bean.list -->
    <el-table :data="bean.list" style="width: 100%" default-expand-all cell-class-name="public-table-cell cell-no-padding"
      height="500">
      <el-table-column label="项目名称" align="center" min-width="300">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" size="mini" placeholder="请填写项目名称" :disabled="operation == STATUS.READ"
            clearable></el-input>
        </template>
      </el-table-column>

      <el-table-column label="规格" prop="specification" align="center" min-width="150">
        <template slot-scope="scope">
          <span class="font12">
            <el-input v-model="scope.row.specification" size="mini" style="width: 100%;" :disabled="operation == STATUS.READ"></el-input>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="单位" prop="unit" align="center" min-width="100">
        <template slot-scope="scope">
          <span class="font12">
            <el-input v-model="scope.row.unit" size="mini" style="width: 100%;" :disabled="operation == STATUS.READ"></el-input>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="数量" prop="materialBarCode" align="center" min-width="110">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.number" @change="numberChange(scope.row)" :controls="false" size="mini"
            style="width: 100%;" :max="99999999" :disabled="operation == STATUS.READ"></el-input-number>
        </template>
      </el-table-column>

      <el-table-column label="单价" align="center" min-width="150">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.price" :min="0.00000" :max="9999999.99999" @change="priceChange(scope.row)"
            style="width: 100%;" :precision="5" :step="10.0" :controls="false" size="mini" :disabled="operation == STATUS.READ"></el-input-number>
        </template>
      </el-table-column>

      <!--      <el-table-column label="含税单价" prop="basisPrice" align="center" min-width="150">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.taxPrice" :min="0.00000" :max="9999999.99999" style="width: 130px;" :precision="5" :step="10.0"
            :controls="false" size="mini" :disabled="bean.status == STATUS.UNCOMMIT"></el-input-number>
        </template>
      </el-table-column> -->

      <el-table-column label="金额" prop="basisPrice" align="center" min-width="150">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.amount" :min="0.00000" :max="9999999.99999" style="width: 100%;"
            :precision="5" :step="10.0" :controls="false" size="mini" :disabled="operation == STATUS.READ"></el-input-number>
        </template>
      </el-table-column>

      <el-table-column label="税率(%)" prop="basisPrice" align="center" min-width="150">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.taxRate" :min="0.00" style="width: 100%;" :precision="2" :step="1"
            @change="taxRateChange(scope.row)" controls-position="right" size="mini" :disabled="bean.warehouseTypeId=='' || operation == STATUS.READ"></el-input-number>
        </template>
      </el-table-column>

      <el-table-column label="税额" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.taxAmount" :min="0.00000" :max="9999999.99999" style="width: 130px;"
            :precision="5" :step="10.0" :controls="false" size="mini" :disabled="operation == STATUS.READ"></el-input-number>
        </template>
      </el-table-column>


      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="120">
        <template slot-scope="scope">
          <el-button @click="targetRemove(scope.$index)" size="mini" type="danger" icon="el-icon-s-release" :disabled="operation == STATUS.READ || bean.status != STATUS.UNCOMMIT"
            circle></el-button>
         <!-- <el-button @click="itemSplice(scope.row)" size="mini" type="danger" icon="el-icon-s-release" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"
            circle></el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 		<pop-bg ref="addItems">
			<add-item></add-item>
		</pop-bg> -->
    <el-dialog :custom-class="['dialog-card','self-card',inWhat == 'IF'? 'medium':'']" :visible.sync="inAdd"
      :append-to-body="true">
      <add-item slot @itemAppend="itemAppend" @itemSplice="itemSplice" v-if="inAdd && inWhat == 'AI'"></add-item>
      <select-warehouse-voucer slot @select="selectWarehouseVoucher" @deSelect="deSelectWarehouseVoucher"
        :warehouseVoucher="bean.warehouseVoucher" v-if="inAdd && inWhat == 'WV'"></select-warehouse-voucer>
      <invoice-files :invoiceId="bean.id" v-if="inAdd && inWhat == 'IF'"></invoice-files>
      <audit-process @set="setPorcess" :processId="bean.auditProcessId" :auditProcess="bean.auditProcess" :type="auditType"
        v-if="inAdd && inWhat === 'AP'"></audit-process>
    </el-dialog>
  </div>
</template>

<script>
  import addItem from './invoice_details_add.vue';
  import selectWarehouseVoucer from './invoice_details_selectWarehouseVoucher.vue';
  import invoiceFiles from './invoice_files.vue';
  import auditProcess from '../../util/process/process.vue';

  export default {
    components: {
      addItem,
      selectWarehouseVoucer,
      invoiceFiles,
      auditProcess
    },
    data() {

      return {

        operation: this.$parent.otherPage.status,

        userInfo: JSON.parse(sessionStorage.userInfo),

        uploadFiles: [],

        options: {
          type: this.InvoiceType.type,
          category: this.InvoiceType.category,
          status: this.ORDER_STATUS,
          auditProcess: []
        },
       /* bean.list:[], */
        inAdd: false,
        inWhat: null,

        bean: {
          type: 1, //发票类型
          category: 1, //发票类别
          createUserName: "", //创建人
          organizationName: "", //创建人所属部门
          status: 0, //状态
          code: "", //发票代码/发票号
          makeTime: "", //开票日期
          taxRate: 13, //税率
          payer: "", //付款方/代垫单位
          carrier: "", //承运方/承运人/运输单位
          warehouseVoucher: [], //入库单号
          description: "", //描述
          remark: "", //备注
          auditProcessId: '', //审核流程
          list: []
        },

        warehouseVoucher: [],

        auditType: this.AuditType.value.INVOICE_PURCHASE,

        history: {
          type: 1,
          purchaseOrderId: 1
        },

        //正在初始化
        initData: true,

        authAPI: {
          isEdit: true
        },

      }
    },
    watch: {
      inAdd: function(newV) {
        if (!newV)
          this.inWhat = null;
      },
      'bean.type': {
        handler: function(newV) {
          // this.initOptions();

          switch (newV) {
            case 1:
              this.auditType = this.AuditType.value.INVOICE_PURCHASE;
              break;
            case 2:
              this.auditType = this.AuditType.value.INVOICE_FREIGHT;
              break;
            case -1:
              this.auditType = this.AuditType.value.INVOICE_RED_PURCHASE;
              break;
            case -2:
              this.auditType = this.AuditType.value.INVOICE_RED_FREIGHT;
              break;
          }

          if (this.bean.auditProcessId != '' && this.bean.auditProcessId != undefined) {
            that.updateProcessType();
          }

        }
      }
    },
    created: function() {
      var that = this;
      if (that.operation !== that.STATUS.ADD) {
        that.initWarehouseVouchar();
      } else {
        that.initOptions();
      }
    },
    methods: {

      initWarehouseVouchar: function() {


        var that = this;
        var axios = that.axios;

        if (that.$parent.otherPage.data.details.id == '') {
          return
        }

        const init = function(that) {
          that.initData = true;

          axios({
            method: 'post',
            url: '/invoice/bean',
            data: {
              id: that.$parent.otherPage.data.details.id
            }
          }).then((response) => {
            if (!response) {
              return
            }

            var data = response.data;
            if (data.code === -304) {
              that.$parent.otherPage.PAGE = 'INDEX';
              that.initData = false;
              throw data.msg;
            }

            setTimeout(function() {
              var bean = data.data;

              that.bean = bean;
              if (that.operation == that.STATUS.UPDATE || that.operation == that.STATUS.FINISH) {
                that.uploadFiles = bean.files;
              }


              that.initData = false;
            }, 300)


          }).catch((error) => {
            that.errorhanding(error)
          });
        }

        that.initOptions(init);
      },

      add: function(commit) {
        if (!this.checkWay())
          return;

        var that = this;
        var axios = that.axios;

        var warehouseVoucher = [];
        for (var i in that.bean.warehouseVoucher) {
          var demo = that.bean.warehouseVoucher[i];
          warehouseVoucher.push(demo.id);
        }

        axios({
          method: 'post',
          url: '/invoice/add',
          data: {
            type: that.bean.type, //发票类型
            category: that.bean.category, //发票类别
            createUserName: that.bean.createUserName, //创建人
            organizationName: that.bean.organizationName, //创建人所属部门
            code: that.bean.code, //发票代码/发票号
            makeTime: that.bean.makeTime, //开票日期
            taxRate: that.bean.taxRate, //税率
            payer: that.bean.payer, //付款方/代垫单位
            carrier: that.bean.carrier, //承运方/承运人/运输单位
            warehouseVoucher: warehouseVoucher, //入库单号
            description: that.bean.description, //描述
            remark: that.bean.remark, //备注
            auditProcess: that.bean.auditProcess, //审核流程
            list: that.bean.list, //信息
            files: that.uploadFiles //图片base64
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }

          setTimeout(function() {
            var data = response.data;

            var msg = '';
            if (data.code == that.STATUS.SUCCESS) {
              that.$parent.initTableList()
              that.$parent.otherPage.PAGE = 'INDEX'
            } else {
              msg = data.msg;
            }

            that.addSuccess(data.code == that.STATUS.SUCCESS, msg);

          }, 300)


        }).catch((error) => {
          that.errorhanding(error)
        });


      },

      update: function(commit) {
        if (!this.checkWay())
          return;

        var that = this;
        var axios = that.axios;
        var warehouseVoucher = [];
        for (var i in that.bean.warehouseVoucher) {
          var demo = that.bean.warehouseVoucher[i];
          warehouseVoucher.push(demo.id);
        }

        axios({
          method: 'post',
          url: '/invoice/update',
          data: {
            id: that.bean.id,
            type: that.bean.type, //发票类型
            category: that.bean.category, //发票类别
            createUserName: that.bean.createUserName, //创建人
            organizationName: that.bean.organizationName, //创建人所属部门
            code: that.bean.code, //发票代码/发票号
            makeTime: that.bean.makeTime, //开票日期
            taxRate: that.bean.taxRate, //税率
            payer: that.bean.payer, //付款方/代垫单位
            carrier: that.bean.carrier, //承运方/承运人/运输单位
            warehouseVoucher: warehouseVoucher, //入库单号
            description: that.bean.description, //描述
            remark: that.bean.remark, //备注
            auditProcessId: that.bean.auditProcessId, //审核流程
            list: that.bean.list, //信息
          },
          df: false
        }).then((response) => {

          setTimeout(function() {
            var data = response.data;

            if (data.code == that.STATUS.SUCCESS) {
              that.addItems = [];
              that.bean.items = [];
              that.updateSuccess(true, '修改成功<br>修改人:<span class="green">' + that.userInfo.name +
                '</span><br>修改时间:<span class="blue">' + that.getCreateDateStr(new Date()) + '</span>')
              that.initWarehouseVouchar();
              that.$parent.initTableList()
            } else {
              that.updateSuccess(false, data.msg)
            }

          }, 300)


        }).catch((error) => {
          that.errorhanding(error)
        });
      },

      updateProcessType: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/invoice/update/process/type',
          data: {
            id: that.bean.auditProcessId,
            type: that.auditType
          },
          df: false
        }).then((response) => {
          if (!response)
            return;

          var data = response.data;
          if (data.code === that.STATUS.SUCCESS) {

            that.updateSuccess(true)
          } else {
            that.updateSuccess(false, data.msg)
          }
        }).catch((error) => {
          that.errorhanding(error)
        });

      },

      //初始化options数据
      initOptions: function(callBack) {
        var that = this;

        that.initData = false;

        if (callBack != undefined && callBack != null) {
          callBack(that);
        }

        return;

        var axios = that.axios;

        axios({
          method: 'post',
          url: '/invoice/option',
          data: {
            invoiceType: that.bean.type
          }
        }).then((response) => {
          if (!response) {
            return
          }

          that.initData = false;
          var data = response.data;

          that.options.auditProcess = data.data.auditProcess;
          that.bean.auditProcessId = data.data.auditProcess.length != 0 ? data.data.auditProcess[0].id : '';

          if (callBack != undefined && callBack != null) {
            callBack(that);
          }

        });
      },
      //仓库
      initOptionsAgreement: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/stock/in/options/agreement',
          data: {
            id: that.bean.supplierId
          }
        }).then((response) => {

          if (!response) {
            return
          }

          var data = response.data;

          var list = data.data;

          var supplierAgreementId = that.bean.supplierAgreementId + 0;
          that.bean.supplierAgreementId = '';

          for (var i in list) {
            var demo = list[i];
            if (demo.id == supplierAgreementId) {
              that.bean.supplierAgreementId = supplierAgreementId;
            }
          }

          that.options.supplierAgreement = data.data;

        });
      },
      initOptionsRoute: function(taskId) {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/stock/in/options/route',
          data: {
            reason: {
              warehouseTypeId: that.bean.warehouseTypeId
            }
          },
          df: false
        }).then((response) => {

          if (!response) {
            return
          }

          var data = response.data;

          var list = data.data;

          var task;
          for (var index in list) {
            var demo = list[index];
            if (taskId == demo.id) {
              task = taskId;
              break;
            } else {
              task = '';
            }
          }

          that.bean.taskId = task;
          that.options.routes = list;

        });
      },
     /* temAppend: function(target) {
        var that = this;
        var demoParsee = JSON.parse(JSON.stringify(target));

        var addItems = that.bean.list;

        //是否在这
        var isHere = -1;
        for (var index in addItems) {
          var demo = addItems[index];
          if (demo.stockInId == demoParsee.stockInId) {
            isHere = index;
          }
        }

        // target.number = target.remainNumberIn;

        if (isHere == -1)
          that.addItems.push(target)
      }, */

     targetRemove: function(index) {
      
        this.bean.list.splice(index, 1)
        
      },
      /* itemSplice: function(demo) {

        var that = this;

        var addItems = that.bean.list;

        that.$confirm('您确定要删除吗？', '提示')
          .then(_ => {
            for (var index = 0; index < addItems.length; index++) {
              var itemDemo = addItems[index];
              if (demo.id == itemDemo.id) {
                that.addItems.splice(index, 1);
                break;
              }
            }
          }).catch(_ => {});

      }, */

      uploadClick: function() {
        document.getElementById('excel').click();
      },


      checkWay: function() {
        var that = this;
        var msg = '';

        if (that.bean.purchaseOrderId == '') {

          msg = '请选择<span class="blue">采购订单</span>';

        }

        if (msg != '') {
          that.$notify({
            title: '警告',
            type: 'warning',
            message: msg,
            duration: 700,
            dangerouslyUseHTMLString: true
          });
          return false;
        } else {
          return true;
        }

      },

      selectWarehouseVoucher: function(target) {
        var that = this;

        var axios = that.axios;

        var warehouseVoucher = that.bean.warehouseVoucher;

        var isHere = false;
        for (var index in warehouseVoucher) {
          var demo = warehouseVoucher[index];

          if (demo.id == target.id) {
            isHere = true;
          }

        }

        if (!isHere) {
          that.warehouseVoucher.push(target);
          that.bean.description = that.bean.description + target.code + ";";
          that.bean.warehouseVoucher.push(target)
        } else {
          return;
        }

        if (that.bean.type == 2 || that.bean.type == -2) {
          return;
        }

        axios({
          method: 'post',
          url: '/invoice/option/warehouse/voucher/material',
          data: {
            id: target.id
          }
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;

          if (data.code === that.STATUS.SUCCESS) {
            var list = data.data;
            for (var index in list) {
              var demo = list[index];
              var beanList = that.bean.list;
              var isHere = false;
              for (var i in beanList) {
                var model = beanList[i];
                if (demo.id == model.id) {
                  isHere = true;
                }
              }
              if (!isHere) {
                demo.price = that.siglePirce(demo);
                demo.amount = that.totalPrice(demo);
                demo.taxAmount = that.taxAmount(demo);
                demo.totalAmount = that.FloatOb.add(demo.amount, demo.taxAmount);

                that.bean.list.push(demo);
              }
            }
          } else {
            throw data.msg;
          }

        }).catch((error) => {
          that.errorhanding(error)
        });

      },

      deSelectWarehouseVoucher: function(target) {
        var that = this;

        that.bean.description = that.bean.description.replace(target.code + ";", "");
        for (var index = 0; index < that.bean.warehouseVoucher.length; index++) {
          var demo = that.bean.warehouseVoucher[index];
          if (target.id == demo.id) {
            that.bean.warehouseVoucher.splice(index, 1);
            that.warehouseVoucher.splice(index, 1);
            index--;
          }
        }

      },

      clearList: function() {
        this.bean.list = [];
      },

      createRow: function() {
        this.bean.list.push({
          materialId: 0,
          name: '',
          specification: '',
          unit: '',
          number: 0,
          taxRate: this.bean.taxRate,
          price: 0,
          taxPrice: 0,
          amount: 0,
          taxAmount: 0,
          totalAmount: 0
        })
      },


      openAddPop: function() {
        if (!this.checkWay())
          return;

        this.inAdd = true;
        this.inWhat = 'AI';
      },

      openWarehouseVoucher: function() {
        this.inAdd = true;
        this.inWhat = 'WV';
      },

      openFiles: function() {
        this.inAdd = true;
        this.inWhat = 'IF';
      },

      downloadExcelDemo: function() {
        var that = this;
        var href = that.axios.defaults.baseURL + '/excel/excelCaiGouShenQingDang.xlsx';
        window.open(href);
      },


      numberChange: function(row) {
        var that = this;
        row.amount = that.FloatOb.multiply(row.number, row.price);
        row.taxAmount = that.FloatOb.multiply(row.amount, that.FloatOb.divide(row.taxRate, 100));
        row.totalAmount = that.FloatOb.add(row.amount, row.taxAmount);
      },

      priceChange: function(row) {
        var that = this;
        row.amount = that.FloatOb.multiply(row.number, row.price);
        row.taxAmount = that.FloatOb.multiply(row.amount, that.FloatOb.divide(row.taxRate, 100));
        row.taxPrice = that.FloatOb.multiply(row.price, that.FloatOb.divide(row.taxRate, 100) + 1);
        row.totalAmount = that.FloatOb.add(row.amount, row.taxAmount);
      },

      taxRateChange: function(row) {
        var that = this;
        row.taxAmount = that.FloatOb.multiply(row.amount, that.FloatOb.divide(row.taxRate, 100));
        row.taxPrice = that.FloatOb.multiply(row.price, that.FloatOb.divide(row.taxRate, 100) + 1);
        row.totalAmount = that.FloatOb.add(row.amount, row.taxAmount);
      },

      //单价不含税
      siglePirce: function(row) {
        var that = this;

        var taxRate = that.FloatOb.divide(row.taxRate, 100) + 1;

        var ratePrice = that.FloatOb.divide(row.taxPrice, taxRate) + "";

        return that.FloatOb.round(5, ratePrice);
      },

      //含税总价
      totalPrice: function(row) {
        var that = this;

        return that.FloatOb.round(5, that.FloatOb.multiply(row.number, row.price));
      },


      //税额
      taxAmount: function(row) {

        var rate = this.FloatOb.multiply(row.amount, this.FloatOb.divide(row.taxRate, 100));

        return this.FloatOb.round(5, rate);
      },

      purchaseOrderIdChange: function(newV) {
        var that = this;
        that.$confirm('更改采购类型，将会清空采购单中的所有物品，是否更改？', '提示')
          .then(_ => {

            that.history.purchaseOrderId = newV;
            if (that.bean.status === that.STATUS.UNCOMMIT) {
              that.addItems = [];
              that.bean.items = [];
            }

          })
          .catch(_ => {
            that.bean.purchaseOrderId = that.history.purchaseOrderId;
          });
      },

      sysn: function(type) {
        var that = this;

        var list = that.bean.list;
        if (type == 'RATE') {
          var target = that.bean.taxRate;
          for (var i in list) {
            that.bean.list[i].taxRate = target;
            that.taxRateChange(list[i]);
          }
        }
      },

      setPorcess: function(process) {
        this.bean.auditProcess = process;
      }

    }
  }
</script>

<style scoped="scoped">
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

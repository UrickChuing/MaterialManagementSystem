<template>
  <div>
    <div>
      <el-button type="primary" :plain="true" @click="$parent.otherPage.PAGE='INDEX'">返回</el-button>
      <el-button icon="el-icon-loading" class="blue" v-if="initData" type="warning" :plain="true"><span class="red">正在初始化，请稍等。。。</span></el-button>
    </div>
    <div class="input-line">
      <div class="input-block">
        <span>归还单号</span>
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

      <!--      <div class="input-block">
        <span>邮轮</span>
        <el-select v-model="bean.warehouseTypeId" :placeholder="$t('quanbu')" :disabled="bean.status != STATUS.UNCOMMIT"
          clearable>
          <el-option v-for="item in options.cruise" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>航次</span>
        <el-select v-model="bean.warehouseTypeTaskId" title="请选择邮轮" :placeholder="bean.warehouseTypeId==''? '请选择邮轮':$t('quanbu')"
          clearable :disabled="bean.warehouseTypeId=='' || bean.status != STATUS.UNCOMMIT">
          <el-option style="height: 50px;" v-for="item in options.routes" :key="item.id" :label="item.taskName" :value="item.id">
            <div style="line-height: 25px;">
              <span>{{item.taskName}}</span> <br>
              <span class="font6"><span class="blue">{{item.startTime}}</span><span class="red">~~</span><span class="blue">{{item.endTime}}</span></span>
            </div>
          </el-option>
        </el-select>
      </div> -->



      <div class="input-block">
        <span>
          <el-button @click="sysn('WAREHOUSE')" type="warning" size="mini" style="padding: 5px 5px;margin-right: 10px;"
            :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">同步</el-button>仓库
        </span>
        <el-select v-model="bean.warehouseId" title="仓库" placeholder="仓库" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">
          <el-option v-for="item in options.warehouse" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span class="text-align-left">
          <el-button @click="openDeliveryVoucher" type="warning" size="mini" style="padding: 5px 5px;" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">
            选择
          </el-button>
          <span class="font10">领料单</span>
        </span>
        <el-input v-model="bean.deliveryVoucherCode" disabled title="领料单" placeholder="领料单" disabled>
        </el-input>
      </div>

      <br>
      <div class="input-block">
        <span>审批</span>
        <!-- <template v-if="operation != STATUS.READ">
          <el-select class="el-select-font12" v-model="bean.auditProcessId" title="请选择" style="width: 155px;"
            :placeholder="$t('quanbu')" clearable :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">
            <el-option v-for="item in options.auditProcess" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-button @click="initOptions()" icon="el-icon-refresh" plain type="primary" circle :disabled="operation == STATUS.READ"></el-button>
        </template>
        <template v-else>
          <el-input v-model="bean.auditProcessName" disabled></el-input>
        </template> -->
        <el-button @click="inAdd = true ; inWhat = 'AP'" plain :disabled="operation == STATUS.READ">管理</el-button>
      </div>

      <div class="input-block">
        <span>
          说明
        </span>
        <el-input v-model="bean.description" style="width: 535px" clearable :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input>
      </div>

    </div>

    <div class="public-table-header">
      <div class="flexRow" v-if="bean.status != STATUS.UNCOMMIT">
        <el-button size="mini" type="warning" v-if="bean.status == STATUS.AUDIT" key>审核中</el-button>
        <el-button size="mini" type="warning" v-else-if="bean.status == STATUS.PASS" key>已通过审核</el-button>
        <span>最后提交人：{{bean.subUserName}} ( {{getCreateDateStr(new Date(bean.subTime))}} )</span>
      </div>

      <template v-if="bean.status == STATUS.UNCOMMIT">
        <el-button icon="" @click="add()" size="mini" type="success" v-if="operation == STATUS.ADD && bean.status == STATUS.UNCOMMIT">保存</el-button>
        <el-button icon="" @click="update()" size="mini" type="success" v-if="operation == STATUS.UPDATE && bean.status == STATUS.UNCOMMIT">保存</el-button>
      </template>

      <!-- <el-button @click="add(true)" icon="" size="mini" type="warning" v-if="operation == STATUS.ADD && bean.status == STATUS.UNCOMMIT">直接提交</el-button> -->
      <el-button @click="update(true)" icon="" size="mini" type="warning" v-if="operation == STATUS.UPDATE && bean.status == STATUS.UNCOMMIT">直接提交</el-button>


      <el-button @click="openAddPop" icon="el-icon-s-order" class="right" size="mini" type="success" v-if="bean.status == STATUS.UNCOMMIT && operation != STATUS.READ">添加物品</el-button>

    </div>

    <el-table :data="addItems" style="width: 100%" default-expand-all cell-class-name="public-table-cell" height="500">
      <el-table-column label="代码" prop="code" align="center" min-width="150">
        <template slot-scope="scope">
          <div class="font12">
            {{scope.row.materialCode}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="物品" prop="materialName" align="center" min-width="200">
        <template slot-scope="scope">
          <div class="font12">
            {{scope.row.materialName}}<br>(<span class="green">{{scope.row.purchaseUnit == undefined || scope.row.purchaseUnit == ''? '无单位':scope.row.purchaseUnit}}</span>)<br>
            <span style="white-space: nowrap;">
              【<span class="blue text-ellipsls">{{scope.row.categoryName == undefined? '未选择类型':scope.row.categoryName}}</span>】
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="条形码" prop="materialBarCode" align="center" min-width="180">
      </el-table-column>
	  <el-table-column label="规格" prop="purchaseSpecification" align="center" min-width="120">
	  </el-table-column>
      <el-table-column label="品牌" prop="brandName" align="center" min-width="100">
      </el-table-column>

      <el-table-column fixed="right" label="归还数量" prop="basisPrice" align="center" min-width="140">
        <template slot-scope="scope">
          <!-- {{scope.row.number}} -->
          <el-input-number v-model="scope.row.number" :min="1" style="width: 110px;" :step="1.0" controls-position="right"
            size="mini" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input-number>
        </template>
      </el-table-column>


      <el-table-column fixed="right" label="过期时间" prop="basisPrice" align="center" min-width="180">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.expiration" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 150px;"
            size="mini" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ" disabled>
          </el-date-picker>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="仓库" align="center" min-width="180">
        <template slot-scope="scope">
          <el-select v-model="scope.row.warehouseId" title="仓库" placeholder="仓库" size="mini" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">
            <el-option v-for="item in options.warehouse" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>


      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="120">
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
      <add-item slot @itemAppend="itemAppend" @itemSplice="itemSplice" v-if="inAdd && inWhat == 'AI'"></add-item>
      <delivery-voucher slot @deliveryVoucher="selectDeliveryVoucher" :targetId="bean.deliveryVoucherId" v-if="inAdd && inWhat == 'DV'"></delivery-voucher>
      <audit-process @set="setPorcess" :processId="bean.auditProcessId" :auditProcess="bean.auditProcess" :type="AuditType.value.RECIVEING_MATERIAL_RETURN"
        v-if="inAdd && inWhat === 'AP'"></audit-process>
    </el-dialog>
  </div>
</template>

<script>
  import addItem from './getUsingBack_details_add.vue';
  import deliveryVoucher from './getUsingBack_getUsingt.vue';
  import auditProcess from '../../../../util/process/process.vue';

  export default {
    components: {
      addItem,
      deliveryVoucher,
      auditProcess
    },
    data() {

      return {

        operation: this.$parent.otherPage.status,

        userInfo: JSON.parse(sessionStorage.userInfo),

        upload: {
          files: null,
          fileName: null
        },



        options: {
          status: this.ORDER_STATUS,
          //采购类型
          cruise: [],
          routes: [],
          purchaseOrder: [],
          auditProcess: [],
          warehouse: []
        },

        addItems: [],
        inAdd: false,
        inWhat: null,


        bean: {
          code: "",
          description: "",
          deliveryVoucherId: '',
          deliveryVoucherCode: '',
          status: 0,
          supplierAgreementCode: "",
          supplierAgreementId: "",
          supplierCode: "",
          supplierId: "",
          taxRate: 13,
          warehouseId: '',
          warehouseTypeId: '',
          warehouseTypeTaskId: '',
          purchaseOrderId: '',
          auditProcessId: ''
        },

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
      'bean.deliveryVoucherId': {
        handler: function(newV, oldV) {
          if (oldV != '' && this.addItems.length != 0 && oldV != newV && this.operation != this.STATUS.READ) {
            this.addItems = [];
          }
        },
        deep: true
      }
    },
    activated: function() {
      var that = this;
      that.initOptions();
      if (that.operation !== that.STATUS.ADD) {
        that.bean = {};
        that.initWarehouseVouchar();
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
            url: '/stock/in/getBack/bean',
            data: {
              id: that.$parent.otherPage.data.details.id
            }
          }).then((response) => {
            if (!response) {
              return
            }

            var data = response.data;
            if (data.code === -304) {
              that.initData = false;
              throw data.msg;
            }

            setTimeout(function() {

              var bean = data.data;
              bean.taxRate = 0;
              bean.warehouseId = that.options.warehouse[0] == undefined ? '' : that.options.warehouse[0].id;

              if (bean.status == that.STATUS.NOPASS)
                bean.status = that.STATUS.UNCOMMIT;

              that.bean = bean;
              that.history.type = that.bean.type;
              that.history.mode = that.bean.mode;

              var addItems = JSON.parse(JSON.stringify(data.data.list))
              that.addItems = addItems;


              that.initData = false;
            }, 300)


          }).catch((error) => {
            that.errorhanding(error)
          });
        }

        that.initOptions(init);
      },

      add: function(commit) {
        var that = this;
        var axios = that.axios;

        if (that.checkWay() == false) {
          return;
        }

        var addData = that.details;

        var addItems = that.addItems;

        var list = []
        for (var i in addItems) {
          var demo = addItems[i];

          var target = {
            materialId: demo.materialId,
            number: demo.number,
            price: demo.price,
            taxRate: demo.taxRate,
            expiration: demo.expiration,
            warehouseId: demo.warehouseId,
            sourceId: demo.sourceId,
            materialName: demo.materialName,
          }
          list.push(target);
        }


        axios({
          method: 'post',
          url: '/stock/in/getBack/add',
          data: {
            //船
            // warehouseTypeId: that.bean.warehouseTypeId,
            //航次
            // warehouseTypeTaskId: that.bean.warehouseTypeTaskId,
            //换货申请Id
            deliveryVoucherId: that.bean.deliveryVoucherId,
            //说明
            description: that.bean.description,
            //税率
            taxRate: that.bean.taxRate,
            //采购类数量
            list: list,
            //审核流程Id
            auditProcess: that.bean.auditProcess,
            //是否直接提交
            status: commit == undefined ? null : commit ? 1 : null,
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
              msg = '<div>单号为:<span class="blue">' + data.data + '</span></div>';
              that.$parent.initTableList();
              that.$parent.otherPage.PAGE = 'INDEX';
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

        var that = this;
        var axios = that.axios;

        var addItems = that.addItems;

        var list = []
        for (var i in addItems) {
          var demo = addItems[i];

          var target = {
            materialId: demo.materialId,
            number: demo.number,
            price: demo.price,
            taxRate: demo.taxRate,
            expiration: demo.expiration,
            warehouseId: demo.warehouseId,
            sourceId: demo.sourceId,
            materialName: demo.materialName
          }
          list.push(target);
        }

        axios({
          method: 'post',
          url: '/stock/in/getBack/update',
          data: {
            id: that.bean.id,
            //供应商Id
            supplierId: that.bean.supplierId,
            //供应商Id
            supplierAgreementId: that.bean.supplierAgreementId,
            //船
            warehouseTypeId: that.bean.warehouseTypeId,
            //航次
            warehouseTypeTaskId: that.bean.warehouseTypeTaskId,
            //换货申请
            deliveryVoucherId: that.bean.deliveryVoucherId,
            //说明
            description: that.bean.description,
            //税率
            taxRate: that.bean.taxRate,
            //采购类数量
            list: list,
            //审核流程Id
            auditProcessId: that.bean.auditProcessId,
            //是否直接提交
            commit: commit,
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
              that.$parent.initTableList();

              if (commit)
                that.$parent.otherPage.PAGE = 'INDEX';

            } else {
              that.updateSuccess(false, data.msg)
            }

          }, 300)


        }).catch((error) => {
          that.errorhanding(error)
        });
      },


      //初始化options数据
      initOptions: function(callBack) {

        var that = this;
        var axios = that.axios;

        that.initData = true;

        axios({
          method: 'post',
          url: '/stock/in/getBack/options',
          data: {
            warehouse: true,
            cruise: false,
            auditProcess: false
          }
        }).then((response) => {
          if (!response) {
            return
          }

          that.initData = false;
          var data = response.data;


          that.options.supplier = data.data.supplier

          var warehouse = data.data.warehouse;
          that.options.warehouse = warehouse;
          // that.options.cruise = data.data.cruise;
          // that.options.auditProcess = data.data.auditProcess;

          // if (that.operation == that.STATUS.ADD && that.bean.auditProcessId == '' && data.data.auditProcess.length !=
          //   0) {
          //   that.bean.auditProcessId = data.data.auditProcess[0].id;
          // }

          if (callBack != undefined && callBack != null) {
            callBack(that);
          } else {
            that.bean.warehouseId = warehouse[0] != undefined ? warehouse[0].id : '';
          }

        });
      },
      //仓库
      initOptionsAgreement: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/stock/in/getBack/options/agreement',
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
          url: '/stock/in/getBack/options/route',
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

      checkWay: function() {
        var that = this;

        var isPass = true;
        // if (that.bean.auditProcessId == '') {

        //   that.$notify({
        //     title: '警告',
        //     type: 'warning',
        //     message: '请选择<span class="blue">审核流程</span>',
        //     duration: 2500,
        //     dangerouslyUseHTMLString: true
        //   })

        //   isPass = false;
        // }

        return isPass;
      },

      itemAppend: function(target) {
        var that = this;
        var demoParsee = JSON.parse(JSON.stringify(target));

        var addItems = that.addItems;

        //是否在这
        var isHere = -1;
        for (var index in addItems) {
          var demo = addItems[index];
          if (demo.sourceId == demoParsee.sourceId) {
            isHere = index;
          }
        }

        // target.number = target.remainNumberIn;

        if (isHere == -1)
          that.addItems.push(target)
      },
      itemSplice: function(demo) {

        var that = this;

        var addItems = that.addItems;

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

      },
      selectDeliveryVoucher: function(target) {
        var that = this;

        // var loading = that.$loading({
        //   lock: true,
        //   // text: 'Loading...',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(255, 255, 255, 0.7)'
        // });

        if (target.supplierCode == '') {
          target.supplierCode = '原采购单未选择';
          target.supplierName = '原采购单未选择';
          target.supplierAgreementName = '原采购单未选择';
        }

        // that.bean.supplierId = target.supplierId;
        // that.bean.supplierName = target.supplierName;
        // that.bean.supplierCode = target.supplierCode;
        // that.bean.supplierAgreementId = target.supplierAgreementId;
        // that.bean.supplierAgreementName = target.supplierAgreementName;
        that.bean.deliveryVoucherId = target.id;
        that.bean.deliveryVoucherCode = target.code;
        // that.bean.warehouseTypeId = target.warehouseTypeId;

        // setTimeout(function() {

        //   loading.close();
        //   if(target.warehouseTypeTaskId != undefined)
        //     that.bean.warehouseTypeTaskId = target.warehouseTypeTaskId;
        // }, 300)

      },
      openAddPop: function() {
        var that = this;

        if (that.bean.deliveryVoucherId == '') {

          that.$notify({
            title: '警告',
            type: 'warning',
            message: '请选择<span class="blue">领料单</span>',
            duration: 2500,
            dangerouslyUseHTMLString: true
          })

          return
        }

        this.inAdd = true;
        this.inWhat = 'AI';
      },
      openDeliveryVoucher: function() {
        var that = this;

        that.inAdd = true;
        that.inWhat = 'DV'
      },

      downloadExcelDemo: function() {
        var that = this;
        var href = that.axios.defaults.baseURL + '/excel/excelCaiGouShenQingDang.xlsx';
        window.open(href);
      },

      sysn: function(type) {
        var that = this;

        var list = that.addItems;
        if (type == 'RATE') {
          var target = that.bean.taxRate;
          for (var i in list) {
            that.addItems[i].taxRate = target;
          }
        } else if (type == 'WAREHOUSE') {
          var target = that.bean.warehouseId;
          for (var i in list) {
            that.addItems[i].warehouseId = target;
          }
        }
      },

      setPorcess: function(process) {
        this.bean.auditProcess = process;
      },

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

<template>

  <div>
    <div>
      <el-button type="primary" :plain="true" @click="$parent.otherPage.PAGE='INDEX'">返回</el-button>
      <el-button icon="el-icon-loading" class="blue" v-if="initData" type="warning" :plain="true"><span class="red">正在初始化，请稍等。。。</span></el-button>
    </div>
    <div class="input-line">
      <div class="input-block">
        <span>入库单号</span>
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
        <el-input :value="userInfo.organizationName" disabled v-if="operation == STATUS.ADD || operation == STATUS.READ"></el-input>
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



      <div class="input-block">
        <span>供应商</span>
        <el-select v-model="bean.supplierId" title="请选择供应商" :placeholder="bean.warehouseTypeId==''? '请选择供应商':$t('quanbu')"
          :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ" clearable>
          <el-option v-for="item in options.supplier" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>供应商代码</span>
        <el-input v-model="bean.supplierCode" placeholder="请先选择供应商" disabled></el-input>
      </div>

      <div class="input-block">
        <span>供应商协议</span>
        <el-select v-model="bean.supplierAgreementId" title="请选择供应商" placeholder="请先选择供应商协议" clearable :disabled="bean.supplierId=='' || bean.status != STATUS.UNCOMMIT  || operation == STATUS.READ">
          <el-option v-for="item in options.supplierAgreement" :key="item.id" :label="item.name == undefined? '未命名协议':item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>

      <br>

      <div class="input-block">
        <span>邮轮</span>
        <el-select v-model="bean.warehouseTypeId" :placeholder="$t('quanbu')" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"
          clearable>
          <el-option v-for="item in options.cruise" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>航次</span>
        <el-select v-model="bean.warehouseTypeTaskId" title="请选择邮轮" :placeholder="bean.warehouseTypeId==''? '请选择邮轮':$t('quanbu')"
          clearable :disabled="bean.warehouseTypeId=='' || bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">
          <el-option style="height: 50px;" v-for="item in options.routes" :key="item.id" :label="item.taskName" :value="item.id">
            <div style="line-height: 25px;">
              <span>{{item.taskName}}</span> <br>
              <span class="font6"><span class="blue">{{item.startTime}}</span><span class="red">~~</span><span class="blue">{{item.endTime}}</span></span>
            </div>
          </el-option>
        </el-select>
      </div>

      <br>

      <div class="input-block">
        <span>
          <el-button @click="sysn('RATE')" type="warning" size="mini" style="padding: 5px 5px;margin-right: 10px;"
            :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">同步</el-button>税率
        </span>
        <el-input-number v-model="bean.taxRate" controls-position="right" :step="0.01" :min="0" :max="100" style="width: 110px;"
          step-strictly :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input-number>
        <span class="font12">(单位百分比<span class="red"> % </span>)</span>
      </div>

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
        <span>审批</span>
        <!--        <template v-if="operation != STATUS.READ">
          <el-select class="el-select-font12" v-model="bean.auditProcessId" title="请选择" style="width: 155px;"
            :placeholder="$t('quanbu')" clearable :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">
            <el-option v-for="item in options.auditProcess" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-button @click="initOptions" icon="el-icon-refresh" plain type="primary" circle :disabled="operation == STATUS.READ"></el-button>
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
        <el-button size="mini" type="warning" v-else key>已通过审核</el-button>
        <span>最后提交人：{{bean.subUserName}} ( {{getCreateDateStr(new Date(bean.subTime))}} )</span>
      </div>

      <el-button icon="" @click="add()" size="mini" type="success" v-if="operation == STATUS.ADD">保存</el-button>
      <el-button icon="" @click="update()" size="mini" type="success" v-if="operation == STATUS.UPDATE">保存</el-button>

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
      <el-table-column label="物品名称" prop="materialName" align="center" min-width="200">
        <template slot-scope="scope">
          <div class="font12">
            {{scope.row.materialName}}(<span class="green">{{scope.row.purchaseUnit}}</span>)<br>
            <span style="white-space: nowrap;">
              【<span class="blue text-ellipsls">{{scope.row.categoryName}}</span>】
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="条形码" prop="materialBarCode" align="center" min-width="180">
      </el-table-column>
       <el-table-column label="规格" prop="purchaseSpecification" align="center" min-width="120">
      </el-table-column>
      <el-table-column label="品牌" prop="brandName" align="center" min-width="150">
      </el-table-column>


      <el-table-column align="center" min-width="420">

        <template slot-scope="scope" slot="header">
          <div class="text-align-center">
            <span>参考价格详情</span><br>
          </div>
        </template>
        <el-table-column label="含税单价" prop="basisPrice" align="center" min-width="150">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.price" :min="0.00000" style="width: 130px;" :precision="5" :step="10.0"
              controls-position="right" size="mini" :disabled="operation == STATUS.READ"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="含税小计" prop="basisPrice" align="center" min-width="120">
          <template slot-scope="scope">
            {{ totalPrice(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="单价" align="center" min-width="120">
          <template slot-scope="scope">
            {{ siglePirce(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="金额" align="center" min-width="120">
          <template slot-scope="scope">
            {{ totalNetPrice(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="税率(%)" prop="basisPrice" align="center" min-width="150">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.taxRate" :min="0.00" style="width: 130px;" :precision="2" :step="1"
              controls-position="right" size="mini" :disabled="operation == STATUS.READ"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="税额" align="center" min-width="120">
          <template slot-scope="scope">
            {{ totalTaxRate(scope.row) }}
          </template>
        </el-table-column>

      </el-table-column>



      <el-table-column fixed="right" label="入库数量" prop="basisPrice" align="center" min-width="145">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.number" :min="1" style="width: 110px;" :step="1.0" controls-position="right"
            size="mini" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input-number>
        </template>
      </el-table-column>




      <el-table-column fixed="right" label="过期时间" prop="basisPrice" align="center" min-width="165">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.expiration" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 130px;"
            size="mini" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">
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
      <add-item slot @itemAppend="itemAppend" @itemSplice="itemSplice" v-if="inAdd && inWhat === 'ADD'"></add-item>
      <audit-process @set="setPorcess" :processId="bean.auditProcessId" :auditProcess="bean.auditProcess" :type="AuditType.value.STOCKIN_ORDINARY"
        v-if="inAdd && inWhat === 'AP'"></audit-process>
    </el-dialog>
  </div>

</template>

<script>
  import addItem from './details_add.vue';
  import auditProcess from '../../../../util/process/process.vue';

  export default {
    components: {
      addItem,
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
          supplier: [],
          warehouse: [],
          supplierAgreement: [],
          status: this.ORDER_STATUS,
          //采购类型
          type: [{
              name: '普通入库',
              value: 0
            },
            {
              name: '采购入库',
              value: 1
            }
          ],
          cruise: [],
          routes: [],
          auditProcess: []
        },

        addItems: [],
        inAdd: false,
        inWhat: null,

        bean: {
          code: "",
          description: "",
          purchaseOrderCode: "",
          status: 0,
          supplierAgreementCode: "",
          supplierAgreementId: "",
          supplierCode: "",
          supplierId: "",
          taxRate: 13,
          warehouseId: '',
          warehouseTypeId: '',
          warehouseTypeTaskId: '',
          auditProcessId: null,
          auditProcess: null
        },

        history: {
          type: 1,
          purchaseRequestId: 1
        },

        //正在初始化
        initData: true,

        authAPI: {
          isEdit: true
        },

      }
    },
    watch: {
      'bean.warehouseTypeId': {
        handler: function(newV) {

          if (newV != '') {
            this.initOptionsRoute(this.bean.taskId);
          } else {
            this.bean.taskId = '';
          }
        },
        deep: true
      },
      'bean.supplierId': {
        handler: function(newV) {
          var that = this;
          var list = that.options.supplier;
          var bean = that.bean;
          for (var i in list) {
            var demo = list[i];
            if (demo.id == bean.supplierId) {
              that.bean.supplierCode = demo.code;
              break;
            }
          }


          if (newV != '' && newV != undefined) {
            that.initOptionsAgreement();
          } else {
            that.bean.supplierCode = '';
            that.bean.supplierAgreementId = '';
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
        that.addItems = [];
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
            url: '/stock/in/bean',
            data: {
              id: that.$parent.otherPage.data.details.id
            }
          }).then((response) => {
            if (!response) {
              return
            }

            setTimeout(function() {


              var data = response.data;

              var bean = data.data;
              bean.taxRate = 0;
              bean.warehouseId = that.options.warehouse[0] == undefined ? '' : that.options.warehouse[0].id;

              if (bean.status == that.STATUS.NOPASS)
                bean.status = that.STATUS.UNCOMMIT


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
            warehouseId: demo.warehouseId
          }
          list.push(target);
        }


        axios({
          method: 'post',
          url: '/stock/in/add',
          data: {
            //供应商Id
            supplierId: that.bean.supplierId,
            //供应商协议Id
            supplierAgreementId: that.bean.supplierAgreementId,
            //船
            warehouseTypeId: that.bean.warehouseTypeId,
            //航次
            warehouseTypeTaskId: that.bean.warehouseTypeTaskId,
            //说明
            description: that.bean.description,
            //税率
            taxRate: that.bean.taxRate,
            //采购类数量
            list: list,
            //审核流程Id
            auditProcess: that.bean.auditProcess,
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }

          var data = response.data;

          if (data.code !== that.STATUS.SUCCESS) {
            throw data.msg;
          }

          setTimeout(function() {

            if (data.code === that.STATUS.SUCCESS) {
              var msg = '<div>单号为:<span class="blue">' + data.data + '</span></div>'
              that.$parent.initTableList()
              that.$parent.otherPage.PAGE = 'INDEX'
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
            warehouseId: demo.warehouseId
          }
          list.push(target);
        }

        axios({
          method: 'post',
          url: '/stock/in/update',
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
                that.$parent.otherPage.PAGE = 'INDEX'

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
          url: '/stock/in/options',
          data: {
            warehouse: true,
            supplier: true,
            cruise: true,
            auditProcess: true,
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
          that.options.cruise = data.data.cruise;
          that.options.auditProcess = data.data.auditProcess;

          if (that.operation == that.STATUS.ADD && that.bean.auditProcessId == '' && data.data.auditProcess.length !=
            0) {
            that.bean.auditProcessId = data.data.auditProcess[0].id;
          }

          if (that.operation == that.STATUS.ADD && that.bean.warehouseTypeId == '' && data.data.warehouse.length !=
            0) {
            that.bean.warehouseTypeId = data.data.cruise[0].id;
          }


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


      itemAppend: function(target) {

        var that = this;
        var demoParsee = JSON.parse(JSON.stringify(target));

        var addItems = that.addItems;

        var isHere = -1;
        for (var index in addItems) {
          var demo = addItems[index];
          if (demo.materialId == demoParsee.materialId) {
            isHere = index;
          }
        }

        if (that.bean.taxRate != undefined) {
          target.taxRate = that.bean.taxRate;
        }

        if (that.bean.warehouseId != undefined) {
          target.warehouseId = that.bean.warehouseId;
        } else {
          target.warehouseId = that.options.warehouse[0] == undefined ? '' : that.options.warehouse[0].id;
        }

        target.taxRate = that.bean.taxRate;

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
              if (demo.materialId == itemDemo.materialId) {
                that.addItems.splice(index, 1);
                break;
              }
            }
          }).catch(_ => {});

      },

      openAddPop: function() {
        var that = this;


        // if (that.bean.supplierId != '' && that.bean.supplierAgreementId == '') {

        //   that.$notify({
        //     title: '警告',
        //     type: 'warning',
        //     message: '已选择<span class="blue">供应商</span><br><span class="red font16">请先选择协议</span>',
        //     duration: 2000,
        //     dangerouslyUseHTMLString: true
        //   })

        //   return
        // }

        this.inAdd = true;
        this.inWhat = 'ADD';
      },


      downloadExcelDemo: function() {
        var that = this;
        var href = that.axios.defaults.baseURL + '/excel/excelCaiGouShenQingDang.xlsx';
        window.open(href);
      },


      querySearchAsync: function(queryString, cb) {
        var that = this;
        var createStateFilter = function(queryString) {
          return (state) => {
            return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
          };
        }

        var restaurants = that.options.deliveryLocations;
        var results = queryString ? restaurants.filter(createStateFilter(queryString)) : restaurants;

        clearTimeout(that.timeout);
        that.searchDeliveryLocatinTimeOut = setTimeout(() => {
          cb(results);
        }, 500);
      },

      //非含税单价
      siglePirce: function(row) {
        var that = this;

        var taxRate = that.FloatOb.divide(row.taxRate, 100) + 1;

        var ratePrice = that.FloatOb.divide(row.price, taxRate) + "";

        return that.FloatOb.round(5, ratePrice);
      },

      //函数总价
      totalPrice: function(row) {
        var that = this;

        return that.FloatOb.round(2, that.FloatOb.multiply(row.number, row.price));
      },

      //净价总计
      totalNetPrice: function(row) {
        var siglePirce = this.siglePirce(row);

        var total = this.FloatOb.multiply(row.number, siglePirce);
        return this.FloatOb.round(2, total);
      },

      //税额
      totalTaxRate: function(row) {

        var rate = this.FloatOb.subtract(this.totalPrice(row), this.totalNetPrice(row));

        return this.FloatOb.round(2, rate);
      },

      typeChange: function(newV) {
        var that = this;
        that.$confirm('更改采购类型，将会清空采购单中的所有物品，是否更改？', '提示')
          .then(_ => {

            that.history.type = newV;
            if (that.bean.status === that.STATUS.UNCOMMIT) {
              that.addItems = [];
              that.bean.items = [];
            }

          })
          .catch(_ => {
            that.bean.type = that.history.type;
          });
      },

      modeChange: function(newV) {
        var that = this;
        that.$confirm('更改采购申请单或移除采购申请单，将会清空采购单中的所有物品，是否更改？', '提示')
          .then(_ => {

            that.history.purchaseRequestId = newV;
            if (that.bean.status === that.STATUS.UNCOMMIT) {
              that.addItems = [];
              that.bean.items = [];
            }

          })
          .catch(_ => {
            that.bean.purchaseRequestId = that.history.purchaseRequestId;
          });
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

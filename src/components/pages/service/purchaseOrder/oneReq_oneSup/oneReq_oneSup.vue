<template>

  <div>
    <div>
      <el-button type="primary" :plain="true" @click="$parent.otherPage.PAGE='INDEX'">返回</el-button>
      <el-button icon="el-icon-loading" class="blue" v-if="initData" type="warning" :plain="true"><span class="red">正在初始化，请稍等。。。</span></el-button>
    </div>
    <div class="input-line">
      <div class="input-block">
        <span>采购单号</span>
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
        <el-select v-model="bean.status" :placeholder="$t('quanbu')" clearable disabled>
          <el-option v-for="(item,statusIndex) in options.status" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <br>


      <div class="input-block">
        <span>采购类型</span>
        <el-select v-model="bean.type" @change="typeChange" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">
          <el-option v-for="(item,statusIndex) in options.type" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>交货时间</span>
        <el-date-picker v-model="bean.deliveryTime" type="date" placeholder="选择日期" style="width: 200px;" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">
        </el-date-picker>
      </div>

      <div class="input-block">
        <span>交货地点</span>
        <el-autocomplete v-model="bean.deliveryLocation" :fetch-suggestions="querySearchAsync" :debounce="0"
          placeholder="请输入地点" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-autocomplete>
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
        <el-input v-model="bean.supplierCode" disabled></el-input>
      </div>

      <div class="input-block">
        <span>供应商协议</span>
        <el-select v-model="bean.supplierAgreementId" @change="agreementChange" title="请选择供应商协" placeholder="请先选择供应商协议"
          clearable :disabled="bean.supplierId=='' || bean.status != STATUS.UNCOMMIT  || bean.type == 0 || operation == STATUS.READ">
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
        <el-select v-model="bean.taskId" title="请选择邮轮" :placeholder="bean.warehouseTypeId==''? '请选择邮轮':$t('quanbu')"
          clearable :disabled="bean.warehouseTypeId=='' || bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">
          <el-option style="height: 50px;" v-for="item in options.routes" :key="item.id" :label="item.taskName" :value="item.id">
            <div style="line-height: 25px;">
              <span>{{item.taskName}}</span> <br>
              <span class="font6"><span class="blue">{{item.startTime}}</span><span class="red">~~</span><span class="blue">{{item.endTime}}</span></span>
            </div>
          </el-option>
        </el-select>
      </div>


      <div class="input-block">
        <span>说明</span>
        <el-input v-model="bean.description" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input>
      </div>

      <!--      <div class="input-block">
        <span>采购申请单</span>
        <el-select class="el-select-font12" v-model="bean.purchaseRequestId" @change="modeChange" title="全部"
          :placeholder="$t('quanbu')" clearable :disabled="bean.status != STATUS.UNCOMMIT">
          <el-option style="height: 50px;" v-for="item in options.purchaseRequest" :key="item.id" :label="item.code"
            :value="item.id">
            <div style="line-height: 25px;">
              <span>{{item.code}}</span> <br>
              <span class="font6">{{item.createUserName}}({{item.organizationName}}):<span class="blue">{{getCreateDateStr(new Date(item.createTime)).substring(0,10)}}</span></span>
            </div>
          </el-option>
        </el-select>
      </div> -->

      <div class="input-block">
        <span class="text-align-left">
          <el-button @click="openPurchaseRequest" type="warning" size="mini" style="padding: 5px 5px;" :disabled="operation != STATUS.ADD || operation == STATUS.READ">
            选择
          </el-button>
          <span class="font10">采购申请</span>
        </span>
        <el-input v-model="bean.purchaseRequestCode" disabled title="采购申请单" placeholder="采购申请单" disabled>
        </el-input>
      </div>

      <div class="input-block">
        <span>税率</span>
        <el-input-number v-model="bean.taxRate" controls-position="right" :step="0.01" :min="0" :max="100" style="width: 110px;"
          step-strictly :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input-number>
        <span class="font12">(单位百分比<span class="red"> % </span>)</span>
      </div>

      <div class="input-block">
        <span>审批</span>
        <!-- <template v-if="operation != STATUS.READ">
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


    </div>

    <div class="public-table-header">

      <el-button size="mini" id="invalidButton" type="warning" :disabled="bean.status != STATUS.UNCOMMIT" v-if="bean.status == STATUS.AUDIT">审核中</el-button>
      <el-button size="mini" id="invalidButton" type="success" :disabled="bean.status != STATUS.UNCOMMIT" v-if="bean.status == STATUS.PASS">审核通过</el-button>


      <el-button icon="" @click="add()" size="mini" type="success" v-if="operation == STATUS.ADD">保存</el-button>
      <el-button icon="" @click="update()" size="mini" type="success" v-if="operation == STATUS.UPDATE && bean.status != STATUS.AUDIT">保存</el-button>

      <el-button @click="update(true)" icon="" size="mini" type="warning" v-if="operation == STATUS.UPDATE && bean.status == STATUS.UNCOMMIT">直接提交</el-button>


      <el-button @click="openAddPop" icon="el-icon-s-order" class="right" size="mini" type="success" v-if="bean.status == STATUS.UNCOMMIT && operation != STATUS.READ">添加物品</el-button>

      <el-button @click="downloadPDF" icon="el-icon-download" size="mini" type="primary" v-if="bean.status != STATUS.UNCOMMIT">下载采购订单(EXCEL)</el-button>
    </div>

    <el-table :data="addItems" style="width: 100%" default-expand-all cell-class-name="public-table-cell" heig-ht="500">
      <el-table-column type="expand" width="50" v-if="false">
        <template slot-scope="scope">
          <div class="margin-left30 flexColumn">
            <div class="font-bold flexRow" style="line-height: 28px;">
              <div class="flex2 text-align-center">
                申请单号
              </div>
              <div class="flex2 text-align-center">
                提交时间
              </div>
              <div class="flex2 text-align-center">
                采购量
              </div>
              <div class="flex2 text-align-center">
                申请人
              </div>
              <div class="flex2 text-align-center">
                所属部门
              </div>
              <div class="flex3 text-align-center">
                航次
              </div>
              <div class="flex2 text-align-center">

              </div>
            </div>

            <div class="flexRow table-in-table" v-for="order in scope.row.list">

              <div class="flex2 text-align-center">
                {{order.code}}
              </div>
              <div class="flex2 text-align-center">
                {{ getCreateDateStr(new Date(order.subTime))}}
              </div>
              <div class="flex2 text-align-center">
                <el-input-number v-model="order.number" :step="1" :min="order.moq == undefined? 1:(order.moq>order.number? order.number:order.moq)"
                  :max="order.maxNumber" size="mini" step-strictly :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input-number>
              </div>
              <div class="flex2 text-align-center">
                {{order.createUserName}}
              </div>
              <div class="flex2 text-align-center">
                {{order.organizationName}}
              </div>
              <div class="flex3 text-align-center">
                {{order.route}}({{order.taskStartTime}}~~{{order.taskEndTime}})
              </div>
              <div class="flex2 text-align-center">
                <el-button @click="listSplice(scope.row.id,order)" type="danger" size="mini" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ">删除</el-button>
              </div>
            </div>

          </div>

        </template>
      </el-table-column>
      <el-table-column label="物品编码" prop="materialCode" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="物品" prop="materialName" align="center" min-width="200">
      </el-table-column>
      <el-table-column label="条形码" prop="materialBarCode" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="规格" prop="purchaseSpecification" align="center" min-width="120">
      </el-table-column>
      <el-table-column label="物品类别" prop="materialCategoryName" align="center" min-width="180">
      </el-table-column>

      <el-table-column label="品牌" prop="materialBrandName" align="center" min-width="180">
      </el-table-column>

      <el-table-column label="单位" prop="purchaseUnit" align="center" min-width="120">
      </el-table-column>

      <!--      <el-table-column label="可用库存" prop="availStock" align="center" min-width="80">
      </el-table-column>
      <el-table-column label="总库存" prop="totalStock" align="center" min-width="80">
      </el-table-column> -->

      <!--      <el-table-column fixed="right" label="数量" prop="basisPrice" align="center" min-width="150">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.number" :min="1" style="width: 130px;" :precision="0" :step="10.0"
            controls-position="right" size="mini" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="含税单价" prop="basisPrice" align="center" min-width="150">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.basisPrice" :min="0.000" style="width: 130px;" :precision="2" :step="10.0"
            controls-position="right" size="mini" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input-number>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="小计" prop="basisPrice" align="center" min-width="120">
        <template slot-scope="scope">
          {{ totalPrice(scope.row) }}
        </template>
      </el-table-column> -->

      <el-table-column fixed="right" label="数量" prop="basisPrice" align="center" min-width="150">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.number" :min="1" style="width: 130px;" :precision="0" :step="10.0"
            controls-position="right" size="mini" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input-number>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" min-width="300">
        <template slot-scope="scope" slot="header">
          <div class="text-align-center">
            <span>参考价格</span><br>
            <span>当前总价：<span class="blue">{{totalAmount()}}</span></span>
          </div>
        </template>

        <el-table-column label="含税单价" align="center" min-width="150">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.basisPrice" :min="0.000" style="width: 130px;" :precision="2" :step="10.0"
              controls-position="right" size="mini" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="小计" align="center" min-width="160">
          <template slot-scope="scope">
            {{ totalPrice(scope.row) }}
          </template>
        </el-table-column>

      </el-table-column>

      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" min-width="60">
        <template slot-scope="scope">
          <el-button @click="itemSplice(scope.row)" size="mini" type="danger" icon="el-icon-s-release" :disabled="bean.status != STATUS.UNCOMMIT || operation == STATUS.READ"
            circle></el-button>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="" prop="applicationNo" align="center" width="40">
        <template slot-scope="scope">
          <button class="el-icon-warning help warnig-button font20" title="协议中不存在该物品" v-if="scope.row.misMatch"></button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 		<pop-bg ref="addItems">
			<add-item></add-item>
		</pop-bg> -->
    <el-dialog :custom-class="['dialog-card','self-card']" :visible.sync="inAdd" :append-to-body="true">
      <add-item slot @itemAppend="itemAppend" @itemSplice="itemSplice" v-if="inAdd && inWhat == 'AI'"></add-item>
      <select-request slot @select="selectPurchaseRequest" :targetId="bean.purchaseRequestId" v-if="inAdd && inWhat == 'PR'"></select-request>
      <audit-process @set="setPorcess" :processId="bean.auditProcessId" :auditProcess="bean.auditProcess" :type="AuditType.value.PURCHASE_ORDER"
        v-if="inAdd && inWhat === 'AP'"></audit-process>
    </el-dialog>

  </div>
</template>

<script>
  import addItem from './one_addMaterials.vue'
  import selectRequest from './purhcaseOrder_details_select.vue'
  import auditProcess from '../../../../util/process/process.vue'

  export default {
    components: {
      addItem,
      selectRequest,
      auditProcess,
    },
    data() {

      // localStorage.deliveryLocations = JSON.stringify([{value:'昆仑虚-北糜'}]);

      var deliveryLocations
      try {
        deliveryLocations = localStorage.deliveryLocations == undefined ? [] : JSON.parse(localStorage.deliveryLocations);
      } catch (error) {
        deliveryLocations = [];
      }


      return {

        operation: this.$parent.otherPage.status,

        userInfo: JSON.parse(sessionStorage.userInfo),

        upload: {
          files: null,
          fileName: null
        },



        options: {
          cruise: [],
          warehouse: [],
          routes: [],
          status: this.ORDER_STATUS,
          supplier: [],
          supplierAgreement: [],
          //采购类型
          type: [{
              name: '普通采购',
              value: 0
            },
            {
              name: '单协议采购',
              value: 1
            },
            // {
            //   name: '多协议采购',
            //   value: 2,
            //   disabled:false
            // }
          ],
          //采购模式
          mode: [{
              name: '无采购申请',
              value: 0
            },
            {
              name: '单采购申请',
              value: 1
            },
            {
              name: '多采购申请',
              value: 2
            }
          ],
          deliveryLocations: deliveryLocations,
          purchaseRequest: [],
          auditProcess: [],
        },

        addItems: [],
        inAdd: false,
        inWhat: null,


        bean: {
          code: '',
          type: 1,
          mode: 1,
          description: '',
          supplierId: '',
          supplierName: '',
          supplierCode: '',
          supplierAgreementId: '',
          subTime: '',
          subUserName: '',
          organization: '',
          deliveryLocation: '',
          deliveryTime: '',
          taskName: '',
          taskId: '',
          warehouseTypeId: '',
          taskStartTime: '',
          taskEndTime: '',
          auditProcessId: '',
          auditProcess: null,
          status: 0,
          ratio: 0,
          items: [],
          purchaseRequestId: '',
          purchaseRequestCode: '',
          //税率
          taxRate: 13.00
        },

        history: {
          type: 1,
          purchaseRequestId: '',
          supplierAgreementId: '',
          supplierId: ''
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
        handler: function(newV, oldV) {
          if (newV == oldV || this.operation == this.STATUS.READ)
            return;
          if (newV != '') {
            this.initOptionsRoute(this.bean.taskId);
          } else {
            this.bean.taskId = '';
          }
        },
        deep: true
      },
      'bean.supplierId': {
        handler: function(newV, oldV) {
          if (newV == oldV)
            return;
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

          if (newV != '') {
            that.initOptionsAgreement();
          } else {
            this.bean.supplierCode = '';
            this.bean.supplierAgreementId = '';

            if (that.addItems.length == 0)
              return;

            if (that.bean.supplierId == that.history.supplierId)
              return;

            if (that.bean.type == 0)
              return;

            return;
            that.$confirm('更改供应商，将会清空采购单中的所有物品，是否更改？', '提示')
              .then(_ => {

                if (that.bean.status === that.STATUS.UNCOMMIT) {
                  that.addItems = [];
                  that.bean.items = [];
                }

                that.history.supplierId = newV;

              })
              .catch(_ => {
                that.bean.supplierId = oldV;
              });
          }

        },
        deep: true
      },
      'bean.purchaseRequestId': {
        handler: function(newV, oldV) {
          if (newV == oldV || this.operation == this.STATUS.READ)
            return;
        /*  if (oldV != "")
            this.addItems = [] */
        },
        deep: true
      },
      'bean.type': {
        handler: function(newV, oldV) {

          if (newV == oldV || this.operation == this.STATUS.READ)
            return;
          var that = this;

          if (that.bean.type == that.history.type)
            return;


          //类型切换到 0
          var clearAgreement = true;
          if (newV != 0)
            clearAgreement = false;

          if (that.addItems.length == 0) {

            if (clearAgreement)
              that.bean.supplierAgreementId = '';

            return;
          }
          if (clearAgreement)
            that.bean.supplierAgreementId = '';
          return;

          //已失效
          that.$confirm('更改采购类型，将会清空采购单中的所有物品，是否更改？', '提示')
            .then(_ => {

              if (that.bean.status === that.STATUS.UNCOMMIT) {

                if (clearAgreement)
                  that.bean.supplierAgreementId = '';

                that.addItems = [];
                that.bean.items = [];
              }

              that.history.type = newV;

            })
            .catch(_ => {
              that.bean.type = oldV;
            });
        },
        deep: true
      },
      'bean.supplierAgreementId': {
        handler: function(newV, oldV) {
          if (newV == oldV || this.operation == this.STATUS.READ)
            return;

          var that = this;


          if (oldV == '')
            that.history.supplierAgreementId = newV;

          if (that.addItems.length == 0)
            return;

          if (that.bean.supplierAgreementId == that.history.supplierAgreementId)
            return;

          if (that.bean.type == 0)
            return;

          that.addItems = [];
          that.bean.items = [];

          return;

          that.$confirm('更改供应商协议，将会清空采购单中的所有物品，是否更改？', '提示')
            .then(_ => {

              if (that.bean.status === that.STATUS.UNCOMMIT) {
                that.addItems = [];
                that.bean.items = [];
              }

              that.history.supplierAgreementId = newV;

            })
            .catch(_ => {
              that.bean.supplierAgreementId = oldV;
            });
        },
        deep: true
      },

    },
    activated: function() {
      var that = this;
      that.initOptions();
      if (that.operation !== that.STATUS.ADD) {
        that.bean = {};
        that.initPurchaseRequest();
      }
    },
    created: function() {
      var that = this;
      that.initOptions();
      if (that.operation !== that.STATUS.ADD) {
        that.initPurchaseRequest();
      } else {
        // that.authAPI.isEdit = false
      }
    },
    methods: {
      initPurchaseRequest: function() {

        var that = this;
        var axios = that.axios;

        if (that.$parent.otherPage.data.details.id == '') {
          return
        }

        const init = function(that) {
          that.initData = true;

          axios({
            method: 'post',
            url: '/purchaseOrder/bean',
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
              that.bean = data.data;

              if (that.bean.status == that.STATUS.NOPASS) {
                that.bean.status = that.STATUS.UNCOMMIT;
              }


              that.history.type = that.bean.type;
              that.history.mode = that.bean.mode;

              var addItems = JSON.parse(JSON.stringify(data.data.items))
              that.addItems = addItems;

              // var items = []
              // for (var i in addItems) {
              //   var demo = addItems[i];

              //   for (var index in demo.list) {
              //     var demoInner = demo.list[index]

              //     var detial = {
              //       purchaseRequestId: demoInner.purchaseRequestId,
              //       materialId: demoInner.materialId,
              //       supplierId: demoInner.supplierId,
              //       supplierAgreementId: demoInner.supplierAgreementId,
              //       supplierAgreementMaterialId: demoInner.supplierAgreementMaterialId,
              //       number: demoInner.number,
              //       price: demoInner.basisPrice
              //     }
              //     items.push(detial);
              //   }
              // }

              that.bean.items = addItems;

              that.history.purchaseRequestId = data.data.purchaseRequestId;

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

        if (!that.checkWay(true)) {
          return;
        }

        var addData = that.details;

        var addItems = that.addItems;
        debugger

        axios({
          method: 'post',
          url: '/purchaseOrder/order/add',
          data: {
            //采购类型 0：普通采购，1：协议采购
            type: that.bean.type,
            //采购模式 1:唯一供应商，2：混合供应商
            mode: that.bean.mode,
            //供应商Id
            supplierId: that.bean.supplierId,
            //供应商协议Id
            supplierAgreementId: that.bean.supplierAgreementId,
            //交货地点
            deliveryLocation: that.bean.deliveryLocation,
            //备注
            deliveryTime: that.bean.deliveryTime,
            //说明
            description: that.bean.description,
            //税率
            taxRate: that.bean.taxRate,
            //采购类数量
            list: addItems,
            //邮轮
            warehouseTypeId: that.bean.warehouseTypeId,
            //航次
            taskId: that.bean.taskId,
            //采购单号
            purchaseRequestId: that.bean.purchaseRequestId,
            //审核流程
            auditProcess: that.bean.auditProcess,

          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }

          setTimeout(function() {
            var data = response.data;
            var msg;
            if (data.code == that.STATUS.SUCCESS) {
              msg = '<div>单号为:<span class="blue">' + data.data + '</span></div>'
              that.$parent.initTableList()
              that.$parent.otherPage.PAGE = 'INDEX'
            } else {
              msg = data.msg;

              if (data.code == -208) {
                var misMatchData = data.data;
                that.misMatchMaterial(that.addItems, misMatchData);
              }

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

        if (!that.checkWay(true)) {
          return;
        }

        var addItems = that.addItems;

        axios({
          method: 'post',
          url: '/purchaseOrder/order/update',
          data: {
            id: that.bean.id,
            //采购类型 0：普通采购，1：协议采购
            type: that.bean.type,
            //采购模式 1:唯一供应商，2：混合供应商
            mode: that.bean.mode,
            //供应商Id
            supplierId: that.bean.supplierId,
            //供应商Id
            supplierAgreementId: that.bean.supplierAgreementId,
            //交货地点
            deliveryLocation: that.bean.deliveryLocation,
            //备注
            deliveryTime: that.bean.deliveryTime,
            //说明
            description: that.bean.description,
            //税率
            taxRate: that.bean.taxRate,
            //采购类数量
            list: addItems,
            //是否直接提交
            status: commit == undefined ? null : commit ? 1 : null,
            //邮轮
            warehouseTypeId: that.bean.warehouseTypeId,
            //航次
            taskId: that.bean.taskId,
            //采购单号
            purchaseRequestId: that.bean.purchaseRequestId,
            //审核流程
            auditProcessId: that.bean.auditProcessId,
            //是否提交
            commit: commit
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
              that.initPurchaseRequest();
              that.$parent.initTableList()
            } else {
              if (data.code == -208) {
                var misMatchData = data.data;
                that.misMatchMaterial(that.addItems, misMatchData);
              }
              that.notic(false, commit ? "提交" : "保存", data.msg)
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
          url: '/purchaseOrder/options',
          data: {
            organization: false,
            supplier: true,
            cruise: true,
            purchaseRequest: true,
            auditProcess: false
          }
        }).then((response) => {
          if (!response) {
            return
          }

          that.initData = false;
          var data = response.data;


          that.options.cruise = data.data.cruise;
          that.options.supplier = data.data.supplier;
          that.options.purchaseRequest = data.data.purchaseRequest;
          // that.options.auditProcess = data.data.auditProcess;

          if (data.data.cruise.length != 0) {
            that.bean.warehouseTypeId = data.data.cruise[0].id
          }

          if (data.data.supplier.length != 0) {
            that.bean.supplierId = data.data.supplier[0].id
          }

          // if (data.data.auditProcess.length != 0) {
          //   that.bean.auditProcessId = data.data.auditProcess[0].id
          // }

          if (callBack != undefined && callBack != null) {
            callBack(that);
          }

        });
      },
      //航次
      initOptionsRoute: function(taskId) {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/purchaseRequest/options/task',
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
      //仓库
      initOptionsAgreement: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/purchaseOrder/options/agreement',
          data: {
            reason: {
              supplierId: that.bean.supplierId
            }
          },
          df: false
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

      //物品不在协议中
      misMatchMaterial: function(addItems, misMatchData) {
        for (var i in addItems) {
          var itemDemo = addItems[i];
          for (var modelIndex in misMatchData) {
            var model = misMatchData[modelIndex];
            if (model.id == itemDemo.materialId) {
              var target = this.addItems[i];
              target.misMatch = true;
              this.$set(this.addItems, i, target)
            }
          }
        }

        this.$forceUpdate();
      },

      checkWay: function(checkList) {
        var that = this;

        var isPass = true;
        var message = '';

        if (checkList && that.addItems.length == 0) {

          message = '请添加<span class="blue">物品</span>';
          isPass = false;
        }

        if (that.bean.type == 1) {

          if (that.bean.supplierAgreementId == '') {
            message = '<span class="red">单协议采购</span><br>请选择<span class="blue">供应商协议</span>'
            isPass = false;
          }

          if (that.bean.supplierId == '') {
            message = '<span class="red">单协议采购</span><br>请选择<span class="blue">供应商</span>'
            isPass = false;
          }

        }

        if (that.bean.purchaseRequestId == '') {
          message = '请选择<span class="blue">采购申请</span>'
          isPass = false;
        }



        // if(that.bean.purchaseRequestId == ''){
        //   message = ''
        // }

        if (!isPass) {
          that.$notify({
            title: '警告',
            type: 'warning',
            message: message,
            duration: 2500,
            dangerouslyUseHTMLString: true
          })
        }

        return isPass;

      },

      itemAppend: function(demo) {
        var that = this;
        var demoParsee = JSON.parse(JSON.stringify(demo));

        var addItems = that.addItems;

        var isHere = -1;
        for (var index in addItems) {
          var demo = addItems[index];
          if (demo.materialId == demoParsee.materialId) {
            isHere = index;
          }
        }

        var target = demoParsee.request;
        delete demoParsee.request;

        if (isHere != -1) {
          that.addItems.push(target);
        } else {
          demoParsee.list = [target];
          that.addItems.push(demoParsee);
        }
      },
      itemSplice: function(demo) {

        var that = this;

        var addItems = that.addItems;
        for (var index = 0; index < addItems.length; index++) {
          var itemDemo = addItems[index];
          if (demo.materialId == itemDemo.materialId) {
            that.addItems.splice(index, 1);
            break;
          }
        }

      },

      listSplice: function(materailId, target) {
        var that = this;
        var materials = that.addItems;
        for (var i in materials) {
          var demo = materials[i];
          if (demo.id == materailId && demo.list != undefined) {
            var list = demo.list;
            for (var index in list) {
              var model = list[index];
              if (model.purchaseRequestMaterialId == target.purchaseRequestMaterialId) {
                list.splice(index, 1);

                if (list.length == 0) {
                  that.itemSplice(demo);
                } else {
                  that.$set(that.addItems, i, demo)
                }

                break;
              }
            }
          }
        }

      },

      selectPurchaseRequest: function(target) {
        var that = this;

        // var loading = that.$loading({
        //   lock: true,
        //   // text: 'Loading...',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(255, 255, 255, 0.7)'
        // });


        that.bean.purchaseRequestId = target.id;
        that.bean.purchaseRequestCode = target.code;
       /* that.bean.warehouseTypeId = target.warehouseTypeId;
        that.bean.taskId = target.taskId; */

      },

      openAddPop: function() {
        var that = this;

        if (!that.checkWay()) {
          return;
        }

        this.inWhat = 'AI'
        this.inAdd = true;
      },

      openPurchaseRequest: function() {
        var that = this;

        that.inAdd = true;
        that.inWhat = 'PR'
      },


      downloadPDF: function() {
        var that = this;
        var axios = that.axios;

        var newTab = window.open('about:blank');

        axios({
          method: 'post',
          url: '/report/getDownload',
          data: {
            type: 'PO',
            id: that.bean.id
          },
          df: false
        }).then((response) => {
          if (!response) {
            return
          }
          var href = that.axios.defaults.baseURL + '/report/excel?download=' + response.data;
          newTab.location.href = href;
        });


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

      totalPrice: function(row) {
        var that = this;

        var total = 0;

        total = that.FloatOb.add(that.FloatOb.multiply(row.number, row.basisPrice), total);

        return total;
      },

      totalAmount: function(row) {
        var list = this.addItems;
        var floatUtil = this.FloatOb;

        var totalAmount = 0;

        for (var i in list) {
          var demo = list[i];

          totalAmount = floatUtil.add(totalAmount, floatUtil.multiply(demo.number, demo.basisPrice));
        }

        return floatUtil.round(2, totalAmount);
      },

      typeChange: function(newV) {
        return;
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
        return;
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

      agreementChange: function(newV) {

      },

      setPorcess: function(process) {
        this.bean.auditProcess = process;
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

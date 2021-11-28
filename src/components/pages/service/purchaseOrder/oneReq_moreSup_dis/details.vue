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
        <span>提交人</span>
        <el-input :value="userInfo.name" disabled v-if="operation == STATUS.ADD"></el-input>
        <el-input :value="bean.subUserName" disabled v-else></el-input>
      </div>

      <div class="input-block">
        <span>部门</span>
        <el-input :value="bean.organizationName" disabled></el-input>
      </div>

      <div class="input-block">
        <span>状态</span>
        <el-select v-model="bean.status" :placeholder="$t('quanbu')" clearable disabled>
          <el-option v-for="(item,statusIndex) in options.status" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <br></br>

      <div class="input-block">
        <span>采购类型</span>
        <el-select v-model="bean.type" clearable disabled>
          <el-option v-for="(item,statusIndex) in options.type" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>交货时间</span>
        <el-date-picker v-model="bean.deliveryTime" type="date" placeholder="选择日期">
        </el-date-picker>
      </div>

      <div class="input-block">
        <span>交货地点</span>
        <el-autocomplete v-model="bean.deliveryLocation" :fetch-suggestions="querySearchAsync" :debounce="0"
          placeholder="请输入地点"></el-autocomplete>
      </div>

      <br>


      <div class="input-block">
        <span>供应商</span>
        <el-select v-model="bean.supplierId" title="请选择供应商" :placeholder="bean.warehouseTypeId==''? '请选择供应商':$t('quanbu')"
          clearable>
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
        <el-select v-model="bean.supplierAgreementId" title="请选择供应商协" :placeholder="bean.supplierId==''? '请先选择供应商协议':$t('quanbu')"
          clearable :disabled="bean.supplierId=='' || bean.status != STATUS.UNCOMMIT">
          <el-option v-for="item in options.supplierAgreement" :key="item.id" :label="item.name == undefined? '未命名协议':item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>


      <br>

      <div class="input-block">
        <span>邮轮</span>
        <el-select v-model="bean.warehouseTypeId" :placeholder="$t('quanbu')" :disabled="bean.status != STATUS.UNCOMMIT"
          clearable>
          <el-option v-for="item in options.cruise" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="input-block">
        <span>航次</span>
        <el-select v-model="bean.taskId" title="请选择邮轮" :placeholder="bean.warehouseTypeId==''? '请选择邮轮':$t('quanbu')"
          clearable :disabled="bean.warehouseTypeId=='' || bean.status != STATUS.UNCOMMIT">
          <el-option style="height: 50px;" v-for="item in options.routes" :key="item.taskId" :label="item.taskName"
            :value="item.taskId">
            <div style="line-height: 25px;">
              <span>{{item.taskName}}</span> <br>
              <span class="font6"><span class="blue">{{item.startTime}}</span><span class="red">~~</span><span class="blue">{{item.endTime}}</span></span>
            </div>
          </el-option>
        </el-select>
      </div>


      <div class="input-block">
        <span>说明</span>
        <el-input v-model="bean.description" :disabled="bean.status != STATUS.UNCOMMIT"></el-input>
      </div>



    </div>

    <div class="public-table-header">

      <el-button size="mini" type="warning" v-if="bean.status != STATUS.UNCOMMIT">审核中</el-button>

      <el-button icon="" @click="add()" size="mini" type="success" v-if="operation == STATUS.ADD">保存</el-button>
      <el-button icon="" @click="update()" size="mini" type="success" v-if="operation == STATUS.UPDATE">保存</el-button>

      <el-button @click="add(true)" icon="" size="mini" type="warning" v-if="operation == STATUS.ADD && bean.status == STATUS.UNCOMMIT">直接提交</el-button>
      <el-button @click="update(true)" icon="" size="mini" type="warning" v-if="operation == STATUS.UPDATE && bean.status == STATUS.UNCOMMIT">直接提交</el-button>


      <el-button @click="openAddPop" icon="el-icon-s-order" class="right" size="mini" type="success" v-if="bean.status == STATUS.UNCOMMIT">添加物品</el-button>

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

      <el-button @click="downloadPDF" icon="el-icon-download" size="mini" type="primary" v-if="false">下载PDF</el-button>

    </div>

    <el-table :data="addItems" style="width: 100%" default-expand-all cell-class-name="public-table-cell" height="500">
      <el-table-column type="expand" width="50">
        <template slot-scope="scope">
          <div class="margin-left30 flexColumn">
            <div class="font-bold flexRow" style="line-height: 28px;">
              <div class="flex1 text-align-center">
                申请单号
              </div>
              <div class="flex1 text-align-center">
                申请时间
              </div>
              <div class="flex1 text-align-center">
                采购量
              </div>
              <div class="flex1 text-align-center">
                申请人
              </div>
              <div class="flex1 text-align-center">
                所属部门
              </div>
              <div class="flex1 text-align-center">
                航次
              </div>
              <div class="flex1 text-align-center">
                <el-button @click="openAddListPop(scope.row)" size="mini" type="success">添加</el-button>
              </div>
            </div>

            <div class="flexRow table-in-table" v-for="order in scope.row.list">

              <div class="flex1 text-align-center">
                {{order.code}}
              </div>
              <div class="flex1 text-align-center">
                {{order.subTime}}
              </div>
              <div class="flex1 text-align-center">
                <el-input-number v-model="order.number" :step="1" :min="scope.row.moq" :max="order.maxNumber" size="mini"></el-input-number>
              </div>
              <div class="flex1 text-align-center">
                {{order.subUserName}}
              </div>
              <div class="flex1 text-align-center">
                {{order.organizationName}}
              </div>
              <div class="flex1 text-align-center">
                {{order.route}}({{order.taskStartTime}}~~{{order.taskEndTime}})
              </div>
              <div class="flex1 text-align-center">
                <el-button @click="listSplice(scope.row.id,order)" type="danger" size="mini">删除</el-button>
              </div>
            </div>

          </div>

        </template>
      </el-table-column>
      <el-table-column label="物品编码" prop="code" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="物品" prop="name" align="center" min-width="200">
      </el-table-column>
      <el-table-column label="条形码" prop="barCode" align="center" min-width="180">
      </el-table-column>
      <el-table-column label="品牌" prop="brandName" align="center" min-width="100">
      </el-table-column>
      <el-table-column label="可用库存" prop="availStock" align="center" min-width="80">
      </el-table-column>
      <el-table-column label="总库存" prop="totalStock" align="center" min-width="80">
      </el-table-column>
      <el-table-column label="单位" prop="purchaseUnit" align="center" min-width="80">
      </el-table-column>
      <el-table-column label="总需量" prop="demandNumber" align="center" min-width="120">
      </el-table-column>
      <el-table-column label="单价(毛假)" prop="basisPrice" align="center" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.price}}
        </template>
      </el-table-column>
      <el-table-column label="预估总金额" align="center" min-width="120">
        <template slot-scope="scope">
          {{scope.row.price * scope.row.demandNumber}}
        </template>
      </el-table-column>
      <el-table-column label="物品类别" prop="categoryName" align="center" min-width="120">
      </el-table-column>
      <el-table-column label="物料类型" prop="typeName" align="center" min-width="120">
      </el-table-column>
      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="200">
        <template slot-scope="scope">
          <el-button @click="itemSplice(scope.row)" size="mini" type="danger" icon="el-icon-s-release" :disabled="bean.status != STATUS.UNCOMMIT"
            circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    </el-table>

    <!-- 		<pop-bg ref="addItems">
			<add-item></add-item>
		</pop-bg> -->
    <el-dialog :custom-class="['dialog-card','self-card']" :visible.sync="inAdd" :append-to-body="true">
      <add-item slot @itemAppend="itemAppend" @itemSplice="itemSplice" v-if="inAdd"></add-item>
    </el-dialog>
    <el-dialog :custom-class="['dialog-card','self-card']" :visible.sync="witchMaterial.inAdd" :append-to-body="true">
      <add-request slot :materialId="witchMaterial.materialId" :checkList="witchMaterial.checkList" @listAppend="listAppend"
        @listSplice="listSplice" v-if="witchMaterial.inAdd"></add-request>
    </el-dialog>
  </div>

</template>

<script>
  import addItem from './detailsAddItem.vue'
  // import popBg from '../../../util/contentPop/index.vue'
  import addRequest from './addPurchaseRequest.vue'

  export default {
    components: {
      addRequest,
      // popBg,
      addItem
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
          type: [{
              name: '普通采购',
              value: 0
            },
            {
              name: '协议采购',
              value: 1
            }
          ],
          deliveryLocations: deliveryLocations
        },

        addItems: [],
        inAdd: false,


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
          status: 0,
          ratio: 0,
          items: []
        },

        //正在初始化
        initData: true,

        authAPI: {
          isEdit: true
        },

        witchMaterial: {
          inAdd: false,
          materialId: null,
          checkList: []
        }



      }
    },
    watch: {
      'addItems': {
        handler: function(newV, oldV) {
          // var reg = /^[0-9]{0,}$/
          // var that = this;
          // for (var i in newV) {
          // 	var demo = newV[i]
          // 	console.log("num", demo.number)
          // 	if (!reg.test(demo.number)) {
          // 		demo.number = parseInt(demo.number);
          // 		if (isNaN(demo.number)) {
          // 			demo.number = 10;
          // 		}
          // 	} else {
          // 		this.bean.items[i].number = parseInt(demo.number);
          // 	}
          // }
        },
        deep: true
      },
      'bean.warehouseTypeId': {
        handler: function(newV) {
          if (newV != '') {
            this.initOptionsRoute();
            this.bean.taskId = '';
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

          if (newV != '') {
            that.initOptionsAgreement();
          }
        },
        deep: true
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

            setTimeout(function() {


              var data = response.data;

              that.bean = data.data;


              var addItems = JSON.parse(JSON.stringify(data.data.items))
              that.addItems = addItems;

              var items = []
              for (var i in addItems) {
                var demo = addItems[i];

                for (var index in demo.list) {
                  var demoInner = demo.list[index]

                  var detial = {
                    purchaseRequestId: demoInner.purchaseRequestId,
                    materialId: demoInner.materialId,
                    supplierId: demoInner.supplierId,
                    supplierAgreementId: demoInner.supplierAgreementId,
                    supplierAgreementMaterialId: demoInner.supplierAgreementMaterialId,
                    number: demoInner.number,
                    price: demoInner.basisPrice
                  }
                  items.push(detial);
                }


              }

              that.bean.items = items;

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
          var itemDemo = addItems[i];
          if (itemDemo.list != undefined) {
            for (var index in itemDemo.list) {
              var listDemo = itemDemo.list[index];
              list.push({
                materialId: listDemo.materialId,
                purchaseRequestMaterialId: listDemo.purchaseRequestMaterialId,
                number: listDemo.number,
                basisPrice: itemDemo.price,
                supplierId: that.bean.supplierId,
                supplierAgreementId: that.bean.supplierAgreementId,
                supplierAgreementMaterialId: itemDemo.supplierAgreementMaterialId
              })
            }
          }
        }

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
            //交货地点
            deliveryLocation: that.bean.deliveryLocation,
            //备注
            deliveryTime: that.bean.deliveryTime,
            //说明
            description: that.bean.description,
            //税率
            texRate: that.bean.texRate,
            //采购类数量
            list: list,
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

            if (data.code == that.STATUS.SUCCESS) {
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


        axios({
          method: 'post',
          url: '/purchaseRequest/order/update',
          data: {
            id: that.bean.id,
            //邮轮
            warehouseTypeId: that.bean.warehouseTypeId,
            //航次
            taskId: that.bean.taskId,
            //仓库Id
            warehouseId: that.bean.warehouseId,
            //说明
            description: that.bean.description,
            //备注
            remark: that.bean.remarks,
            //采购类数量
            items: that.bean.items,
            //是否直接提交
            status: commit == undefined ? null : commit ? 1 : null,
          },
          df: false
        }).then((response) => {

          setTimeout(function() {
            var data = response.data;

            if (data.code == that.STATUS.SUCCESS) {
              that.addItems = [];
              that.bean.items = [];
              that.updateSuccess(true, '修改成功<br>修改人:<span class="green">' + that.userInfo.name +
                '</span><br>单号:<span class="blue">' + that.bean.code + '</span>')
              that.initPurchaseRequest();
              that.$parent.initTableList()
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
            cruise: true
          }
        }).then((response) => {
          if (!response) {
            return
          }

          that.initData = false;
          var data = response.data;

          that.options.cruise = data.data.cruise
          that.options.supplier = data.data.supplier

          if (callBack != undefined && callBack != null) {
            callBack(that);
          }

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
              warehouseTypeId: that.bean.warehouseTypeId
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



      uploadClick: function() {
        document.getElementById('excel').click();
      },
      excelChange: function() {


        var that = this;

        let files = document.getElementById('excel').files;
        let file = document.getElementById('excel').files[0];

        if (files == undefined) {
          return
        }

        that.upload.file = file;
        that.upload.fileName = file.name;

      },

      itemAppend: function(demo) {
        var that = this;


        var demoParsee = JSON.parse(JSON.stringify(demo));

        //用于 显示
        that.addItems.push(demoParsee);


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

      listAppend: function(materailId, target) {
        var that = this;

        var materials = that.addItems;
        for (var i in materials) {
          var demo = materials[i];
          if (demo.id == materailId) {
            demo.list = demo.list == undefined ? [] : demo.list;
            // code,subTime,number,subUserName,organizationName,route,taskStartTime,taskEndTime
            demo.list.push({
              code: target.code,
              subTime: target.subTime,
              number: target.number,
              maxNumber: target.number,
              subUserName: target.code,
              organizationName: target.organizationName,
              route: target.taskName,
              taskStartTime: target.taskStartTime,
              taskEndTime: target.taskEndTime,
              purchaseRequestId: target.purchaseRequestId,
              purchaseRequestMaterialId: target.purchaseRequestMaterialId,
              materialId: target.materialId
            });
            // that.addItems.splice(i,1);
            // that.addItems.push(demo);
            that.$set(that.addItems, i, demo)
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
                that.$set(that.addItems, i, demo)
                break;
              }
            }
          }
        }

      },

      openAddPop: function() {
        var that = this;

        if (that.bean.supplierAgreementId == '') {

          that.$notify({
            title: '警告',
            type: 'warning',
            message: '<span class="red font16">请先选择协议</span>',
            duration: 2000,
            dangerouslyUseHTMLString: true
          })

          return
        }

        this.inAdd = true;
      },

      openAddListPop: function(row) {
        var that = this;
        that.witchMaterial.materialId = row.id;
        that.witchMaterial.checkList = (row.list == undefined ? [] : row.list);

        that.witchMaterial.inAdd = true;

      },

      downloadPDF: function() {
        var that = this;
        var href = that.axios.defaults.baseURL + '/purchaseRequest/download.do?purchaseRequisitionID=' + that.details
          .purchaseRequisitionID
        window.open(href);
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

  .input-line {}

  .input-block {
    display: inline-block;
    margin-top: 10px;
    width: auto;
    margin-right: 20px;
  }

  .input-block>span {
    display: inline-block;
    width: 90px;
    text-align: right;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    padding: 0px 10px;
    border-radius: 5px;
    background: rgba(240, 240, 240, 1);
    margin-right: -5px;
  }

  .input-block>div {
    display: inline-block;
    width: 200px;
  }


  .more-width {
    width: 534px !important;
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

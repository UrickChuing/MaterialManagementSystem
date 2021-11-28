<template>
  <div>
    <div class="input-line">
      <div class="input-block">
        <span>协议名称</span>
        <el-input v-model="bean.name" clearable></el-input>
      </div>
      <div class="input-block">
        <span>协议开始日期</span>
        <el-date-picker v-model="bean.dateFrom" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
        </el-date-picker>
      </div>
      <div class="input-block">
        <span>协议结束日期</span>
        <el-date-picker v-model="bean.dateTo" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
        </el-date-picker>
      </div>
    </div>

    <div class="public-table-header">

      <template v-if="$parent.tree.operation == STATUS.UPDATE">
        <el-input v-model="materialsReason.name" size="mini" clearable placeholder="物品名称" style="width: 120px;"></el-input>
        <el-input v-model="materialsReason.code" size="mini" clearable placeholder="物品代码" style="width: 120px;"></el-input>

        <el-button @click="initTableList" icon="el-icon-search" type="success" size="mini" circle></el-button>
      </template>


      <el-button @click="inAdd=true;inAddType='BATCH';initCategory()" class="right" type="primary" size="mini" v-if="$parent.tree.operation == STATUS.UPDATE">批量添加物品</el-button>

      <el-button @click="updateSupplierAgreement" type="warning" size="mini" v-if="$parent.tree.operation == STATUS.UPDATE">保存</el-button>
      <el-button @click="addSupplierAgreement" type="warning" size="mini" v-if="$parent.tree.operation == STATUS.ADD">保存</el-button>

      <el-button @click="inAdd=true;initTableList()" class="margin-right10" type="success" size="mini">添加物品</el-button>

    </div>

    <div>

      <el-table :data="materials" style="width: 100%" default-expand-all cell-class-name="public-table-cell" height="500">
        <el-table-column fixed="left" type="expand" width="40" v-if="false">
          <template slot-scope="scope">

            <div class="sc-block" v-for="(packDemo,index) in scope.row.packages">
              <div>
                价格方案{{getNumberChineseStr(index + 1)}}
              </div>
              <!--              <div>
                moq :
                <el-input-number v-model.sync="packDemo.moq" :min="0" class="margin-left10 margin-right10" style="width: 120px;"
                  size="mini"></el-input-number>
                {{scope.row.purchaseUnit}}
              </div> -->
              <div class="margin-left40">
                价格 :
                <el-input-number v-model="packDemo.basisPrice" :min="0" class="margin-left10 margin-right10" style="width: 120px;"
                  size="mini"></el-input-number>
                元/{{scope.row.purchaseUnit}}
              </div>
              <div class="margin-left-auto margin-right20 font12">
                <span @click="deletePrice(scope.$index,scope.row,index)" class="margin-left15 text-underline red pointer"
                  v-if="index != 0 || scope.row.packages.length > 1">删除</span>
                <!-- <span @click="addPrice(scope.$index,scope.row)" class="text-underline green pointer margin-left10" v-if="index == scope.row.packages.length - 1">添加</span> -->
              </div>
            </div>

          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" align="center" min-width="150">
        </el-table-column>
        <el-table-column label="代码" prop="code" align="center" min-width="210">
          <template slot-scope="scope">
            {{scope.row.code}}
          </template>
        </el-table-column>
        <el-table-column label="类别" prop="categoryName" align="center" min-width="120">
        </el-table-column>
        <!--        <el-table-column label="类型" prop="typeName" align="center" min-width="120">
        </el-table-column> -->
        <el-table-column label="品牌" prop="brandName" align="center" min-width="180">
        </el-table-column>
        <el-table-column label="采购单位" prop="purchaseUnit" align="center" min-width="80" v-if="false">
        </el-table-column>
        <el-table-column fixed="right" label="价格" prop="applicationNo" align="center" width="300">
          <template slot-scope="scope">
            <div class="text-align-left">
              价格 :
              <el-input-number v-model="scope.row.packages[0].basisPrice" :min="0" class="margin-left10 margin-right10" style="width: 150px;"
                size="mini"></el-input-number>
              {{scope.row.purchaseUnit == undefined? '元':'元/'+scope.row.purchaseUnit}}
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="60">
          <template slot-scope="scope">
            <el-button icon="el-icon-minus" @click="deleteMaterial(scope.row)" type="danger" size="mini" circle></el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>


    <el-dialog title="添加物品" :modal-append-to-body="false" :append-to-body="true" :visible.sync="inAdd" width="800px"
      center>

      <template v-if="inAddType == 'SINGLE'">
        <div class="public-table-header" style="margin-top: 0px;" @keyup.enter="table.page=1;initTableList()">
          <el-input v-model="table.reason.name" style="width: 150px;" size="mini" placeholder="物品名称" clearable></el-input>
          <el-input v-model="table.reason.code" style="width: 150px;" size="mini" placeholder="物品代码" clearable></el-input>
          <el-input v-model="table.reason.categoryName" style="width: 150px;" size="mini" placeholder="物品类别" clearable></el-input>
          <el-button @click="table.page=1;initTableList()" icon="el-icon-search" :disabled="table.inSelect" size="mini" type="warning"
            circle></el-button>
        </div>
        <el-table :data="table.list" style="width: 100%" cell-class-name="public-table-cell">
          <el-table-column label="代码" prop="code" align="center" min-width="160">
            <template slot-scope="scope">
              {{scope.row.code}}
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name" align="center" min-width="180">
          </el-table-column>
          <el-table-column label="类别" prop="categoryName" align="center" min-width="150">
          </el-table-column>
          <el-table-column label="类型" prop="typeName" align="center" min-width="150">
          </el-table-column>
          <el-table-column label="品牌" prop="brandName" align="center" min-width="150">
          </el-table-column>
          <el-table-column fixed="right" label="采购单位" prop="purchaseUnit" align="center" min-width="80">
          </el-table-column>
          <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="60">
            <template slot-scope="scope">
              <el-button icon="el-icon-plus" v-if="!scope.row.add" @click="addMaterial(scope.row)" type="success" size="mini"
                :disabled="table.inSelect" circle></el-button>
              <el-button icon="el-icon-minus" v-else @click="deleteMaterial(scope.row)" type="danger" size="mini"
                :disabled="table.inSelect" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="flexCenter margin-top20">
          <el-pagination @size-change="(val)=>{table.pageSize=val;initTableList()}" @current-change="(val)=>{table.page=val;initTableList()}"
            :current-page="table.page" :page-sizes="[10, 20, 30, 40 , 50]" :page-size="table.pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="table.total">
          </el-pagination>
        </div>

      </template>

      <template v-else-if="inAddType == 'BATCH'">

        <div class="flexCenter">
          <div class="input-block">
            <span>类别</span>
            <el-cascader v-model="batchAdd.reason.materialCategoryId" popper-class="z-index2022" style="width: 325px;" :options="options.category"
              :props="{ multiple: true, label:'name' , value:'id' }" collapse-tags clearable></el-cascader>
            <el-button @click="initCategory()" icon="el-icon-refresh" type="success" circle plain></el-button>
          </div>
        </div>
        <div class="flexCenter">
          <div class="input-block">
            <span>物品名称包含</span>
            <el-input v-model="batchAdd.reason.name" style="width: 375px;" clearable></el-input>
          </div>
        </div>
        <div class="flexCenter">
          <div class="input-block">
            <span>物品名称不包含</span>
            <el-input v-model="batchAdd.reason.notName" style="width: 375px;" clearable></el-input>
          </div>
        </div>
        <div class="flexCenter">
          <div class="input-block">
            <span>物品代码包含</span>
            <el-input v-model="batchAdd.reason.notCode" style="width: 375px;" clearable></el-input>
          </div>
        </div>
        <div class="flexCenter">
          <div class="input-block">
            <span>物品代码不包含</span>
            <el-input v-model="batchAdd.reason.code" style="width: 375px;" clearable></el-input>
          </div>
        </div>

        <div class="flexCenter margin-top20">
          <span class="blue font14 margin-right10 font-bold">此操作不可逆，请确认</span><el-checkbox class="bright-border" v-model="batchAdd.agree" size="mini"></el-checkbox>
        </div>

        <div class="flexCenter">
          <el-button @click="batchAddMaterials" type="danger" class="margin-top10" plain>批量添加</el-button>
        </div>



      </template>

    </el-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {

        inAdd: false,
        inAddType: 'SINGLE', //SINGLE 单一选择，BATCH 批量

        batchAdd: {
          reason: {
            name: '',
            code: '',
            notName: '',
            notCode: '',
            materialCategoryId: [],
          },
          agree:false
        },

        options: {
          category: []
        },

        bean: {
          name: '',
          dateFrom: '',
          dateTo: '',
          supplierId: this.$parent.tree.select.id,
          supplierCode: this.$parent.tree.select.code,
          packages: []
        },

        materials: [], //协议物品
        materialsBackUp: [],
        materialsReason: {
          name: '',
          code: ''
        }, //查询
        materialsReasonSetTimeOut: null,

        dateFromTo: [],

        table: {
          list: [],
          page: 1,
          pageSize: 10,
          total: 0,
          reason: {
            name: '',
            code: '',
            categoryName: ''
          },
          inSelect: false
        }

      }
    },
    watch: {
      dateFromTo: {
        handler: function(newV) {
          var that = this;
          if (newV !== null && newV.length !== 0) {
            that.bean.dateFrom = newV[0]
            that.bean.dateTo = newV[1]
          } else {
            that.bean.dateFrom = ''
            that.bean.dateTo = ''
          }
        },
        deep: true
      },
      materialsReason: {
        handler: function(newV, oldV) {
          var that = this;

          clearTimeout(that.materialsReasonSetTimeOut);
          setTimeout(function() {
            var list = that.materialsBackUp;
            if (newV.name != '')
              list = that.listFilter(list, 'name', newV.name);
            if (newV.code != '')
              list = that.listFilter(list, 'code', newV.code);

            that.materials = list;
          }, 250)


        },
        deep: true
      }
    },
    created: function() {
      var that = this;


      if (that.$parent.tree.operation == that.STATUS.UPDATE) {
        that.initBean();
      }
    },
    methods: {

      initBean: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/supplierAgreement/bean',
          data: {
            id: that.$parent.supplierAgreement.id
          }
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;

          var bean = data.data;
          bean.dateFrom = bean.dateFrom == undefined ? '' : that.getCreateDateStr(new Date(bean.dateFrom));
          bean.dateTo = bean.dateTo == undefined ? '' : that.getCreateDateStr(new Date(bean.dateTo));

          that.bean = data.data;

          that.materials = data.data.materials;
          that.materialsBackUp = JSON.parse(JSON.stringify(data.data.materials));

          delete that.bean.materials;

        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      initTableList: function() {
        var that = this;
        var axios = that.axios;

        that.table.inSelect = true;
        axios({
          method: 'post',
          url: '/supplierAgreement/material/list',
          data: {
            reason: that.table.reason,
            page: that.table.page,
            pageSize: that.table.pageSize
          },
          df: false
        }).then((response) => {
          that.table.inSelect = false;
          if (!response) {
            return;
          }
          var data = response.data;

          var list = data.data;

          for (var index in list) {
            var demo = list[index];
            demo.add = false;
            demo.show = true;
            for (var i in that.materials) {
              var mDemo = that.materials[i];
              if (demo.id === mDemo.id) {
                demo.add = true;
              }
            }
          }


          that.table.list = list;
          that.table.total = data.total;

        }).catch((error) => {
          that.table.inSelect = false;
          that.errorhanding(error)
        })
      },

      initCategory: function() {
        var that = this;

        var axios = that.axios;

        axios({
          method: 'post',
          url: '/material/category/tree',
          data: {},
          df: false
        }).then((response) => {
          if (!response) {
            return
          }
          var data = response.data;

          var category = data.data

          if (that.operation == that.STATUS.ADD) {
            if (category.length != undefined && category.length != 0) {
              var cId = category != [] ? category[0].id : ''
              that.batchAdd.reason.materialCategoryId = []
            }
          }
          that.options.category = category;

          if (that.operation == that.STATUS.UPDATE) {
            that.initBean();
          }

        }).catch((error) => {
          that.table.inSelect = false;
        });
      },

      addSupplierAgreement: function() {
        var that = this;
        var axios = that.axios;

        if (that.bean.name.trim() == '') {
          that.warningInfo('请输入协议名称')
          return
        }

        var agreementMaterails = [];

        var materials = that.materials
        for (var i in materials) {
          var demo = materials[i];
          if (demo.packages.length != 0) {
            for (var index in demo.packages) {
              var packDemo = demo.packages[index];

              agreementMaterails.push({
                materialId: demo.id,
                basisPrice: packDemo.basisPrice,
                moq: packDemo.moq
              });
            }
          }
        }

        that.bean.packages = agreementMaterails;

        axios({
          method: 'post',
          url: '/supplierAgreement/add',
          data: that.bean,
          df: false,
          loading: true
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          if (data.code == that.STATUS.SUCCESS) {
            that.addSuccess(true);
            that.initTableList();
            that.$parent.tree.operation = that.STATUS.CHOSEN
            that.$parent.initAgreement()
          } else {
            that.addSuccess(false)
          }
        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      updateSupplierAgreement: function() {
        var that = this;
        var axios = that.axios;

        var that = this;
        var axios = that.axios;

        if (that.bean.name.trim() == '') {
          that.warningInfo('请输入协议名称')
          return
        }

        var agreementMaterails = [];

        var materials = that.materials
        for (var i in materials) {
          var demo = materials[i];
          if (demo.packages.length != 0) {
            for (var index in demo.packages) {
              var packDemo = demo.packages[index];

              agreementMaterails.push({
                materialId: demo.id,
                basisPrice: packDemo.basisPrice,
                moq: packDemo.moq
              });
            }
          }
        }

        that.bean.packages = agreementMaterails;

        var bean = JSON.parse(JSON.stringify(that.bean));
        debugger
        bean = {
          id: bean.id,
          name: bean.name,
          dateFrom: bean.dateFrom,
          dateTo: bean.dateTo,
          packages: bean.packages
        }

        axios({
          method: 'post',
          url: '/supplierAgreement/update',
          data: bean,
          df: false,
          loading: true
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          if (data.code == that.STATUS.SUCCESS) {
            that.updateSuccess(true);
            that.initTableList();
            that.$parent.tree.operation = that.STATUS.CHOSEN;
            that.$parent.initAgreement()


          } else {
            that.updateSuccess(false)
          }
        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      batchAddMaterials: function() {
        var that = this;

        if(!that.batchAdd.agree){
          that.$notify({
            message: '请勾选确认！',
            type: 'error',
            duration: 3000,
            dangerouslyUseHTMLString: true
          });
          return;
        }

        var axios = that.axios;

        axios({
          method: 'post',
          url: '/supplierAgreement/batchAdd',
          data: {
            id:that.$parent.supplierAgreement.id,
            reason:that.batchAdd.reason
          },
          df: false,
          loading: true
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          if (data.code == that.STATUS.SUCCESS) {
            that.addSuccess(true);
            that.initTableList();
            that.$parent.tree.operation = that.STATUS.CHOSEN
            that.$parent.initAgreement()
          } else {
            that.addSuccess(false)
          }
        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      addMaterial: function(row) {
        row.add = true;
        row.packages = [

          {
            moq: 10,
            basisPrice: 10.000,
            materialId: row.id,
          }

        ]
        this.materials.push(row)
      },
      deleteMaterial: function(row) {
        row.add = false;
        var that = this;
        that.$confirm('您确定要删除？', '提示')
          .then(_ => {
        for (var i in that.materials) {
          var demo = that.materials[i];
          if (demo.id === row.id) {
            that.materials.splice(i, 1)
          }
        }
         }).catch(_ => {});
      },
      addPrice: function(index, material) {

        if (material.packages.length >= 5) {
          this.$notify({
            title: '警告',
            type: 'warning',
            message: '最多只可设置<span class="blue">五</span>个价格方案',
            duration: 5000,
            dangerouslyUseHTMLString: true
          })

          return
        }

        material.packages.push({
          moq: 10,
          basisPrice: 10.000,
          materialId: material.id,
        });
        this.$set(this.materials, index, material)

      },
      deletePrice: function(index, material, packgeIndex) {

        material.packages.splice(packgeIndex, 1);
        this.$set(this.materials, index, material)

      },
      getNumberChineseStr: function(index) {
        index = parseInt(index)
        if (index < 10) {
          switch (index) {
            case 1:
              return "一";
              break;
            case 2:
              return "二";
              break;
            case 3:
              return "三";
              break;
            case 4:
              return "四";
              break;
            case 5:
              return "五";
              break;
          }
        }

      },

      listFilter: function(listBackUp, key, value) {
        var res = [];

        listBackUp.forEach((val) => {
          var name = val[key] + '';
          if (name.trim().indexOf(value) > -1)
            res.push(val)
        });

        return res;
      }

    }
  }
</script>

<style scoped="scoped">

  .input-block>span{
    width: 135px !important;
  }

  .sc-block {
    display: flex;
    flex-direction: row;
    overflow: hidden;
    transition: .3s;
    font-size: 15px;
    width: 100%;
    border: 1px rgba(230, 230, 230, 1) solid;
  }


  i.show-inline-hide {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    border: 1px rgba(230, 230, 230, 1) solid;
    background: rgba(245, 245, 245, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 6%;
  }

  .sc-block>div {
    height: 38px;
    line-height: 38px;
  }

  .sc-block>div:first-child {
    margin-left: 6%;
    margin-right: 10%;
  }


  .main-line.header {
    font-weight: bold;
  }

  .main-line {
    border: solid 1px rgba(245, 245, 245, 1);
  }

  .main-line>div:first-child {
    height: 38px;
    line-height: 38px;
    display: flex;
    flex-direction: row;
    text-align: center;
    font-size: 14px;
  }

  .main-line>div:first-child>div {
    flex: 1;
  }
</style>


<style>
  .bright-border span.el-checkbox__inner{
    border: 1px solid rgba(64, 158, 255, 1);
  }
</style>

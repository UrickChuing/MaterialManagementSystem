<template>
  <div style="height: 500px;">

    <div class="public-table-header">

      <el-button @click="insertList" size="mini" type="success">提交</el-button>

      <div class="right">

        <el-popover placement="bottom" width="120" trigger="click" popper-class="z-index2022">

          <div class="flexColumn" style="width: 120px;">
            <template v-for="(el,index) in labelController">
              <el-checkbox v-model="labelController[index]" @change="updateView">{{getLabel(index)}}</el-checkbox>
            </template>
          </div>

          <button class="el-icon-s-operation font18" slot="reference"></button>
        </el-popover>

      </div>
    </div>

    <el-table :data="list" style="width: 100%" height="460">

      <template v-for="(label,index) in labels">
        <el-table-column :prop="label" :label="index" width="180" align="center" v-if="labelController[label] && label != 'materialCategoryId' && label != 'properties'">
        </el-table-column>
        <el-table-column :prop="label" :label="index" align="center" width="120" v-if="labelController[label] && label == 'materialCategoryId'">
          <template slot-scope="scope">
            {{getCategory(scope.row.materialCategoryId)}}
          </template>
        </el-table-column>
        <el-table-column :prop="label" :label="index" align="center" width="120" v-if="labelController[label] && label == 'properties'">
          <template slot-scope="scope">
            {{scope.row.properties == 0? '不可销售':'可销售'}}
          </template>
        </el-table-column>
      </template>


      <el-table-column fixed="right" label="操作" prop="applicationNo" align="center" width="120">
        <template slot-scope="scope">
          <el-button @click="remove(scope.$index)" size="mini" type="danger" icon="el-icon-s-release" circle></el-button>
        </template>
      </el-table-column>
    </el-table>



  </div>
</template>

<script>
  export default {
    props: ['materials'],
    data() {
      return {
        parent: this.$parent.$parent,

        labels: [],
        list: [],
        category: [],

        labelController: {},
        getLabel: function(code) {

          for (var i in this.labels) {
            if (this.labels[i] == code) {
              return i;
            }
          }
        },
        getCategory: function(id) {
          for (var i in this.category) {
            if (id == this.category[i].id) {
              return this.category[i].name;
            }
          }
        }
      }
    },
    created: function() {
      var excel = JSON.parse(JSON.stringify(this.materials));
      this.labels = excel.label;
      this.list = excel.list;
      this.initCategory();

      for (var i in excel.label) {
        this.labelController[excel.label[i]] = false;
        if (excel.label[i] == 'code' || excel.label[i] == 'name' || excel.label[i] == 'materialCategoryId') {
          this.labelController[excel.label[i]] = true;
        }
        if (excel.label[i] == 'popPrice') {
          this.labelController[excel.label[i]] = true;
        }
        if (excel.label[i] == 'barCode') {
          this.labelController[excel.label[i]] = true;
        }
        if (excel.label[i] == 'nameAbb') {
          this.labelController[excel.label[i]] = true;
        }
        if (excel.label[i] == 'properties') {
          this.labelController[excel.label[i]] = true;
        }

      }

    },
    methods: {
      updateView: function() {
        this.$forceUpdate();
      },
      remove: function(index) {
        this.list.splice(index, 1)
      },
      insertList: function(){
        var that = this;
        var axios = that.axios;

        axios({
        	method: 'post',
        	url: '/material/add/excel',
        	data: that.list,
          df:false,
          loading:true
        }).then((response) => {
          if (!response) {
          	return;
          }
          var data = response.data;

          if(data.code === that.STATUS.SUCCESS){
            that.addSuccess(true);
            that.parent.inAdd = false;
            that.parent.initTableList();
          }else{
            //throw data.msg;
            if(data.code == -405 || data.msg== "System Error:<br>Other Exception,Not Mine.<br><br>Error Message:class com.mysql.cj.jdbc.exceptions.MysqlDataTruncation<br>Data truncation: Data too long for column 'purchase_specification' at row 1"
            )
            that.errorhanding("导入的数据中存在某些数据过长，请检查")
          }

        }).catch((error) => {
        	that.errorhanding(error)
        });
      },
      initCategory: function() {
        var that = this;
        var axios = that.axios;
        axios({
          method: 'post',
          url: '/material/category/list',
          data: {},
          df: false
        }).then((response) => {
          if (!response)
            return;

          var data = response.data;
          if (data.code == that.STATUS.SUCCESS) {
            that.category = data.data;
          } else {
            throw data.msg;
          }
        }).catch((error) => {
          that.errorhanding(error)
        })
      }
    }
  }
</script>

<style>
</style>

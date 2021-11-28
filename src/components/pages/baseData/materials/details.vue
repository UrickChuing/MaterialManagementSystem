<template>
  <div>
    <div class="title">
      <el-button type="warning" @click="$parent.otherPage.PAGE = 'INDEX'" plain>返回物品列表</el-button>
      <div> > 新增物品</div>
    </div>
    <div class="flexCenter">
      <div>
        <div class="flexRowWarp  margin-top30">
          <div class="flexCenter" style="width: 360px;">
            <div class="upload-button-div pointer" @click="uploadClick()">
              <input type="file" id="imageUpload" style="display: none;" name="image" @change="imageChange($event)"
                accept="image/jpg,image/jpeg,image/png">
              <i class="el-icon-upload"></i>
              <span style="display: inline-block;text-align: center;vertical-align: top;line-height: 20px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden;"
                :style="{width:base64 == null?'':'55px'}">
                <template v-if="operation == STATUS.ADD">
                  {{base64 == null? '没有图片...':'已选择'}}
                </template>
                <template v-if="operation == STATUS.UPDATE">
                  {{bean.name}}
                </template>
              </span>
              <template v-if="operation == STATUS.ADD">
                <button class="pointer" v-if="base64==null">选择</button>
                <button class="pointer" @click.stop="base64 = null" v-else>清除</button>
              </template>
              <template v-else-if="operation == STATUS.UPDATE">
                <button class="pointer" v-if="base64==null && bean.picUrl.trim().length == 0">选择</button>
                <button class="pointer" @click.stop="base64 = null;bean.picUrl='';" v-else>清除</button>
              </template>
              <div class="image-block">

                <template v-if="operation == STATUS.ADD">
                  <img :src="base64" v-if="base64 != null" />
                  <div class="flexCenter" style="font-size: 170px;color: rgba(230,230,230,1);height: 100%;width: 100%;"
                    v-else>
                    ?
                  </div>
                </template>
                <template v-else-if="operation == STATUS.UPDATE">
                  <!-- rand=h9xqeI -->
                  <img :src="axios.defaults.baseURL + bean.picUrl + '?' + Date.now()" v-if="bean.picUrl.trim().length != 0" />
                  <img :src="base64" v-else-if="bean.picUrl.trim().length == 0 && base64!=null" />
                  <div class="flexCenter" style="font-size: 120px;color: rgba(230,230,230,1);height: 100%;width: 100%;"
                    v-else>
                    ?
                  </div>
                </template>


              </div>
            </div>
          </div>
          <div style="padding-left: 25px;">
            <div class="input-block" style="display: block;margin-top: 15px;">
              <span><span class="red">*</span>物品编码</span>
              <span class="margin-left5" style="text-align: center !important;padding-left: 5px;padding-right: 5px;">
                {{bean.preCode == ''? '&nbsp;':bean.preCode}}
              </span>
              <el-input v-model="bean.suffixCode" style="width: 145px;" placeholder="自动生成" disabled>
              </el-input>
            </div>
            <div class="input-block">
              <span><span class="red"></span>物品条码</span>
              <el-input v-model="bean.barCode" clearable></el-input>
            </div>
            <div class="input-block" style="display: block;">
              <span><span class="red">*</span>名称</span>
              <el-input v-model="bean.name" clearable></el-input>
            </div>
            <div class="input-block" style="display: block;">
              <span>简称</span>
              <el-input v-model="bean.nameAbb" clearable></el-input>
            </div>
          </div>
        </div>

        <div class="margin-top20"></div>
        <div class="input-block">
          <span><span class="red">*</span>类别</span>
          <el-cascader v-model="bean.materialCategoryId" :options="options.category" style="width: 205px;" :props="{ checkStrictly: true , label:'name' , value:'id' }"></el-cascader>
          <el-button @click="initCategory()" icon="el-icon-refresh" type="success" circle plain></el-button>
        </div>
        <div class="input-block">
          <!--          <span>物品类型</span>
          <el-select v-model="bean.materialTypeId" placeholder="请选择">
            <el-option v-for="item in options.type" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select> -->
        </div>
        <br>

        <div class="input-block">
          <span>品牌</span>
          <el-input v-model="bean.brandName" clearable></el-input>
        </div>
        <div class="input-block">
          <span>产地</span>
          <el-input v-model="bean.origin" clearable></el-input>
        </div>



        <div class="margin-top30"></div>
        <div class="input-block" style="display: none;">
          <span>销售规格</span>
          <el-input v-model="bean.salesSpecification" placeholder="12瓶 " style="width: 170px;" clearable></el-input>
          <el-input v-model="bean.salesUnit" placeholder="单位  例:箱" style="width: 75px;" clearable></el-input>
        </div>
        <div class="input-block">
          <span>采购规格</span>
          <el-input v-model="bean.purchaseSpecification" placeholder="规格: 500ml*12瓶" style="width: 170px;" clearable></el-input>
          <el-input v-model="bean.purchaseUnit" placeholder="箱" style="width: 75px;" clearable></el-input>
        </div>
        <div class="input-block">
          <span>尺寸</span>
          <el-input v-model="bean.dim" placeholder="250ml*100ml*250ml" style="width: 250px;" clearable></el-input>
        </div>
        <br>
        <div class="input-block" style="margin-right: 25px;">
          <span>体积</span>
          <el-input v-model="bean.volume" style="width: 218px;" clearable></el-input>
          <span class="red" style="width: 40px;text-align: center;">m³</span>
        </div>
        <div class="input-block">
          <span>重量</span>
          <el-input v-model="bean.weight" style="width: 218px;" clearable></el-input>
          <span class="red" style="width: 40px;text-align: center;">kg</span>
        </div>


        <div class="margin-top30"></div>
        <div class="input-block">
          <span>库存上限</span>
          <el-input v-model="bean.maxStock"></el-input>
        </div>
        <div class="input-block">
          <span>库存下限</span>
          <el-input v-model="bean.minStock"></el-input>
        </div>
        <br>
        <div class="input-block">
          <span>参考价格</span>
          <el-input v-model="bean.popPrice"></el-input>
        </div>
        <div class="input-block">
          <span>保质期限(天)</span>
          <template v-if="bean.duration == 0">
            <el-switch v-model="bean.duration" :inactive-value="0" class="margin-left10 margin-right10"
             style="width: 40px;" inactive-color="#ff4949" active-color="#13ce66">
            </el-switch>
            不启用(无)
          </template>
          <template v-else>
            <el-input-number v-model="bean.duration" controls-position="right" :min="1" :max="3650" style="width: 205px;"></el-input-number>
            <el-switch v-model="bean.duration" :inactive-value="0"  active-color="#13ce66" :active-value="bean.duration" style="width: 40px">
            </el-switch>
          </template>
        </div>
        <!--        <div class="input-block">
          <span><span class="red">*</span>属性</span>
          <el-select v-model="bean.properties" placeholder="全部">
            <el-option v-for="(item,index) in options.properties" :key="index" :label="item" :value="index">
            </el-option>
          </el-select>
        </div> -->
        <br>


        <div class="margin-top30"></div>
        <div class="input-block">
          <span style="float: left;margin-right: 0px;">说明</span>
          <el-input v-model="bean.description" type="textarea" :rows="3" style="width: 635px;" resize="none"></el-input>
        </div>




        <div class="flexCenter margin-top20">
          <el-button @click="add" type="primary" v-if="operation == STATUS.ADD">提交</el-button>
          <el-button @click="edit" type="primary" v-if="operation == STATUS.UPDATE">保存</el-button>
          <el-button type="warning" @click="$parent.otherPage.PAGE = 'INDEX'">返回</el-button>
        </div>


      </div>

    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

        operation: this.$parent.otherPage.status.details,

        parent: this.$parent,

        bean: {
          barCode: '',
          brandName: '',
          preCode: '',
          code: '',
          currentStock: '',
          deficitRatio: '',
          description: '',
          eName: '',
          eNameAbb: '',
          id: '',
          isDelete: '',
          lastPrice: '',
          materialCategoryId: '',
          materialTypeId: '',
          maxStock: '',
          minStock: '',
          name: '',
          nameAbb: '',
          origin: '',
          picUrl: '',
          popPrice: '',
          properties: '',
          purchaseSpecification: '',
          purchaseUnit: '',
          remarks: '',
          salesSpecification: '',
          salesUnit: '',
          status: '',
          volume: '',
          weight: '',
          dim: '',
          duration: 0
        },

        base64: null,


        options: {
          status: ['不可用', '可用'],
          properties: ['不可销售', '可销售'],
          brands: [],
          category: [],
          type: []
        },

        brandTimeOut: null

      }
    },
    watch: {
      'bean.materialCategoryId': {
        handler: function(newV) {
          this.getCategoryCode();
        },
        deep: true
      }
    },
    created: function() {
      var that = this;

      if (that.operation == that.STATUS.UPDATE) {
        that.bean.id = that.parent.otherPage.data.details.id;
      }

      console.log(that.operation)
      that.initType()
      that.initCategory()
    },
    methods: {
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
              that.bean.materialCategoryId = cId == '' ? [] : [cId]
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
      initType: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/material/type/list',
          data: {},
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;

          that.options.type = data.data;
          if (that.operation == that.STATUS.ADD) {
            if (data.data.length != undefined && data.data.length != 0)
              that.bean.materialTypeId = (data.data)[0].id
          }

        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      initBean: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/material/bean',
          data: {
            id: that.bean.id
          }
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;

          var bean = data.data


          bean.materialCategoryId = that.getAllParentIdDeepTree(bean.materialCategoryId, that.options.category)

          that.bean = bean

        }).catch((error) => {
          that.errorhanding(error)
        });

      },

      add: function() {
        var that = this;
        var axios = that.axios;

        if(!that.checkWay())
          return;

        var bean = JSON.parse(JSON.stringify(that.bean));

        var category = bean.materialCategoryId
        bean.materialCategoryId = category[category.length - 1]

        axios({
          method: 'post',
          url: '/material/add',
          data: {
            material: bean,
            base64: that.base64,
          },
          df: false
        }).then((response) => {

          if (!response) {
            return;
          }

          var data = response.data;

          var msg = null;
          if (data.code == that.STATUS.SUCCESS) {
            that.$parent.otherPage.PAGE = 'INDEX';
            that.$parent.initTableList();
          } else {
            msg = '<div><span>失败原因：<br>' +
              '1.物品<span class="blue">条码重复</span>' +
              '</span></div>'
          }
          that.addSuccess(data.code == that.STATUS.SUCCESS, msg)

        }).catch((error) => {
          that.errorhanding(error)
        });

      },

      edit: function() {
        var that = this;
        var axios = that.axios;

        if(!that.checkWay())
          return;

        var bean = JSON.parse(JSON.stringify(that.bean));

        // delete bean.code
        delete bean.updateTime;
        delete bean.updateUser;
        delete bean.createUser;
        delete bean.createTime;
        delete bean.auditUser;
        delete bean.auditTime;
        delete bean.auditStatus;
        delete bean.isDelete;
        delete bean.code;


        var list = bean.materialCategoryId;
        bean.materialCategoryId = list[list.length - 1];

        axios({
          method: 'post',
          url: '/material/update',
          data: {
            material: bean,
            base64: that.base64
          },
          df: false
        }).then((response) => {
          var data = response.data;

          if (data.code == 1) {
            that.$notify({
              type: 'success',
              title: '修改成功'
            });
            that.initBean();
            that.parent.initTableList();
          } else {
            that.$notify({
              type: 'success',
              title: '修改失败',
              message: '修改失败，参数错误或发生内部错误'
            });
          }

        }).catch((error) => {
          that.errorhanding(error)
        });

      },

      checkWay: function(){
        var that = this;
        var bean = that.bean;

        var msg = null;
        if(bean.name == null || bean.name.trim().length == 0){
          msg = '请填写物品名称';
        }
        if(bean.materialCategoryId == null || (Array.isArray(bean.materialCategoryId) && bean.materialCategoryId.length == 0)){
          msg = '请选择物品类别';
        }

        if(msg != null){
          that.$notify({
            title: '警告',
            message:msg,
            type: 'error',
            duration: 5000,
            dangerouslyUseHTMLString: true
          });
          return false;
        }

        return true;
      },

      uploadClick: function() {
        var files = document.getElementById('imageUpload');
        files.value = '';

        document.getElementById('imageUpload').click();
      },
      imageChange: function() {
        var that = this;
        var axios = that.axios;

        let files = document.getElementById('imageUpload');
        let file = document.getElementById('imageUpload').files[0]
        if (file == undefined) {
          return
        }

        let name = file.name
        let arr = name.split('.')
        // console.log(arr);
        // image/jpg,image/jpeg,image/png
        var nameSuffix = arr[arr.length - 1];
        if (nameSuffix != 'jpg' && nameSuffix != 'jpeg' && nameSuffix != 'png') {

          that.$notify.error({
            title: that.$t('错误'),
            message: that.$t('请上传jpg、jpeg、png格式的图片'),
            duration: 5000
          });
          return false;
        }

        let fileSize = 0;
        let fileMaxSize = 1024 * 1024 * 512; //1M
        if (files) {
          fileSize = files.size;
          if (fileSize > fileMaxSize) {
            that.$notify.error({
              title: '错误',
              message: '文件过大(大于 5 Mb )',
              duration: 5000
            });
            // file.value = "";
            return false;
          } else if (fileSize <= 0) {
            that.$notify.error({
              title: '错误',
              message: '文件大小异常(小于0)',
              duration: 5000
            });
            return false;
          }
        } else {
          return false;
        }

        //转码base64
        let reader = new FileReader();
        let imgFile
        // let that = this
        reader.readAsDataURL(file)
        reader.onloadend = function() {
          that.isEditPic = true;
          var fileBase64 = reader.result;
          that.base64 = fileBase64;
        }
      },

      getAllParentIdDeepTree: function(targetId, list) {
        var res = [targetId]

        function getTarget(id, list) {
          var target = null;

          function deep(list) {
            for (var i in list) {
              var demo = list[i];
              if (demo.id === id) {
                target = demo;
                break;
              }
              if (target !== null) {
                break;
              }
              if (demo.children != undefined) {
                deep(demo.children);
              }
            }
          }
          deep(list);
          return target;
        }

        var target = getTarget(targetId, list);
        if (target == null)
          return []
        while (target.parentId != undefined) {
          target = getTarget(target.parentId, list);
          res.push(target.id);
        }

        return res.reverse();
      },


      getCategoryCode: function(target) {
        var treeList = JSON.parse(JSON.stringify(this.options.category));
        var category = JSON.parse(JSON.stringify(this.bean.materialCategoryId));

        if (category.length == 1) {
          for (var i in treeList) {
            var demo = treeList[i];
            if (demo.id === category[0]) {
              this.bean.preCode = demo.code
            }
          }
          return
        }

        for (var i = 0; i < category.length; i++) {
          var id = category[i];
          innerFor: for (var index in treeList) {
            var demoNode = treeList[index];
            if (id === demoNode.id) {
              treeList = demoNode.children;
              if (i === category.length - 1) {
                this.bean.preCode = demoNode.code
              }
              break innerFor;
            }
          }
        }

      }


    }
  }
</script>

<style scoped="scoped">
  .input-block>div {
    width: 250px;
  }

  .image-block>img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }

  .image-block {
    border: solid 1px rgba(240, 240, 240, 1);
    height: 160px;
    width: 150px;
    overflow: hidden;
  }

  .upload-button-div {
    border: solid 1px rgba(220, 220, 220, 1);
    background: white;
    width: 150px;
    height: 200px;
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
    padding: 0px 14px;
    background: white;
    max-width: 55px;
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
    display: inline-block;
  }

  .upload-button-div>button:hover {
    background: rgba(102, 177, 255, 1);
  }

  .upload-button-div:hover {
    background: rgba(220, 250, 255, 1);
  }

  .pop-card {
    top: 10%;
  }

  .title {

    height: 40px;
    line-height: 40px;
    font-size: 20px;

    border-bottom: rgba(240, 240, 240, 1) solid 1px;

    display: flex;
  }

  .title>div:last-child {
    margin-left: 10px;
  }
</style>

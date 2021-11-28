<template>
  <div @click.stop="">

    <div class="title">
      <el-button type="warning" @click="$parent.otherPage.PAGE = 'INDEX'" plain>返回供应商列表</el-button>
      <div> > 新增供应商</div>
    </div>

    <div class="flexCenter">
      <div class="card">
        <div class="block">
          <span>供应商名称</span>
          <el-input v-model="bean.name"></el-input>
        </div>
        <div class="block" v-if="$parent.otherPage.PAGE != 'INDEX'">
          <span>供应商代码</span>
          <el-input v-model="bean.code" placeholder="自动生成" :disabled="$parent.otherPage.PAGE != 'INDEX'"></el-input>
        </div>
        <div class="block">
          <span>简称</span>
          <el-input v-model="bean.nameAbb"></el-input>
        </div>
        <div class="block">
          <span>状态</span>
          <el-select v-model="bean.status" placeholder="全部" :clearable="false">
            <el-option v-for="(item,index) in options.status" :key="index" :label="item" :value="index">
            </el-option>
          </el-select>
        </div>


        <div class="margin-top30"></div>

        <div class="block">
          <span>联系人</span>
          <el-input v-model="bean.contact"></el-input>
        </div>
        <div class="block">
          <span>联系人电话</span>
          <el-input v-model="bean.contactNumber"></el-input>
        </div>
        <div class="block">
          <span>固定电话</span>
          <el-input v-model="bean.fixedNumber"></el-input>
        </div>
        <div class="block">
          <span>邮箱</span>
          <el-input v-model="bean.email"></el-input>
        </div>


        <div class="margin-top30"></div>
        <div class="block">
          <span>银行</span>
          <el-input v-model="bean.bank"></el-input>
        </div>
        <div class="block">
          <span>银行卡号</span>
          <el-input v-model="bean.bankNumber"></el-input>
        </div>
        <div class="block">
          <span>银行卡开户人</span>
          <el-input v-model="bean.bankOpener"></el-input>
        </div>


        <div class="margin-top30"></div>
        <div class="block">
          <span>法人</span>
          <el-input v-model="bean.legalPerson"></el-input>
        </div>
        <div class="block">
          <span>统一社会信用码</span>
          <el-input v-model="bean.uscCode"></el-input>
        </div>



        <div class="margin-top30"></div>
        <div class="block">
          <span>地区</span>
          <el-input v-model="bean.addressCode" style="width: 645px;"></el-input>
        </div>
        <div class="block">
          <span>邮编</span>
          <el-input v-model="bean.postalCode"></el-input>
        </div>
        <div class="block">
          <span>详细地址</span>
          <el-input v-model="bean.address" style="width: 645px;"></el-input>
        </div>
        <div class="block">
          <span style="float: left;margin-right: 0px;">说明</span>
          <el-input v-model="bean.description" type="textarea" :rows="3" style="width: 645px;" resize="none"></el-input>
        </div>

        <div class="flexCenter margin-top20 margin-bottom30 padding-bottom10">
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
          address: '',
          addressCode: '',
          auditStatus: '',
          auditTime: '',
          auditUser: '',
          bank: '',
          bankNumber: '',
          bankOpener: '',
          bl: '',
          code: '',
          contact: '',
          contactNumber: '',
          createTime: '',
          createUser: '',
          description: '',
          eName: '',
          eNameAbb: '',
          email: '',
          fixedNumber: '',
          id: '',
          isDelete: '',
          legalPerson: '',
          name: '',
          nameAbb: '',
          occ: '',
          uscCode: '',
          postalCode: '',
          status: '',
          trn: '',
          updateTime: '',
          updateUser: '',
          userId: ''
        },



        options: {
          status: ['不可用', '可用']
        }

      }
    },
    created: function() {
      var that = this;

      if (that.operation == that.STATUS.UPDATE) {
        that.bean.id = that.parent.otherPage.data.details.id;
        that.initBean();
      }

    },
    methods: {

      initBean: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/supplier/bean',
          data: {
            id: that.bean.id
          }
        }).then((response) => {
          if (!response) {
            return;
          }

          var data = response.data;

          that.bean = data.data

        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      add: function() {
        var that = this;

        if (!that.checkWay())
          return;

        var axios = that.axios;

        axios({
          method: 'post',
          url: '/supplier/add',
          data: that.bean,
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          var msg;
          if (data.code == that.STATUS.SUCCESS) {
            msg = '<div>供应商代码:<span class="blue">' + data.data + '</span></div>'
            that.$parent.otherPage.PAGE = 'INDEX'
          } else {
            msg = '<div>添加失败，可能为供应商代码生产<span class="blue">重复</span>，请<span class="red">重试</span><br>' +
              '若重试多次后，依旧无法添加，请联系管理员</div>'
          }
          that.addSuccess(true, msg)

        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      edit: function() {
        var that = this;

        if (!that.checkWay())
          return;

        var axios = that.axios;

        var bean = JSON.parse(JSON.stringify(that.bean));

        delete bean.code
        delete bean.updateTime
        delete bean.updateUser
        delete bean.auditTime
        delete bean.createUser
        delete bean.createTime
        delete bean.auditUser
        delete bean.auditTime
        delete bean.auditStatus


        axios({
          method: 'post',
          url: '/supplier/update',
          data: bean,
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
        })

      },

      checkWay: function() {

        var that = this;
        var msg = null;
        if (that.bean.name.trim() == '') {
          msg = '未填写供应商名称'
        }

        if (msg == null) {
          return true;
        } else {
          that.$notify({
            title: '警告',
            type: 'warning',
            message: msg,
            duration: 2500,
            dangerouslyUseHTMLString: true
          });
          return false;
        }

      }

    }
  }
</script>

<style scoped="scoped">
  .card {
    margin-top: 20px;
    min-width: 500px;
    max-width: 810px;
  }

  .block {
    display: inline-block;
    margin-top: 10px;
    margin-right: 20px;
  }

  .block>span {
    display: inline-block;
    padding: 0px 10px;
    width: 120px;
    background: rgba(240, 240, 240, 1);
    height: 40px;
    line-height: 40px;
    border-radius: 5px;
    margin-right: -5px;
    text-align: right;
    font-size: 14px;
  }

  .block>div {
    display: inline-block;
    width: 240px;
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

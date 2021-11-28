<template>
  <div class="pop-card" @click.stop="">

    <div>

      <div class="input-block">
        <span>账号</span>
        <el-input v-model="bean.user.account" maxlength="32" clearable></el-input>
      </div>

      <div class="input-block">
        <span>用户名</span>
        <el-input v-model="bean.user.name" clearable></el-input>
      </div>

      <div class="input-block">
        <span>密码</span>
        <el-input v-model="bean.user.password" show-password clearable></el-input>
      </div>

      <div class="input-block" v-if="false">
        <span>操作密码</span>
        <el-input v-model="bean.user.oPassword" show-password clearable></el-input>
      </div>

      <div class="flexCenter margin-top30">
        <!-- {{options.roles}}<br>{{bean.roles}} -->
        <el-transfer v-model="bean.roles" :data="options.roles" :props="{key:'id', label:'name',disabled:'disable'}"
          :titles="['全部角色','当前角色']"></el-transfer>
      </div>

      <div class="flexCenter margin-top20">
        <el-button @click="add()" type="success" v-if="operation == STATUS.ADD">保存</el-button>
        <el-button @click="update()" type="success" v-if="operation == STATUS.UPDATE">保存</el-button>
      </div>

    </div>

  </div>
</template>

<script>
  export default {
    data() {
      var parent = this.$parent.$parent;
      return {

        parent: parent,
        operation: parent.otherPage.status.details,


        options: {
          roles: []
        },

        bean: {
          user: {
            id: '',
            name: '',
            account: '',
            password: '',
            oPassword: ''
          },
          roles: []
        }

      }
    },
    created: function() {
      var that = this;

      that.initOptions();

      if (that.operation == that.STATUS.UPDATE) {
        that.initBean()
      }

    },
    methods: {

      add: function() {
        var that = this;

        if(!that.checkWay())
          return;

        var axios = that.axios;

        axios({
          method: 'post',
          url: '/user/add',
          data: {
            user: {
              name: that.bean.user.name,
              account: that.bean.user.account,
              password: md5(that.bean.user.password),
              oPassword: md5(that.bean.user.oPassword)
            },
            roles: that.bean.roles
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }

          var data = response.data;
          if (data.code == that.STATUS.SUCCESS) {
            that.$notify({
              title: '添加',
              message: '<div><span class="blue">添加</span>用户成功!<br>用户: ' + that.bean.user.name + '【' + that.bean
                .user.account +
                '】</div>',
              type: 'success',
              duration: 5000,
              dangerouslyUseHTMLString: true
            });
            that.parent.initTableList();
            that.parent.$refs.userDetails.hiden();
          } else {
            that.addSuccess(false, data.msg)
          }

        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      initOptions: function() {
        var that = this;
        var axios = that.axios;
        axios({
          method: 'post',
          url: '/user/details/options',
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }

          var data = response.data;



          var options = []
          var roles = data.data;

          for (var index in roles) {
            var roleDemo = roles[index]
            var role = {
              id: roleDemo.id,
              name: roleDemo.name,
              disable: !roleDemo.status
            }
            options.push(role)
          }


          that.options.roles = options
        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      initBean: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/user/bean',
          data: {
            id: that.parent.otherPage.data.details.id
          }
        }).then((response) => {
          if (!response) {
            return;
          }

          var data = response.data;

          that.bean.user.id = data.data.user.id;
          that.bean.user.account = data.data.user.account;
          that.bean.user.name = data.data.user.name;
          that.bean.user.password = data.data.user.password;
          that.bean.user.oPassword = data.data.user.oPassword;

          that.bean.roles = data.data.roles;

        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      update: function() {
        var that = this;

        if(!that.checkWay())
          return;

        var axios = that.axios;

        var user = {
          id: that.bean.user.id,
          name: that.bean.user.name,
          account: that.bean.user.account,
          password: md5(that.bean.user.password),
          oPassword: md5(that.bean.user.oPassword)
        }

        if (that.bean.user.password === 'CAN_NOT_VIEW')
          delete user.password
        if (that.bean.user.oPassword === 'CAN_NOT_VIEW')
          delete user.oPassword

        axios({
          method: 'post',
          url: '/user/update',
          data: {
            user: user,
            roles: that.bean.roles
          },
          df: false
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          if (data.code == that.STATUS.SUCCESS) {
            that.$notify({
              title: '保存成功',
              type: 'success',
              duration: 5000
            });
            that.initBean()
            that.parent.initTableList();
          }
        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      checkWay: function(){
        var that = this;
        var msg = '';

        if (that.bean.user.account.trim().length < 2) {
          msg = '请填写至少<span class="blue">2位账号</span>';
        }

        if (that.bean.user.password.trim().length < 6) {
          msg = '请填写至少<span class="blue">6位密码</span>'
        }

        if (that.bean.user.name.trim().length < 1) {
          msg = '请填写<span class="blue">用户名</span>';
        }
        
        if(!Array.isArray(that.bean.roles) || that.bean.roles.length === 0){
          msg = '请设置<span class="blue">角色</span>';
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
      }


    }
  }
</script>

<style scoped="scoped">
  .pop-card {
    width: 710px;
    left: calc(50% - 355px);
    height: 520px;
  }
</style>

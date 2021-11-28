<template>
  <div :class="baseClasses" :style="baseStyle" @click="$parent.personalMenu.change = false">
    <div class="reset-pwd-card" @click.stop="">
      <div>
        <el-avatar :size="100" class="flexCenter"> <span class="el-icon-user-solid" style="font-size: 45px;"></span> </el-avatar>
      </div>
      <div>您正在重置当前账户的密码</div>
      <div>
        <div class="reset-pwd-card-line">
          <div>原来的密码</div>
          <div>
            <el-input v-model="resetPwd.reuserPwd" show-password></el-input>
          </div>
        </div>
        <div class="reset-pwd-card-line">
          <div>新的密码</div>
          <div>
            <el-input v-model="resetPwd.userPwd" show-password></el-input>
          </div>
        </div>
      </div>
      <div>
        <el-button class="blueButton" @click="change()" type="warning" plain>修改密码</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'changePwd',
    data() {
      return {
        baseClasses: ['baseClass'],
        baseStyle: {},

        resetPwd: {
          id: (JSON.parse(sessionStorage.getItem('userInfo'))).id,
          reuserPwd: '',
          userPwd: ''
        }

      }
    },
    created: function() {

    },
    methods: {
      change: function() {
        var that = this;
        var axios = that.axios;

        if (that.resetPwd.userPwd.trim().length < 6) {
          this.$message.error(that.$t('密码长度不少于6'));
          return
        }

        this.$confirm('是否更新当前账户密码，请确定', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          const loading = this.$loading({
            lock: true,
            text: 'waiting',
            // spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.7)'
          });

          axios({
            method: 'post',
            url: '/password/reset',
            data: {
              checkPwd: md5(that.resetPwd.reuserPwd),
              newPwd: md5(that.resetPwd.userPwd)
            },
          }).then((response) => {
            if (!response) {
              return;
            }
            var data = response.data;

            if(data.code == that.STATUS.SUCCESS){
              that.$notify({
                type:'success',
                title: '提示',
                dangerouslyUseHTMLString:true,
                message: '密码修改成功<br><span class="blue">即将退出，请重新登录</span>',
                duration:2500
              });
              setTimeout(function(){
                that.logout(loading);
              },2500)
            } else {
              throw data.msg;
            }
          }).catch(function(error) {
            loading.close()
            that.errorhanding(error);
          })

        })
      },

      logout: function(loading) {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/logout',
          df: false
        }).then((response) => {
          sessionStorage.clear();
          that.$router.push('/login')
          setTimeout(function(){
            loading.close();
            window.location.reload();
          },50)
        }).catch(error => {
          sessionStorage.clear()
          that.$router.push('/login')
        });

      },
    }
  }
</script>

<style scoped="scoped">
  .reset-pwd-card>div:first-child {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .reset-pwd-card>div:nth-child(2) {
    text-align: center;
    margin: 20px;
    color: #666666;
    font-size: 12px;
  }

  .reset-pwd-card>div:last-child {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }

  .reset-pwd-card .el-avatar {
    font-size: 28px;
  }

  .reset-pwd-card-line {
    display: flex;
    flex-direction: column;
    color: #666666;
    text-align: center;
    margin-bottom: 10px;
  }

  .reset-pwd-card-line>div:last-child {
    padding: 0 10px;
  }

  .reset-pwd-card {
    width: 260px;
    height: 360px;
    background: white;

    padding: 20px;
    margin-bottom: 200px;

    border-radius: 2px;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;

    animation: opacity0To1 0.3s forwards;
  }

  .baseClass {
    position: fixed;
    top: 0px;
    left: 0px;

    height: 100%;
    width: 100%;

    background: rgba(00, 00, 00, 0.3);
    z-index: 600;

    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

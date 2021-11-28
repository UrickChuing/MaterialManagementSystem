<template>
  <div class="inner-card">
    <div class="inner-header">
      <span v-if="processId == null">添加流程</span>
      <span v-else>编辑流程</span>
    </div>
    <div>
      <div class="reason-line">
        <div class="reason-input">
          <span>
            名称
          </span>
          <el-input v-model="bean.name" clearable></el-input>
        </div>


        <div class="reason-input">
          <span>部门</span>
          <el-cascader v-model="selectOrganization" :options="options.organizations" :props="props" popper-class="z-index2022"
            collapse-tags clearable></el-cascader>
        </div>

        <div class="reason-input">
          <span>
            人员
          </span>
          <el-button @click="setting.inSetting = true;setting.user_role = 'P_USER'">设置 ( <span class="blue">{{bean.userCount}}</span>
            ) </el-button>
        </div>

      </div>
      <div class="public-table-header">
        <el-button @click="updateSteps" type="success" size="mini">保存</el-button>

        <el-button @click="createStep" class="right" size="mini" type="primary">添加步骤</el-button>
      </div>
      <div class="step-block public-scroll-y">

        <template v-for="(step,index) in bean.steps">
          <div class="flexCenter blue font-bold next-icon" v-if="index != 0">
            <i class="el-icon-caret-bottom"></i>
          </div>
          <div class="step-line flexRow">

            <div class="flex1 text-align-center step-text">
              步骤：{{index + 1}}
            </div>
            <div class="flex5 text-align-center">
              <el-input v-model="step.name" placeholder="步骤名称" style="width:240px" clearable></el-input>
            </div>
            <div class="flex4 text-align-center">
              通过数量: <el-input-number v-model="step.number" style="width: 100px;" controls-position="right" :min="1"></el-input-number>
            </div>
            <!--            <div class="flex4 text-align-center">
              拒绝数量: <el-input-number v-model="step.refuseNumber" style="width: 100px;" controls-position="right" :min="1"></el-input-number>
            </div> -->
            <div class="flex2 text-align-center ">
              <el-button @click="setting.id = step.id;setting.inSetting = !setting.inSetting;setting.user_role = 'USER'"
                size="mini" type="primary" plain>
                设置人员
              </el-button>
            </div>
            <!--            <div class="flex2 text-align-center">
              <el-button @click="setting.id = step.id;setting.inSetting = !setting.inSetting;setting.user_role = 'ROLE'" size="mini" type="primary" plain>
                设置角色
              </el-button>
            </div> -->
            <i @click="deleteStep(step)" class="el-icon-close font16 close-icon"></i>
          </div>
        </template>


      </div>

      <el-dialog width="750px" class="z-index2022" :custom-class="['dialog-card','self-card']" style="margin-top: 5vh;"
        :visible.sync="setting.inSetting" append-to-body>
        <template v-if="setting.inSetting">
          <add-user :stepId="setting.id" :processId="processId" v-if="setting.user_role == 'USER'"></add-user>
          <add-role :stepId="setting.id" :processId="processId" v-if="setting.user_role == 'ROLE'"></add-role>
          <process-user :processId="processId" @init="initBean" v-if="setting.user_role == 'P_USER'"></process-user>
        </template>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import addUser from './process_add_user.vue'
  import addRole from './process_add_role.vue'
  import processUser from './process_user.vue'

  export default {
    components: {
      addUser,
      addRole,
      processUser
    },
    props: ['processId'],
    data() {
      return {

        props: {
          multiple: true,
          label: 'name',
          value: 'id'
        },

        options: {
          organizations: []
        },

        selectOrganization: [],

        bean: {
          id: '',
          name: '',
          steps: [{
              name: '初审',
              number: 1,
              auditProcessId: 1,
              users: [],
              roles: []
            },
            {
              name: '中审',
              number: 1
            }
          ],
          organization: [],
          userCount: 0
        },


        setting: {
          inSetting: false,
          user_role: null,
          user: [],
          role: [],
          //步骤Id
          id: null
        }

      }
    },
    watch: {
      selectOrganization: {
        handler: function(newV) {
          this.bean.organization = []
          for (var index in newV) {
            this.bean.organization.push((newV[index])[0])
          }
        },
        deep: true
      }
    },
    created: function() {
      var that = this;
      var processId = that.processId;

      console.log('processId', processId)

      if (processId != null) {
        that.initBean();
      }

      that.initOptions();

    },
    methods: {

      initBean: function(only) {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/audit/process/bean',
          data: {
            id: that.processId
          },
        }).then((response) => {
          if (!response) {
            return;
          }

          var data = response.data;

          if(only != undefined && only){
            that.selectOrganization = JSON.parse(JSON.stringify(data.data.organization));
            that.bean.organization = [];
            that.bean.userCount = data.data.userCount;
          }else{
            that.bean = data.data;
            that.selectOrganization = JSON.parse(JSON.stringify(data.data.organization));
            that.bean.organization = [];
          }

        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      initBeanList: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/audit/process/bean/list',
          data: {
            id: that.processId
          },
        }).then((response) => {
          if (!response) {
            return;
          }

          var data = response.data;
          if (data.code === that.STATUS.SUCCESS) {
            var list = data.data;

            var steps = that.bean.steps;
            for(var index in list){
              var demo = list[index];
              var re_id = demo.id;
              for(var index_inner in steps){
                var model = steps[index_inner]
                if(model.id == demo.id){
                  re_id = -1;
                  break;
                }
              }
              if(re_id != -1){
                that.bean.steps.push(demo);
              }
            }
          } else {
            throw data.msg;
          }

        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      createStep: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/audit/process/bean/step/add',
          data: {
            id: that.processId
          },
          df: true,
          loading: true
        }).then((response) => {

          setTimeout(function() {
            that.inSearch = false;
            if (!response) {
              return;
            }

            var data = response.data;

            if (data.code == that.STATUS.SUCCESS) {
              that.addSuccess(true);
            } else {
              that.addSuccess(false)
            }
            that.initBeanList();

          }, 200)


        }).catch((error) => {
          that.errorhanding(error)
        })
      },


      updateSteps: function() {
        var that = this;
        var axios = that.axios;

        var stepList = that.bean.steps;

        var steps = [];
        for (var i in stepList) {
          var demo = stepList[i];
          var target = {
            id: demo.id,
            name: demo.name,
            number: demo.number,
            refuseNumber: demo.refuseNumber
          }
          steps.push(target);
        }

        var demo = {
          id: that.processId,
          name: that.bean.name,
          list: steps,
          organization: that.bean.organization
        }

        axios({
          method: 'post',
          url: '/audit/process/bean/update',
          data: demo,
          df: false,
          loading: true
        }).then((response) => {
          if(!response)
            return;

          if(response.data.code != that.STATUS.SUCCESS){
            that.notics.error('提示',response.data.msg);
            return;
          }


          setTimeout(function() {
            that.inSearch = false;
            if (!response) {
              return;
            }

            var data = response.data;

            that.selectOrganization = [];
            that.initBean();
            that.$emit('initTableList')
            if (data.code == that.STATUS.SUCCESS) {
              that.updateSuccess(true);
            }
          }, 200)


        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      deleteStep: function(target) {
        var that = this;
        var axios = that.axios;
                                /* (永久删除) */
        that.$confirm('确定删除，步骤，不可逆？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: '/audit/process/bean/step/delete',
              data: {
                id: target.id
              },
              df: false,
              loading: true
            }).then((response) => {

              setTimeout(function() {
                that.inSearch = false;
                if (!response) {
                  return;
                }

                var data = response.data;

                if (data.code == that.STATUS.SUCCESS) {
                  that.deleteSuccess(true);
                } else {
                  that.deleteSuccess(false)
                }
                that.initBean();

              }, 200)


            }).catch((error) => {
              that.errorhanding(error)
            })
          })
          .catch(_ => {});

      },

      //初始化options数据
      initOptions: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/audit/process/options',
          data: {}
        }).then((response) => {


          var data = response.data;

          that.options.organizations = data.data.organizations;

        });
      },

    }
  }
</script>

<style scoped="scoped">
  .close-icon {
    position: absolute;
    right: 0px;
    font-size: 20px;
    transition: .2s;
  }

  .close-icon:hover {
    color: rgba(180, 255, 255);
    text-shadow: 0px 1px 2px rgba(00, 00, 00, 1);
  }

  .next-icon {
    font-size: 28px;
  }

  .step-text {
    min-width: 70px;
  }

  .step-line:first-child {
    margin-top: 10px;
  }

  .step-line {
    height: 80px;
    line-height: 80px;
    background: rgba(245, 245, 245, 1);
    border-radius: 10px;
    position: relative;
  }

  .step-block {
    height: 350px;
  }

  .inner-header {
    height: 38px;
    line-height: 38px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }

  .inner-card {
    padding: 20px;
  }
</style>

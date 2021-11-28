<template>
  <div class="inner-card">
    <div>

      <div class="flex">
        <span class="margin-right10 flexCenter">审批模板</span>
        <el-select v-model="process.templateId" placeholder="请选择审批模板(非必选)" class="flex1" :disabled="!processIdNull">
          <el-option v-for="item in options.auditProcess" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="public-table-header">
        <!-- <el-button @click="updateSteps" type="success" size="mini">保存</el-button> -->

        <el-button @click="createStep" class="right" size="mini" type="primary">添加步骤</el-button>
      </div>
      <div class="step-block public-scroll-y">

        <template v-for="(step,index) in process.steps">
          <div class="flexCenter blue font-bold next-icon" v-if="index != 0">
            <i class="el-icon-caret-bottom"></i>
          </div>
          <div class="step-line flexRow">

            <div class="flex1 text-align-center step-text">
              步骤：{{index + 1}}
            </div>
            <div class="flex5 text-align-center">
              <el-input v-model="step.name" placeholder="步骤名称" @change="($event)=>{updateStepName($event,step.id,index)}"
                style="width:240px" clearable></el-input>
            </div>
            <!-- <div class="flex4 text-align-center">
              通过数量: <el-input-number v-model="step.number" style="width: 100px;" controls-position="right" :min="1"></el-input-number>
            </div> -->
            <!--            <div class="flex4 text-align-center">
              拒绝数量: <el-input-number v-model="step.refuseNumber" style="width: 100px;" controls-position="right" :min="1"></el-input-number>
            </div> -->
            <div class="flex2 text-align-center ">


              <el-popover placement="bottom-end" width="250" trigger="hover">
                <div class="flexColumn">
                  <template v-if="step.user.length != 0">
                    <div class="public-scroll-y" style="max-height: 300px;">
                      <span class="flexCenter margin-bottom10" v-for="user in step.user">
                        {{user.name}}
                      </span>
                    </div>
                  </template>
                  <template v-else>
                    <span class="flexCenter">
                      未选择
                    </span>
                  </template>
                </div>
                <el-button @click="setStepUser(step,index)" size="mini" :type="step.user.length != 0? 'primary':'danger'"
                  plain slot="reference">
                  设置人员 {{step.user.length != 0? '':'(未选择)'}}
                </el-button>
              </el-popover>

            </div>
            <!--            <div class="flex2 text-align-center">
              <el-button @click="setting.id = step.id;setting.inSetting = !setting.inSetting;setting.user_role = 'ROLE'" size="mini" type="primary" plain>
                设置角色
              </el-button>
            </div> -->
            <i @click="deleteStep(step , index)" class="el-icon-close font16 close-icon"></i>
          </div>
        </template>


      </div>

      <el-dialog width="750px" class="z-index2022" :custom-class="['dialog-card','self-card']" style="margin-top: 5vh;"
        :visible.sync="setting.inSetting" append-to-body>
        <template v-if="setting.inSetting">
          <add-user @set="addStepUser" @remove="removeStepUser" @init="initProcess" :stepId="setting.id" :stepIndex="setting.index"
            :processId="processId" :users="setting.user" v-if="setting.inSetting"></add-user>
        </template>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import addUser from './process_add_user.vue'

  export default {
    components: {
      addUser,
    },
    props: ['processId', 'type', 'auditProcess'],
    data() {

      var auditProcess = this.auditProcess;
      if (auditProcess == undefined) {
        auditProcess = {
          templateId: '',
          steps: [],
        };
      }

      return {

        processIdNull: true,

        props: {
          multiple: true,
          label: 'name',
          value: 'id'
        },

        options: {
          auditProcess: []
        },

        process: auditProcess,


        setting: {
          inSetting: false,
          user: [],
          //步骤Id
          id: null,
          index: null
        }

      }
    },
    watch: {
      'process.templateId': {
        handler: function(newV, oldV) {
          if (!this.processIdNull) {
            return;
          }
          this.initTemplate(newV);
        },
        deep: true
      }
    },
    created: function() {
      var that = this;
      var processId = that.processId;

      console.log('processId', processId)

      if (processId != undefined && processId != '' && processId != null) {
        that.processIdNull = false;
        that.initProcess(processId);
      }

      that.initOptions();

    },
    methods: {

      initTemplate: function(processId) {
        var that = this;
        var axios = that.axios;
        axios({
          method: 'post',
          url: '/audit/process/bean',
          data: {
            id: processId,
            process: true
          },
        }).then((response) => {
          if (!response) {
            return;
          }

          var data = response.data;
          if (data.code === that.STATUS.SUCCESS) {
            var processDemo = data.data;
            var stepsDemo = processDemo.steps;


            that.process.steps = [];
            for (var index in stepsDemo) {
              var step = stepsDemo[index];
              that.process.steps.push({
                name: step.name,
                user: step.user
              })
            }

            that.$emit('set', that.process)

          }

          console.log(data)

        }).catch((error) => {
          that.errorhanding(error)
        })

      },

      initProcess: function(processId, isCallBack, callWay) {
        var that = this;
        var axios = that.axios;
        axios({
          method: 'post',
          url: '/audit/process/bean',
          data: {
            id: processId,
            process: true
          },
        }).then((response) => {
          if (!response) {
            return;
          }

          var data = response.data;
          if (data.code === that.STATUS.SUCCESS) {
            var processDemo = data.data;
            that.process = processDemo;

            that.$emit('set', processDemo)

            if (isCallBack != undefined && isCallBack) {
              var steps = processDemo.steps;
              for (var i in steps) {
                var step = steps[i];
                if (step.id === that.setting.id) {
                  that.setting.user = step.user;
                  callWay();
                }
              }

            }

          }

          console.log(data)

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
            for (var index in list) {
              var demo = list[index];
              var re_id = demo.id;
              for (var index_inner in steps) {
                var model = steps[index_inner]
                if (model.id == demo.id) {
                  re_id = -1;
                  break;
                }
              }
              if (re_id != -1) {
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

        if (that.processIdNull) {

          that.process.steps.push({
            name: 'The Step',
            user: []
          })

          that.$emit('set', that.process);

          return;
        }


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
              that.addSuccess(false, msg.data)
            }
            that.initProcess(that.processId);

          }, 200)


        }).catch((error) => {
          that.errorhanding(error)
        })
      },


      updateStepName: function(name, id, index) {
        var that = this;

        if (id == undefined && index != undefined) {

          that.process.steps[index].name = name;
          that.$emit('set', that.process);
          return;
        }


        var axios = that.axios;

        axios({
          method: 'post',
          url: '/audit/process/bean/step/update',
          data: {
            id: id,
            name: name
          },
          df: false,
          loading: true
        }).then((response) => {
          if (!response)
            return;

          if (response.data.code != that.STATUS.SUCCESS) {
            that.notics.error('提示', response.data.msg);
            return;
          }


          setTimeout(function() {
            if (!response) {
              return;
            }

            var data = response.data;

            that.initProcess(that.processId);
            if (data.code == that.STATUS.SUCCESS) {
              that.updateSuccess(true);
            }
          }, 200)


        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      deleteStep: function(target, targetIndex) {
        var that = this;

        if (that.processIdNull) {

          that.process.steps.splice(targetIndex, 1);
          that.$emit('set', that.process);
          return;
        }


        var axios = that.axios;

        that.$confirm('确定删除(永久删除)步骤，不可逆？', '提示')
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
                  that.deleteSuccess(false, data.msg)
                }
                that.initProcess(that.processId);

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
          url: '/audit/process/options/process',
          data: {
            type: that.type
          }
        }).then((response) => {
          if (!response)
            return

          var data = response.data;
          that.options.auditProcess = data.data;

        });
      },

      setStepUser: function(step, index) {
        this.setting.id = step.id;
        this.setting.index = index;
        this.setting.inSetting = true;
        this.setting.user = step.user;
      },

      addStepUser: function(user, id, index) {
        var that = this;
        if (id == undefined && index != undefined) {
          that.process.steps[index].user.push(user);
          that.$emit('set', that.process)
        }

      },

      removeStepUser: function(userId, index) {
        var that = this;
        var users = that.process.steps[index].user;

        for (var i in users) {
          var user = users[i];
          if (user.userId === userId) {
            that.process.steps[index].user.splice(i, 1);
            break;
          }
        }

      }

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

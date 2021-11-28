<template>
  <div class="card-bg public-scroll" @click="close">

    <div class="card-body" @click.stop="">
      <h3>{{AuditType.getStr(target.type)}}{{target.type == AuditType.value.PURCHASE_ORDER? '':'单'}}</h3>

      <div>

        <div class="card-line">
          <div>代码：</div>
          <div>{{task.code}}</div>
        </div>

        <div class="card-line">
          <div>审批目标：</div>
          <div>{{target.sourceCode}}</div>
        </div>

        <div class="card-line">
          <div>当前步骤：</div>
          <div>{{task.currentStepName}}</div>
        </div>

      </div>

      <el-table :data="task.list" height="300" class="dis" style="width: 100%;margin-top: 10px;" border
        cell-class-name="public-table-cell" highlight-current-row>
        <el-table-column label="审批人" type="code" align="center" min-width="200">
          <template slot-scope="scope">
            <div class="text-ellipsls">
              {{scope.row.userName}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="步骤" prop="name" align="center" min-width="210">
          <template slot-scope="scope">
            <div class="text-ellipsls">
              {{scope.row.name}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="审批时间" align="center" min-width="210">
          <template slot-scope="scope">
            <div class="text-ellipsls">
              {{DateToStr(new Date(scope.row.createTime))}}
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="备注" align="center" min-width="210">
          <template slot-scope="scope">
            <div class="text-ellipsls">
              <el-popover placement="bottom" width="200" trigger="hover" :content="scope.row.remarks">
                <a class="pointer" slot="reference">{{scope.row.remarks}}</a>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="card-audit">
        <el-button type="warning" disabled plain> {{auditor}} </el-button>
        <el-input v-model="remarks"></el-input>
        <el-button @click="pass" type="warning" key v-if="type == 'PASS'"> 通过 </el-button>
        <el-button @click="refuse" type="danger" key v-if="type == 'RF'"> 驳回 </el-button>
      </div>


    </div>

  </div>
</template>

<script>
  export default{
    props:['target','type'],
    data(){
      return {

        task: {
          currentStepName: '',
          list: [],
          code: ''
        },

        auditor: sessionStorage.userName,


        remarks: ''


      }
    },
    created:function(){
      this.initAuditTask();
    },
    methods:{
      close: function(){
        this.$emit('close');
      },

      initAuditTask: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/myAudit/getAuditTask',
          data: {
            // id: that.target.id,
            // type: that.type,
            auditTaskId: that.target.id
          },
          df: true
        }).then((response) => {
          if (!response)
            return;
          var data = response.data;

          console.log(data);

          that.task = data.data;

        }).catch((error) => {
          that.errorhanding(error);
        });

      },

      pass: function(row) {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/myAudit/pass',
          data: {
            auditTaskId: that.target.id,
            auditProcessId: that.target.auditProcessId,
            remarks: that.remarks
          },
          df: true
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          that.$emit('initTable');
          if (data.code == that.STATUS.SUCCESS) {
            that.notic(true,"审批");
            that.$emit('close');
          } else {
            that.notic(false,"审批",data.msg)
          }
        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      refuse: function() {
        var that = this;
        var axios = that.axios;
        that.$confirm('确定驳回审批吗？', '提示')
          .then(_ => {
            axios({
              method: 'post',
              url: '/myAudit/refuse',
              data: {
                auditTaskId: that.target.id,
                auditProcessId: that.target.auditProcessId,
                remarks: that.remarks
              },
              df: true
            }).then((response) => {
              if (!response) {
                return;
              }
              var data = response.data;
              that.$emit('initTable');
              if (data.code == that.STATUS.SUCCESS) {
                that.notic(true,'驳回');
                that.$emit('close');
              } else {
                that.notic(false,'驳回');
              }
            }).catch((error) => {
              that.errorhanding(error)
            })
            done();
          })
          .catch(_ => {});
      },

    }
  }
</script>

<style scoped="scoped">

  .card-audit{
    margin-top: 10px;
    display: flex;
  }

  .card-audit>button{
    margin-right: 0px;

  }

  .card-block{

  }

  .card-line{
    display: flex;
  }

  .card-line>div:first-child{
    width: 80px;
    text-align: right;
  }

  .card-bg{
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0px;
    left: 0px;
    background: rgba(00,00,00,0.3);
    z-index: 2022;
    transition: .25s;
    overflow: scroll;

    /* padding-left: calc(50vw - 300px); */
    /* padding-right: calc(50vw - 300px); */
  }

  .card-body{
    background: white;
    width: 600px;
    height: 500px;

    position: absolute;
    left: calc(50vw - 300px);
    right: calc(50vw - 300px);
    top: calc(50vh - 300px);
    bottom: calc(50vh - 200px);

    padding: 0px 15px 15px 15px;

    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  }

  h3{
      text-align: center;
  }
</style>

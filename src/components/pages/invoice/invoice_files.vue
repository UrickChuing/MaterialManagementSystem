<template>
  <div class="padding20 padding-top0">
    <div class="flexCenter">
      <h2>文件列表</h2> 
    </div>
    <div class="flexCenter">
      <h3 class="red flexCenter pointer">(发票仅支持jpg和png格式)</h3>
    </div>
    <div class="public-table-header">
      <input type="file" id="invoiceFiles" style="display: none;" name="image" @change="fileChange($event)">
      <el-button @click="uploadClick" class="right" type="primary" size="mini">上传文件</el-button>
    </div>

    <div class="flex-preview">
      <div class="flex-item">
        <div class="flexColumn" v-if="list.length != 0">
          <div class="file-line" v-for="file in list">
            <div class="flex-item" @click="showImage(file.filePath)">
              <div class="flex-preview">
                <div class="preview-image-mini">
                  <el-image
                    style="width:50px; height:50px"
                    :src="axios.defaults.baseURL + '/' + file.filePath"
                    :preview-src-list="previewList"></el-image>
                </div>
                <div class="file-line-left youCanNotChoose">
                  <span class="text-ellipsls" :title="file.fileName">{{file.fileName}}</span>
                  <div class="text-ellipsls" :title="file.filePath">
                    {{file.filePath}}
                  </div>
                </div>
              </div>
            </div>
            <div class="upload-action">
              <div class="file-line-right flexRow">
                <a :href="axios.defaults.baseURL + '/' + file.filePath" class="flexCenter margin-right20" target="view_window">下载</a>
                <a @click="fileDelete(file.fileName)" class="red flexCenter pointer">删除</a>
              </div>
            </div>
          </div>
        </div>
        <div class="flexCenter margin-top10" v-else>
          暂无数据
        </div>
      </div>
    </div>
    <el-image-viewer
         v-if="showViewer"
         :on-close="closeViewer"
         :url-list="[url]"
    />


  </div>
</template>

<script>
  // 导入组件
  import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
  export default {
    components: {
       ElImageViewer
     },
    props: ['operation', 'invoiceId'],
    data() {
      var parent = this.$parent.$parent;
      return {
        parent: parent,
        file: null,
        open: false,
        list: [],
        showViewer: false, // 显示查看器
        url: ''

      }
    },
    created: function() {

      this.initFileList();

    },
    methods: {
      // 点击按钮预览图片
        onPreview(img) {
        this.url = img
        this.showViewer = true
      },
      // 关闭查看器
       closeViewer() {
        this.showViewer = false
      },
      initFileList: function() {
        var that = this;
        var axios = that.axios;
        axios({
          method: 'post',
          url: '/invoice/bean/files',
          data: {
            id: that.invoiceId
          },
          df: true
        }).then((response) => {
          if (!response) {
            return;
          }
          var data = response.data;
          that.list = data.data;
        }).catch((error) => {
          that.errorhanding(error)
        })
      },

      fileDelete: function(name) {
        var that = this;
        var axios = that.axios;
		that.$confirm('您确定要删除吗？', '提示')
		  .then(_ => {
        axios({
          method: 'post',
          url: '/invoice/bean/files/delete',
          data: {
            fileName: name,
            id: that.invoiceId
          },
          loading: true
        }).then((response) => {
          that.initFileList();
          if (!response) {
            return;
          }
          var data = response.data;


          if (data.code === that.STATUS.SUCCESS) {
            that.notic(true, '删除文件')
            that.initFileList();
          } else {
            throw data.msg;
          }

        }).catch((error) => {
          that.errorhanding(error)
        })
		done();
		})
		.catch(_ => {});
      },
	  showImage: function(filePath) {
      this.url = this.axios.defaults.baseURL+ filePath
      this.showViewer = true

	  },

      uploadClick: function() {
        var files = document.getElementById('invoiceFiles');
        files.value = '';

        files.click();
      },

      fileChange: function() {
        var that = this;
        var axios = that.axios;

        let files = document.getElementById('invoiceFiles');
        let file = files.files[0]
        if (file == undefined) {
          return
        }

        let name = file.name
        let arr = name.split('.')
        // console.log(arr);
        // image/jpg,image/jpeg,image/png
        var nameSuffix = arr[arr.length - 1];
        if (nameSuffix == '') {

          that.$notify.error({
            title: that.$t('错误'),
            message: that.$t('未检测到文件类型，请上传正确的文件(非文件夹)'),
            duration: 5000
          });
          return false;
        }
        let fileSize = 0;
        let fileMaxSize = 1024 * 1024 * 10; //10M
        if (file) {
          fileSize = file.size;
          if (fileSize > fileMaxSize) {
            that.$notify.error({
              title: '错误',
              message: '文件过大(大于 10 Mb )',
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
        that.file = file;
        that.fileUpload();
      },

      fileUpload: function() {
        var that = this;
        var axios = that.axios;

        axios({
          method: 'post',
          url: '/invoice/bean/files/add',
          data: {
            file: that.file,
            id: that.invoiceId
          },
          loading: true
        }).then((response) => {
          that.initFileList();
          if (!response) {
            return;
          }
          var data = response.data;

          if (data.code === that.STATUS.SUCCESS) {
            that.notic(true, '上传')
            that.initFileList();
          } else {
            throw data.msg;
          }

        }).catch((error) => {
          that.errorhanding(error)
        });


      },

    }
  }
</script>

<style  scoped="scoped">
  .flex-preview{
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-top: 10px;
  }
  .upload-action{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .thumbnail{
    width: 200px;
    margin-right: 10px;
    text-align: center;
  }
  .flex-item{
    flex: 1;
  }
  .file-line {
    display: flex;
    border-radius: 5px;
    margin-bottom: 5px;
    background-color: #ececec;
  }
  .file-line .preview-image-mini{
    margin-right: 10px;
  }

  .file-line:hover {
    background: rgba(116, 206, 196, 0.1);
    color: #1598ED;
  }

  .file-line-left {
    display: flex;
    flex-direction: column;
    width: calc(100% - 100px);
    margin-right: 10px;
  }

  .file-line-right {
    width: 100px;
  }

  .file-line-left>span:first-child {
    font-size: 16px;
    width: 100%;
    height: 30px;
    line-height: 30px;
  }

  .file-line-left>div:last-child {
    font-size: 12px;
    width: 100%;
  }
</style>

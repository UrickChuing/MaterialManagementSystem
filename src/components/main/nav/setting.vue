<template>
  <div :class="baseClasses">
    <div class="setting-background" @click=" show = !show " v-if="show"></div>
    <div class="setting-card" :style="baseStyle">
      <div class="setting-button" @click=" show = !show " v-if="!settingOpenButton">
        <i class="el-icon-close" v-if="show"></i>
        <i class="el-icon-setting" v-else></i>
      </div>
      <div class="setting-button1" @click=" show = !show " v-if="settingOpenButton">
        <i class="el-icon-arrow-right" v-if="show"></i>
        <i class="el-icon-arrow-left" v-else></i>
      </div>

      <div class="setting-block public-scroll-y-hide">

        <div class="flexRow">
          <el-avatar :size="50" :src="'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'">
          </el-avatar>
          <div class="flexCenter margin-left10">
            <div class="flexColumn text-ellipsls">
              <span class="font16 blue">
                {{userName}}
              </span>
              <span class="font12">
                {{organizationName}}
              </span>
            </div>
          </div>
        </div>




        <div class="setting-block-title" style="margin-top: 20px;">
          <span>{{$t('yuyan')}}</span>
        </div>

        <div class="setting-block-part">

          <div class="setting-languages">
            <div @click="$i18n.locale = item.code;language = item.code" class="language" v-for="item in languanges"
              :style="{color: language==item.code? 'rgb(64, 158, 255)':''}">
              {{item.title}}
            </div>
          </div>

          <!--          <el-select style="margin-top: 5px;" v-model="language">
            <el-option v-for="item in languanges" :key="item.code" :label="item.title" :value="item.code">
            </el-option>
          </el-select> -->
        </div>

        <div class="setting-block-part">
          <span>{{$t('zuocedaohang')}}</span>
          <div class="setting-block-part-line">
            <span>{{$t('beijingse')}}</span>
            <div>
              <el-color-picker show-alpha :color-format="'rgb'" v-model="settingData.navLeftColor.backgroundColor" size="small"></el-color-picker>
            </div>
          </div>
          <div class="setting-block-part-line">
            <span>{{$t('zitiyanse')}}</span>
            <div>
              <el-color-picker show-alpha :color-format="'rgb'" v-model="settingData.navLeftColor.textColor" size="small"></el-color-picker>
            </div>
          </div>
          <div class="setting-block-part-line">
            <span>{{$t('xuanzhongyanse')}}</span>
            <div>
              <el-color-picker show-alpha :color-format="'rgb'" v-model="settingData.navLeftColor.activeTextColor" size="small"></el-color-picker>
            </div>
          </div>
          <div class="setting-block-part-line">
            <span>{{$t('zuocedaohang_Logo_beijingse')}}</span>
            <div>
              <el-color-picker show-alpha :color-format="'rgb'" v-model="settingData.navLeftLogoColor.backgroundColor"
                size="small"></el-color-picker>
            </div>
          </div>
        </div>

        <div class="setting-block-part">
          <span>{{$t('dingbudaohang')}}</span>
          <div class="setting-block-part-line">
            <span>{{$t('beijingse')}}</span>
            <div>
              <el-color-picker show-alpha :color-format="'rgb'" v-model="settingData.navTopColor.head.backgroundColor"
                size="small"></el-color-picker>
            </div>
          </div>
          <div class="setting-block-part-line">
            <span>{{$t('zitiyanse')}}</span>
            <div>
              <el-color-picker show-alpha :color-format="'rgb'" v-model="settingData.navTopColor.head.color" size="small"></el-color-picker>
            </div>
          </div>
          <div class="setting-block-part-line">
            <span>{{$t('tabsyanse')}}</span>
            <div>
              <el-color-picker show-alpha :color-format="'rgb'" v-model="settingData.navTopColor.page.backgroundColor"
                size="small"></el-color-picker>
            </div>
          </div>
          <div class="setting-block-part-line">
            <span>Tabs {{$t('zitiyanse')}}</span>
            <div>
              <el-color-picker show-alpha :color-format="'rgb'" v-model="settingData.navTopColor.page.color" size="small"></el-color-picker>
            </div>
          </div>
        </div>




        <div class="setting-block-part">
          <span>Setting</span>
          <div class="setting-block-part-line">
            <span>{{$t('beijingse')}}</span>
            <div>
              <el-color-picker show-alpha :color-format="'rgb'" v-model="baseStyle.backgroundColor" size="small"></el-color-picker>
            </div>
          </div>
          <div class="setting-block-part-line">
            <span>{{$t('zitiyanse')}}</span>
            <div>
              <el-color-picker show-alpha :color-format="'rgb'" v-model="baseStyle.color" size="small"></el-color-picker>
            </div>
          </div>
        </div>


        <div class="flexCenter upload-background" @click="uploadClick" v-if="false">
          <div class="flexColumn">
            <i class="el-icon-upload"></i>
            <span>上传背景图片</span>
          </div>
        </div>
        <input type="file" id="settingBackgroundImage" style="display: none;" name="image" @change="imageChange($event)" accept="image/jpg,image/jpeg,image/png">

      </div>

    </div>

  </div>
</template>

<script>
  export default {
    props: ['settingData'],
    data() {
      var samllButton = false;
      try {
        samllButton = Boolean(sessionStorage.settingButtonSmall)
      } catch (e) {
        samllButton = false
      }


      var languageCode = this.$i18n.locale;
      return {
        show: false,

        baseClasses: ['hide'],
        baseStyle: {
          backgroundColor: 'rgba(255,255,255,1)',
          color: 'rgba(00,000,00,1)'
        },

        // companyName:sessionStorage.companyName,
        companyName: localStorage.companyName,

        language: this.$i18n.locale,
        languanges: [],


        settingOpenButton: true,

        userName: sessionStorage.userName,
        organizationName: (JSON.parse(sessionStorage.userInfo)).organizationName


      }
    },
    watch: {
      show: function(newV) {
        this.showBlock(newV)
      },
      language: function(newV) {
        this.$i18n.locale = newV
        localStorage.setItem('langType', newV);
      },
      settingOpenButton: function(newV) {
        sessionStorage.setItem('settingButtonSmall', newV + '')
      },
    },
    created: function() {
      var that = this;


      that.initLanguage();
    },
    methods: {
      initLanguage: function() {
        var that = this;

        var languages = [];
        var allLanguages = that.$i18n.messages;

        for (var index in allLanguages) {
          var demo = allLanguages[index]
          var language = {
            title: demo.language.title,
            code: index
          }
          languages.push(language)
        }

        that.languanges = languages;
      },

      showBlock: function(show) {
        if (show) {
          this.baseClasses = ['show']
        } else {
          this.baseClasses = ['hide']
        }
      },

      uploadClick: function() {
        var files = document.getElementById('settingBackgroundImage');
        files.value = '';

        document.getElementById('settingBackgroundImage').click();
      },

      imageChange: function() {
        var that = this;
        var axios = that.axios;
        let files = document.getElementById('settingBackgroundImage');
        let file = document.getElementById('settingBackgroundImage').files[0]
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
        if (file) {
          fileSize = file.size;
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
          localStorage.backgroundImage = fileBase64;
        }
      },

    }
  }
</script>

<style scoped="scoped">
  .upload-background {
    border-radius: 10px;
    border: solid 1px rgba(149, 149, 149, 0.6);
    width: 100%;
    cursor: pointer;
    padding-top: 10px;
    padding-bottom: 15px;
    transition: .2s;
  }

  .upload-background:hover {
    border: #1598ED solid 1px;
  }

  .upload-background:hover>div>i {
    color: #1598ED;
  }

  .upload-background>div>i {
    font-size: 64px;
    color: rgba(192, 196, 204, 1);
    transition: .2s;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .upload-background>div>span {
    font-size: 13px;
    color: rgba(50, 50, 50, 0.8);
  }

  .language:hover {
    color: rgb(64, 158, 255);
  }

  .language {
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    cursor: pointer;
    transition: 0.3s;
  }

  .setting-languages {
    margin-top: 5px;
  }

  .setting-background {
    position: fixed;
    z-index: 2000;
    left: 0px;
    top: 0px;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.15);
    animation: moblieBack .2s forwards;
  }

  @keyframes moblieBack {
    from {
      background: rgba(0, 0, 0, 0.0);
    }

    to {
      background: rgba(0, 0, 0, 0.15);
    }
  }

  .setting-card {
    position: fixed;
    right: 0;

    max-width: 260px;
    width: 250px;
    height: 100%;

    background: white;
    z-index: 2000;

    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }

  .hide .setting-card {
    width: 0px;
  }

  .setting-button1 {
    position: absolute;
    width: 24px;
    height: 48px;
    background: rgba(24, 144, 255, 1);
    z-index: 2020;

    border-radius: 6px 0 0 6px;

    left: -24px;
    top: 40%;

    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 24px;

    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.2);
  }

  .setting-button {
    position: absolute;
    width: 48px;
    height: 48px;
    background: rgba(24, 144, 255, 1);
    z-index: 2020;

    border-radius: 6px 0 0 6px;

    left: -48px;
    top: 40%;

    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 24px;

    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.2);
  }

  .setting-block {
    padding: 20px;
    /* overflow: hidden; */
    width: 210px;
    height: calc(100% - 40px);
  }

  .setting-block-title {
    font-weight: bold;
  }

  .setting-block-part {
    font-size: 15px;
    margin-top: 20px;
  }

  .setting-block-part-line {
    margin-left: 20px;
    margin-top: 15px;
    font-size: 14px;

    height: 32px;
    line-height: 32px;

    color: rgba(0, 0, 0, 0.65);
  }

  .setting-block-part-line>div {
    float: right;
  }
</style>

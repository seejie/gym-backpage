<template>
  <div class="login-container">
    <div class="picbg">
      <div class="logo">
        <el-image :src="loginInfo.indexLogo" v-if="loginInfo.indexLogo" fit="contain" style="width: 300px; height: 300px"/>
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">{{ loginInfo.sysName }}</h3>
        </div>

        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-form-item style="background: #fff; width: auto; white-space: nowrap;">
          <div class="input-ct">
            <el-input
              prop="jcaptcha"
              class="jcaptcha"
              v-model="loginForm.validateCode"
              type="text"
              tabindex="3"
              @keyup.enter.native="handleLogin"
            ></el-input>
          </div>
          <img class="jcaptcha-img" :src="jcaptcha" />
          <a href="javascript:;" class="changecap" @click="getImg">换一张</a>
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px;"
          @click.native.prevent="handleLogin"
          >登&nbsp;&nbsp;录</el-button
        >
      </el-form>
    </div>
    <div style="position: fixed; bottom: 20px; left: 0; right: 0; text-align: center; cursor: pointer;" @click="link">
      {{loginInfo && loginInfo.copyright}} {{ loginInfo && loginInfo.beianInfo}}
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate';
import settings from '@/settings';
import { getQueryObject, param } from '@/utils';
import md5 from 'md5';

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: 'yujiajie',
        password: 'yujiajie2018',
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            //validator: validateUsername
          },
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            //validator: validatePassword
          },
        ],
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      jcaptcha: '',
      loginDisabled: false,

      loginInfo: {
        indexLogo: '',
      },
    };
  },
  computed: {
    logo() {
      return this.$store.getters.indexLogo;
    },
    title() {
      return this.$store.getters.shareTitle;
    },
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.getImg();
    this.loadLoginInfo();
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus();
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getImg() {
      this.$store
        .dispatch('user/jcaptcha', {
          t: +new Date(),
        })
        .then(jcaptcha => {
          this.jcaptcha = jcaptcha;
        });
    },

    link() {
      if(this.loginInfo && this.loginInfo.beianUrl) {
        window.open(this.loginInfo.beianUrl)
      }
    },

    loadLoginInfo() {
      this.$ajax
        .get(`/denglu/loginInfo?unitId=${this.$route.query.unitId}`,)
        .then(res => {
          this.loginInfo = res;
        })
        .catch(err => {
          console.log(err);
        });
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if ((shiftKey && key >= 'a' && key <= 'z') || (!shiftKey && key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      if (this.loginDisabled || this.loading) {
        return;
      }
      this.loginDisabled = true;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch('user/login', {
              ...this.loginForm,
              // password: md5(this.loginForm.password)
            })
            .then(() => {
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery,
              });
              console.log('登录成功 跳转页面');
              this.loading = false;
              this.loginDisabled = false;
            })
            .catch(e => {
              this.loading = false;
              this.loginDisabled = false;
              this.getImg();
            });
        } else {
          this.loginDisabled = false;
          console.log('error submit!!');
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #eff4f5;
$light_gray: #989898;
$cursor: #989898;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 48px;
    width: 402px;

    &.jcaptcha {
      width: 175px;
    }

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    background: #f2f2f2;
    border-radius: 5px;
    color: #454545;
    height: 48px;
  }
}
</style>

<style lang="scss" scoped>
@import '../../styles/variables.scss';
$bg: #eff4f5;
$dark_gray: #889aa4;
$light_gray: #eee;
$logoW: 527px;

.login-container {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .picbg {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -589px;
    margin-top: -229.5px;
    width: 1178px;
    height: 459px;
    background: url(../../assets/login/bg.png) no-repeat;

    .logo {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate(0, -50%);
      width: $logoW;
      text-align: center;
    }
  }

  .login-form {
    position: relative;
    margin-left: $logoW;
    width: 520px;
    max-width: 100%;
    overflow: hidden;
    padding: 45px 0 0 105px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 29px;
      color: #000;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  .changecap {
    display: inline-block;
    width: 52px;
    line-height: 48px;
    vertical-align: top;
    background: #fff;
    text-align: center;
    color: $xqn_green;
  }

  .jcaptcha-img {
    border: none;
    height: 48px;
    width: 160px;
    vertical-align: top;
    margin-left: 23px;
  }

  .input-ct {
    display: inline-block;
    background: $bg;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>

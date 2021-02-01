<template>
  <div class="login-container">
    <el-form ref="loginForm" 
    :model="loginForm" 
    :rules="loginRules" 
    class="login-form" 
    auto-complete="on" 
    label-position="left">

      <div class="title-container">
        <h3 class="title">云平台</h3>
      </div>
      <!-- 用户名框 -->
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!-- 密码框 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-button :loading="loading" 
      type="primary" 
      style="width:75%;margin-bottom:30px;" 
      @click.native.prevent="handleLogin">Login</el-button>
      <!-- 重置按钮 -->
      <el-button type="warning" 
          @click="resetLoginForm"
          style="width:22.5%;margin-bottom:30px;" >重置</el-button>
      <div class="tips">
        <span style="margin-right:20px;" v-model="loginForm.username">username: {{loginForm.username}}</span>
        <span v-model="loginForm.password"> password: {{loginForm.password}}</span>
        <a class="doc" target="_blank" href="https://github.com/1liu23456/row-doc.git">参考文档</a>
      </div>

    </el-form>
    
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      //表单参数
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //表单验证规则
      loginRules: {
        username: [{ required: true, message: "Please enter a username!", trigger: 'blur', validator: validateUsername },
        { min: 5, max: 8, message: "The length should be between 5 and 8 characters!", trigger: "blur" }],
        password: [{ required: true, message: "Please enter your password!",  trigger: 'blur', validator: validatePassword },
        { min: 6, max: 8, message: "Passwords should be 6 to 8 digits!", trigger: "blur" }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    //重置表单
    resetLoginForm() {
      this.$refs.loginForm.resetFields();
    },
    // 密码可见
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    //登录操作
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true
           // 调用get请求   this.loginForm  为传入参数 即User类型的 用户名和密码 
        const {data :res} = await this.$http.post("login", this.loginForm);
        console.log(res);
         if (res.flag == "ok" ) {
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
            this.$message.success("登陆成功！！！");
            window.sessionStorage.setItem('user',res.user); // session 放置 把信息保存起来
          }).catch(() => {
            this.loading = false
          })
           }else{
          this.$message.error("登录失败！！！");
         }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

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
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
.doc {
  color: rgb(241, 97, 61);
  font-size: 16px;
  margin-left: 120px;
  margin-top: -4px;
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
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
      font-size: 26px;
      color: $light_gray;
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
}
</style>

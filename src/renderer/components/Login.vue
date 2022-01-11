<template>
  <div style="background: url('static/image/background.jpg');
  background-size: 100% 100%;
  height: 100%;
  position: fixed;
  width: 100%">
    <el-card class="box-card">
      <el-form @keyup.enter.native="login" style="width: 100%">
        <h3>登录系统 V{{ version }}</h3>
        <el-form-item>
          <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" style="width: 100%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>

</template>

<script>
import {login} from '../api'

export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      version: process.env.version
    }
  },
  methods: {
    login () {
      const that = this
      login({
        account: this.loginForm.username,
        password: this.loginForm.password
      }).then(res => {
        if (res.games.indexOf('0') === -1) {
          that.$message({
            type: 'error',
            message: '该账户未允许使用此脚本，请联系管理员',
            duration: 1000,
            onClose: function () {
              that.$store.commit('LOGIN_OUT')
            }
          })
          return
        }
        that.$store.dispatch('loginSuccess', res)
        that.$message({
          type: 'success',
          message: '登录成功',
          duration: 1000,
          onClose: function () {
            that.$router.push('/')
          }
        })
      }).catch(failResponse => {
        console.log(failResponse)
      })
    }
  }
}
</script>

<style>
.box-card {
  margin: 100px auto;
  width: 60%;
}
.el-button--primary{
  background-color: #CD661D !important;
  border-color: #CD661D !important;
}
</style>


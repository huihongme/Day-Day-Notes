<template>
  <section class="login">
    <div class="body">
      <h1>
        <img src="../assets/logo.svg" :style="{width: '180px'}"/>
        <p>天天笔记</p>
      </h1>
      <div style="height:50%;padding:10% 0 0" v-if="isPassword">
        <el-input v-model="a" class="login-key" @focus="onFocus" :maxlength="1" ref="pw1" @click.native="ind=1" @keyup.native="nextInput" autofocus></el-input>
        <el-input v-model="b" class="login-key" @focus="onFocus" :maxlength="1" ref="pw2" @click.native="ind=2" @keyup.native="nextInput"></el-input>
        <el-input v-model="c" class="login-key" @focus="onFocus" :maxlength="1" ref="pw3" @click.native="ind=3" @keyup.native="nextInput"></el-input>
        <el-input v-model="d" class="login-key" @focus="onFocus" :maxlength="1" ref="pw4" @click.native="ind=4" @keyup.native="nextInput"></el-input>
      </div>
      <div class="">
        <button class="el-button el-button--text" @keyup.enter="login" @click="login" ref="submit">
          <font-awesome-icon icon="sign-in-alt" :style="{fontSize: '30px'}"/>
        </button>
      </div>
    </div>
    <div class="background"></div>
  </section>
</template>

<script>
  // import SystemInformation from './LandingPage/SystemInformation'

  export default {
    name: 'Login',
    data () {
      return {
        isPassword: false,
        a: '',
        b: '',
        c: '',
        d: '',
        ind: 1
      }
    },
    components: {
    },
    mounted () {
      this.$db.system.findOne({type: 'password'}, (err, doc) => {
        if (!err && doc) {
          // this.$router.push({path: '/notes'})
          this.isPassword = true
        }
      })
    },
    methods: {
      login () {
        if (!this.isPassword) {
          this.$router.push({path: '/notes'})
          return false
        }
        if (this.a === '' || this.b === '' || this.c === '' || this.d === '') {
          this.$message.error('密码不完整，请继续输入')
          this.$refs['pw' + this.ind].select()
          this.$refs['pw' + this.ind].focus()
          return false
        }
        let password = this.a + '' + this.b + '' + this.c + '' + this.d
        this.$db.system.findOne({type: 'password', value: password}, (err, doc) => {
          if (!err && doc) {
            this.$router.push({path: '/notes'})
          } else {
            this.$message.error('密码错误')
          }
        })
      },
      onFocus (event) {
        if (event) event.target.select()
      },
      nextInput (event) {
        if (event.code === 'Enter') {
          this.login()
          return true
        }
        if (event.code === 'Backspace') {
          this.ind = this.ind - 1 <= 1 ? 1 : this.ind - 1
        } else {
          this.ind = this.ind + 1 > 4 ? 4 : this.ind + 1
        }
        if (this.ind <= 4 && this.$refs['pw' + this.ind]) {
          this.$refs['pw' + this.ind].select()
          this.$refs['pw' + this.ind].focus()
        // } else if () {
        }
      }
    }
  }
</script>

<style>
.login {
  height:100vh;
  width: 100%;
  -webkit-app-region: drag;
  color: #333;
  text-align: center;
  font-size: 40px;
  position: relative;
}
.login .body{
  height:100vh;
  width: 100%;
  -webkit-app-region: drag;
  color: #333;
  text-align: center;
  font-size: 40px;
  display: flex;
  position: absolute;
  top:0;
  left:0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.login .el-button--text{color:#fff}
.login .el-button--text:focus, .login .el-button--text:hover{
  /* color:# */
}
.login .login-key{width: 100px;text-align: center;}
.login-key input{text-align: center;background: transparent;border:none;border-radius: 0;border-bottom:2px solid rgba(255,255,255,.7);font-size: 18px;color:#fff;}
.login h1 {
  font-size: 24px;
  color:#fff;
}
.login .background{
  background-color: rgba(0,0,0,.8);
  /* filter: blur(20px); */
  height:100vh;
  width: 100%;
  position: absolute;
  top:0;
  left:0;
  z-index: -1
}

</style>

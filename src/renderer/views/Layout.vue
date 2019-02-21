<template>
  <main id="app-main">
      <div class="topbar"/>
      <aside>
        <ul>
          <li @click="open('/notes')" :class="{'selected': $route.path=='/notes'}">
            <el-tooltip :content="$t('navs.note')" placement="right">
              <font-awesome-icon icon="sticky-note" :style="{fontSize: '26px'}"></font-awesome-icon>
            </el-tooltip>
          </li>
          <li @click="open('/calendars')" :class="{'selected': $route.path=='/desktop/home'}">
            <el-tooltip :content="$t('navs.calendar')" placement="right">
              <font-awesome-icon icon="calendar-alt" :style="{fontSize: '26px'}"></font-awesome-icon>
            </el-tooltip>
          </li>
        </ul>
        <ul>
          <!-- <li @click="open('/helps')">
            <el-tooltip :content="$t('navs.help')" placement="right">
              <font-awesome-icon icon="question-circle" :style="{fontSize: '26px'}"></font-awesome-icon>
            </el-tooltip>
          </li> -->
          <li @click="settingDialog=true">
            <el-tooltip :content="$t('navs.setup')" placement="right">
              <font-awesome-icon icon="cog" :style="{fontSize: '26px'}"></font-awesome-icon>
            </el-tooltip>
          </li>
          <li @click="open('/login')">
            <el-tooltip :content="$t('navs.logout')" placement="right">
              <font-awesome-icon icon="power-off" :style="{fontSize: '26px'}"></font-awesome-icon>
            </el-tooltip>
          </li>
        </ul>
        <!-- <div class="aside-mask"></div> -->
      </aside>
      <section>
        <router-view></router-view>
      </section>
      <el-dialog :title="$t('setting.title')" :visible.sync="settingDialog">
        <el-form :model="form" label-width="100px">
          <el-form-item :label="$t('setting.lang')">
            <el-select :value="lang" size="small" @change="langChange">
              <el-option value="zh" label="中文简体"></el-option>
              <el-option value="en" label="English"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('setting.lock_pw')">
            <el-input v-model="form.password" :readonly="pwReadonly" :maxlength="4" :minlength="4" type="password" class="pw-input"></el-input>
            <el-button type="text" icon="el-icon-delete" @click="pwVisible = true">{{$t('setting.lock_pw_change')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
          :title="$t('setting.password.title')"
          width="350"
          top='0'
          trigger="manual"
          :visible.sync="pwVisible">
          <el-form :model="pwForm" :rules="pwRules" ref="pwForm" label-width="100px">
            <el-form-item :label="$t('setting.password.old_pw')" prop="old_password" v-if="!firstCreate">
              <el-input v-model="pwForm.old_password" :placeholder="$t('setting.password.old_pw')" :maxlength="4" :minlength="4" type="password" class="pw-input"></el-input>
            </el-form-item>
            <el-form-item :label="$t('setting.password.new_pw')" prop="password">
              <el-input v-model="pwForm.password" :placeholder="$t('setting.password.new_pw')" :maxlength="4" :minlength="4" type="password" class="pw-input"></el-input>
            </el-form-item>
          </el-form>
          <div  slot="footer">
            <el-button size="mini" type="text" @click="delPw">{{$t('setting.password.btn_del')}}</el-button>
            <el-button type="primary" size="mini" @click="submitPw">{{$t('setting.password.btn_update')}}</el-button>
          </div>
      </el-dialog>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  // const dateFormat = require('dateformat')

  export default {
    name: 'Layout',
    components: {
    },
    data () {
      return {
        settingDialog: false,
        pwReadonly: true,
        pwVisible: false,
        firstCreate: false,
        pwForm: {
          old_password: '',
          password: ''
        },
        pwRules: {
          old_password: [
            { required: true, message: '请输入原密码', trigger: 'blur' },
            { min: 4, max: 4, message: '长度必须是4位数', trigger: 'blur' }
          ],
          password: [
            { min: 4, max: 4, message: '长度必须是4位数', trigger: 'blur' }
          ]
        },
        form: {
          password: '',
          lang: 'zh'
        },
        isLoading: true
      }
    },
    watch: {
    },
    computed: mapState({
      modalVisible: state => state.notes.modal_visible,
      lang: state => state.base.lang
    }),
    mounted () {
      this.checkFirst()
    },
    methods: {
      checkFirst () {
        this.$db.system.findOne({type: 'password'}, (err, doc) => {
          if (!err && !doc) {
            this.firstCreate = true
            this.form.password = ''
          } else {
            this.firstCreate = false
            this.form.password = '****'
          }
        })
      },
      open (link) {
        this.$router.push({'path': link})
        // this.$electron.shell.openExternal(link)
      },
      submitPw () {
        this.$refs.pwForm.validate((valid) => {
          if (valid) {
            if (!this.firstCreate) {
              this.$db.system.update({type: 'password', value: this.pwForm.old_password}, {$set: {value: this.pwForm.password}}, {}, (err) => {
                if (!err) {
                  this.$message.success('更新成功')
                  this.checkFirst()
                  this.pwVisible = false
                } else {
                  this.$message.error('原密码错误')
                }
              })
            } else {
              this.$db.system.insert({value: this.pwForm.password, type: 'password'}, (err, doc) => {
                if (!err) {
                  this.$message.success('设置成功')
                  this.checkFirst()
                }
                this.pwVisible = false
              })
            }
          } else {
            return false
          }
        })
      },
      delPw () {
        this.$refs.pwForm.validate((valid) => {
          if (valid) {
            this.$db.system.remove({value: this.pwForm.old_password, type: 'password'}, (err, doc) => {
              if (!err) {
                this.$message.success('删除成功')
                this.checkFirst()
              }
              this.pwVisible = false
            })
            this.$message.success('submit')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      langChange (lang) {
        this.$i18n.locale = lang
        localStorage.setItem('lang', lang)
        this.$store.dispatch('setLang', lang)
      },
      showMessage (text) {
        if (text) this.$Message.info(text)
      },
      close () {
        this.$store.dispatch('setModalVisible', false)
      },
      ...mapActions([
        'getNotes'
      ])
    }
  }
</script>

<style>
  main#app-main {
    /* background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      ); */
    height: 100vh;
    width: 100vw;
    min-width: 900px;
    display: flex;
    justify-content: space-between;
  }
  main#app-main > .topbar{
    width: 100%;
    height: 20px;
    -webkit-app-region: drag;
    background: transparent;
    z-index: 10000;
    flex:0;
    position: absolute;
    top:0;
    cursor:move;
  }
  main#app-main > aside {
    -webkit-app-region: drag;
    cursor:move;
    width: 68px;
    min-width: 68px;
    /* flex-basis: 50%; */
    background: #434d88;
    display: flex;
    flex-direction: column;
    flex: 0;
  }
  main#app-main > section{
    flex: 1 1 auto;
  }
  main#app-main > aside .aside-mask{
    width: 232px;
    height: 100vh;
    background: #5964a5;
    display: none;
    flex-direction: column;
    position: absolute;
    top:0;
    left:68px;
    z-index: 1;
  }
  main#app-main > aside:hover .aside-mask{
    display: block;
  }
  main#app-main > aside .text{display: none;}
  main#app-main > aside:hover > ul > li{width: 100%;}
  main#app-main > aside:hover .text{display:block;}
  main#app-main > aside > ul{
    padding-top:30px;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  main#app-main > aside > ul:first-child{
    /* background: #999; */
    flex: 1 1 auto;
  }
  main#app-main > aside > ul:nth-child(2){
    /* align-items: flex-end; */
    text-align: left;
  }
  main#app-main > aside ul li {
    width:68px;
    height:68px;
    line-height: 68px;
    color:#fff;
    text-align: center;
    position: relative;
    cursor: pointer;
  }
  main#app-main > aside > ul > li .text{width: 232px;text-align: left;text-indent: 2em;position: absolute;left:68px;top:0;z-index: 2}
  main#app-main > aside > ul > li:hover .text{background: rgba(255,255,255,.1)}
  main#app-main > aside > ul > li .ivu-icon{font-size: 30px}
  main#app-main > aside > ul > li:hover,
  main#app-main > aside > ul > li.selected{background-color: rgba(255,255,255,.1)}
  .pw-input.el-input{width:220px;}
  .pw-input .el-input__inner{letter-spacing: 35px;text-indent:15px}
  .pw-input .el-input__inner::placeholder{letter-spacing: 1px;text-indent: 0}
</style>

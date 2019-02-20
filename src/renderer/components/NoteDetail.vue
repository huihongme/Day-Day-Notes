<template>
  <section class="note-detail">
    <template v-if="note._id!=''">
      <div class="cell note-title">
        <el-input v-model="inote.title" @change="editorChange" size="small" prefix="md-create"></el-input> &nbsp;
        <el-colorPicker v-model="inote.color" @change="colorPickerChange" class="color-picker" size="small"/> &nbsp;
        <el-popover
          placement="bottom-end"
          v-model="delVisible">
          <el-alert
            :title="$t('note.del_tip')"
            type="error"
            :style="{marginBottom: '10px'}"
            :closable="false"
            show-icon>
          </el-alert>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="delVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="del(note._id)">确定</el-button>
          </div>
          <el-button slot="reference" size="small" style="padding-left:8px;padding-right:8px;"><i class="el-icon-delete" /></el-button>
        </el-popover>
      </div>
      <vue-editor class="cell" @text-change="editorChange" v-model="inote.content"></vue-editor>
      <div class="cell save-state">
        <span v-if="saveState==0 && !saveing"><i class="el-icon-edit" /> {{$t('input_ing')}}</span>
        <span v-else-if="saveing"><el-icon class="el-icon-circle-check-outline" /> {{$t('save_ing')}}</span>
        <span v-else-if="!saveing"><el-icon class="el-icon-circle-check" /> {{$t('save_end')}}</span>
      </div>
      <!-- <div class="cell">
        <Button type="primary" :disabled="saveDisabled" :loading="saveLoading" @click="save" icon="md-checkmark">{{$t('note.save')}}</Button>
        <Divider type="vertical" />
        <Button type="default" @click="isEdit = false" icon="md-close">{{$t('note.clear')}}</Button>
      </div> -->
    </template>
    <template v-if="note._id==''">
      <div class="no-data">
        <p><span>未选择便签</span></p>
        <el-button @click="create"><i class="el-add-circle" size="16"/> 创建一个</el-button>
      </div>
    </template>
    <el-dialog
      title="新建"
      :visible="modalVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :styles="{top: '0'}">
        <el-input placeholder="标题" v-model="noteTitle" />
        <footer slot="footer">
          <el-button type="default" icon="md-close-circle" @click="close">关闭</el-button>
          <el-button icon="md-checkmark-circle" type="primary" @click="save">确定</el-button>
        </footer>
    </el-dialog>
  </section>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { VueEditor } from 'vue2-editor'
  var flag

  export default {
    name: 'Note',
    components: {
      VueEditor
    },
    data () {
      return {
        id: 0,
        isEdit: false,
        saveState: 2,
        delVisible: false,
        noteTitle: '',
        color: '#ff6600',
        inote: {title: '', content: ''},
        saveDisabled: false,
        saveLoading: false,
        customToolbar: [
          ['bold', 'italic', 'underline'],
          [{'list': 'ordered'}, { 'list': 'bullet' }],
          ['image', 'code']
        ],
        content: ''
      }
    },
    watch: {
      '$route' (to, from) {
        // this.refresh()
      },
      note (val) {
        this.inote = JSON.parse(JSON.stringify(val))
      },
      saveing (val) {
        if (!val) this.saveTip = '已保存'
      }
    },
    created () {
    },
    mounted () {
      this.inote = JSON.parse(JSON.stringify(this.note))
    },
    computed: mapState({
      modalVisible: state => state.notes.modal_visible,
      selectId: state => state.notes.select_id,
      note: state => state.notes.note,
      saveing: state => state.base.loading,
      windows: state => state.base.windows
    }),
    methods: {
      save () {
        let data = {
          title: this.noteTitle || '这是一个新便签',
          content: ''
        }
        this.saveNote(data)
        this.noteTitle = ''
      },
      close () {
        this.$store.dispatch('setModalVisible', false)
      },
      editorChange () {
        if (this.inote.content !== this.note.content || this.inote.title !== this.note.title) {
          clearTimeout(flag)
          this.saveState = 0
          flag = setTimeout(() => {
            this.saveState = 1
            this.saveNote(this.inote)
          }, 2000)
        }
      },
      colorPickerChange () {
        clearTimeout(flag)
        this.saveState = 0
        flag = setTimeout(() => {
          this.saveState = 1
          this.saveNote(this.inote)
        }, 2000)
      },
      create () {
        this.$store.dispatch('setModalVisible', true)
      },
      edit () {
        this.isEdit = !this.isEdit
        this.inote = JSON.parse(JSON.stringify(this.note))
      },
      del (id) {
        this.delVisible = false
        this.delNotes(id)
      },
      ...mapActions([
        'setLoading',
        'getNotes',
        'getNote',
        'saveNote',
        'delNotes',
        'delWin',
        'addWin'
      ])
    }
  }
</script>

<style>
.spin-col{
  position: relative;
}
.spin-icon-load{
    animation: ani-spin 1s linear infinite;
}
@keyframes ani-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}

.color-picker .ivu-select-dropdown{
  left: auto !important;
  right: 0;
}

.no-data{
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 80%;
}
.no-data p{
  width:100%;
  height: 14px;
  color:#ccc;
  text-align: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px
}
.no-data p span{
  background: #fff;
  display: inline-block;
  padding: 5px 10px;
}
.note-detail {
  display: flex;
  flex-direction: column;
  /* text-align: center; */
  /* margin:-15px;
  padding: 15px; */
  justify-content: space-between;
  height: 100%
}
.note-detail .note-title{
  margin-bottom: 8px;
  text-align: left;
}
.note-detail .note-title h3{flex: 1;line-height: 30px;}
.note-detail .ql-toolbar.ql-snow .ql-formats{margin-right: 4px;}
.note-detail .quillWrapper{
  /* border:1px solid #ccc */
  /* background: rgba(0,0,0,.05); */
  border-radius: 6px;
  box-shadow: 0 0 20px rgba(0,0,0,.1) inset
}
.note-detail .ql-toolbar.ql-snow{border-color:#eee;background: #fff;border-radius: 6px;}
.note-detail .ql-container.ql-snow{border:none;}
.note-detail .cell:first-child{
  /* height: 40px; */
  display: flex;
  justify-content: center;
  align-items: center;
}
.note-detail .cell:nth-child(2){
  flex: 1;
  margin-bottom: 8px;
  overflow: hidden;
}
.note-detail .cell:last-child{
  /* align-items: flex-end; */
  height:12px;
  line-height: 12px;
  text-align: right;
  margin-top:-2px;
  margin-bottom:-8px;
  color:#ccc
}
.note-content{
  background-color: rgba(0,0,0,0.04);
  overflow-y: auto;
  padding: 10px;
}
.save-state{text-align: right;font-size:12px;color:#999}
</style>

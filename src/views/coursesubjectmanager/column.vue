<template>
  <div class="wrap">
    <div>
      栏目设置
      <el-button @click="showAddBox(true)">新增设置</el-button>
    </div>
    <div class="tableStyle">
      <ul style="border-bottom: 1px solid #eee; padding-bottom: 16px;">
        <li>序号</li>
        <li>栏目</li>
        <li>有效状态</li>
        <li>操作</li>
      </ul>
      <draggable v-model="list" style="width: 800px;">
        <ul v-for="(item, i) in list" :key="i">
          <li>{{i + 1}}</li>
          <li>{{item.name}}</li>
          <li>
            <el-switch v-model="item.status" @change="changeStatus(item, i)"></el-switch>
          </li>
          <li>
            <el-button type="text" @click="editColumn(item)">编辑</el-button>
            <el-button type="text" @click="deleteData(item.id)">删除</el-button>
          </li>
        </ul>
      </draggable>
    </div>
    <div>提示：可实现拖动排序</div>
    <div style="text-align: center;padding 20px">
      <el-button type="success" @click="dragSubmit">提交</el-button>
    </div>
    <div class="mask-box" v-show="showAdd">
      <div class="wrap-mask">
        <div class="mask-title">
          {{ boxObj.id ? '编辑栏目' : '新建栏目' }}
          <i class="el-icon-close" @click="showAddBox(false)"></i>
        </div>
        <div style="padding: 16px">
          <div style="padding: 8px 0">栏目名称</div>
          <el-input v-model="boxObj.name" clearable></el-input>
          <div style="padding: 8px 0">栏目类型</div>
          <el-select v-model="boxObj.type">
            <el-option label="普通" :value="0"></el-option>
            <el-option label="直播" :value="1"></el-option>
            <el-option label="问答" :value="2"></el-option>
          </el-select>
        </div>
        <div class="footer">
          <el-button size="small" @click="showAddBox(false)">取消</el-button>
          <el-button size="small" type="success" @click="addData" :disabled="!boxObj.name">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import assign from 'object-assign';
import { addColumn, columnList, deleteColumn, updateColumn, activeColumn, setColumnSort } from './sever';

export default {
  name: '',
  data() {
    return {
      listData: [
        { name: '交通', status: true, id: 1 },
        { name: '美食', status: false, id: 10 },
        { name: '大地', status: true, id: 12 },
      ],
      showAdd: false,
      boxObj: { name: '', type: '' },
    };
  },
  created() {
    this.search();
  },
  computed: {
    list: {
      get() {
        return this.listData;
      },
      set(value) {
        this.listData = value.filter(v => Boolean(v));
      },
    },
  },
  components: {
    draggable,
  },
  methods: {
    dragSubmit() {
      const courseColumnDataList = this.list.map((v, i) => {
        v.sortIndex = i + 1;
        return {
          columnId: v.id,
          sortIndex: v.sortIndex,
        };
      });

      setColumnSort({ courseColumnDataList })
        .then(res => {
          this.$message.success('保存成功');
          this.search()
        })
        .catch(error => {
          this.$message.success('保存失败');
        });
    },
    search() {
      const that = this;
      columnList().then(res => {
        if (res.resCode == 200) {
          that.listData = (res.resObject.list || []).map(v => assign(v, { status: v.isActive === 1 }));
          that.listData = that.listData.sort(function(prev, next) {
            return prev.sortIndex - next.sortIndex
          })
          this.showAdd = false;
        } else {
          that.$message(res.message, 'error');
        }
      });
    },
    showAddBox(val) {
      if (!val) this.boxObj = { name: '', type: '' };
      this.showAdd = val;
    },
    editColumn(val) {
      this.boxObj = val;
      this.showAdd = true;
    },
    deleteData(id) {
      const that = this;
      this.$confirm('您的栏目中存有数据，此操作将永久删除该文件，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteColumn({ ids: [id] }).then(res => {
            if (res.resCode == 200) {
              that.$message.success('删除成功');
              that.search();
            } else {
              that.$message.error(res.message);
            }
          });
        })
        .catch(() => {});
    },
    changeStatus(item, i) {
      const that = this;
      activeColumn({ id: item.id }).then(res => {
        console.log(11111);
        if (res.resCode == 200) {
          that.$message.success('操作成功');
        } else {
          that.$message.error(res.message);
          that.list[i].status = item.status;
        }
      });
    },
    updateData() {
      const that = this;
      updateColumn(this.boxObj.id, this.boxObj).then(res => {
        if (res.resCode == 200) {
          that.$message.success('编辑成功');
          that.search();
        } else {
          that.$message.error(res.message);
        }
      });
    },
    addData() {
      if (this.boxObj.id) return this.updateData();
      const that = this;
      addColumn(this.boxObj).then(res => {
        if (res.resCode == 200) {
          that.$message.success('新增成功');
          that.search();
        } else {
          that.$message.error(res.message);
        }
      });
    },
  },
};
</script>

<style scoped>
.wrap {
  background-color: rgb(255, 255, 255);
  height: 100%;
  margin: 16px;
  padding: 16px;
  box-shadow: 0 0 10px #d9d9d9;
  border-radius: 4px;
}
.tableStyle ul {
  display: flex;
  list-style: none;
  padding: 0;
}
.tableStyle ul li {
  display: flex;
  align-items: center;
}
.tableStyle ul:hover {
  background-color: #cccccc;
}
.tableStyle ul >>> li:nth-child(1) {
  width: 60px;
}
.tableStyle ul >>> li:nth-child(2) {
  width: 150px;
}
.tableStyle ul >>> li:nth-child(3) {
  width: 150px;
}
.tableStyle ul >>> li:nth-child(4) {
  width: 150px;
}
.mask-box {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  left: 0;
  background-color: rgba(55, 55, 55, 0.6);
}
.wrap-mask {
  width: 400px;
  margin: 0 auto;
  position: relative;
  outline: 0;
  top: 100px;
  background-color: #ffffff;
}
.wrap-mask .mask-title {
  display: flex;
  align-items: center;
  padding: 8px;
  justify-content: space-between;
  background-color: #333333;
  color: #ffffff;
}
.footer {
  text-align: right;
  padding: 8px;
  border-top: 1px solid #cccccc;
}
</style>

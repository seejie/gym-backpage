<template>
  <div class="channel_form yanse-form">
    <el-card class="box-card">
      <el-form :model="channelData" ref="channelForm" label-width="100px" class="demo-ruleForm" v-if="channelData">
        <el-form-item label="文字状态" class="color-item-title"></el-form-item>
        <el-form-item label="选中" label-width="150px" class="color-item">
          <div class="checked_text">
            <div class="label">{{ channelData.checkColor }}</div>
            <el-color-picker v-model="channelData.checkColor"></el-color-picker>
          </div>
        </el-form-item>
        <el-form-item label="未选中" label-width="150px" class="color-item">
          <div class="checked_text">
            <div class="label">{{ channelData.uncheckColor }}</div>
            <el-color-picker v-model="channelData.uncheckColor"></el-color-picker>
          </div>
        </el-form-item>
        <el-form-item class="yanse-text-desc">
          <div class="channel-text-desc">
            提示：设置后，前台频道名以及栏目名 选中、未选中状态字体颜色会变化
          </div>
        </el-form-item>
        <el-form-item label="频道排序" class="color-item-title"></el-form-item>
        <el-form-item label-width="20px">
          <el-table
            :data="channelListData"
            v-show="channelListData.length > 0"
            class="channel-list-table"
            border
            style="width: 1150px;"
            row-key="id"
          >
            <el-table-column
              label="位置排序"
              type="index"
              align="center"
              show-overflow-tooltip
              width="100"
            ></el-table-column>
            <el-table-column property="channelName" label="频道名称" align="center" width="125"></el-table-column>
            <el-table-column property="showChannelName" label="自定义名" align="center" width="125"></el-table-column>
            <el-table-column label="微信H5展示状态" width="100" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.gzhShowChannel"
                  :width="60"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="小程序展示状态" width="100" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.miniShowChannel"
                  :width="60"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="选中LOGO" width="100" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.channelImgUrl" v-if="scope.row.channelImgUrl" class="logo-img" />
              </template>
            </el-table-column>
            <el-table-column label="未选中LOGO" width="100" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.uncheckChannelImgUrl" v-if="scope.row.uncheckChannelImgUrl" class="logo-img" />
              </template>
            </el-table-column>
            <el-table-column property="shareTitle" label="分享标题" align="center" width="100"></el-table-column>
            <el-table-column property="shareDesc" label="分享说明" align="center" width="100"></el-table-column>
            <el-table-column label="分享图片" width="100" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.shareImage" v-if="scope.row.shareImage" class="logo-img" />
              </template>
            </el-table-column>
            <el-table-column width="100" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="updateClick(scope)">
                  编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="channel-text-desc" v-show="channelListData.length > 0">
            提示：可拖动实现排序
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">提交</el-button>
          <el-button @click="resetFrom()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog width="50%" title="频道设置" :visible.sync="isShowDialog" :close-on-click-modal="false">
      <editForm :channelData="selectData" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdata">取 消</el-button>
        <el-button type="primary" @click="saveDataClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { setChannelSort, getAllChannelByUnitId } from '@/api/apiPlatformSetting';

import editForm from './index';
import { info, confirm } from '../../utils/ddHelper';
import sortable from 'sortablejs';

export default {
  name: 'yanse',

  components: {
    editForm,
  },
  data() {
    return {
      rules: {},

      isShowDialog: false,
      selectData: {},
      selectDataIndex: '',

      channelData: {
        channelList: [],
      },
      channelListData: [],
    };
  },
  created() {
    this.loadData();
  },
  mounted() {
    let el = document.querySelectorAll('.channel-list-table > .el-table__body-wrapper > table > tbody')[0];

    if (el) {
      sortable.create(el, {
        onEnd: evt => {
          //监听拖动结束事件
          console.log(evt.oldIndex); //当前行的被拖拽前的顺序
          console.log(evt.newIndex); //当前行的被拖拽后的顺序
          const currRow = this.channelListData.splice(evt.oldIndex, 1)[0];
          this.channelListData.splice(evt.newIndex, 0, currRow);
        },
      });
    }
  },
  methods: {
    loadData() {
      getAllChannelByUnitId({}, data => {
        this.channelData = data;
        this.channelData.checkColor = data.checkColor || '#1989fa';
        this.channelData.uncheckColor = data.uncheckColor || '#7d7e80';
        this.channelListData = data.channelList;
      });
    },
    submitForm() {
      let self = this;
      confirm(this, '确定提交吗？', () => {
        self.channelListData.forEach((channel, index) => {
          channel.channelSort = index + 1;
        });
        setChannelSort(
          {
            channelList: self.channelListData,
            checkColor: self.channelData.checkColor,
            uncheckColor: self.channelData.uncheckColor,
          },
          () => {
            info(self, `修改成功`);
            this.loadData();
          }
        );
      });
    },
    resetFrom() {
      this.$refs.channelForm.resetFields();
    },

    updateClick(item) {
      this.isShowDialog = true;
      this.selectData = item.row;
      this.selectDataIndex = item.$index;
    },

    saveDataClick() {
      this.isShowDialog = false;
      this.channelListData[this.selectDataIndex] = this.selectData;
    },

    cancelUpdata() {
      this.isShowDialog = false;
      this.loadData();
    },
  },

  watch: {
    'channelData.channelList'(value) {
      this.channelListData = value;
    },
  },
};
</script>
<style lang="scss" scoped>
.yanse-form {
  .color-item {
    margin-bottom: 0px !important;

    label.el-form-item__label {
      font-size: 10px;
    }
  }

  .color-item-title {
    margin-bottom: 0px !important;
  }

  .logo-img {
    width: 30px;
    height: 30px;
  }
}

.checked_text {
  display: flex;

  .label {
    color: $font-6;
    padding: 0 10px;
  }
}
</style>

<template>
  <div class="dd-page wechat_page">
    <el-card>
      <el-row :gutter="60">
        <el-col :span="8">
          <div class="wechat_preview">
            <div class="menu_bottom">
              <div class="menu_content">
                <div
                  :class="firstActiveIndex == index && secondActiveIndex == null ? 'menu_item active' : 'menu_item'"
                  v-for="(item, index) in menuList"
                  :key="index"
                >
                  <!-- begin 一级菜单 -->
                  <div
                    v-if="item.isAddbtn && menuList.length == 1"
                    class="first_add_btn_one"
                    @click="addFirstMenu(index)"
                  >
                    <i class="el-icon-plus" style="font-weight: bold; color: #c9c9c9;"></i>添加菜单
                  </div>
                  <div
                    v-else-if="item.isAddbtn && menuList.length != 1"
                    @click="addFirstMenu(index)"
                    class="first_add_btn"
                  >
                    <i class="el-icon-plus" style="font-weight: bold; color: #c9c9c9;"></i>
                  </div>
                  <div v-else class="first_add_btn" @click="editFirstMenu(index)">{{ item.name }}</div>
                  <!-- end 一级菜单 -->

                  <!-- begin 二级菜单 -->
                  <div class="menu_children" v-if="item.child && item.child.length && firstActiveIndex == index">
                    <div
                      :class="secondActiveIndex == child_index ? 'menu_child active' : 'menu_child'"
                      v-for="(child_item, child_index) in item.child"
                      :key="child_index"
                    >
                      <div class="label" v-if="child_item.isAddbtn" @click="addSecondMenu(index, child_index)">
                        <i class="el-icon-plus" style="font-weight: bold; color: #c9c9c9;"></i>
                      </div>
                      <div class="label" v-else @click="editSecondMenu(index, child_index)">{{ child_item.name }}</div>
                    </div>
                  </div>
                  <!-- end 二级菜单 -->
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="wechat_form" v-if="previewData">
            <div class="title_content">
              <h3>菜单设置</h3>
              <el-button type="text" style="float: right;" @click="deleteMenu">
                {{previewData.horder == 0 ? '删除菜单' : '删除子菜单'}}
              </el-button>
            </div>

            <!-- begin 已添加子菜单，仅可设置菜单名称 -->
            <div
              v-if="previewData.child && previewData.child.length > 1 && previewData.child.length < 5"
              style="color: #9a9a9a; font-size: 14px; margin-top: 20px; margin-bottom: 40px;"
            >
              已添加子菜单，仅可设置菜单名称。
            </div>
            <div
              v-else-if="previewData.child && previewData.child.length == 5"
              style="color: #9a9a9a; font-size: 14px; margin-top: 20px; margin-bottom: 40px;"
            >
              已为“{{ previewData.name }}”添加了个5子菜单，无法设置其他内容。
            </div>

            <el-form v-if="previewData.child && previewData.child.length > 1" label-width="100px">
              <el-form-item label="菜单标题" prop="name">
                <el-input placeholder="" v-model="previewData.name" clearable class="input-comp"></el-input>
                <div class="name_tips">
                  仅支持中英文和数字,字数不超过8个汉字或者英文不超过16个字母
                </div>
              </el-form-item>
            </el-form>

            <el-form v-else label-width="100px">
              <el-form-item label="菜单标题" prop="name">
                <el-input placeholder="" v-model="previewData.name" clearable class="input-comp"></el-input>
                <div class="name_tips">
                  仅支持中英文和数字,字数不超过8个汉字或者英文不超过16个字母
                </div>
              </el-form-item>

              <el-form-item label="菜单类型" prop="type">
                <el-radio-group v-model="previewData.type" style="width: 100%;">
                  <el-radio style="margin: 0 0;" label="media_id">发送消息</el-radio>
                  <el-radio style="margin: 0 30px;" label="view"> 跳转页面</el-radio>
                  <el-radio style="margin: 0 0;" label="miniprogram">跳转小程序</el-radio>
                </el-radio-group>
              </el-form-item>

              <div style="padding: 10px 20px 20px 30px;">
                <!-- begin 发送消息 -->
                <el-tabs
                  v-model="previewData.mtype"
                  type="border-card"
                  v-if="previewData.type == 'media_id' || (previewData.type == 'click' && previewData.mtype == 5)"
                >
                  <!-- begin 选择图文信息-->
                  <el-tab-pane label="图文" :name="1 + ''">
                    <div v-if="previewData.mtype == '1'" class="material_container_block">
                      <span class="material_container_text" @click.stop="addMaterialClick">
                        选择图文信息
                      </span>
                      <div
                        class="material-container-main"
                        v-if="previewData.materialsNews && previewData.materialsNews.id"
                      >
                        <el-image
                          style="width: 450px; height: 200px;"
                          :src="previewData.materialsNews.indexPic"
                          fit="contain"
                        />
                        <el-button icon="el-icon-close" circle @click.stop="deleteMaterialClick"></el-button>
                      </div>
                    </div>
                  </el-tab-pane>
                  <!-- end 选择图文信息-->

                  <!-- begin 文字-->
                  <el-tab-pane label="文字" :name="5 + ''">
                    <div v-if="previewData.mtype == '5'" class="material_container_block">
                      <el-input type="textarea" maxlength="64" v-model="previewData.ekey"></el-input>
                    </div>
                  </el-tab-pane>
                  <!-- end 文字-->

                  <!-- begin 选择图片信息 -->
                  <el-tab-pane label="图片" :name="2 + ''">
                    <div v-if="previewData.mtype == '2'" class="material_container_block">
                      <span class="material_container_text" @click.stop="addMaterialClick">
                        选择图片信息
                      </span>
                      <div
                        class="material-container-main"
                        v-if="previewData.materialsImage && previewData.materialsImage.path"
                      >
                        <el-image
                          style="width: 450px; height: 200px;"
                          :src="previewData.materialsImage.path"
                          fit="contain"
                        />
                        <el-button icon="el-icon-close" circle @click.stop="deleteMaterialClick"></el-button>
                      </div>
                    </div>
                  </el-tab-pane>
                  <!-- end 选择图片信息 -->

                  <!-- begin 选择音频信息 -->
                  <el-tab-pane label="音频" :name="4 + ''">
                    <div v-if="previewData.mtype == '4'" class="material_container_block">
                      <span
                        class="material_container_text"
                        v-show="!previewData.materialsVoice"
                        @click.stop="addMaterialClick"
                      >
                        选择音频信息
                      </span>
                      <div class="material-container-main" v-if="previewData.materialsVoice">
                        <h3 class="material-title">
                          {{ previewData.materialsVoice.title }}
                        </h3>
                        <aplayer
                          mini
                          :music="{
                            src: previewData.materialsVoice.voicePath,
                            pic: previewData.materialsVoice.imagePath,
                          }"
                        />
                        <el-button icon="el-icon-close" circle @click.stop="deleteMaterialClick"></el-button>
                      </div>
                    </div>
                  </el-tab-pane>
                  <!-- end 选择音频信息 -->

                  <!-- begin 选择视频信息 -->
                  <el-tab-pane label="视频" :name="3 + ''">
                    <div v-if="previewData.mtype == '3'" class="material_container_block">
                      <span class="material_container_text" @click.stop="addMaterialClick">
                        选择视频信息
                      </span>
                      <div class="material-container-main" v-if="previewData.materialsVideo">
                        <h3 class="material-title">
                          {{ previewData.materialsVideo.title }}
                        </h3>
                        <video controls :poster="previewData.materialsVideo.imagePath">
                          <source :src="previewData.materialsVideo.videoPath" />
                        </video>
                        <el-button icon="el-icon-close" circle @click.stop="deleteMaterialClick"></el-button>
                      </div>
                    </div>
                  </el-tab-pane>
                  <!-- end 选择视频信息 -->
                </el-tabs>
                <!-- end 发送消息 -->

                <!-- begin 跳转页面 -->
                <div v-if="previewData.type == 'view'">
                  <div class="name_tips">
                    订阅者点击该菜单会跳到以下链接
                  </div>
                  <div class="choose-preview">
                    <el-input required style="width: 100%;" class="input-comp" v-model="previewData.url"></el-input>
                    <el-button @click="isShowSelChannelDialog = true">
                      选择频道
                    </el-button>
                  </div>
                </div>
                <!-- end 跳转页面 -->

                <!-- begin 跳转小程序 -->
                <el-form label-position="top" label-width="80px" v-if="previewData.type == 'miniprogram'">
                  <el-form-item label="小程序APPID">
                    <el-input v-model="previewData.appid" required placeholder="请填写小程序APPID"></el-input>
                  </el-form-item>
                  <el-form-item label="小程序默认页面路径">
                    <el-input v-model="previewData.pagepath" required placeholder="请填写小程序默认页面路径"></el-input>
                  </el-form-item>
                  <el-form-item label="小程序URL">
                    <div class="choose-preview">
                      <el-input
                        required
                        style="width: 100%;"
                        placeholder="请填写小程序备用URL，用户无法访问小程序时跳转"
                        class="input-comp"
                        v-model="previewData.url"
                      ></el-input>
                      <el-button @click="isShowSelChannelDialog = true">
                        选择频道
                      </el-button>
                    </div>
                  </el-form-item>
                </el-form>
                <!-- end 跳转小程序 -->
              </div>
            </el-form>
          </div>
          <div
            v-else
            style="color: #999; text-align: center; font-size: 14px; padding-top: 222px; padding-bottom: 152px;"
          >
            点击左侧菜单进行编辑操作
          </div>
          <div style="width: 100%; padding-left: 150px;">
            <el-button type="primary" @click="onSubmit">
              保存并发布
            </el-button>
            <!-- <el-button @click="onSubmit(false)">取消</el-button> -->
          </div>
        </el-col>
      </el-row>

      <!-- begin 选择素材 -->
      <el-dialog
        title="选择素材"
        :visible.sync="showMaterialDialog"
        width="94%"
        top="0"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <image-text
          :getId="false"
          :modal="showModal"
          v-if="previewData && previewData.mtype == 1"
          @handleCheckedCitiesChange="handleCheckedMaterialChange"
        ></image-text>
        <image-material
          :getId="false"
          :modal="showModal"
          v-if="previewData && previewData.mtype == 2"
          @handleCheckedCitiesChange="handleCheckedMaterialChange"
        ></image-material>
        <voice-material
          :getId="false"
          :modal="showModal"
          v-if="previewData && previewData.mtype == 4"
          @handleCheckedCitiesChange="handleCheckedMaterialChange"
        ></voice-material>
        <video-material
          :getItem="true"
          :modal="showModal"
          v-if="previewData && previewData.mtype == 3"
          @handleCheckedCitiesChange="handleCheckedMaterialChange"
        ></video-material>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="getMediaId">
            确 定
          </el-button>
        </div>
      </el-dialog>
      <!-- end 选择素材 -->

      <!-- begin 选择频道 -->
      <el-dialog title="选择频道" @close="isShowSelChannelDialog = false" :visible.sync="isShowSelChannelDialog">
        <el-radio-group v-if="previewData" style="overflow: hidden; width: 100%;" v-model="previewData.url" size="mini">
          <el-radio style="margin: 10px;" :label="item.previewUrl" v-for="item in channels" :key="item.id">
            {{ item.channelName + ' --- ' + item.previewUrl }}
          </el-radio>
        </el-radio-group>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShowSelChannelDialog = false"> 取 消 </el-button>
          <el-button type="primary" @click="isShowSelChannelDialog = false">确 定</el-button>
        </div>
      </el-dialog>
      <!-- end 选择频道 -->
    </el-card>
  </div>
</template>

<script>
import ImageText from '@/views/material/imagetext';
import ImageMaterial from '@/views/material/image';
import VoiceMaterial from '@/views/material/voice';
import VideoMaterial from '@/views/material/video';
import Aplayer from 'vue-aplayer';
import { getMenuList } from '@/api/apiPlatformSetting';

export default {
  data() {
    return {
      menuList: [], // 菜单列表
      firstActiveIndex: null, // 当前选中的一级菜单下标
      secondActiveIndex: null, // 当前选中的二级菜单下标

      previewData: null, // 正在编辑的菜单数据
      showMaterialDialog: false, // 是否展示选择素材弹框
      showModal: false,
      selectMaterial: [], // 选中素材

      isShowSelChannelDialog: false, // 是否展示选择频道弹层
      channels: [], // 频道链接列表
    };
  },

  created() {
    if (this.menuList.length == 0) {
      this.menuList = [
        {
          isAddbtn: true,
        },
      ];
    }

    this.getAllchannel();
    this.loadMenuList();
  },

  components: {
    ImageText,
    ImageMaterial,
    VoiceMaterial,
    VideoMaterial,
    Aplayer,
  },

  watch: {
    firstActiveIndex() {
      this.handlePreviewData();
    },
    secondActiveIndex() {
      this.handlePreviewData();
    },
    previewData() {
      this.updatepPreviewData();
    },
    'previewData.name'() {
      this.updatepPreviewData();
    },
    'previewData.type'() {
      this.updatepPreviewData();
    },
    'previewData.mtype'() {
      this.updatepPreviewData();
    },
    'previewData.url'() {
      this.updatepPreviewData();
    },
    'previewData.ekey'() {
      this.updatepPreviewData();
    },
  },

  methods: {
    // 添加一级菜单
    addFirstMenu(index) {
      if (!this.menuList[index].child) {
        this.$set(this.menuList, index, {
          isAddbtn: false,
          name: '菜单名称',
          type: 'media_id',
          mtype: '1',
          url: '',
          child: [
            {
              isAddbtn: true,
            },
          ],
        });
      }
      if (index < 2) {
        this.$set(this.menuList, index + 1, {
          isAddbtn: true,
        });
      }
      this.firstActiveIndex = index;
      this.secondActiveIndex = null;
    },

    // 编辑一级菜单
    editFirstMenu(index) {
      this.firstActiveIndex = index;
      this.secondActiveIndex = null;
    },

    // 确认添加二级菜单
    confirmAddSecondMenu() {
      return new Promise((resolve, reject) => {
        this.$confirm(`添加子菜单后，一级菜单的内容将被清除。确定添加子菜单？`, '子菜单确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(e => {
            resolve(true);
          })
          .catch(e => {
            resolve(false);
          });
      });
    },

    // 添加二级菜单
    async addSecondMenu(index, child_index) {
      if (this.menuList[index].child.length < 2) {
        if (!(await this.confirmAddSecondMenu())) {
          return;
        }
      }

      let childList = this.menuList[index].child;
      childList[child_index] = {
        name: '子菜单名称',
        type: 'media_id',
        mtype: '1',
        url: '',
      };
      if (child_index < 4) {
        childList.push({
          isAddbtn: true,
        });
      }
      this.$set(this.menuList, index, {
        ...this.menuList[index],
        child: childList,
      });
      this.secondActiveIndex = child_index;
    },

    // 编辑二级菜单
    editSecondMenu(index, child_index) {
      this.firstActiveIndex = index;
      this.secondActiveIndex = child_index;
    },

    delWxMenu() {
      if (this.previewData.id) {
        this.$ajax
          .post('/platformsetting/wxMenu/delWxMenu', {
            id: this.previewData.id,
          })
          .then(res => {
            if (res.resCode == 200) {
              this.$message.success('删除成功');
              this.handleMxMenuPublish()
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(err => console.log(err));
      }
    },

    // 删除菜单
    deleteMenu() {
      if (this.secondActiveIndex == null) {
        // 删除一级菜单
        this.$confirm(`删除后“${this.previewData.name}”菜单下设置的内容将被删除并发布`, '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(e => {
          let list = this.menuList.slice();
          list.splice(this.firstActiveIndex, 1);
          this.menuList = list;

          this.firstActiveIndex = null;
          this.secondActiveIndex = null;
          this.delWxMenu();
          this.handleShowPlusIcon();
        });
      } else {
        // 删除二级菜单
        this.$confirm(`删除后“${this.previewData.name}”菜单下设置的内容将被删除并发布`, '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(e => {
          let child = this.menuList[this.firstActiveIndex].child.slice();
          child.splice(this.secondActiveIndex, 1);
          this.$set(this.menuList, this.firstActiveIndex, {
            ...this.menuList[this.firstActiveIndex],
            child,
          });

          this.firstActiveIndex = null;
          this.secondActiveIndex = null;
          this.delWxMenu();
          this.handleShowPlusIcon();
        });
      }
    },

    handleMxMenuPublish() {
      this.$ajax
        .post('/platformsetting/wxMenu/publish', {})
        .then(res => {
          if (res.resCode == 200) {
            this.loadMenuList();
            this.$message.success('发布成功');
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => console.log(err));
    },

    handleShowPlusIcon() {
      // 二级菜单显示加号按钮
      let data = this.menuList.slice();
      data.forEach((item, index) => {
        let isHaveAdd = false;
        if (item.child && item.child.length && item.child[item.child.length - 1].isAddbtn) {
          isHaveAdd = true;
        }

        if (item.child && item.child.length < 5 && !isHaveAdd) {
          item.child.push({
            isAddbtn: true,
          });
        }
      });

      // 一级菜单显示加号按钮
      let isParentHaveAdd = false;
      if (data && data.length && data[data.length - 1].isAddbtn) {
        isParentHaveAdd = true;
      }
      if (!isParentHaveAdd) {
        if (data.length < 3) {
          data.push({
            isAddbtn: true,
          });
        }
      }

      this.menuList = data;
    },

    // 处理选中菜单
    handlePreviewData() {
      if (this.menuList.length && this.firstActiveIndex != null && this.secondActiveIndex == null) {
        this.previewData = this.menuList[this.firstActiveIndex];
      } else if (this.menuList.length && this.firstActiveIndex != null && this.secondActiveIndex != null) {
        this.previewData = this.menuList[this.firstActiveIndex].child[this.secondActiveIndex];
      } else {
        this.previewData = null;
      }
    },

    // 选择素材
    addMaterialClick() {
      // mtype 1 图文，2 图片，3 视频，4 音频
      this.showMaterialDialog = true;
    },

    // 选中素材
    handleCheckedMaterialChange(val) {
      this.selectMaterial = val;
    },

    // 确认选中素材
    getMediaId() {
      if (this.selectMaterial.length == 0) {
        this.message(`请选择素材`, 'error');
        return;
      } else if (this.selectMaterial.length > 1) {
        this.message(`只能选一个素材`, 'error');
        return;
      } else {
        this.showMaterialDialog = false;
        this.$set(this.previewData, `materialsId_${this.previewData.mtype}`, this.selectMaterial[0].id);
        if (this.previewData.mtype == 1) {
          this.$set(this.previewData, 'materialsNews', this.selectMaterial[0]);
        } else if (this.previewData.mtype == 2) {
          this.$set(this.previewData, 'materialsImage', this.selectMaterial[0]);
        } else if (this.previewData.mtype == 3) {
          this.$set(this.previewData, 'materialsVideo', this.selectMaterial[0]);
        } else if (this.previewData.mtype == 4) {
          this.$set(this.previewData, 'materialsVoice', this.selectMaterial[0]);
        }
      }
    },

    // 删除选中素材
    deleteMaterialClick() {
      this.$set(this.previewData, `materialsId_${this.previewData.mtype}`, null);
      if (this.previewData.mtype == 1) {
        this.$set(this.previewData, 'materialsNews', null);
      } else if (this.previewData.mtype == 2) {
        this.$set(this.previewData, 'materialsImage', null);
      } else if (this.previewData.mtype == 3) {
        this.$set(this.previewData, 'materialsVideo', null);
      } else if (this.previewData.mtype == 4) {
        this.$set(this.previewData, 'materialsVoice', null);
      }
    },

    //获取频道数据
    getAllchannel() {
      this.$ajax
        .get('/platformsetting/channel/getAllChannelByUnitId')
        .then(res => {
          if (res.resCode == 200) {
            this.channels = res.resObject.channelList;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => console.log(err));
    },

    // 获取菜单
    loadMenuList() {
      getMenuList(data => {
        if (data.length) {
          data.forEach((item, index) => {
            if (!item.child) {
              item.child = [];
            }

            if (data[0].child && data[0].child.length > 0) {
              this.secondActiveIndex = 0;
            }

            this.firstActiveIndex = 0;

            // begin 处理图文 发送消息 type
            data[index].mtype = item.mtype ? item.mtype + '' : '1';
            if (item.type == 'view_limited' || item.type == 'click') {
              data[index].type = 'media_id';
            }

            item.child.forEach((item_child, index_index) => {
              data[index].child[index_index].mtype = item_child.mtype ? item_child.mtype + '' : '1';
              if (item_child.type == 'view_limited' || item_child.type == 'click') {
                data[index].child[index_index].type = 'media_id';
              }
            });
            // end 处理图文 发送消息 type
          });
        }

        this.menuList = data;
        this.handleShowPlusIcon();
      });
    },

    testMenu(payload) {
      let materialsMap = {
        1: '图文',
        2: '图片',
        3: '视频',
        4: '音频',
      };

      if (!payload.name) {
        return `请输入菜单标题`;
      } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(payload.name)) {
        return `[${payload.name}]：菜单标题仅支持中英文和数字`;
      } else if (payload.name.replace(/[^\x00-\xff]/g, 'aa').length > 16) {
        return `[${payload.name}]：菜单标题字数不超过8个汉字或者英文不超过16个字母`;
      } else if (!payload.type && !payload.child.length) {
        return '请选择菜单类型';
      } else if (payload.type == 'media_id' && !payload.materialsId && payload.mtype != 5) {
        return `[${payload.name}]：请选择${materialsMap[payload.mtype]}素材`;
      } else if (payload.type == 'view_limited' && !payload.materialsId) {
        return `[${payload.name}]：请选择${materialsMap[payload.mtype]}素材`;
      } else if (payload.type == 'view' && !payload.url) {
        return '请选择频道链接';
      } else if (payload.type == 'miniprogram' && !payload.appid) {
        return '请填写小程序APPID';
      } else if (payload.type == 'miniprogram' && !payload.pagepath) {
        return '请填写小程序默认页面路径';
      } else if (payload.type == 'miniprogram' && !payload.url) {
        return '请填写小程序备用URL';
      }
    },

    formatPayload(item, payload) {
      if (item.id) {
        payload = {
          ...payload,
          id: item.id,
        };
      }

      switch (item.type) {
        case 'view':
          payload = {
            ...payload,
            url: item.url,
          };
          break;
        case 'miniprogram':
          payload = {
            ...payload,
            url: item.url,
            appid: item.appid,
            pagepath: item.pagepath,
          };
          break;
        case 'media_id':
          if (item.mtype == 1) {
            // 图文
            payload = {
              ...payload,
              materialsId: item[`materialsId_${item.mtype}`] || item.materialsId,
              type: 'view_limited',
              mtype: item.mtype,
            };
          } else {
            // 图片、音频、视频
            payload = {
              ...payload,
              materialsId: item[`materialsId_${item.mtype}`] || item.materialsId,
              type: 'media_id',
              mtype: item.mtype,
            };
          }
          break;
        default:
          break;
      }

      if (payload.mtype == 5) {
        // 文字
        payload = {
          ...payload,
          type: 'click',
          mtype: item.mtype,
          ekey: item.ekey,
        };

        delete payload.materialsId;
      }

      return payload;
    },

    // 处理二级菜单
    formatSecondPayload(list, parent_index) {
      if (!list) {
        return [];
      }
      list = list.filter(item => {
        return !item.isAddbtn;
      });
      let payloadList = list.map((item, index) => {
        let payload = {
          worder: parent_index + 1,
          horder: list.length - index,
          type: item.type,
          name: item.name,
        };

        return this.formatPayload(item, payload);
      });
      return payloadList;
    },

    // 处理菜单参数
    formatFirstPayload() {
      let list = this.menuList.filter(item => {
        return !item.isAddbtn;
      });
      let payloadList = list.map((item, index) => {
        // 有效子菜单
        let childList =
          item.child.filter(item => {
            return !item.isAddbtn;
          }) || [];

        if (childList && childList.length) {
          let payload = {
            worder: index + 1,
            horder: 0,
            name: item.name,
            child: this.formatSecondPayload(item.child, index),
          };

          // 有了子菜单 一级菜单应该只能输入名称
          return payload;
        } else {
          let payload = {
            worder: index + 1,
            horder: 0,
            type: item.type,
            name: item.name,
            child: this.formatSecondPayload(item.child, index),
          };
          return this.formatPayload(item, payload);
        }

        if (item.mtype == 5) {
          let payload = {
            worder: index + 1,
            horder: 0,
            name: item.name,
            child: this.formatSecondPayload(item.child, index),
          };
          return this.formatPayload(item, payload);
        }
      });
      return payloadList;
    },

    checkMenulist(data) {
      let list = [];
      data.map((item, index) => {
        item.child.map((child_item, index_index) => {
          list.push(this.testMenu(child_item));
        });
        list.push(this.testMenu(item));
      });

      return list;
    },

    // 提交
    onSubmit() {
      let data = this.formatFirstPayload();
      if (!data.length) {
        this.$message.error(`请添加菜单`);
        return;
      }

      let checkResultList = this.checkMenulist(data).filter(item => {
        return item;
      });

      if (checkResultList.indexOf(false) !== -1) return;
      if (checkResultList.length) {
        this.$message.error(checkResultList[0]);
        return;
      }

      this.$confirm('发布成功后会覆盖原版本，且将在24小时内对所有用户生效，确认发布？', '发布确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(e => {
          this.handlePublish(data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    // 发布
    handlePublish(payload) {
      let url = '/platformsetting/wxMenu/saveWxMenu';
      this.$ajax
        .post(url, payload)
        .then(res => {
          if (res.resCode == 200) {
            this.handleMxMenuPublish()
          } else {
            this.$message.error(res.message);
          }
          this.$loading().close();
        })
        .catch(err => {
          this.$loading().close();
          console.log(err);
        });
    },

    // 更新PreviewData
    updatepPreviewData() {
      if (this.firstActiveIndex !== null && this.secondActiveIndex == null) {
        this.$set(this.menuList, this.firstActiveIndex, {
          ...this.menuList[this.firstActiveIndex],
          ...this.previewData,
        });
      } else if (this.firstActiveIndex != null && this.secondActiveIndex != null) {
        let child = this.menuList[this.firstActiveIndex].child.slice();
        child[this.secondActiveIndex] = {
          ...child[this.secondActiveIndex],
          ...this.previewData,
        };
        this.$set(this.menuList, this.firstActiveIndex, {
          ...this.menuList[this.firstActiveIndex],
          child,
        });
      }
    },
  },
};
</script>

<style lang="scss" scpoed src="./index.scss"></style>

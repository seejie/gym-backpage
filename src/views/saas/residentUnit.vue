<template>
  <div class="residentUnit">
    <!-- 入住单位 -->
    <div class="from-wrap">
      <el-form :inline="true" ref="formInline" label-width="80px" label-position="left" :model="searchData">
        <el-row>
          <el-col :span="6">
            <el-form-item prop="title" label="搜索名称">
              <el-input v-model="searchData.unitName" placeholder="搜索名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="company" label="发布状态">
              <el-select placeholder="请选择" v-model="searchData.status">
                <el-option label="已上线" value="1"></el-option>
                <el-option label="已下线" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="查询时间:">
              <el-date-picker
                v-model="time"
                class="input"
                size="medium"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item style="float:right">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <el-card shadow="never" class="card">
      <!--全选、添加等操作按钮-->
      <div slot="header" class="clearfix">
        <el-button type="primary" @click="addresidentUnit()">
          创建单位
        </el-button>
        <el-button @click="batchTopicPublish(3)">批量上线</el-button>
        <el-button @click="batchTopicPublish(4)">批量下线</el-button>
        <el-button @click="batchTopicDel">删除</el-button>
      </div>
      <!--表格-->
      <el-table :data="tableList" style="width: 100%;" @selection-change="selectionchange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="单位名称" min-width="140px">
          <template slot-scope="scope">
            <el-tag size="mini" style="margin-right: 10px;" v-if="scope.row.position == 1">
              置顶
            </el-tag>
            <img style="width: 36px; height: 36px; border-radius: 4px; flex-shrink: 0;" :src="scope.row.unitImg" />
            <span style="margin-left: 10px;">{{ scope.row.unitName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="发布状态" width="180px">
          <template slot-scope="scope">
            <span style="color: #71b933;" v-if="scope.row.status == 1">
              已上线
            </span>
            <span style="color: #ff5c7a;" v-if="scope.row.status == 0">
              已下线
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="sysName" label="管理员" width="180px"></el-table-column>
        <el-table-column prop="mobile" label="联系方式" width="180px"></el-table-column>
        <el-table-column label="创建时间" width="180px">
          <template slot-scope="scope">
            {{ $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="text">
              <el-button type="text" @click="openLink(scope.row)">
                网址
              </el-button>
            </el-button>
            <el-button type="text" @click="addresidentUnit(scope.row)">
              编辑
            </el-button>
            <el-dropdown @command="dropdownMenu">
              <el-button type="text">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="scope.row.status == 0" :command="{ id: scope.row.id, value: 1 }">
                  上线
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status == 1" :command="{ id: scope.row.id, value: 2 }">
                  下线
                </el-dropdown-item>
                <el-dropdown-item :command="{ id: scope.row.id, value: 5 }">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        width="70%"
        :close-on-click-modal="false"
        :title="form.id ? '编辑单位' : '新建单位'"
        :visible.sync="innerVisible"
      >
        <el-form :model="form" :rules="rules" ref="unitForm" :label-width="formLabelWidth">
          <el-form-item label="单位名称" prop="unitName">
            <el-input v-model="form.unitName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="单位简介" prop="introduction">
            <el-input type="textarea" v-model="form.introduction" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="单位Logo" class="share-icon">
            <img-include v-model="unitImg" :max="1" :cropper="indexCropper"></img-include>
          </el-form-item>
          <el-form-item label="所在位置" prop="cityId">
            <area-cascader
              type="all"
              style="line-height: 16px;"
              :level="1"
              v-model="areaselected"
              :data="pcaa"
              v-if="showAreaLinkage"
            ></area-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input placeholder="请填写详细地址" v-model="form.address"></el-input>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="form.sysName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="mobile">
            <el-input v-model="form.mobile" autocomplete="off" type="number"></el-input>
          </el-form-item>
          <el-form-item label="默认账号" prop="defaultAccount">
            <el-input v-model="form.defaultAccount" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="频道权限" prop="channelType">
            <el-checkbox-group v-model="form.channelType">
              <el-checkbox
                style="width: 100px;"
                :label="item.channelType"
                v-for="item in allchannel"
                :key="item.channelType"
              >
                {{ item.channelName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="个人中心权限" prop="personalCenter">
            <el-checkbox-group v-model="form.personalCenter">
              <el-checkbox
                style="width: 200px;"
                :label="item.settingType"
                v-for="item in funcListData"
                :key="item.settingType"
              >
                {{ item.functionName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="店铺详细tab页权限" prop="storeConfig">
            <el-checkbox-group v-model="form.storeConfig">
              <el-checkbox
                v-for="item in storeConfigList"
                style="width: 200px;"
                :label="item.id"
                :key="item.id"
              >
                {{ item.tabName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
           <el-form-item label="大师详情tab页权限" prop="masterConfig">
            <el-checkbox-group v-model="form.masterConfig">
              <el-checkbox
                style="width: 200px;"
                :label="item.id"
                v-for="item in masterConfigList"
                :key="item.tabName"
              >
                {{ item.tabName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!--  -->
            <el-form-item label="我的店铺网点权限" prop="mystoreConfig">
            <el-checkbox-group v-model="form.mystoreConfig">
              <el-checkbox
                v-for="item in mystoreConfigList"
                style="width: 200px;"
                :label="item.id"
                :key="item.id"
              >
                {{ item.tabName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
           <el-form-item label="我的大师详情页权限" prop="mymasterConfig">
            <el-checkbox-group v-model="form.mymasterConfig">
              <el-checkbox
                style="width: 200px;"
                :label="item.id"
                v-for="item in mymasterConfigList"
                :key="item.tabName"
              >
                {{ item.tabName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!--  -->
          <el-form-item label="素材模块权限">
            <el-checkbox-group v-model="form.materiaConfig">
              <el-checkbox
                style="width: 200px;"
                :label="item.id"
                v-for="item in materiaConfigList"
                :key="item.tabName"
              >
                {{ item.tabName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUnit">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分页 -->
      <div style="text-align: right; margin-top: 20px;">
        <Pagination
          :pageSize="pageSize"
          :pageSizes="pageSizes"
          :total="totalCount"
          @currentChange="currentChange"
          @sizeChange="sizeChange"
        ></Pagination>
      </div>
    </el-card>
    <el-dialog title="登录网址" :close-on-click-modal="false" :visible.sync="dialogVisible" width="30%">
      <p id="url-link">{{ urlLink }}</p>
      <el-button type="primary" @click="copyUrl">复制</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import Pagination from '../../components/Pagination';
import { AreaCascader } from 'vue-area-linkage';
import { pca, pcaa } from 'area-data';
import ImgInclude from '@/components/CropImgInclue/index.vue';
export default {
  name: 'residentUnit',
  components: {
    Pagination,
    ImgInclude,
  },
  data() {
    return {
      time: [],
      searchData: {
        unitName: '',
        status: '',
        createTimeMin: '',
        createTimeMax: '',
      },
      form: {
        unitName: '',
        introduction: '',
        address: '',
        channelType: [],
        personalCenter: [],
        sysName: '',
        mobile: '',
        defaultAccount: '',
        provinceId: '',
        provinceName: '',
        cityId: '',
        cityName: '',
        areaId: '',
        areaName: '',
        mymasterConfig: [],
        mystoreConfig: [],
        masterConfig: [],
        storeConfig: [],
        materiaConfig:[]
      },
      isEdit: false,
      pcaa: pcaa,
      areaselected: [], //省市区
      showAreaLinkage: true,
      formLabelWidth: '180px',
      innerVisible: false,
      //分页
      totalCount: 0,
      pageNum: 1,
      pageSizes: [10, 20, 30],
      pageSize: 0,
      // 频道列表
      allchannel: [],
      tableList: [],
      mystoreConfigList: [],
      mymasterConfigList: [],
      masterConfigList: [],
      storeConfigList: [],
      materiaConfigList:[],
      //全选
      ids: [],
      rules: {
        unitName: [
          {
            required: true,
            message: '请输入单位名称',
            trigger: 'blur',
          },
        ],
        introduction: [
          {
            required: true,
            message: '请输入单位简介',
            trigger: 'blur',
          },
        ],
        mobile: [
          {
            required: true,
            message: '请输入联系方式',
            trigger: 'blur',
          },
        ],

        defaultAccount: [
          { required: true, message: '请输入默认账号', trigger: 'blur' },
          {
            pattern: /^[a-zA-z].*$/,
            message: '默认账号以字母开头',
            trigger: 'blur',
          },
        ],
        address: [
          {
            required: true,
            message: '请输入所在位置',
            trigger: 'blur',
          },
        ],

        channelType: [
          {
            required: true,
            message: '请选择频道',
            trigger: 'blur',
          },
        ],

        personalCenter: [
          {
            required: true,
            message: '请选择个人中心权限',
            trigger: 'blur',
          },
        ],

        cityId: [
          {
            required: true,
            message: '请选择所在位置',
            trigger: 'blur',
          },
        ],
      },
      dialogVisible: false,
      urlLink: '',

      unitImg: {
        ratio1: [],
      },
      indexCropper: [
        {
          name: '单位图片',
          ratio_x: 1,
          ratio_y: 1,
          ratio: 1,
          desc: '单位图片',
        },
      ],

      funcListData: [],
    };
  },
  watch: {
    // searchData: {
    //   handler() {
    //     this.residentUnitlist();
    //   },
    //   deep: true,
    // },
    areaselected: {
      handler() {
        console.log(this.areaselected);
        if (this.areaselected.length == 0) return;
        this.form.provinceId = parseInt(Object.keys(this.areaselected[0])[0]);
        this.form.cityId = Object.keys(this.areaselected[1])[0];
        this.form.areaId = parseInt(Object.keys(this.areaselected[2])[0]);
        this.form.provinceName = this.areaselected[0][this.form.provinceId];
        this.form.cityName = this.areaselected[1][this.form.cityId];
        this.form.areaName = this.areaselected[2][this.form.areaId];
        console.log(this.areaselected[0][this.form.provinceId]);
        console.log(parseInt(Object.keys(this.areaselected[0])[0]));
      },
      deep: true,
    },

    time(val) {
      this.searchData.createTimeMin = val[0]
      this.searchData.createTimeMax = val[1]
    }
  },
  created() {
    this.pageSize = this.pageSizes[0];
    this.residentUnitlist();
    this.getAllchannel();
    this.loadAllPersonal();

    this.getDefaultConfig();
  },
  methods: {
    search() {
      this.residentUnitlist();
    },

    resetForm() {
      this.time = []
      this.searchData = {
        unitName: '',
        status: '',
        createTimeMin: '',
        createTimeMax: '',
      }
    },

    //分页
    currentChange(val) {
      this.pageNum = val;
      this.residentUnitlist();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.residentUnitlist();
    },
    copyUrl() {
      var eleInput = document.createElement('input');
      eleInput.value = this.urlLink;
      document.body.appendChild(eleInput);
      eleInput.select();
      document.execCommand('Copy');
      document.body.removeChild(eleInput);
      this.$message.success('复制成功');
    },
    openLink(val) {
      this.urlLink = `${document.URL.substring(0, document.URL.indexOf('#') + 2)}login?unitId=${val.id}`;
      this.dialogVisible = true;
    },
    //全选
    selectionchange(val) {
      this.ids = [];
      for (var i = 0; i < val.length; i++) {
        this.ids.push(val[i].id);
      }
    },
    //下拉菜单点击事件
    dropdownMenu(data) {
      this.ids = [data.id];
      if (data.value == 1) {
        this.batchTopicPublish(3); // 上线
      }
      if (data.value == 2) {
        this.batchTopicPublish(4); // 下限
      }
      if (data.value == 5) {
        //删除
        this.batchTopicDel(data.id);
      }
    },

    // 添加对话框
    addresidentUnit(val) {
      if (val) {
        this.isEdit = true;
        this.$ajax
          .get('/sys/unit/unitInfo', {
            params: {
              unitId: val.id,
            },
          })
          .then(res => {
            if (res.resCode == 200) {
              let resChannelList =
                (res.resObject.channelType && res.resObject.channelType.split(',').map(v => parseInt(v))) || [];
              let personalCenterList = (res.resObject.personalCenter && res.resObject.personalCenter.split(',').map(v => parseInt(v))) || []
              let channelType = [];
              let personalCenter = []

              this.allchannel.forEach(allItem => {
                resChannelList.forEach(item => {
                  if (allItem.channelType == item) {
                    channelType.push(item);
                  }
                });
              });

              this.funcListData.forEach(allItem => {
                personalCenterList.forEach(item => {
                  if (allItem.settingType == item) {
                    personalCenter.push(item);
                  }
                });
              });

              let masterConfig = [];
              let storeConfig = [];
              let mymasterConfig = [];
              let mystoreConfig = [];
              let materiaConfig = [];
              if (Array.isArray(res.resObject.masterConfig)) {
                masterConfig = res.resObject.masterConfig.filter(item => item.include).map(item => item.id);
              }
              if (Array.isArray(res.resObject.storeConfig)) {
                storeConfig = res.resObject.storeConfig.filter(item => item.include).map(item => item.id);
              }
              if (Array.isArray(res.resObject.mymasterConfig)) {
                mymasterConfig = res.resObject.mymasterConfig.filter(item => item.include).map(item => item.id);
              }
              if (Array.isArray(res.resObject.mystoreConfig)) {
                mystoreConfig = res.resObject.mystoreConfig.filter(item => item.include).map(item => item.id);
              }
              if (Array.isArray(res.resObject.materiaConfig)) {
                materiaConfig = res.resObject.materiaConfig.filter(item => item.include).map(item => item.id);
              }
              this.form = {
                id: res.resObject.id,
                unitName: res.resObject.unitName,
                introduction: res.resObject.introduction,
                address: res.resObject.address,
                personalCenter: personalCenter,
                sysName: res.resObject.sysName,
                defaultAccount: res.resObject.defaultAccount,
                mobile: res.resObject.mobile,
                provinceId: res.resObject.provinceId,
                provinceName: res.resObject.provinceName,
                cityId: res.resObject.cityId,
                cityName: res.resObject.cityName,
                areaId: res.resObject.areaId,
                areaName: res.resObject.areaName,
                channelType: channelType,

                masterConfig,
                storeConfig,
                mymasterConfig,
                mystoreConfig,
                materiaConfig
              };

              this.unitImg = {
                ratio1: [res.resObject.unitImg],
              };

              this.areaselected.push(pcaa[86][this.form.provinceId]); //res.data.addrprovinceid省对应的id
              this.areaselected.push(pcaa[this.form.provinceId][this.form.cityId]); //res.data.addrcityid省对应的id
              this.areaselected.push(pcaa[this.form.cityId][this.form.areaId]); //res.data.addrcountyid省对应的id
            }
          })
          .catch(err => console.log(err));
      } else {
        this.isEdit = false;
        this.form = {
          unitName: '',
          introduction: '',
          address: '',
          channelType: [],
          personalCenter: [],
          mymasterConfigList: [],
          mystoreConfigList: [],
          masterConfig: [],
          storeConfig: [],
          mymasterConfig: [],
          mystoreConfig: [],
          materiaConfig:[],
          sysName: '',
          defaultAccount: '',
          mobile: '',
          provinceId: '',
          provinceName: '',
          cityId: '',
          cityName: '',
          areaId: '',
          areaName: '',
        };
        this.areaselected = [];
        this.showAreaLinkage = false;
        setTimeout(() => {
          this.showAreaLinkage = true;
        }, 0);
      }
      this.innerVisible = true;
    },

    deleteNaN(arr) {
      var res = [];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === arr[i]) {
          res.push(arr[i]);
        }
      }
      return res;
    },

    // 提交添加编辑
    submitUnit() {
      let url = this.form.id ? '/sys/unit/editUnit' : '/sys/unit/addUnit';
      this.$refs['unitForm'].validate(valid => {
        if (valid) {
          this.$ajax
            .post(url, {
              ...this.form,
              unitImg: this.unitImg.ratio1[0],
              channelType: this.deleteNaN(this.form.channelType),
              personalCenter: this.deleteNaN(this.form.personalCenter),
              storeConfigIds: this.deleteNaN(this.form.storeConfig),
              masterConfigIds: this.deleteNaN(this.form.masterConfig),
              mystoreConfigIds: this.deleteNaN(this.form.mystoreConfig),
              mymasterConfigIds: this.deleteNaN(this.form.mymasterConfig),
              materiaConfigIds: this.deleteNaN(this.form.materiaConfig)
            })
            .then(res => {
              if (res.resCode == 200) {
                this.innerVisible = false;
                this.residentUnitlist();
                this.message('成功', 'success');
              }
            })
            .catch(err => console.log(err));
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    //批量删除
    batchTopicDel(val) {
      if (this.ids.length == 0 && !val) {
        this.message('请选择需要操作的列', 'error');
      } else {
        this.$confirm('确认删除？')
          .then(_ => {
            this.$ajax
              .post('/sys/unit/deleteUnit', {
                ids: this.ids,
              })
              .then(res => {
                if (res.resCode == 200) {
                  this.residentUnitlist();
                  this.message('成功', 'success');
                }
              })
              .catch(err => console.log(err));
          })
          .catch(_ => {
            this.message('已取消删除', 'info');
          });
      }
    },

    //批量上下线
    batchTopicPublish(status) {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error');
      } else {
        let url = '';
        if (status == 3) {
          url = '/sys/unit/onlineUnit'; // 上线
        } else if (status == 4) {
          url = '/sys/unit/offlineUnit'; // 下线
        }
        this.$ajax
          .post(url, {
            ids: this.ids,
          })
          .then(res => {
            if (res.resCode == 200) {
              this.residentUnitlist();
              this.message('成功', 'success');
            }
          })
          .catch(err => console.log(err));
      }
    },
    //获取表格数据
    residentUnitlist() {
      this.$ajax
        .get('/sys/unit/listUnit', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            ...this.searchData,
          },
        })
        .then(res => {
          if (res.resCode == 200) {
            this.totalCount = res.resObject.totalCount;
            this.tableList = res.resObject.list;
          }
        })
        .catch(err => console.log(err));
    },

    getDefaultConfig() {
       this.$ajax
        .get('/sys/unit/defaultConfig', {
          // params: {
          //   pageNum: this.pageNum,
          //   pageSize: this.pageSize,
          //   ...this.searchData,
          // },
        })
        .then(res => {
          if (res.resCode == 200) {
            this.masterConfigList = res.resObject.masterConfig;
            this.storeConfigList = res.resObject.storeConfig;
            this.mymasterConfigList = res.resObject.mymasterConfig;
            this.mystoreConfigList = res.resObject.mystoreConfig;
            this.materiaConfigList = res.resObject.materiaConfig
          }
        })

    },
    //获取频道数据
    getAllchannel() {
      this.$ajax
        .get('/platformsetting/channel/getDefaultChannels')
        .then(res => {
          if (res.resCode == 200) {
            this.allchannel = res.resObject;
          }
        })
        .catch(err => console.log(err));
    },

    // 个人中心频道
    loadAllPersonal() {
      this.$ajax
        .get('/platformsetting/personalcenter/queryDefaultPersionSettingCenter', {})
        .then(res => {
          if (res.resObject) {
            this.funcListData = res.resObject;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //错误、成功提示
    message(message, type) {
      Message({
        message: message,
        type: type,
        duration: 5 * 1000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.residentUnit {
  /*//@extend %fill;*/
  overflow: auto;
  /*padding: 20px;*/
  padding-bottom: 0;
  /*height: calc(100vh - 100px);*/

  .el-row {
    margin-bottom: 20px;
  }

  .el-form {
    width: 100%;
  }

  .el-range-editor--medium.el-input__inner {
    width: 100%;
  }

  .el-select {
    width: 100%;
  }

  /deep/ .el-card__header {
    padding-bottom: 0;
    border: none;
  }

  .el-dropdown {
    margin-left: 15px;
  }
  .share-icon {
    .el-form-item__content {
      display: flex;
    }
  }
  .upload-container {
    width: 50px;
    height: 50px;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-upload {
    height: 50px;
    line-height: 50px;
  }
  .img-tip {
    font-size: 12px;
    color: #999;
    margin-left: 10px;
  }

  /deep/ .el-table .cell {
    display: flex;
    align-items: center;
  }

  .from-wrap {
    width: 100%;
    background: #f5f7fa;
    border: 1px solid #e5e9ef;
    border-bottom: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 10px 0 20px;

    .el-form-item {
      margin-bottom: 0;
    }

    .title {
      cursor: pointer;
      font-size: 16px;
      color: #353535;

      span {
        color: #666666;
      }
    }
  }
}
</style>

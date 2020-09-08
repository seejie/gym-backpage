<template>
  <div class="addActive">
    <formListAdd
      :fromList="fromList"
      :formItems="formItems"
      :formRules="formRules"
      :addEdit="type"
      :btnType="btnType"
      :tabelData="productAttributeList"
      @getPriceTable="getPriceTable"
      @getTypeName="getTypeName"
      @getPosition="getPosition"
      @submit="submit"
    ></formListAdd>
    <el-dialog title="导入网点" :visible.sync="netShow" width="800px">
      <el-form
        :model="addFrom"
        ref="addFrom"
        style="display:flex;justify-content: space-between;marginBottom:15px;"
      >
        <el-form-item label label-width="100" prop="provinceCity" v-if="netShow">
          <area-select v-model="addFrom.provinceCity" type="code" :data="pcaa" :level="1"></area-select>
        </el-form-item>
        <el-form-item label label-width="100" prop="type">
          <el-select v-model="addFrom.typeId" placeholder="请选择类型" style="width:150px;">
            <el-option
              v-for="item in addFrom.types"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="100" prop="name">
          <el-input v-model="addFrom.keyWard" placeholder="请输入关键词"></el-input>
        </el-form-item>
        <el-button type="primary" style="height:40px;" @click="goSubmit('addFrom')">搜 索</el-button>
      </el-form>
      <div class>
        <el-table :data="tableData" border @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="banner" label="详情页banner">
            <template slot-scope="scope">
              <div class="title">
                <div class="img-wrap">
                  <img :src="scope.row.venuePic" alt width="60" />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="categoryName" label="类型"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="marginTop:20px;"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer" style="textAlign:center;">
        <el-button @click="netShow=false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import formListAdd from '@/components/FormComponent/common.vue';
import { AreaCascader } from 'vue-area-linkage';
import { pca, pcaa } from 'area-data';
import * as http from '@/api/huigou/ticket/index';
export default {
  name: 'addActivePage',
  data() {
    return {
      fromList: {
        name: '', // 主标题
        subTitle: '', // 副标题
        banner: { ratio1: [] }, // 景点封面
        indexPic: { ratio1: [] }, // 缩略图
        thirdUrl: '', // 三方链接
        serviceIds: [], // 标签
        refundRulesType: 1, // 退款类型
        refundRules: '', // 退款说明
        publishStatus: 1, // 发布状态
        coder: '', // 码商
        notes: '', // 使用须知
        productCategoryId: [], // 分类ID
        orderLimit: [], // 订单限制
        backRule: 1, // 退票类型,
        isAdvance: 1, // 是否需要提前购买
        backRuleNote: '', // 退票说明
        address: '', // 详细地址
        forbidStatus: 0, // 是否禁言（否）
        description: '', // 门票详情
        beforeTime: '', // 当天购买时间
        advanceDays: '', // 提前多少天
        productCategoryName: '', // 品类名称
        productAttributeListCode: '',
        productAttributeList: [], // 门票价格集合
        factoryPlace: '', // 店铺名称
        factoryId: '', // 店铺id
      },
      productAttributeList: [],
      formItems: [
        { label: '商品标题', placeholder: '请填写商品标题，1-30字', type: 'text', prop: 'name', max: 30 },
        { label: '商品副标题', placeholder: '请填写商品副标题，1-30字', type: 'text', prop: 'subTitle', max: 30 },
        {
          label: '景点封面',
          placeholder: '请填写商品副标题，1-30字',
          type: 'img',
          prop: 'banner',
          max: 9,
          cropper: [
            {
              name: '景点封面',
              ratio_x: 160,
              ratio_y: 110,
              ratio: 1,
              desc: '你的用户将在门票详情页各类别票种、惠购查看更多门票列表，看到此封面',
            },
          ],
        },
        {
          label: '缩略图',
          placeholder: '请填写商品副标题，1-30字',
          type: 'img',
          prop: 'indexPic',
          max: 9,
          cropper: [
            {
              name: '缩略图',
              ratio_x: 160,
              ratio_y: 110,
              ratio: 1,
              desc: '你的用户将在门票详情页各类别票种、惠购查看更多门票列表，看到此封面',
            },
          ],
        },
        { label: '三方链接', placeholder: '请填写三方链接，前台访问直接跳转', type: 'text', prop: 'thirdUrl' },
        { label: '特色标签', placeholder: '', type: 'checkbox', prop: 'serviceIds', options: [] },
        { label: '使用须知', placeholder: '请填写使用须知,1-200字', type: 'textArea', prop: 'notes', max: 200 },
        {
          label: '退款规则',
          placeholder: '',
          type: 'radio',
          prop: 'refundRulesType',
          options: [
            { label: '无条件退款', value: 1 },
            { label: '不支持退款', value: 2 },

          ],
        },
        { label: '', placeholder: '请填写退款规则', type: 'textArea', prop: 'refundRules' },
        {
          label: '发布状态',
          placeholder: '',
          type: 'radio',
          prop: 'publishStatus',
          options: [
            { label: '下架', value: 0 },
            { label: '立即发布', value: 1 },
          ],
        },
        {
          label: '码商支持',
          placeholder: '请选择码商',
          type: 'select',
          prop: 'coder',
          options: [{ value: 1, label: 1 }],
        },
        {
          label: '门票类型',
          prop: 'productCategoryId',
          placeholder: '请选择',
          type: 'link',
          options: [],
          cb: this.changeLink,
        },
        { label: '门票价格', placeholder: '', type: 'priceDetail', prop: 'productAttributeListCode' },
        { label: '提前购买', placeholder: '', type: 'checkAndInput', prop: 'isAdvance' },
        {
          label: '订单限制',
          placeholder: '',
          type: 'checkbox',
          prop: 'orderLimit',
          options: [
            { label: '填写手机号', value: 1 },
            { label: '填写身份证', value: 2 },
            { label: '填写游玩日期', value: 3 },
            { label: '支持优惠券', value: 4 },
          ],
        },
        {
          label: '退票规则',
          placeholder: '',
          type: 'radio',
          prop: 'backRule',
          options: [
            { label: '无条件退票', value: 1 },
            { label: '不支持退票', value: 2 },
            { label: '有条件退票', value: 3 },
          ],
        },
        { label: '', placeholder: '请填写退票规则', type: 'textArea', prop: 'backRuleNote' },
        { label: '所在位置', placeholder: '可直接关联，若无可填详细信息', type: 'address', prop: 'address' },
        { label: '门票详情', placeholder: '可直接关联，若无可填详细信息', type: 'detail', prop: 'description' },
      ],
      formRules: {
        name: [{ required: true, message: '请填写商品标题', trigger: 'blur' }],
      },
      labelList: [], // 标签数据
      type: '', // 操作类型
      btnType: '', // 按钮文案
      pcaa: pcaa, // 区域数据
      currentPage: 1, // 当前页数
      tableData: [], // 表格数据
      total: 0, // 总数
      addFrom: {
        provinceCity: [], // 区域数据
        types: [], // 类型
        keyWard: '',
        typeId: '',
      }, // 表单数据
      pageSize: 5,
      keyWard: '',

      netShow: false, // 表格弹框
      chooseItem: [], // 选择的数据
    };
  },
  beforeRouteEnter(to, from, next) {
    if (to.query.hasOwnProperty('id')) {
      // 此时应该是编辑门票
      to.meta.title = '编辑门票';
    } else {
      // 添加门票
      to.meta.title = '添加门票';
    }
    next();
  },
  created() {
    this.getLabelData();
    this.getLabelList();
    this.getNetType();
    if (this.$route.query.hasOwnProperty('id')) {
      // 此时应该是编辑门票
      this.type = 'edit';
      this.id = this.$route.query.hasOwnProperty('id');
      this.getFormListByid(this.$route.query.id);
      this.btnType = '编辑保存';
    } else {
      this.type = 'add';
      this.btnType = '立即创建';
    }
  },
  methods: {
    submit(val) {
      if (this.type === 'add') {
        this.$ajax
          .post('/sys/THuigouTicketProduct/create', {
            product: {
              name: val.name, // 主标题
              subTitle: val.subTitle, // 副标题
              banner: this.getSubmitPic(val.banner), // 景点封面
              indexPic: this.getSubmitUrl(val.indexPic), // 景点封面
              thirdUrl: val.thirdUrl, // 三方链接
              serviceIds: val.serviceIds.join(','), // 特色标签id
              refundRulesType: val.refundRulesType, // 退款类型
              publishStatus: val.publishStatus, // 发布状态
              refundRules: val.refundRules, // 退款说明
              coder: val.coder, // 码商
              deleteStatus: 0, // 0不删除
              productCategoryId: 20,
              factoryPlace: val.factoryPlace,
              factoryId: val.factoryId,
              orderLimit: val.orderLimit.join(','), // 订单限制
              backRule: val.backRule, // 退票类型
              isAdvance: val.isAdvance, // 是否需要提前购买
              backRuleNote: val.backRuleNote, // 退票说明
              address: val.address, // 详细地址
              description: val.description, // 门票详情
              productCategoryName: val.productCategoryName, // 类型名称
              forbidStatus: val.forbidStatus, // 是否禁言默认不禁言
              beforeTime: val.beforeTime ==== '' ? null : val.beforeTime, // 当前购买时间
              advanceDays: val.advanceDays, // 提前多少天
              notes: val.notes, // 使用须知
            },
            productAttributeList: val.productAttributeList, // 门票价格
          })
          .then(res => {
            this.$message.success('创建门票成功');
            this.$router.go(-1);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$ajax
          .post('/sys/THuigouTicketProduct/update', {
            product: {
              id: Number(this.$route.query.id),
              name: val.name, // 主标题
              subTitle: val.subTitle, // 副标题
              banner: this.getSubmitPic(val.banner), // 景点封面
              indexPic: this.getSubmitUrl(val.indexPic), // 景点封面
              thirdUrl: val.thirdUrl, // 三方链接
              serviceIds: val.serviceIds.join(','), // 特色标签id
              refundRulesType: val.refundRulesType, // 退款类型
              publishStatus: val.publishStatus, // 发布状态
              refundRules: val.refundRules, // 退款说明
              coder: val.coder, // 码商
              factoryPlace: val.factoryPlace,
              factoryId: val.factoryId,
              productCategoryName: val.productCategoryName, // 类型名称
              deleteStatus: 0, // 0不删除
              productCategoryId: val.productCategoryId ? val.productCategoryId.join(',') : '',
              orderLimit: val.orderLimit.join(','), // 订单限制
              backRule: val.backRule, // 退票类型
              isAdvance: val.isAdvance, // 是否需要提前购买
              backRuleNote: val.backRuleNote, // 退票说明
              address: val.address, // 详细地址
              forbidStatus: val.forbidStatus, // 是否禁言默认不禁言
              description: val.description, // 门票详情
              beforeTime: val.beforeTime ==== '' ? null : val.beforeTime, // 当前购买时间
              advanceDays: val.advanceDays, // 提前多少天
              notes: val.notes, // 使用须知
            },
            productAttributeList: val.productAttributeList, // 门票价格
          })
          .then(res => {
            this.$message.success('修改成功');
            this.$router.go(-1);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    getTypeName(val) {
      this.fromList.productCategoryName = val.join('-');
    },
    getPriceTable(val) {
      this.fromList.productAttributeList = val.map(res => {
        return {
          ...res,
          attributeIcon: res.attributeIcon && res.attributeIcon.ratio1 ? res.attributeIcon.ratio1[0] : '',
        };
      });
      console.log(this.fromList.productAttributeList);
    },
    changeLink(val) {
      console.log(val);
    },
    // 处理首页图片数据
    getUrl(val) {
      if (val) {
        const urlList = val.split(',');
        if (urlList.length > 1) {
          return {
            ratio1: urlList,
          };
        } else {
          return {
            ratio1: [urlList[0]],
          };
        }
      } else {
        return {
          ratio1: [],
        };
      }
    },
    // 处理缩略图数据
    getPic(val) {
      if (val !=== '') {
        const urlList = val.split(',');
        if (urlList.length > 1) {
          return {
            ratio1: urlList,
          };
        } else {
          return {
            ratio1: [urlList[0]],
          };
        }
      } else {
        return {
          ratio1: [],
        };
      }
    },
    // 上传保存时候转换图片数据
    getSubmitUrl(val) {
      return val.ratio1.join(',');
    },
    // 缩略图
    getSubmitPic(val) {
      return val.ratio1.join(',');
    },
    // 根据id获取详情
    getFormListByid(id) {
      this.$ajax
        .get(`/sys/THuigouTicketProduct/findProductById/${id}`, {
          id: id,
        })
        .then(res => {
          this.fromList = {
            name: res.resObject.product.name, // 主标题
            subTitle: res.resObject.product.subTitle, // 副标题
            banner: this.getUrl(res.resObject.product.banner), // 景点封面
            indexPic: this.getUrl(res.resObject.product.indexPic), // 景点封面
            thirdUrl: res.resObject.product.thirdUrl, // 三方链接
            serviceIds: res.resObject.product.serviceIds.split(',').map(res => Number(res)), // 特色标签id
            refundRulesType: Number(res.resObject.product.refundRulesType), // 退款类型
            publishStatus: Number(res.resObject.product.publishStatus), // 发布状态
            refundRules: res.resObject.product.refundRules, // 退款说明
            coder: res.resObject.product.coder, // 码商
            productCategoryId: res.resObject.product.productCategoryId
              ? res.resObject.product.productCategoryId.split(',').map(res => Number(res))
              : '',
            orderLimit: res.resObject.product.orderLimit.split(',').map(res => Number(res)), // 订单限制
            backRule: res.resObject.product.backRule, // 退票类型
            isAdvance: res.resObject.product.isAdvance, // 是否需要提前购买
            backRuleNote: res.resObject.product.backRuleNote, // 退票说明
            address: res.resObject.product.address, // 详细地址
            description: res.resObject.product.description, // 门票详情
            beforeTime: res.resObject.product.beforeTime ==== '' ? null : res.resObject.product.beforeTime, // 当前购买时间
            advanceDays: res.resObject.product.advanceDays, // 提前多少天
            // productAttributeList: res.resObject.productAttributeList,
            factoryPlace: res.resObject.product.factoryPlace,
            factoryId: res.resObject.product.factoryId,
            forbidStatus: res.resObject.product.forbidStatus, // 是否禁言默认不禁言
            notes: res.resObject.product.notes, // 使用须知
          };
          this.productAttributeList = JSON.parse(JSON.stringify(res.resObject.productAttributeList));
          console.log(this.productAttributeList);
        });
    },
    // 获取标签列表
    getLabelList() {
      http
        .getLabelList()
        .then(res => {
          const arr = res.resObject.filter(item => {
            return item.isValid === 1;
          });
          this.formItems[5].options = arr.map(item => {
            return {
              label: item.name,
              value: item.id,
            };
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取关键字对应类型文本
    getShowText(val) {
      switch (val) {
        case '1':
          return '文本';
          break;
        case '2':
          return '单选';
          break;
        case '3':
          return '多选';
          break;
        case '4':
          return '时间选择';
          break;

        case '6':
          return '图片';
          break;
        case '7':
          return '附件';
          break;
      }
    },
    getNetType() {
      // 获取网点列表
      this.$ajax
        .get('/storemanager/store-category/list', {
          params: { unitType: '32' },
        })
        .then(res => {
          if (res.resCode === 200) {
            this.addFrom.types = res.resObject.list;
          }
        });
    },
    // 导入位置数据获取
    getPosition() {
      this.$ajax
        .get('/storemanager/store/list', {
          params: {
            unitType: '32',
            category: this.addFrom.typeId,
            provinceId: typeof this.addFrom.provinceCity[0] === 'undefined' ? '' : this.addFrom.provinceCity[0],
            cityId: typeof this.addFrom.provinceCity[1] === 'undefined' ? '' : this.addFrom.provinceCity[1],
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            name: this.addFrom.keyWard,
          },
        })
        .then(res => {
          this.tableData = res.resObject.list.map(res => {
            return {
              ...res,
              venuePic: res.storeImage[0] ? res.storeImage[0].url : '',
            };
          });
          this.total = res.resObject.totalCount;
          console.log(res);
          this.netShow = true;
        });
    },
    // 表格确认下按钮
    confirm() {
      console.log('确认按钮');
      if (this.chooseItem.length > 1) {
        this.$message.error('一次只能导入一个地区');
      } else if (this.chooseItem.length == 0) {
        this.$message.error('未选择数据');
      } else {
        this.fromList.address = this.chooseItem[0].address;
        this.fromList.factoryId = this.chooseItem[0].id;
        this.fromList.factoryPlace = this.chooseItem[0].name;
        this.netShow = false;
      }
    },
    // 页展示条数切换
    handleSizeChange(val) {
      console.log(val);
      this.pageSize = val;
      this.getPosition();
    },
    // 当前页数改变
    handleCurrentChange(val) {
      console.log(val);
      this.currentPage = val;
      this.getPosition();
    },
    handleSelectionChange(val) {
      this.chooseItem = val;
    },
    // 搜索
    goSubmit() {
      this.getPosition();
    },
    // 获取品类下拉数据
    async getLabelData() {
      const arr = [];
      this.$ajax
        .get('/sys/THuigouTicketCategory/findAll', {
          params: {
            catGrade: 1,
          },
        })
        .then(res => {
          res.resObject.map(async list => {
            const data = {
              label: list.catName,
              value: list.catId,
              children: await this.getChildLabel(list.catId),
            };
            arr.push(data);
          });
          this.formItems[11].options = arr;
          // console.log(this.formItems[11].options)
        })
        .catch(err => {
          console.log(err);
        });
    },
    async getChildLabel(id) {
      return new Promise(async resolve => {
        resolve(await this.getChildData(id));
      });
    },
    getChildData(id) {
      let childrenArr = [];
      return new Promise(resolve => {
        this.$ajax
          .get('/sys/THuigouTicketCategory/findAll', {
            params: {
              catGrade: 2,
              catParentId: id,
            },
          })
          .then(res => {
            childrenArr = res.resObject.map(list => {
              return {
                label: list.catName,
                value: list.catId,
              };
            });
            resolve(childrenArr);
          });
      });
    },
  },
  components: {
    formListAdd,
  },
  watch: {
    'fromList.isAdvance'(newValue, oldValue) {
      console.log(newValue);
      if (newValue === 1) {
        this.fromList.beforeTime = '';
      } else {
        this.fromList.advanceDays = '';
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.addActive {
  @extend %fill;
  padding: 10px 15%;
  /deep/ .area-select {
    line-height: 40px;
    height: 40px;
    .area-selected-trigger {
      padding: 0 0 0 12px;
    }
  }
  /deep/ .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
}
</style>

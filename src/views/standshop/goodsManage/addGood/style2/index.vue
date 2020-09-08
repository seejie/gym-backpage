<template>
  <div class="addGood">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div style="padding-right: 20px;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="商品标题" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请填写标题，1-23字"></el-input>
          </el-form-item>
          <el-form-item label="商品副标题" prop="subTitle">
            <el-input v-model="ruleForm.subTitle" placeholder="请填写副标题，1-30字"></el-input>
          </el-form-item>

          <el-form-item label="缩略图" prop="indexPic">
            <img-include v-model="ruleForm.indexPic" :max="1" :cropper="indexCropper" />
            <div class="uploader-text">请上传5M以内图片，支持PNG\JPG等常见格式,建议尺寸 160*110</div>
          </el-form-item>

          <el-form-item label="商品详情页banner" prop="banner">
            <img-include v-model="ruleForm.banner" :max="9" :cropper="cropper" />
            <div class="uploader-text">请上传5M以内图片，支持PNG\JPG等常见格式,最多9张，首张为封面,建议尺寸 550*408</div>
          </el-form-item>

          <el-form-item label="三方链接" prop="thirdUrl">
            <el-input v-model="ruleForm.thirdUrl" placeholder="请填写第三方链接,前台访问直接跳转"></el-input>
          </el-form-item>
          <el-form-item label="商品标签" prop="serviceIds">
            <el-radio-group v-model="ruleForm.serviceIds">
              <el-radio :label="i.id" name="serviceIds" v-for="i in serviceIdsOptions" :key="i.id">
                {{
                i.name
                }}
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="退款规则" prop="refundRulesType">
            <el-radio-group v-model="ruleForm.refundRulesType">
              <el-row>
                <el-col :span="14" style="padding: 10px">
                  <el-radio label="1">支持退货和退款，请输入退货期限天数</el-radio>
                </el-col>
                <el-col :span="10">
                  <el-input type="number" v-model="ruleForm.refundDays" placeholder="请填写天数，默认七天"></el-input>
                </el-col>
              </el-row>
              <el-row style="padding: 10px">
                <el-radio label="2">不支持退货和退款</el-radio>
              </el-row>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="退款规则说明" prop="refundRules" v-if="ruleForm.refundRulesType == 1">
            <el-input v-model="ruleForm.refundRules" type="textarea" placeholder="请填写退款规则"></el-input>
          </el-form-item>

          <el-form-item label="物流费用" prop="logisticsFee">
            <el-input v-model="ruleForm.logisticsFee" placeholder="单位元: 不填则为0"></el-input>
          </el-form-item>

          <el-form-item label="商品状态" prop="publishStatus">
            <el-radio-group v-model="ruleForm.publishStatus">
              <el-radio label="1">立即上架</el-radio>
              <el-radio label="0">下架</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商品品牌" prop="brandId">
            <el-select v-model="ruleForm.brandId" placeholder="请选择">
              <el-option
                v-for="item in brandIds"
                :key="item.brandId"
                :label="item.brandName"
                :value="item.brandId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品类型" prop="productCategoryIdExtras">
            <el-cascader
              v-model="ruleForm.productCategoryIdExtras"
              :options="productCategoryIdOptios"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="商品规格" class="upload-container" prop="detailJsonExtra">
            <el-input v-model="ruleForm.detailJsonExtra" type="hidden"></el-input>
            <div class="upload-icon-logo-text">
              图片规格1:1
              <br />建议尺寸
              <br />55*55
            </div>
            <PriceTable
              @getPriceTable="getPriceTable"
              :addEdit="addEdit"
              :attributeValueList="attributeValueList"
              :id="id"
            />
          </el-form-item>
          <el-form-item label="产地溯源" prop="address" v-if="userLevel != 3">
            <div style="display: flex;">
              <div style="flex: 1;">
                <!-- <el-input v-model="ruleForm.position"></el-input> -->
                <span>{{ ruleForm.factoryPlace }}</span>
              </div>
              <div style="width: 120px;">
                <NetPosition @getIds="getIds" />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="商品详情" prop="description">
            <!-- <div id="editor"></div> -->
            <myEditor v-model="editorGood"></myEditor>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm('ruleForm')">返回</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">发布商品</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import NetPosition from '@/components/NetPosition';
import PriceTable from './../../PriceTable.vue';
import ImgInclude from '@/components/CropImgInclue';
import { deleteEmptyParams } from '../../../commonText.js';

import {
  shopProductEdit,
  shopProductInfoById,
  shopProductAdd,
  shopCategoryTree,
  shopBrandPage,
  shopTagPage,
} from '@/api/standshop/goodsManage';
import { getUserLevel } from '@/utils/storage';

import E from 'wangeditor';
export default {
  data() {
    return {
      cropper: [
        {
          name: '详情封面',
          ratio_x: 550,
          ratio_y: 408,
          ratio: 1.348,
          desc: '你的用户将在商品详情页，商品规格封面，看到此封面。',
        },
      ],
      indexCropper: [
        {
          name: '列表封面',
          ratio_x: 16,
          ratio_y: 11,
          ratio: 1.45,
          desc: '你的用户将在网点详情、惠购频道及查看更多列表，看到此封面。',
        },
      ],
      ruleForm: {
        name: '',
        subTitle: '',
        banner: {},
        indexPic: {},
        thirdUrl: '',
        serviceIds: [], // 传数组
        serviceRuleType: [],
        refundRulesType: '1', // 退款规则
        refundRules: '', // 退款描述
        refundDays: '', // 退款期限
        logisticsFee: 0, //物流费用
        publishStatus: '1',
        brandId: '', //品牌
        productCategoryIdExtras: [], //类型额外参数
        detailJson: [], //图片、现价、规格、有效期
        detailJsonExtra: '', //门票
        description: '',
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        venueId: '',
        unit: '',
        address: '',
        lon: '',
        lat: '',
      },
      productCategoryIds: [],
      serviceIdsOptions: [],
      productCategoryIdOptios: [], //类型
      brandIds: [],
      imageUrl: '',
      //value: [],
      dialogImageUrl: '',
      dialogVisible: false, //上传点击图片预览
      rules: {
        name: [
          { required: true, message: '请输入商品标题' },
          { min: 1, max: 24, message: '长度在 1 到 23 个字符' },
        ],
        indexPic: [{ required: true, message: '请上传商品缩略图' }],
        brandId: [{ required: true, message: '请输入商品品牌' }],
        productCategoryIdExtras: [{ required: true, message: '请输入商品类型' }],
        // detailJsonExtra: [{ required: true, message: "请输入商品规格" }]
      },
      editorGood: '',
      addEdit: 'add',
      id: '',
      attributeValueList: [],
    };
  },
  components: {
    NetPosition,
    PriceTable,
    ImgInclude,
  },
  created() {
    this.getList();
    this.getTagList();
    this.addEdit = this.$router.history.current.params.type;
    this.id = this.$router.history.current.params.id;
    this.getClassifyList({ catParentId: 0 });
    if (this.$router.history.current.params.type == 'edit') {
      this.loadGoodDetail();
    }
  },

  computed: {
    // 用户等级 1-A，2-B，3-C
    userLevel() {
      return getUserLevel();
    },
  },

  beforeRouteEnter(to, from, next) {
    console.log(to);
    if (to.params.type === 'edit') {
      //此时应该是编辑活动
      to.meta.title = '编辑商品';
    } else {
      // 添加活动
      to.meta.title = '添加商品';
    }
    next();
  },
  mounted() {},
  methods: {
    rmImage() {
      this.emitInput('');
    },
    //上传图片预览
    // handlePictureCardPreview (file) {
    //   this.dialogImageUrl = file.url;
    //   this.dialogVisible = true;
    // },
    emitInput(val) {
      this.$emit('input', val);
    },

    // 获取商品品牌下拉数据
    async getList() {
      let params = {
        pageNum: 1,
        pageSize: 99,
      };
      shopBrandPage(params).then(res => {
        if (res.resCode == 200) {
          this.brandIds = res.resObject.list;
        }
      });
    },

    //获取所有品类数据
    async getClassifyList(params) {
      this.productCategoryIdOptios = [];
      shopCategoryTree().then(res => {
        if (res.resCode == 200) {
          let categoryTree = res.resObject;
          Object.keys(categoryTree).forEach((key, index) => {
            this.productCategoryIdOptios.push({
              ...categoryTree[key].key,
              label: categoryTree[key].key.catName,
              value: categoryTree[key].key.catId,
              children: categoryTree[key].sonList
                ? categoryTree[key].sonList.map(jj => ({
                    ...jj,
                    label: jj.catName,
                    value: jj.catId,
                  }))
                : [],
            });
          });
        }
      });
    },
    //获取品类父id
    getFatherId(childId) {
      let id = '';
      this.productCategoryIdOptios.map(item => {
        item.children.map(child => {
          if (child.catId == childId) {
            id = item.catId;
          }
        });
      });

      return id;
    },
    // 获取标签列表
    async getTagList() {
      shopTagPage({
        pageNum: 1,
        pageSize: 99,
      }).then(res => {
        if (res.resCode == 200) {
          this.serviceIdsOptions = res.resObject.list || [];
        }
      });
    },
    // 获取导入位置id
    getIds(item) {
      console.log('fu', item);
      this.ruleForm = {
        ...this.ruleForm,
        factoryId: item.id,
        factoryPlace: item.name,
        factoryUnitAddress: item.address,
      };
    },

    // 规格
    getPriceTable(table) {
      this.ruleForm.detailJson = table;
      this.ruleForm.detailJsonExtra = table.length > 0 ? table[0].value : '';
      console.log(this.ruleForm.detailJson);
    },

    submitForm(formName) {
      //console.log("富文本", this.editor.txt.html());
      // console.log(JSON.stringify(this[formName].detailJson))
      this.$refs[formName].validate(valid => {
        if (!valid) {
          if (!this[formName].name) {
            this.$message.error('商品标题必填');
          } else if (!this[formName].indexPic['ratio1.45']) {
            this.$message.error('请上传商品缩略图');
          } else if (!this[formName].brandId) {
            this.$message.error('商品品牌必填');
          }
          return;
        }

        let detailList = this[formName].detailJson.map(item => {
          if (!item.attributeIcon) {
            this.$message.error('请上传商品规格图片');
            return false;
          } else if (!item.value) {
            this.$message.error('请填写商品规格种类');
            return false;
          } else if (!item.currentPrice || parseFloat(item.currentPrice) == 0) {
            this.$message.error('请填写商品规格现价');
            return false;
          }
        });

        if (detailList.indexOf(false) !== -1) return;

        const params = {
          ...this[formName],
          banner: this[formName].banner['ratio1.348'] ? this[formName].banner['ratio1.348'].join(',') : '',
          indexPic: this[formName].indexPic['ratio1.45'] ? this[formName].indexPic['ratio1.45'].join(',') : '',
          brandName: this.brandIds.filter(item => {
            return item.brandId == this[formName].brandId;
          })[0].brandName,
          refundRulesType: this[formName].refundRulesType && Number(this[formName].refundRulesType),
          publishStatus: Number(this[formName].publishStatus),
          detailJson: JSON.stringify(this[formName].detailJson),
          productCategoryId:
            this[formName].productCategoryIdExtras.length > 0 ? this[formName].productCategoryIdExtras[1] : '',
          description: this.editorGood,
          serviceIds: this[formName].serviceIds.join(','),
          serviceRuleType: this[formName].serviceRuleType.join(','),
        };

        for (var i in params) {
          if (params[i] == '') {
            delete params[i];
          }
        }

        if (params.refundRulesType == '') {
          delete params.refundRulesType;
        }
        delete params.productCategoryIdExtras;
        delete params.detailJsonExtra;

        if (this.addEdit == 'edit') {
          params.id = this.id;
          shopProductEdit(params).then(res => {
            if (res.resCode == 200) {
              this.$message({
                message: '操作成功!',
                type: 'success',
              });
              this.$router.push({
                name: 'goodsIndex',
              });
            }
          });
        } else {
          shopProductAdd(params).then(res => {
            if (res.resCode == 200) {
              this.$message({
                message: '操作成功!',
                type: 'success',
              });
              this.$router.push({
                name: 'goodsIndex',
              });
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.push({
        name: 'goodsIndex',
      });
    },
    rightDelete(e) {
      console.log('右边删除', e);
    },

    //上传图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    loadGoodDetail() {
      shopProductInfoById(this.$router.history.current.params.id).then(result => {
        if (result.resCode == 200) {
          let res = result.resObject;
          this.ruleForm = {
            name: res.name,
            subTitle: res.subTitle,
            logisticsFee: res.logisticsFee,
            banner: (res.banner && { 'ratio1.348': res.banner.split(',') }) || {},
            indexPic: (res.indexPic && { 'ratio1.45': res.indexPic.split(',') }) || {},
            thirdUrl: res.thirdUrl,
            serviceIds: res.serviceIds ? res.serviceIds.split(',').map(Number) : [],
            serviceRuleType: res.serviceRuleType ? res.serviceRuleType.split(',') : [],
            notes: res.notes,
            refundRulesType: res.refundRulesType && res.refundRulesType.toString(),
            refundDays: res.refundDays,
            refundRules: res.refundRules,
            publishStatus: res.publishStatus && res.publishStatus.toString(),
            brandId: parseInt(res.brandId),
            productCategoryIdExtras: res.productCategoryId
              ? [this.getFatherId(res.productCategoryId), res.productCategoryId]
              : [],
            detailJsonExtra: 'aa',
            detailJson: res.detailJson || res.attributeValueList,
            provinceCode: res.provinceCode || '',
            cityCode: res.cityCode || '',
            areaCode: res.areaCode || '',
            venueId: res.venueId || '',
            unit: res.unit || '',
            address: res.address || '',
            lon: res.lon || '',
            lat: res.lat || '',
            factoryId: res.factoryId,
            factoryPlace: res.factoryPlace,
            factoryUnitAddress: res.factoryUnitAddress,
            //detailJsonExtra: res.detailJson[0].name,
            //backRule: res.backRule && res.backRule.toString(),
            //position: res.position,
            //positionId: res.positionId,
          };

          this.attributeValueList = res.attributeValueList;
          this.editorGood = res.description;
          this.priceTable = res.detailJson;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.addGood {
  @extend %fill;
  padding: 10px 15%;
  .fromList {
    @extend %fill;
    .uploader-text {
      font-size: 14px;
      color: #ccc;
    }
    .select-wrap {
      display: flex;
      justify-content: space-between;
      width: 100%;
      /deep/ .el-select {
        flex: 1;
        margin-right: 10px;
        &:last-child {
          margin: 0;
        }
      }
    }
    .origin-wrap {
      display: flex;
      width: 100%;
      .el-input {
        margin-right: 15px;
      }
    }
    .enlist-info {
      // display: flex;
      width: 100%;
      // padding: 40px 20px 0 20px;
      padding-bottom: 20px;
      .chooseLine {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: rp(20);
        .keyword {
          min-width: 50px;
          text-align: center;
          margin-right: 15px;
        }
        .el-input {
          margin-right: 15px;
        }
      }
      .chooseItem {
        display: flex;
        width: 90%;
        align-items: center;
        padding: 0 5em;
        margin-top: 20px;

        .keyword {
          min-width: 50px;
          text-align: center;
          margin-right: 15px;
        }
        i {
          font-size: 20px;
          margin-left: 15px;
          cursor: pointer;
        }
      }
      /deep/ .el-dropdown {
        margin-right: 15px;
      }
    }
    #editor {
      min-height: 200px;
      width: 100%;
    }
    .btn-wrap {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    /deep/ .el-range-separator {
      width: 20px;
    }
    /deep/ .el-textarea {
      min-height: 70px;
      /deep/ .el-textarea__inner {
        min-height: 70px !important;
        padding-right: 50px;
      }
    }
    /deep/ .el-collapse-item__wrap {
      border: none;
    }
    /deep/ .el-collapse-item__header {
      color: #ccc;
    }
    /deep/ .el-checkbox {
      margin-right: 15px;
    }
    /deep/ .el-textarea__inner {
      height: 100%;
    }
  }
}
.upload-container {
  position: relative;

  .upload-icon-logo-text {
    font-size: 14px;
    color: #ccc;
    line-height: 16px;
    width: 80px;
    position: absolute;
    left: -83px;
    top: 40px;
  }
}
</style>

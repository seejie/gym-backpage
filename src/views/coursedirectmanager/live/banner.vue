<template>
  <div class="live-banner-set">
    <el-table
      :data="list"
      style="width: 800px"
    >
      <el-table-column
        type="index"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="columnName"
        label="栏目名称"
        width="200"
      >
      </el-table-column>
      <el-table-column
        label="banner图片"
        width="320"
      >
        <template slot-scope="scope">
          <img-include class="table-banner" :width="50" v-model="scope.row.banner" :max="9" :cropper="coverCropper"></img-include>
        </template>
      </el-table-column>
      <el-table-column label="有效状态">
        <template slot-scope="scope">
            <el-switch
              v-model="scope.row.bannerStatus"
              @change="handleStatus(scope.row)"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </template>
      </el-table-column>
      <el-table-column label="提交">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="submit(scope.row)">提交</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="tip-banner-text">尺寸建议：355*188Px；格式 Png、Jpg</div>
  </div>
</template>

<script>
import ImgInclude from '@/components/CropImgInclue/index.vue';
import { getLiveCourseBannerList, setLiveCourseBanner } from '../sever';
import assign from 'object-assign';
export default {
  name: '',
  components: { ImgInclude },
  data() {
    return {
      list: [],
      coverCropper: [
        {
          name: '直播banner',
          ratio_x: 355,
          ratio_y: 188,
          ratio: 1,
          desc: '',
        },
      ],
    };
  },
  created(){
    this.getList();
  },
  watch:{},
  methods: {
    getList(){
      getLiveCourseBannerList({
        channelType:8
      }).then(res=>{
        if (res.resCode == 200) {
          res.resObject.map(item=>{
            if(item.bannerUrl){
              let banner = item.bannerUrl.split(',')
              item.banner = {
                ratio1: banner
              }
            }
          })
          this.list = res.resObject
        } else {
          that.$message(res.message, 'error');
        }
      })
    },
    handleStatus(row){
      this.submit(row)
    },
    submit(row) {
      row.bannerUrl = row.banner.ratio1.join(',');
      setLiveCourseBanner({
        ...row,
        channelType:8
      }).then(res => {
        if (res.resCode == 200) {
          this.$message.success("保存成功！");
        } else {
          this.$message(res.message, 'error');
        }
      });
    }
  },
};
</script>

<style>
.tip-banner-text {
  font-size: 12px;
  color: #999;
  margin-top: 50px;
}
.live-banner-set{
  width:100%
}
.table-banner .include div{
  display: inline-block;
  vertical-align: middle;
}

</style>

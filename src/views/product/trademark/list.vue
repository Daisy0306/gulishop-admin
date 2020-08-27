<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
    <el-table :data="trademarkList" border style="width: 100%;margin:20px 0">
      <el-table-column label="序号" width="100" type="index" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌Logo">
        <!-- 当你要展示的数据结构由你说了算，列表中需要放其他的标签，就用作用域插槽 -->
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" alt style="width:120px;height:55px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="small">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align:center"
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
      :current-page="page"
      :page-sizes="[3, 5, 7, 10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper, ->,sizes,total"
      :total="total"
      background
    ></el-pagination>

    <!-- 嵌套表格的 dialog  图片上传用 upload-->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        style="width:80%;padding:0 20px"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="品牌名称" :label-width="'100px'">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" :label-width="'100px'">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      // 初始化默认值
      page: 4,
      limit: 3,
      total: 10,
      trademarkList: [],
      dialogFormVisible: false, //是否弹出对话框
      form: {
        // form表单需要收集的信息
        tmName: "",
        logUrl: "",
      },
    };
  },
  mounted() {
    // 测试请求接口函数使用
    //this.$API.trademark.getPageList(1, 3);

    this.getTrademarkList();
  },
  methods: {
    async getTrademarkList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      );
      if (result.code === 200) {
        this.trademarkList = result.data.records;
        this.totla = result.data.total;
      }
    },
    // 改变选择框的 多少条/页
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },
    // 当前显示的页码直接写在发请求的函数中就可以了
    // handleCurrentChange(val) {
    //   console.log(`当前页: ${val}`);
    // },

    showAddDialog() {
      this.dialogFormVisible = true;
    },
    // upload中的
    // 上传成功后的处理
    handleAvatarSuccess(res, file) {
      this.form.logUrl = URL.createObjectURL(file.raw);
    },
    // 上传之前的处理
    beforeAvatarUpload(file) {
      const fileTypes = ["image/jpeg", "image/png"];
      const isJPGOrPNG = fileTypes.indexOf(file.type) !== -1;
      const isLt500k = file.size / 1024 < 500;

      if (!isJPGOrPNG) {
        this.$message.error("上传头像图片只能是 JPG格式 或者 PNG格式!");
      }
      if (!isLt500k) {
        this.$message.error("上传头像图片大小不能超过 500kB!");
      }
      return isJPGOrPNG && isLt500k;
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

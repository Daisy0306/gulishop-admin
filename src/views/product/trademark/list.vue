<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table :data="trademarkList" border style="width: 100%;margin:20px 0">
      <el-table-column prop="date" label="序号" width="100" align="center"></el-table-column>
      <el-table-column prop="address" label="品牌名称"></el-table-column>
      <el-table-column prop="address" label="品牌Logo"></el-table-column>
      <el-table-column prop="address" label="操作"></el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        style="text-align:center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="4"
        :page-sizes="[3, 5, 7, 10]"
        :page-size="3"
        layout=" prev, pager, next, jumper, ->,sizes,total"
        :total="20"
        background
      ></el-pagination>
    </div>
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
      totla: 10,
      trademarkList: [],
    };
  },
  mounted() {
    // 测试请求接口函数使用
    //this.$API.trademark.getPageList(1, 3);

    this.getTrademarkList();
  },
  methods: {
    async getTrademarkList() {
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      );
      if (result.code === 200) {
        this.trademarkList = result.data.records;
        this.totla = result.data.total;
      }
    },
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    // },
    // handleCurrentChange(val) {
    //   console.log(`当前页: ${val}`);
    // },
  },
};
</script>

<style scoped>
</style>

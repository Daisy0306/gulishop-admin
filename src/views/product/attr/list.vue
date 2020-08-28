<template>
  <div>
    <el-card>
      <CategorySelector @changeCategory="changeCategory"></CategorySelector>
    </el-card>
    <el-card style="margin-top:20px">
      <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id">添加属性</el-button>
      <el-table border style="width: 100%" :data="attrList">
        <el-table-column label="属性ID" width="80" align="center" type="index"></el-table-column>
        <el-table-column label="属性名称" width="150" prop="attrName"></el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="{row,$index}">
            <el-tag
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
            >{{attrValue.valueName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template>
            <HintButton icon="el-icon-edit" type="warning" title="修改属性" size="mini"></HintButton>
            <HintButton icon="el-icon-delete" type="danger" title="删除属性" size="mini"></HintButton>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
    };
  },
  methods: {
    changeCategory({ categoryId, level }) {
      console.log(categoryId, level);

      if (level === 1) {
        this.category1Id = categoryId;
        // 重新选择 1 级分类的时候，需要将父级中的  2/3级id 和 attrList清空
        this.category2Id = "";
        this.category3Id = "";
        this.attrList = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        // 重新选择 2 级分类的时候，需要将父级中的 3 级id 和 attrList 清空
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        // 说明触发的是3级分类列表，发送请求获取属性列表数据
        this.getAttrList();
      }
    },

    async getAttrList() {
      //发请求拿属性的列表数据
      let { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
        console.log(this.attrList);
      }
    },
  },
};
</script>


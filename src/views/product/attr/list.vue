<template>
  <div>
    <el-card>
      <CategorySelector @changeCategory="changeCategory"></CategorySelector>
    </el-card>
    <el-card style="margin-top:20px">
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddDiv"
        >添加属性</el-button>
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
            <template slot-scope="{row,$index}">
              <HintButton
                icon="el-icon-edit"
                type="warning"
                title="修改属性"
                size="mini"
                @click="showUpdateDiv(row)"
              ></HintButton>
              <HintButton icon="el-icon-delete" type="danger" title="删除属性" size="mini"></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowList">
        <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="form.attrName"></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!form.attrName"
          @click="addAttrValue"
        >添加属性值</el-button>
        <el-button @click="isShowList=true">取消</el-button>

        <el-table border style="margin:20px 0;" :data="form.attrValueList">
          <el-table-column label="序号" width="80" align="center" type="index"></el-table-column>
          <el-table-column label="属性值名称" prop="valueName">
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName" placeholder="请输入属性值" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>

        <el-button type="primary">保存</el-button>
        <el-button @click="isShowList=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowList: true,
      form: {
        attrName: "",
        attrValueList: [],
        categoryId: "",
        categoryLevel: 3,
      },
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

    // 点击添加属性按钮，显示新的页面
    showAddDiv() {
      this.isShowList = false;
      // 解决添加之后取消，完啦再添加数据依然存在的bug
      this.form = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },

    // 点击添加属性值逻辑（数据收集）
    addAttrValue() {
      this.form.attrValueList.push({
        attrId: this.form.id, // form当中有id就拿form 的id，没有就是undefined
        valueName: "",
      });
    },

    // 点击修改属性逻辑（数据收集）
    showUpdateDiv(row) {
      this.isShowList = false;
      this.form = cloneDeep(row);
    },
  },
};
</script>


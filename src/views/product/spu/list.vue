<template>
  <div>
    <el-card>
      <CategorySelector @changeCategory="changeCategory" :isShowList="isShowList"></CategorySelector>
    </el-card>
    <el-card style="margin-top:20px">
      <div v-show="isShowList">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id">添加平台属性</el-button>
        <el-table border style="width: 100%;margin:20px 0" :data="spuList">
          <el-table-column label="属性ID" width="80" align="center" type="index"></el-table-column>
          <el-table-column label="SPU属性名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU属性描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <HintButton icon="el-icon-plus" type="success" title="增加sku" size="mini"></HintButton>
              <HintButton icon="el-icon-edit" type="primary" title="修改SPU" size="mini"></HintButton>
              <HintButton icon="el-icon-question" type="info" title="查看所有的sku" size="mini"></HintButton>
              <el-popconfirm title="这是一段内容确定删除吗？">
                <HintButton
                  icon="el-icon-delete"
                  type="danger"
                  title="删除SPU"
                  size="mini"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div v-show="!isShowList">
        <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="form.attrName"></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!form.attrName"
          @click="addAttrValue()"
        >添加属性值</el-button>
        <el-button @click="isShowList=true">取消</el-button>

        <el-table border style="margin:20px 0;" :data="form.attrValueList">
          <el-table-column label="序号" width="80" align="center" type="index"></el-table-column>
          <el-table-column label="属性值名称" prop="valueName">
            <template slot-scope="{row,$index}">
              <el-input
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="请输入属性值"
                size="mini"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row,$index)"
                style="display:inline-block;height:100%;width:100%"
              >{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="form.attrValueList.splice($index,1)">
                <HintButton
                  slot="reference"
                  icon="el-icon-delete"
                  title="删除属性值"
                  type="danger"
                  size="mini"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save" :disabled="form.attrValueList.length === 0">保存</el-button>
        <el-button @click="isShowList=true">取消</el-button>
      </div>-->
      <el-pagination
        style="text-align:center"
        :current-page="page"
        @size-change="handleSizeChange"
        @current-change="getSpuList"
        :page-sizes="[3, 5, 7, 10]"
        :page-size="limit"
        layout=" prev, pager, next, jumper, ->,sizes,total"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuList: [],
      isShowList: true,

      // 初始化默认值
      // 列表页数据 4 个
      page: 1,
      limit: 3,
      total: 10,
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
        this.spuList = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        // 重新选择 2 级分类的时候，需要将父级中的 3 级id 和 attrList 清空
        this.category3Id = "";
        this.spuList = [];
      } else {
        this.category3Id = categoryId;
        // 说明触发的是3级分类列表，发送请求获取属性列表数据
        this.getSpuList();
      }
    },
    async getSpuList(page1 = 1) {
      this.page = page1;
      //发请求拿属性的列表数据
      let { page, limit, category3Id } = this;
      const result = await this.$API.spu.getList(page, limit, category3Id);
      if (result.code === 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
        //console.log(this.spuList);
      }
    },
    // 分页相关
    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },
  },
};
</script>


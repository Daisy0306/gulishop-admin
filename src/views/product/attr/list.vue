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

              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteAttr(row)">
                <HintButton
                  icon="el-icon-delete"
                  type="danger"
                  title="删除属性"
                  size="mini"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
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
        <el-button type="primary" @click="save">保存</el-button>
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

    // 添加属性值界面的显示
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
      // 添加属性值
      this.form.attrValueList.push({
        attrId: this.form.id, // form当中有id就拿form 的id，没有就是undefined
        valueName: "",
        isEdit: true,
      });
      // 永远是最后的 那个 input 获取焦点
      this.$nextTick(() => {
        this.$refs[this.form.attrValueList.length - 1].focus();
      });
    },

    // 点击修改属性逻辑（数据收集）
    showUpdateDiv(row) {
      this.isShowList = false;
      this.form = cloneDeep(row);
      this.form.attrValueList.forEach((item) => {
        // item.isEdit = false; // 错的，这样不是响应式属性，因为数据劫持早都完了,属性值就写死了，要用 $set
        this.$set(item, "isEdit", false);
      });
    },

    // 属性值编辑模式变查看模式的切换
    toLook(row) {
      // 属性值必须是有意义的值
      if (row.valueName.trim() === "") {
        this.$message.warning("属性值不能为空");
        // 添加无用属性值的时候，失去焦点或者按回车，就清空输入框中的内容
        //row.valueName = "";
        if (this.form.id) {
          row.valueName = this.originValue;
          row.isEdit = false;
        } else {
          row.valueName = "";
        }
        return;
      }

      // 不能和已有的属性值重复
      let repeat = this.form.attrValueList.some((item) => {
        if (item != row) {
          return item.valueName.trim() === row.valueName.trim();
        }
      });
      if (repeat) {
        this.$message.warning("属性值不能重复");
        // 同时清空输入框中的内容
        row.valueName = "";
        return;
      }
      row.isEdit = false;
    },

    //查看模式变为编辑模式
    toEdit(row, index) {
      this.originValue = row.valueName;
      row.isEdit = true;
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },

    // 保存修改/添加属性值
    async save() {
      // 1.获取参数数据
      let attr = this.form;

      // 2.对数据进行过滤/整理
      if (attr.attrValueList.length === 0) {
        this.$message.warning("属性当中必须有值");
        return;
      }
      attr.attrValueList.forEach((item) => {
        delete item.isEdit;
      });

      // 3.发请求
      const result = await this.$API.attr.addOrUpdate(attr);
      if (result.code === 200) {
        this.$message.success("保存属性成功");
        this.getAttrList();
        this.isShowList = true;
      } else {
        this.$message.error("保存属性失败");
      }
    },

    // 删除属性的操作
    async deleteAttr(row) {
      const result = await this.$API.attr.delete(row.id);
      if (result.code === 200) {
        this.$message.success("删除属性成功");
        this.getAttrList();
      } else {
        this.$message.error("删除属性失败");
      }
    },
  },
};
</script>


<template>
  <div class="box">
    <ActionBar
      @reset="refreshTable"
      @refresh="searchBannerByName"
      @addItem="openDialog"
    />
    <el-table
      :data="bannerList"
      style="width: 100%"
      max-height="calc(100vh - 225px)"
    >
      <el-table-column type="index" label="" min-width="50" />
      <el-table-column prop="title" label="标题" align="center" />
      <el-table-column
        prop="imgSrc"
        label="封面"
        align="center"
        min-width="140"
      >
        <template v-slot="scope">
          <img :src="scope.row.imgSrc" :width="140" :height="70" />
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" align="center" />
      <el-table-column label="类型" align="center">
        <template #default="scope">
          <span v-if="scope.row.type === '0'">新番</span>
          <span v-else-if="scope.row.type === '1'">番剧</span>
          <span v-else-if="scope.row.type === '2'">剧场</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="170" label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" @click.prevent="alterRow(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" @click.prevent="delRow(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="添加轮播图"
      v-model="dialogVisible"
      width="30%"
      align="center"
    >
      <!-- el-form 使用 el-row 和 el-col 包裹，每行显示两个 el-form-item -->
      <el-form :model="formData" label-width="auto" style="max-height: 600px">
        <el-form-item label="标题">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>

        <el-form-item label="封面">
          <el-input v-model="formData.imgSrc"></el-input>
        </el-form-item>

        <el-form-item label="描述" v-if="itemDialogVisible">
          <el-input v-model="formData.description"></el-input>
        </el-form-item>

        <el-form-item label="类型" v-if="itemDialogVisible">
          <el-select v-model="formData.type" v-if="itemDialogVisible">
            <el-option label="新番" value="0" />
            <el-option label="番剧" value="1" />
            <el-option label="剧场" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <!-- Dialog 的底部按钮 -->
      <div class="dialog-footer" style="text-align: right">
        <el-button type="primary" @click="addItem">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  getBanner,
  addBanner,
  delBanner,
  updateBanner,
  searchBanner,
} from "@/api/banner/index";
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";

const bannerList = ref([]);
const dialogVisible = ref(false);
const itemDialogVisible = ref(false);

const formData = ref({
  id: null,
  title: "",
  imgSrc: "",
  description: "",
  type: null,
});
const alterRow = (row: any) => {
  formData.value.id = row.id;
  formData.value.title = row.title;
  formData.value.imgSrc = row.imgSrc;
  formData.value.description = row.description;
  formData.value.type = row.type;
  itemDialogVisible.value = true;
  dialogVisible.value = true;
};
const delRow = (row: any) => {
  delBanner(row.id)
    .then(() => {
      getBannerList();
    })
    .catch(() => {
      ElMessage({
        type: "error",
        message: "操作失败",
      });
    });
};
const getBannerList = () => {
  getBanner()
    .then((res) => {
      bannerList.value = res.data.data;
    })
    .catch(() => {
      ElMessage({
        type: "error",
        message: "操作失败",
      });
    });
};
const openDialog = () => {
  formData.value.id = null;
  formData.value.title = "";
  formData.value.imgSrc = "";
  formData.value.description = "";
  formData.value.type = null;
  dialogVisible.value = true;
  itemDialogVisible.value = false;
};
const addItem = () => {
  if (formData.value.id) {
    updateBanner(formData.value)
      .then(() => {
        closeDialog();
        getBannerList();
      })
      .catch(() => {
        ElMessage({
          type: "error",
          message: "操作失败",
        });
      });
  } else {
    addBanner(formData.value)
      .then(() => {
        closeDialog();
        getBannerList();
      })
      .catch(() => {
        ElMessage({
          type: "error",
          message: "操作失败",
        });
      });
  }
};
const closeDialog = () => {
  dialogVisible.value = false; // 关闭对话框
};
const refreshTable = () => {
  getBannerList();
};
const searchBannerByName = (value: string) => {
  searchBanner(value).then((res) => {
    bannerList.value = res.data.data;
  });
};

onMounted(() => {
  getBannerList();
});
</script>

<style lang="scss" scoped>
.dialog-footer {
  justify-content: flex-end; /* 将底部按钮靠右 */
}
</style>

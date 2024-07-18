<template>
  <div class="box">
    <ActionBar
      @reset="refreshTable"
      @refresh="searchVideo"
      @addItem="openDialog"
    />
    <el-table
      :data="currentList"
      style="width: 100%"
      max-height="calc(100vh - 225px)"
    >
      <el-table-column type="index" min-width="50" />
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
      <el-table-column prop="score" label="评分" align="center" />
      <el-table-column prop="episode" label="集数" align="center" />
      <el-table-column prop="date" label="日期" align="center" />
      <el-table-column label="类型" align="center">
        <template #default="scope">
          <span v-if="scope.row.type === '0'">新番</span>
          <span v-else-if="scope.row.type === '1'">番剧</span>
          <span v-else-if="scope.row.type === '2'">剧场</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="300" label="操作" align="center">
        <template #default="scope">
          <el-button  @click.prevent="jump2danmaku(scope.row.id)">
            弹幕
          </el-button>
          <el-button  @click.prevent="jump2comment(scope.row.id)">
            评论
          </el-button>
          <el-button type="primary" @click.prevent="updateVideo(scope.row.id)">
            编辑
          </el-button>
          <el-button type="danger" @click.prevent="delRow(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next, jumper, total"
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :page-sizes="pageSizes"
    />
  </div>

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
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getVideos, delVideoById, getVideoByName } from "@/api/video/index";
import router from "@/router";
const currentPage = ref();
const pageSize = ref();
const pageSizes = ref();
const total = ref(0);
const currentList = ref([]);
const searchVideoKeyword = ref();
const dialogVisible = ref(false);
const itemDialogVisible = ref(false);

const formData = ref({
  id: null,
  title: "",
  imgSrc: "",
  description: "",
  type: null,
});


const sizeChange = (val: any) => {
  console.log(val);
};
const currentChange = (val: number) => {
  const keyword = searchVideoKeyword.value;
  if (keyword) {
    getVideo(keyword, val);
  } else {
    getVideoList(val);
  }
};
const getVideoList = (page: number) => {
  getVideos(page).then((res) => {
    currentList.value = res.data.data.records;
    currentPage.value = res.data.data.current;
    total.value = res.data.data.total;
    pageSizes.value = res.data.data.pages;
    pageSize.value = res.data.data.size;
  });
};
const getVideo = (value: string, size: number) => {
  getVideoByName(value, size).then((res) => {
    currentList.value = res.data.data.records;
    currentPage.value = res.data.data.current;
    total.value = res.data.data.total;
    pageSizes.value = res.data.data.pages;
    pageSize.value = res.data.data.size;
  });
};
const delRow = (row: any) => {
  delVideoById(row.id).then(() => {
    getVideoList(1);
  });
};

const refreshTable = () => {
  getVideoList(1);
  searchVideoKeyword.value = null;
};
const searchVideo = (value: string) => {
  if (value) {
    getVideo(value, 1);
    searchVideoKeyword.value = value;
  } else {
    getVideoList(1);
    searchVideoKeyword.value = null;
  }
};

const openDialog = () => {
  router.push( {name:'VideoDetail',params: {videoId:' '}} )
};
const closeDialog = () => {
  dialogVisible.value = false; // 关闭对话框
};

const jump2danmaku = (id:string) =>{
  router.push({ name: 'Danmaku' ,params: {videoId:id}});
};
const jump2comment = (id:string) => {
  router.push({ name: 'Comment' ,params: {videoId:id}});
}
const updateVideo = (id:string) => {
  router.push( {name:'VideoDetail',params: {videoId:id}});
}
onMounted(() => {
  getVideoList(1);
});
</script>

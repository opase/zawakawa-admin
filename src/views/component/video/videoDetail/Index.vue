<template>
  <div class="box">
    <el-form :model="form" max-height="calc(100vh - 225px)">
      <el-form-item label="标题：" required>
        <el-input v-model="form.title" clearable />
      </el-form-item>
      <el-form-item label="日期：" required>
        <el-date-picker
          v-model="form.date"
          type="month"
          style="width: 100%"
          format="YYYY-MM"
          value-format="YYYY-MM"
          clearable
        />
      </el-form-item>

      <el-form-item label="主演：" required>
        <el-input v-model="form.producer" clearable />
      </el-form-item>
      <el-form-item label="评分：" required>
        <el-input
          type="number"
          v-model="form.score"
          @input="validateScore"
          clearable
        />
      </el-form-item>
      <el-form-item label="类别：" required>
        <el-input v-model="form.category" clearable />
      </el-form-item>
      <el-form-item label="类型：" required>
        <el-radio-group v-model="form.type">
          <el-radio label="新番" :value="0" />
          <el-radio label="番剧" :value="1" />
          <el-radio label="剧场" :value="2" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="封面：" required>
        <el-input v-model="form.imgSrc" clearable />
      </el-form-item>
      <el-form-item class="episodeContainer" label="集数：" required>
        <el-select
          v-model="form.episode"
          clearable
          placeholder="默认新增集数"
          style="width: 200px"
        >
          <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <div class="uploadContainer">
          <Upload @fileUploaded="handleFileUploaded" />
          <div class="image-upload-container">
            <el-upload
              class="upload"
              :file-list="fileList"
              :on-change="handleImgChange"
              :limit="1"
              :auto-upload="false"
              multiple
              drag
            >
              <el-icon><Plus /></el-icon>
              <div class="el-upload__text">点击或拖拽图片到此处上传</div>
              <template #tip>
                <div class="el-upload__tip" style="text-align: center">
                  图片需要小于5MB.
                </div>
              </template>
            </el-upload>

            <el-button type="primary" @click="handleCoverUpload"
              >上传封面</el-button
            >
          </div>
          <img :src="form.imgSrc" style="max-width: 200px; max-height: 300px" />
        </div>
      </el-form-item>
      <el-form-item label="描述：" required>
        <el-input v-model="form.description" type="textarea" clearable />
      </el-form-item>

      <el-form-item class="footer">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <!-- <el-button>Cancel</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getVideoInfoById } from "@/api/video/index";
import Upload from "@/views/common/Upload.vue";
import { ElMessage } from "element-plus";
import {
  uploadCover,
  createVideoInfo,
  updateVideoInfo,
} from "@/api/video/index";
const route = useRoute();
const router = useRouter();
const validateScore = (value: string) => {
  if (Number(value) < 0) {
    form.value.score = 0;
  } else if (Number(value) > 9) {
    form.value.score = 9;
  } else {
    form.value.score = Number(value);
  }
};
const fileList = ref<any[]>([]);
const selectedFile = ref<File | null>(null);

const form = ref({
  id: "",
  title: "",
  imgSrc: "",
  date: "",
  type: 0,
  producer: "",
  score: 0,
  category: "",
  description: "",
  episode: null,
  videoSrc: "",
});
const videoId = ref();

const getVideoInfo = (videoId: string) => {
  getVideoInfoById(videoId).then((res) => {
    form.value = res.data.data;
    episodes.value = res.data.data.episode;
  });
};
// 动态生成选项
const episodes = ref(0);
const options = computed(() => {
  const opts = [];
  for (let i = 1; i <= episodes.value; i++) {
    opts.push({ label: `第${i}集`, value: i });
  }
  return opts;
});

// 定义选择的选项

const onSubmit = () => {
  form.value.id = videoId.value;
  if (form.value.episode === undefined) {
    form.value.episode = 0;
  }
  if (form.value.id == null) {
    try {
      createVideoInfo(form.value).then(() => {
        ElMessage.success("添加视频成功");
        router.push("/component/video");
      });
    } catch (error) {
      ElMessage.error("添加视频失败");
    }
  } else {
    try {
      updateVideoInfo(form.value).then(() => {
        ElMessage.success("更新视频成功");
        router.push("/component/video");
      });
    } catch (error) {
      ElMessage.error("更新视频失败");
    }
  }
  console.log(form.value);
};
const handleImgChange = (file: any, fileList: any[]) => {
  const isImage =
    file.raw.type == "image/png" ||
    file.raw.type == "image/jpeg" ||
    file.raw.type == "image/jpg";
  if (!isImage) {
    ElMessage.error("请上传图片文件");
    return false;
  }
  const isLimited = file.size / 1024 / 1024 < 5;
  if (!isLimited) {
    ElMessage.error("图片需要小于5MB");
    return false;
  }
  selectedFile.value = file.raw;
  console.log("caocaocao");
  fileList.value = fileList;
  return true;
};
const handleFileUploaded = (url: string) => {
  form.value.videoSrc = url;
};
const handleCoverUpload = async () => {
  if (selectedFile.value) {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile.value);
      form.value.imgSrc = await uploadCover(formData);
      ElMessage.success("上传封面完成");
    } catch (error) {
      ElMessage.error("上传封面失败");
    }
  } else {
    ElMessage.warning("请选择一个图片");
  }
};

onMounted(() => {
  const id = route.params.videoId as string;
  if (" " === id) {
    videoId.value = null;
  } else {
    videoId.value = id;
    getVideoInfo(id);
  }
});
</script>

<style scoped>
.el-form {
  width: 80%;
  height: 99%;
  background-color: white;
  padding: 7px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}
.footer {
  margin-left: auto;
}

.episodeContainer {
  display: flex;
  align-items: center;
}
.uploadContainer {
  display: flex;
  gap: 150px; /* 间隔 */
  align-items: flex-end; /* 垂直对齐方式 */
  margin-left: 300px;
}
.image-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

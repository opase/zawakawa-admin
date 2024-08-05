<template>
  <div class="uploadcontainer">
    <el-upload
      class="upload"
      :on-change="handleFileChange"
      :file-list="fileList"
      :auto-upload="false"
      multiple
      :limit="1"
      drag
    >
      <el-icon><Plus /></el-icon>
      <div class="el-upload__text">点击或拖拽文件到此处上传</div>
      <div class="el-upload__text">支持mp4</div>
      <template #tip>
        <div class="el-upload__tip">视频文件需要小于2GB</div>
      </template>
    </el-upload>
    <div>
      <el-button type="primary" @click="handleUpload">上传视频</el-button>
      <el-button type="error" @click="">取消</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { checkFile, calculateMD5, uploadFile } from "@/utils/uploadFile";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

export default defineComponent({
  name: "FileUploader",
  components: {
    Plus,
  },

  setup(_, { emit }) {
    const fileList = ref<any[]>([]);
    const selectedFile = ref<File | null>(null);

    const handleFileChange = (file: any, fileList: any[]) => {
      // 获取文件名
      const fileName = file.name;
      // 获取文件后缀
      const fileExtension = fileName
        .slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2)
        .toLowerCase();
      // 检查文件后缀是否是 mp4
      if (fileExtension !== "mp4") {
        ElMessage.error("请上传正确的视频格式");
        return false;
      }
      const isLimited = file.size / 1024 / 1024 / 1024 < 2;
      if (!isLimited) {
        ElMessage.error("视频文件需要小于2GB");
        return false;
      }
      selectedFile.value = file.raw;
      fileList.value = fileList;
      return true;
    };

    const handleUpload = async () => {
      if (selectedFile.value) {
        try {
          const md5 = await calculateMD5(selectedFile.value);
          const uploadedChunks = await checkFile(md5);
          const url = await uploadFile(selectedFile.value, md5, uploadedChunks);
          emit("fileUploaded", url);
          ElMessage.success("上传完成");
        } catch (error) {
          ElMessage.error("上传失败");
        }
      } else {
        ElMessage.warning("请选择一个文件");
      }
    };

    return {
      fileList,
      handleFileChange,
      handleUpload,
    };
  },
});
</script>

<style scoped>
.uploadcontainer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.el-upload__text {
  text-align: center;
  margin-top: 16px;
}
.el-upload__tip {
  text-align: center;
  color: #999;
}
</style>

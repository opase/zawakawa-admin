<template>
  <div class="box">
    <el-form :model="form" max-height="calc(100vh - 225px)">
      <el-form-item label="标题：" required>
        <el-input v-model="form.title" clearable />
      </el-form-item>
      <el-form-item label="封面：" required>
        <el-input v-model="form.imgSrc" clearable />
      </el-form-item>
      <el-form-item label="日期：" required>
        <el-date-picker
          v-model="form.date"
          type="month"
          style="width: 100%"
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
          <el-radio label="新番" :value=0 />
          <el-radio label="番剧" :value=1 />
          <el-radio label="剧场" :value=2 />
        </el-radio-group>
      </el-form-item>
      <el-form-item class="episodeContainer" label="集数：" required>
        <el-select
          v-model="form.episode"
          clearable
          placeholder="默认新增集数"
          style="width: 200px;"
        >
          <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        
        
        <el-upload
          class="upload-demo upload"
          drag
          action=""
          multiple
        >
          <el-icon class="el-icon--upload"><Plus /></el-icon>
          <div class="el-upload__text">点击或拖拽文件到此处上传</div>
          <div class="el-upload__text">支持jpg、png、gif</div>
          <template #tip>
            <div class="el-upload__tip">
              jpg/png files with a size less than 500kb
            </div>
          </template>
        </el-upload>
        
      </el-form-item>
      <el-form-item label="描述：" required>
        <el-input v-model="form.description" type="textarea" clearable />
      </el-form-item>

      <el-form-item class="footer" >
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <!-- <el-button>Cancel</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
import { getVideoInfoById } from "@/api/video/index"
const route = useRoute();
const validateScore = (value: string) => {
  if (Number(value) < 0) {
    form.value.score = 0;
  } else if (Number(value) > 9) {
    form.value.score = 9;
  } else {
    form.value.score = Number(value);
  }
};


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
  episode:undefined,
  videoSrc: "",
});
const videoId = ref();

const getVideoInfo = ( videoId:string) => {
  getVideoInfoById(videoId).then( (res) => { 
      form.value = res.data.data;
      episodes.value = res.data.data.episode;
  })
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
const selectedOption = ref<number | null>(null);

const onSubmit = () => {
  form.value.id = videoId.value;
  if(form.value.episode===undefined){
    form.value.episode = 0;
  }
  console.log(form.value);
};

onMounted(() => {
  const id = route.params.videoId as string;
  if(' '===id){
    videoId.value = null;

  }else{
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
.upload {
  margin-left: 300px;
}
.episodeContainer {
  display: flex;
  align-items: center;
}
</style>

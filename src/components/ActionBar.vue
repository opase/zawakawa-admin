<template>
  
  <el-card class="action-card" shadow="never">
    <template #header>
      <div class="action-card-header">
        <div class="l">
          <el-button type="primary" @click="$emit('addItem')">添加</el-button>
        </div>
        <div class="r">
          <el-input v-model="inputValue" placeholder="请输入名称" clearable />
          <el-button style="margin-left: 10px" type="success" @click="$emit('refresh', inputValue);">
            查询
            <el-icon class="el-icon--right">
              <Search  />
            </el-icon>
          </el-button>
          <el-button type="warning" @click="emit('reset')">
            重置
            <el-icon class="el-icon--right">
              <RefreshRight />
            </el-icon>
          </el-button>
        </div>
      </div>
    </template>
  </el-card>
  
</template>

<script setup lang="ts">
import {Search,RefreshRight} from '@element-plus/icons-vue'
import { ref } from 'vue';
const inputValue = ref('');
// const emit = defineEmits<{
//   (e: 'refresh'): void,
//   (e: 'reset'): void,
//   (e: 'addItem'): void,
// }>()
const emit = defineEmits(['refresh', 'reset', 'addItem']);

</script>
<style scoped lang="scss">
.action-card{

  .action-card-header {
    display: flex;
    justify-content: space-between;
    .r,.l{
      display: flex;
    }
  }
  :deep(.el-card__header){
    padding: 10px;
  }

}
.el-card{
  border: none!important;
}
</style>

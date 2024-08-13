import SparkMD5 from "spark-md5";
import { uploadFileByChunk, askChunk } from "@/api/video/index";
import { ElMessage } from "element-plus";

/**
 * 计算文件的 MD5 值
 * @param file 文件对象
 * @returns MD5 值
 */
export function calculateMD5(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunkSize = 2097152; // 分块大小，2MB
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();

    fileReader.onload = function (e) {
      spark.append(e.target.result as ArrayBuffer); // Append array buffer
      currentChunk++;

      if (currentChunk < chunks) {
        loadNext();
      } else {
        resolve(spark.end()); // 完成计算
      }
    };

    fileReader.onerror = function () {
      reject("File reading error");
    };

    function loadNext() {
      const start = currentChunk * chunkSize;
      const end =
        start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(file.slice(start, end));
    }

    loadNext();
  });
}

/**
 * 检查文件是否存在
 * @param md5 文件的 MD5 值
 * @returns 已上传的分片索引数组
 */
export async function checkFile(md5: string): Promise<number> {
  try {
    const res = await askChunk(md5); // 等待异步操作完成
    const index = res.data.data;
    return index;
  } catch (error) {
    throw new Error("检查文件分片失败");
  }
}

/**
 * 上传文件分片
 * @param file 文件对象
 * @param md5 文件的 MD5 值
 * @param chunkIndex 当前分片的索引
 * @returns void
 */
export async function uploadChunk(
  file: Blob,
  md5: string,
  chunkIndex: number,
  totalChunk: number
): Promise<void> {
  const formData = new FormData();
  formData.append("chunk", file);
  formData.append("hash", md5);
  formData.append("index", chunkIndex.toString());
  formData.append("total", totalChunk.toString());

  await uploadFileByChunk(formData);
}

/**
 * 分片上传文件
 * @param file 文件对象
 * @param md5 文件的 MD5 值
 * @param uploadedChunks 已上传的分片索引数组
 */
export async function uploadFile(
  file: File,
  md5: string,
  uploadedChunks: number
): Promise<string> {
  const chunkSize = 1024 * 1024 * 5; // 2MB
  const chunks = Math.ceil(file.size / chunkSize);
  try {
    for (
      let currentChunk = uploadedChunks;
      currentChunk < chunks;
      currentChunk++
    ) {
      const start = currentChunk * chunkSize;
      const end =
        start + chunkSize >= file.size ? file.size : start + chunkSize;
      const chunk = file.slice(start, end);

      // 上传当前分片
      await uploadChunk(chunk, md5, currentChunk, chunks);

      // 报告进度
      console.log(`分片 ${currentChunk + 1} 上传成功`);
      ElMessage.info(`分片 ${currentChunk + 1} 上传成功`);
    }
  } catch (error) {
    throw new Error(`分片上传失败`);
  }
}

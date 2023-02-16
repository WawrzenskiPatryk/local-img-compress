import { ref, computed } from 'vue';
import Compressor from 'compressorjs';
import { downloadZip } from 'client-zip/index.js';
import FileSaver from 'file-saver';

export function useFileCompressor(fileInput) {
  const appStatuses = {
    compressing: 'compressing...',
    ready: 'ready to download',
    empty: 'waiting for upload',
  };

  const compressionRate = ref(100);
  const uploadedAmount = ref(0);
  const compressedAmount = ref(0);
  const minifiedImages = ref([]);
  const isCompressionLoading = ref(false);
  const isDownloadZipLoading = ref(false);

  const isReadyToDownload = computed(() => {
    const difference = uploadedAmount.value - compressedAmount.value;
    return !difference && !!uploadedAmount.value;
  });

  const counterMessage = computed(() => {
    if (uploadedAmount.value > 0) {
      return `Compressed images: ${compressedAmount.value} / ${uploadedAmount.value}`;
    } else {
      return 'Upload images to compress!';
    }
  });

  const compressionStatus = computed(() => {
    if (isCompressionLoading.value) {
      return appStatuses.compressing;
    } else if (isReadyToDownload.value) {
      return appStatuses.ready;
    } else {
      return appStatuses.empty;
    }
  });

  function compressFiles() {
    uploadedAmount.value = fileInput.value.files.length;
    isCompressionLoading.value = true;
    const images = Array.from(fileInput.value.files);
    images.forEach(file => {
      new Compressor(file, {
        quality: compressionRate.value / 100,
        success(result) {
          const fileName = result.name;
          const miniFile = new File([result], fileName);

          miniFile.originalSize = file.size;
          minifiedImages.value.push(miniFile);
          compressedAmount.value++;

          if (compressedAmount.value === uploadedAmount.value) {
            isCompressionLoading.value = false;
          }
        },
        error(e) {
          console.warn('Compressor Error:', e);
        },
      });
    });
  }

  async function downloadFiles() {
    if (isCompressionLoading.value || !uploadedAmount.value) return;
    isDownloadZipLoading.value = true;
    const content = await downloadZip(minifiedImages.value).blob();
    FileSaver.saveAs(content, 'min-download.zip');
    isDownloadZipLoading.value = false;
  }

  function clearFiles() {
    minifiedImages.value = [];
    uploadedAmount.value = 0;
    compressedAmount.value = 0;
    fileInput.value.value = '';
  }

  return {
    isCompressionLoading,
    isDownloadZipLoading,
    isReadyToDownload,
    compressionRate,
    counterMessage,
    compressionStatus,
    minifiedImages,
    compressFiles,
    downloadFiles,
    clearFiles,
  };
}

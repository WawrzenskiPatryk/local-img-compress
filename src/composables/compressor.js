import { ref, computed } from 'vue';
import Compressor from 'compressorjs';

const appStatuses = {
  compressing: 'compressing...',
  ready: 'ready to download',
  empty: 'waiting for upload',
};

export function useCompressor(uploadInput) {
  const compressionRate = ref(60);
  const uploadedAmount = ref(0);
  const compressedAmount = ref(0);
  const minifiedImages = ref([]);
  const isCompressionLoading = ref(false);

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
    uploadedAmount.value = uploadInput.value.files.length;
    isCompressionLoading.value = true;
    const images = Array.from(uploadInput.value.files);
    images.forEach(file => {
      new Compressor(file, {
        quality: compressionRate.value / 100,
        success(result) {
          const fileName = `min-${result.name}`;
          const file = new File([result], fileName);

          minifiedImages.value.push(file);
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

  function downloadFiles() {
    if (isCompressionLoading.value || !uploadedAmount.value) return;
    // todo
    console.log(minifiedImages.value);
  }

  function clearFiles() {
    minifiedImages.value = [];
    uploadedAmount.value = 0;
    compressedAmount.value = 0;
    uploadInput.value.value = '';
  }

  return {
    isCompressionLoading,
    isReadyToDownload,
    compressionRate,
    counterMessage,
    compressionStatus,
    compressFiles,
    downloadFiles,
    clearFiles,
  };
}

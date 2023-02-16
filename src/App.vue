<template>
  <main class="compressor">
    <div class="compressor__buttons">
      <button class="compressor__upload-button" @click="onUploadButtonClick">
        Upload
        <input
          multiple
          type="file"
          accept="image/*"
          ref="uploadInput"
          class="compressor__upload-input"
          @change="onInputChange"
        />
      </button>
      <button
        class="compressor__upload-button compressor__upload-button--download"
        @click="downloadFiles"
      >
        Download
      </button>
      <button
        class="compressor__upload-button compressor__upload-button--clear"
        @click="clearFiles"
      >
        Clear memory
      </button>
    </div>
    <div class="compressor__rate">
      Compression rate:
      <input
        name="rate"
        v-model="compressionRate"
        type="number"
        max="100"
        min="0"
        class="compressor__rate"
      />
      %
    </div>
    <div>
      <h1>{{ counterMessage }}</h1>
      <h1>Status: {{ compressionStatus }}</h1>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from "vue";
import Compressor from "compressorjs";

const minifiedImages = ref([]);
const uploadInput = ref();
const uploadedAmount = ref(0);
const compressedAmount = ref(0);
const compressionRate = ref(60);
const isCompressionLoading = ref(false);

const isReadyToDownload = computed(() => {
  const difference = uploadedAmount.value - compressedAmount.value;
  return !difference && !!uploadedAmount.value;
});

const counterMessage = computed(() => {
  if (uploadedAmount.value > 0) {
    return `Compressed images: ${compressedAmount.value} / ${uploadedAmount.value}`;
  } else {
    return "Upload images to compress!";
  }
});

const compressionStatus = computed(() => {
  if (isCompressionLoading.value) {
    return "compressing...";
  } else if (isReadyToDownload.value) {
    return "ready to download";
  } else if (uploadedAmount.value === 0) {
    return "waiting for upload";
  } else {
    return "ready to compress";
  }
});

function onUploadButtonClick() {
  uploadInput.value.click();
}

function onInputChange() {
  const images = Array.from(uploadInput.value.files);
  uploadedAmount.value += images.length;
  compressFiles();
}

async function compressFiles() {
  isCompressionLoading.value = true;
  const images = Array.from(uploadInput.value.files);
  images.forEach((file) => {
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
        console.warn(e);
      },
    });
  });
}

function downloadFiles() {
  if (isCompressionLoading.value || !uploadedAmount.value) return;
  console.log(minifiedImages.value);
}

function clearFiles() {
  minifiedImages.value = [];
  uploadedAmount.value = 0;
  compressedAmount.value = 0;
  console.log("CLEARED");
}
</script>

<style lang="scss" scoped>
* {
  font-family: Arial, Helvetica, sans-serif;
}
.compressor {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  height: 100vh;

  &__buttons {
    display: flex;
    gap: 60px;
  }

  &__upload-button {
    font-size: 25px;
    padding: 15px;
    height: 170px;
    width: 170px;
    border-radius: 100%;
    cursor: pointer;
    font-weight: bold;
    transition: 200ms ease;
    border: 5px solid rgb(41, 98, 168);
    background-color: rgb(235, 241, 246);

    &:hover {
      background-color: rgb(219, 231, 241);
    }

    &--download {
      border: 5px solid rgb(41, 168, 71);
      background-color: rgb(235, 246, 236);

      &:hover {
        background-color: rgb(220, 241, 219);
      }
    }

    &--compress {
      border: 5px solid rgb(168, 155, 41);
      background-color: rgb(246, 245, 235);

      &:hover {
        background-color: rgb(239, 241, 219);
      }
    }

    &--clear {
      border: 5px solid rgb(168, 41, 41);
      background-color: rgb(246, 235, 235);

      &:hover {
        background-color: rgb(241, 219, 219);
      }
    }
  }

  &__rate {
    font-size: 30px;
  }

  &__upload-input {
    display: none;
  }
}
</style>

<template>
  <main class="compressor">
    <input
      multiple
      type="file"
      accept="image/*"
      ref="uploadInput"
      class="compressor__upload-input"
      @change="compressFiles"
    />
    <div class="compressor__buttons">
      <button
        class="compressor__upload-button"
        :disabled="isReadyToDownload || isCompressionLoading"
        @click="uploadInput.click()"
      >
        Upload
      </button>
      <button
        class="compressor__upload-button compressor__upload-button--download"
        :disabled="!isReadyToDownload"
        @click="downloadFiles"
      >
        Download
      </button>
      <button
        class="compressor__upload-button compressor__upload-button--clear"
        :disabled="!isReadyToDownload"
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
        :disabled="isReadyToDownload || isCompressionLoading"
        class="compressor__rate"
      />
      %
    </div>
    <div>
      <h2>{{ counterMessage }}</h2>
      <h2>Status: {{ compressionStatus }}</h2>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useFileCompressor } from './composables/compressor';

const uploadInput = ref();
const {
  isCompressionLoading,
  isReadyToDownload,
  compressionRate,
  counterMessage,
  compressionStatus,
  compressFiles,
  downloadFiles,
  clearFiles,
} = useFileCompressor(uploadInput);

compressionRate.value = 60;
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

    &:hover:not([disabled]) {
      background-color: rgb(219, 231, 241);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }

    &--download {
      border: 5px solid rgb(41, 168, 71);
      background-color: rgb(235, 246, 236);

      &:hover:not([disabled]) {
        background-color: rgb(220, 241, 219);
      }
    }

    &--compress {
      border: 5px solid rgb(168, 155, 41);
      background-color: rgb(246, 245, 235);

      &:hover:not([disabled]) {
        background-color: rgb(239, 241, 219);
      }
    }

    &--clear {
      border: 5px solid rgb(168, 41, 41);
      background-color: rgb(246, 235, 235);

      &:hover:not([disabled]) {
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

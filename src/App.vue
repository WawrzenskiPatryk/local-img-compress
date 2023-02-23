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
        v-disabled="isReadyToDownload || isCompressionLoading"
        v-loading="isCompressionLoading"
        @click="uploadInput.click()"
      >
        Upload
      </button>
      <button
        class="compressor__upload-button compressor__upload-button--download"
        v-loading="isCompressionLoading"
        v-disabled="!isReadyToDownload || isDownloadZipLoading"
        @click="downloadFiles"
      >
        Download
      </button>
      <button
        class="compressor__upload-button compressor__upload-button--clear"
        v-loading="isCompressionLoading"
        v-disabled="!isReadyToDownload || isDownloadZipLoading"
        @click="clearFiles"
      >
        Clear memory
      </button>
    </div>
    <div>
      <h3>{{ counterMessage }}</h3>
      <h3>Status: {{ compressionStatus }}</h3>
    </div>
  </main>
  <section class="file-list">
    <div class="file-list__wrapper">
      <div v-if="!isReadyToDownload && !isCompressionLoading">File list is empty.</div>
      <div
        v-for="file in minifiedImages"
        :key="file.lastModified"
        class="file-list__table-row"
      >
        <div class="file-list__table-cell">{{ file.name }}</div>
        <div class="file-list__table-cell">size: {{ parseInt(file.size / 1024) }} kB</div>
        <div class="file-list__table-cell">
          original size: {{ parseInt(file.originalSize / 1024) }} kB
        </div>
        <div class="file-list__table-cell">
          smaller around {{ parseInt(file.originalSize / file.size) }} time{{
            parseInt(file.originalSize / file.size) === 1 ? '' : 's'
          }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useFileCompressor } from './composables/compressor';

const uploadInput = ref();
const {
  isCompressionLoading,
  isDownloadZipLoading,
  isReadyToDownload,
  counterMessage,
  compressionStatus,
  minifiedImages,
  compressFiles,
  downloadFiles,
  clearFiles,
  setAppTitle,
} = useFileCompressor(uploadInput);

setAppTitle();
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
  gap: 20px;
  margin: 40px 0 20px 0;

  &__buttons {
    display: flex;
    gap: 60px;
  }

  &__upload-button {
    font-size: 20px;
    padding: 12px;
    height: 150px;
    width: 150px;
    border-radius: 100%;
    cursor: pointer;
    font-weight: bold;
    transition: 200ms ease;
    border: 5px solid rgb(41, 98, 168);
    background-color: rgb(235, 241, 246);

    &:hover:not([disabled]) {
      background-color: rgb(219, 231, 241);
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
    font-size: 20px;
    margin-top: 5px;
  }

  &__upload-input {
    display: none;
  }
}

.file-list {
  border: 1px solid black;
  margin: 0 10vw;
  min-height: 100px;
  max-height: 400px;
  overflow: scroll;

  &__wrapper {
    padding: 20px 50px;
  }

  &__table-row {
    display: grid;
    margin-bottom: 10px;
    grid-template-columns: repeat(4, 1fr);
  }

  &__table-cell {
    margin: 0 auto;
  }
}
</style>

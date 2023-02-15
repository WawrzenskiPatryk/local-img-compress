<template>
  <main class="compressor">
    <button class="compressor__upload-button" @click="onUploadButtonClick">
      Upload files
      <br />
      to compress
      <input
        ref="uploadInput"
        type="file"
        class="compressor__input"
        multiple
        @change="onInputChange"
      />
    </button>
  </main>
</template>

<script setup>
import { ref } from "vue";

const uploadInput = ref();

function onUploadButtonClick() {
  uploadInput.value.click();
}

function onInputChange() {
  const images = Array.from(uploadInput.value.files);
  images.forEach((image) => {
    console.log(image);
  });
}
</script>

<style lang="scss" scoped>
.compressor {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  &__upload-button {
    font-size: 25px;
    padding: 15px;
    height: 220px;
    width: 220px;
    border: 5px solid rgb(41, 98, 168);
    border-radius: 100%;
    background-color: rgb(235, 241, 246);
    cursor: pointer;
    font-weight: bold;
    transition: 100ms ease;
    &:hover {
      background-color: rgb(219, 231, 241);
    }
  }

  &__input {
    display: none;
  }
}
</style>

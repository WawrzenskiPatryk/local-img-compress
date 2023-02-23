export const vDisabled = (el, binding) => {
  if (binding.value || binding.value === undefined) {
    el.classList.add('v-disabled');
    el.setAttribute('disabled', 'disabled');
  } else {
    el.classList.remove('v-disabled');
    el.removeAttribute('disabled');
  }
};

export const vLoading = (el, binding) => {
  if (binding.value || binding.value === undefined) {
    el.classList.add('v-loading');
  } else {
    el.classList.remove('v-loading');
  }
};

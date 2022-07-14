<script setup>
  import { useCurrencyInput } from 'vue-currency-input'

  const props = defineProps(['modelValue', 'options', 'classes']);
  const { inputRef } = useCurrencyInput(props.options);

  defineExpose({
    inputRef
  });
</script>

<template>
  <input
    ref="inputRef"
    type="text"
    :class="classes"
  />
</template>
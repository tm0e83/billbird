<script setup>
  import { reactive, toRaw, watch } from 'vue';

  const props = defineProps(['dataset']);
  const emit = defineEmits(['close']);

  let data = Object.assign({}, toRaw(props.dataset));
  let state = reactive({ data: data });

  watch(() => props.dataset, (newData, oldData) => {
    data = Object.assign({}, toRaw(newData));
    state.data = data;
  });

  function save() {
    console.log('saving...');
    emit('close');
  }
</script>

<template>
  <div>
    <input type="text" v-model="state.data.title">
    <button @click="$emit('close')">Schließen</button>
    <button @click="save">Speichern</button>
  </div>
</template>

<style lang="scss" scoped>

</style>
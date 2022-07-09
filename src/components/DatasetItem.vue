<script setup>
  const props = defineProps(['data']);
</script>

<template>
  <div class="dataset">
    <div class="prop id">{{ data.id }}</div>
    <div class="prop title">{{ data.title }}</div>
    <div class="prop invoice-amount">Rechnungsbetrag</div>
    <div class="prop interval">Periode</div>
    <div class="prop monthly-amount">Pro Monat</div>
    <div class="prop update-amount">Update</div>
    <div class="prop actual-amount">Ist</div>
    <div class="prop debit-amount">Soll</div>
    <div class="prop diff-amount">Diff</div>
    <div class="prop buttons">
      <button @click="$delete('delete', data.id)">Löschen</button>
      <button @click="$emit('edit', data)">Bearbeiten</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
  .dataset {
    display: flex;

    &:nth-child(odd) {
      background-color: $gray-100-color;
    }
  }

  .prop {
    flex: 1;
    padding: 0.5rem;
  }
</style>
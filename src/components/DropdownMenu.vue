<script setup>
  // DO NOT use this component yet!

  import { onMounted, onUnmounted, ref } from 'vue';

  const props = defineProps({
    'menuItems': {
      type: Array,
      default: []
    }
  });

  const isExpanded = ref(false);
  const dropdownMenuRef = ref(null);
  const triggerRef = ref(null);
  const dropdownLayerRef = ref(null);

  function toggle() {
    positionLayer();
    isExpanded.value = !isExpanded.value;
  }

  function positionLayer() {
    const x = window.scrollX + triggerRef.value.getBoundingClientRect().x;
    const y = window.scrollY + triggerRef.value.getBoundingClientRect().y;

    dropdownLayerRef.value.style.left = `${x}px`;
    dropdownLayerRef.value.style.top = `${y}px`;
  }

  function onClickOutside(e) {
    const clickedOutsideDropownMenu = !e.target.isEqualNode(dropdownMenuRef.value) && !dropdownMenuRef.value.contains(e.target);
    const clickedOutsideDropownLayer = !e.target.isEqualNode(dropdownLayerRef.value) && !dropdownLayerRef.value.contains(e.target);

    if (isExpanded.value && clickedOutsideDropownMenu && clickedOutsideDropownLayer) {
      isExpanded.value = false;
    }
  }

  onMounted(() => {
    document.body.addEventListener('click', onClickOutside);
    window.addEventListener('scroll', positionLayer);
    window.addEventListener('orientationchange', positionLayer);
  });

  onUnmounted(() => {
    document.body.removeEventListener('click', onClickOutside);
    window.removeEventListener('scroll', positionLayer);
    window.removeEventListener('orientationchange', positionLayer);
  });
</script>

<template>
  <div class="dropdown-menu" ref="dropdownMenuRef">
    <span @click="toggle" ref="triggerRef">
      <slot></slot>
    </span>

    <Teleport to="body">
      <div :class="{ 'expanded': isExpanded}" class="dropdown-layer" ref="dropdownLayerRef">
        <slot name="menu"></slot>
        <ul v-if="menuItems.length">
          <li v-for="menuItem in menuItems">
            <a
              :href="menuItem.href"
              @click="menuItem.onClick"
            >{{ menuItem.label }}</a>
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
  .dropdown-menu {
    @apply inline-block;
  }

  .dropdown-layer {
    @apply absolute top-0 left-0 bg-white hidden;

    &.expanded {
      @apply block;
    }
  }

  li {
    @apply px-3 py-1;
  }
</style>
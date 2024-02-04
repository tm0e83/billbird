<script setup>
// DO NOT use this component yet!

import { onMounted, onUnmounted, ref } from 'vue';
import { DotsVerticalIcon } from 'vue-tabler-icons';
import { useElementEdges } from '@/composables/element-edges.js';

const props = defineProps({
  menuItems: {
    type: Array,
    default: [],
  },
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
  const layerRect = dropdownLayerRef.value.getBoundingClientRect();
  const bodyRect = document.body.getBoundingClientRect();

  const triggerEdges = useElementEdges(triggerRef.value);

  const fitsLeft = triggerEdges.top.right.x - layerRect.width > 0;
  const fitsRight = bodyRect.width - triggerEdges.top.right.x - layerRect.width > 0;

  let x,
    y = triggerEdges.bottom.left.y;

  if (fitsRight) {
    x = triggerEdges.top.left.x;
  } else if (fitsLeft) {
    x = triggerEdges.top.right.x - layerRect.width;
  } else {
    x = triggerEdges.bottom.left.x - (triggerEdges.bottom.left.x + layerRect.width - bodyRect.width);
  }

  dropdownLayerRef.value.style.left = `${x}px`;
  dropdownLayerRef.value.style.top = `${y}px`;
}

function onClickOutside(e) {
  const clickedOutsideDropownMenu = !e.target.isEqualNode(dropdownMenuRef.value) && !dropdownMenuRef.value.contains(e.target);

  if (isExpanded.value && clickedOutsideDropownMenu) {
    isExpanded.value = false;
  }
}

onMounted(() => {
  document.body.addEventListener('click', onClickOutside);
  window.addEventListener('scroll', positionLayer);
  window.addEventListener('resize', positionLayer);
  window.addEventListener('orientationchange', positionLayer);
});

onUnmounted(() => {
  document.body.removeEventListener('click', onClickOutside);
  window.removeEventListener('resize', positionLayer);
  window.removeEventListener('scroll', positionLayer);
  window.removeEventListener('orientationchange', positionLayer);
});
</script>

<template>
  <div
    class="dropdown-menu"
    ref="dropdownMenuRef"
  >
    <a
      @click="toggle"
      ref="triggerRef"
    >
      <slot><DotsVerticalIcon class="w-5 h-5" /></slot>
    </a>

    <Teleport to="body">
      <div
        :class="{ expanded: isExpanded }"
        class="dropdown-layer"
        ref="dropdownLayerRef"
      >
        <slot name="menu"></slot>
        <ul v-if="menuItems.length">
          <template v-for="menuItem in menuItems">
            <li v-if="menuItem.condition !== false">
              <a
                :href="menuItem.href"
                @click="menuItem.onClick"
                >{{ menuItem.label }}</a
              >
            </li>
          </template>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.dropdown-menu {
  display: inline-block;
}
.dropdown-layer {
  position: absolute;
  background-color: white;
  opacity: 0;
  visibility: hidden;
  z-index: -10;
  border-radius: 0.25rem;
  filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));

  &.expanded {
    opacity: 1;
    visibility: visible;
    z-index: 10;
  }
}

li {
  padding: 0.25rem 0.75rem;
}
</style>

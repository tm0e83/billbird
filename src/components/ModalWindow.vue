<script setup>
import { reactive, ref } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  maxWidth: {
    type: String,
    default: '600px',
  },
});

const emit = defineEmits(['afterLeave', 'close']);
const outerModal = ref(null);

const styles = reactive({
  'max-width': props.maxWidth,
});

function onAfterLeave(e) {
  emit('afterLeave');
}

function onclickOutside(e) {
  if (e.target === outerModal.value) {
    emit('close');
  }
}
//.
</script>

<template>
  <Teleport to="body">
    <Transition
      name="modal"
      @after-leave="onAfterLeave"
    >
      <div
        class="modal"
        v-show="show"
        @mousedown="onclickOutside"
      >
        <div
          class="modal-outer"
          ref="outerModal"
        >
          <div
            class="modal-inner"
            :style="styles"
          >
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal {
  @apply fixed
      z-10
      bg-black
      bg-opacity-25
      w-full
      h-full
      top-0
      left-0
      flex
      flex-col
      overflow-y-auto
      overflow-x-hidden;
}

.modal-outer {
  @apply flex grow items-center justify-center;
}

.modal-inner {
  @apply w-full max-w-lg m-4 bg-white p-6 rounded;
}

.modal-enter-active,
.modal-leave-active {
  @apply transition transition-opacity duration-300;

  .modal-inner {
    @apply transition transition-[transform] duration-300;
  }
}

.modal-enter-from,
.modal-leave-to {
  @apply opacity-0;

  .modal-inner {
    @apply opacity-0 -translate-y-1/2;
  }
}
</style>

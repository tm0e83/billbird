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
    }
  });

  const emit = defineEmits(['afterLeave', 'close']);
  const outerModal = ref(null);

  const styles = reactive({
    'max-width': props.maxWidth
  });

  function onAfterLeave(e) {
    emit('afterLeave');
  }

  function onclickOutside(e) {
    if (e.target === outerModal.value) {
      emit('close');
    }
  }
</script>

<template>
  <Teleport to="body">
    <Transition name="modal" @after-leave="onAfterLeave">
      <div class="modal" v-show="show" @mousedown="onclickOutside">
        <div class="modal-outer" ref="outerModal">
          <div class="modal-inner" :style="styles">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
  .modal {
    background-color: rgba(0, 0, 0, 0.15);
    position: fixed;
    z-index: 11;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .modal-outer {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .modal-inner {
    width: 100%;
    max-width: 600px;
    margin: 1.5rem auto;
    background-color: #fff;
    padding: 1.5rem;
  }

  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;

    .modal-inner {
      transition: transform 0.3s ease;
    }
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;

    .modal-inner {
      transform: translateY(-100px);
    }
  }
</style>
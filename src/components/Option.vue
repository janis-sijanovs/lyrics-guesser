<script lang="ts">
import { useSettingsStore } from "@/stores/settingsStore";
import { storeToRefs } from "pinia";
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

export default defineComponent({
  name: "OptionComponent",
  props: {
    option: String,
    player: Number,
    index: Number,
  },
  setup(props, context) {
    const settingsStore = useSettingsStore();
    const { playerKeyBindings } = storeToRefs(settingsStore);

    const buttonKey = ref(
      playerKeyBindings.value[props.player || 0][props.index || 0]
    );

    const emitPress = () => {
      context.emit("recievePress", props.option);
    };
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      if (e.key === buttonKey.value) {
        emitPress();
      }
    };
    onMounted(() => {
      document.addEventListener("keyup", handleKeyboardEvent);
    });
    onUnmounted(() => {
      document.removeEventListener("keyup", handleKeyboardEvent);
    });
    return { emitPress, buttonKey };
  },
});
</script>

<template>
  <button class="key-button" @click="emitPress()">
    {{ option }}
    <div class="key-button__key-tag">{{ buttonKey }}</div>
  </button>
</template>

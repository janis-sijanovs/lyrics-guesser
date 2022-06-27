<script lang="ts">
import { useSettingsStore } from "@/stores/settingsStore";
import { storeToRefs } from "pinia";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "OptionComponent",
  props: {
    player: Number,
    index: Number,
  },
  setup(props, context) {
    const settingsStore = useSettingsStore();
    const { playerKeyBindings } = storeToRefs(settingsStore);

    const currentKey = ref(
      playerKeyBindings.value[props.player || 0][props.index || 0]
    );

    const setEventListener = () => {
      document.addEventListener("keyup", handleKeyboardEvent);
    };

    const emitChange = (key: string) => {
      context.emit("recieveChange", props.player, props.index, key);
    };
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      if (
        !(
          playerKeyBindings.value[0].includes(e.key) ||
          playerKeyBindings.value[1].includes(e.key)
        )
      ) {
        emitChange(e.key);
      }
      document.removeEventListener("keyup", handleKeyboardEvent);
    };
    return { setEventListener, currentKey };
  },
});
</script>

<template>
  <button class="key-button" @click="setEventListener()">
    Option {{ index }}
    <div class="key-button__key-tag">{{ currentKey }}</div>
  </button>
</template>

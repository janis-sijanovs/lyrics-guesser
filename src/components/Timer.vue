<script lang="ts">
import { useSettingsStore } from "@/stores/settingsStore";
import { storeToRefs } from "pinia";
import { computed, defineComponent, onMounted, reactive, ref } from "vue";

export default defineComponent({
  name: "TimerComponent",
  setup(props, context) {
    const settingsStore = useSettingsStore();
    const { minutes, seconds } = storeToRefs(settingsStore);

    const timer = ref<number | undefined>(0);

    const time = ref(minutes.value * 60 + seconds.value);

    const start = () => {
      if (!timer.value) {
        timer.value = setInterval(() => {
          if (time.value > 1) {
            time.value -= 1;
          } else {
            emitFinish();
            clearTimeout(timer.value);
          }
        }, 1000);
      }
    };

    const event: unknown = reactive({
      prettyTime: computed(() => {
        const newTime = time.value;
        const minutes = Math.floor(newTime / 60);
        const secondes = newTime - minutes * 60;
        return (
          minutes +
          ":" +
          (secondes.toString().length === 1 ? "0" + secondes : secondes)
        );
      }),
    });

    const emitFinish = () => {
      context.emit("finishGame");
    };

    onMounted(() => start());

    return { emitFinish, event };
  },
});
</script>

<template>
  <p class="timer">Time left: {{ event.prettyTime }}</p>
</template>

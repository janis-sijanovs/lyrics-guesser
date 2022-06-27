<script lang="ts">
import { useSettingsStore } from "@/stores/settingsStore";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    const settingsStore = useSettingsStore();
    const { setSettings } = settingsStore;
    onMounted(() => {
      try {
        const retrievedSettings = JSON.parse(
          localStorage.getItem("settings") || ""
        );
        if (retrievedSettings) {
          setSettings(retrievedSettings);
        }
      } catch (e) {
        console.log("No Local Data");
      }
    });
  },
});
</script>

<template>
  <router-view />
</template>

<style lang="sass">
@import "./styles/app.scss"
</style>

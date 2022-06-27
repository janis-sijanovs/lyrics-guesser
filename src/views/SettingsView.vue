<script lang="ts">
import { useSettingsStore } from "@/stores/settingsStore";
import { storeToRefs } from "pinia";
import { defineComponent, onUnmounted } from "vue";
import KeyBind from "@/components/KeyBind.vue";

export default defineComponent({
  name: "SettingsView",
  setup() {
    const settingsStore = useSettingsStore();
    const {
      setKey,
      setPlayerName,
      setMaxLines,
      setMinutes,
      setSeconds,
      saveSettings,
      resetSettings,
      setSinglePlayer,
    } = settingsStore;
    const {
      minutes,
      seconds,
      maxLines,
      playerNameStore,
      playerKeyBindings,
      singlePlayer,
    } = storeToRefs(settingsStore);

    const recieveChange = (
      playerVal: number,
      indexVal: number,
      keyVal: string
    ) => {
      setKey(playerVal, indexVal, keyVal);
    };
    onUnmounted(() => {
      saveSettings();
    });

    return {
      minutes,
      seconds,
      maxLines,
      singlePlayer,
      playerNameStore,
      playerKeyBindings,
      setKey,
      setPlayerName,
      setMaxLines,
      setSinglePlayer,
      setMinutes,
      setSeconds,
      recieveChange,
      resetSettings,
    };
  },
  components: { KeyBind },
});
</script>

<template>
  <div class="navigation">
    <h1 class="title">Settings</h1>
  </div>
  <div class="menu-container">
    <button class="button" @click="$router.push('/')">&lt; Back</button>
    <button class="button" @click="resetSettings()">Reset ↻</button>
    <h2 class="category-title">Game</h2>
    <label class="label"
      >Single Player Mode:
      <div class="double">
        <input
          class="input"
          type="checkbox"
          @change="(event) => setSinglePlayer(!singlePlayer)"
          :checked="singlePlayer"
        />
      </div>
    </label>
    <label class="label"
      >Max Lines:
      <input
        class="input"
        type="text"
        :value="maxLines"
        @change="(event) => setMaxLines(event.target.value)"
      />
    </label>
    <h2 class="category-title">Timer</h2>
    <label class="label">
      Minutes:
      <input
        class="input"
        type="text"
        :value="minutes"
        @change="(event) => setMinutes(event.target.value)"
      />
    </label>
    <label class="label"
      >Seconds:
      <input
        class="input"
        type="text"
        :value="seconds"
        @change="(event) => setSeconds(event.target.value)"
      />
    </label>
    <h2 class="category-title">Players</h2>
    <label class="label">
      Player 1 name:
      <input
        class="input"
        type="text"
        :value="playerNameStore[0]"
        @change="(event) => setPlayerName(0, event.target.value)"
      />
    </label>
    <label class="label"
      >Player 2 name:
      <input
        class="input"
        type="text"
        :value="playerNameStore[1]"
        @change="(event) => setPlayerName(1, event.target.value)"
      />
    </label>
    <h2 class="category-title">Key bindings</h2>
    <h2 class="category-title">Player 1</h2>
    <div class="bindings-list">
      <div v-for="(key, index) in playerKeyBindings[0]" :key="key">
        <KeyBind :index="index" :player="0" @recieveChange="recieveChange" />
      </div>
    </div>
    <h2 class="category-title">Player 2</h2>
    <div class="bindings-list">
      <div v-for="(key, index) in playerKeyBindings[1]" :key="key">
        <KeyBind :index="index" :player="1" @recieveChange="recieveChange" />
      </div>
    </div>
  </div>
</template>

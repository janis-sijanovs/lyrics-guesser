import Settings from "@/models/settings";
import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    cachedLyrics: 15,
    maxLines: 4,
    singlePlayer: false,
    minutes: 0,
    seconds: 30,
    playerNameStore: ["Player 1", "Player 2"],
    playerKeyBindings: [
      ["a", "s", "d", "f", "g", "h"],
      ["c", "v", "b", "n", "m", "l"],
    ],
  }),
  actions: {
    setKey(player: number, index: number, key: string) {
      this.playerKeyBindings[player][index] = key;
      this.saveSettings();
    },
    setPlayerName(player: number, name: string) {
      this.playerNameStore[player] = name;
      this.saveSettings();
    },
    setMaxLines(value: number) {
      this.maxLines = value;
      this.saveSettings();
    },
    setMinutes(value: number) {
      this.minutes = value;
      this.saveSettings();
    },
    setSeconds(value: number) {
      this.seconds = value;
      this.saveSettings();
    },
    setSinglePlayer(value: boolean) {
      this.singlePlayer = value;
      this.saveSettings();
    },
    setSettings({
      cachedLyrics,
      maxLines,
      singlePlayer,
      minutes,
      seconds,
      playerNameStore,
      playerKeyBindings,
    }: Settings) {
      this.cachedLyrics = cachedLyrics;
      this.maxLines = maxLines;
      this.singlePlayer = singlePlayer;
      this.minutes = minutes;
      this.seconds = seconds;
      this.playerNameStore = playerNameStore;
      this.playerKeyBindings = playerKeyBindings;
    },
    saveSettings() {
      const settings = {
        cachedLyrics: this.cachedLyrics,
        maxLines: this.maxLines,
        singlePlayer: this.singlePlayer,
        minutes: this.minutes,
        seconds: this.seconds,
        playerNameStore: this.playerNameStore,
        playerKeyBindings: this.playerKeyBindings,
      };
      localStorage.setItem("settings", JSON.stringify(settings));
    },
    resetSettings() {
      localStorage.clear();
      location.reload();
    },
  },
});

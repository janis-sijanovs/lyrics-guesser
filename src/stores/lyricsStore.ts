import { getLines, getRandom, shuffleArray } from "@/helpers/helpers";
import axios from "axios";
import { defineStore } from "pinia";
import { useSettingsStore } from "./settingsStore";

export const useLyricsStore = defineStore("lyrics", {
  state: () => ({
    lyrics: null as null | string[],
    loading: false,
    answerOptions: [] as string[][],
    answers: [] as string[],
    currentTurn: 0,
  }),
  actions: {
    getAnswerOption(lines: string[], index: number): string {
      const randomLine = getRandom(lines);
      if (
        this.answers[index] === randomLine ||
        this.answerOptions[index].includes(randomLine)
      ) {
        return this.getAnswerOption(lines, index);
      }
      return randomLine;
    },
    async fetchLyrics(count: number): Promise<string[]> {
      const { data } = await axios.get(count.toString());
      return data.map((song: { lyrics: string }) => song.lyrics);
    },
    async formatLyrics() {
      const settingsStore = useSettingsStore();
      const { cachedLyrics: lyricsCount } = settingsStore;

      let newLines = await this.fetchLyrics(lyricsCount);

      newLines = newLines.map((lines) => lines.split("\n\n").join("\n")) || [
        "",
      ];

      newLines = newLines.map((lines) =>
        getLines(lines.split("\n"), 4).join("\n")
      );

      newLines = newLines.map((lines) => {
        const answer = getRandom(lines.split("\n"));
        this.answers.push(answer);
        this.answerOptions.push([answer]);
        return lines.replace(
          answer,
          "> __________________ <"
          // "_".repeat(answer.length + randomNumber(-10, 10))
        );
      });

      this.lyrics = newLines;
    },
    async generateFakes() {
      await this.formatLyrics();

      const settingsStore = useSettingsStore();
      const { cachedLyrics: lyricsCount } = settingsStore;

      let newLines = await this.fetchLyrics(lyricsCount);

      newLines = newLines.map((lines) => lines.split("\n\n").join("\n"));

      for (let i = 0; i < this.answers.length; i++) {
        for (let count = 0; count < 4; count++) {
          this.answerOptions[i].push(this.getAnswerOption(newLines, i));
        }
      }

      this.answerOptions.map((options) => shuffleArray(options));
    },
    async setupGame() {
      this.loading = true;
      await this.generateFakes();
      this.loading = false;
    },
  },
});

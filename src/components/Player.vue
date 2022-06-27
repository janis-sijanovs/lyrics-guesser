<script lang="ts">
import { getLines, getRandom, shuffleArray } from "@/helpers/helpers";
import axios from "axios";
import { defineComponent, onMounted, onUnmounted, ref, toRef } from "vue";
import { useSettingsStore } from "@/stores/settingsStore";
import Question from "./Question.vue";
import Option from "./Option.vue";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "PlayerComponent",
  props: {
    player: Number,
    ready: Boolean,
  },
  setup(props, context) {
    const nextLyrics = ref<string[]>([]);
    const nextAnswerOptions = ref<string[][]>([]);
    const nextAnswers = ref<string[]>([]);
    const loading = ref(false);
    const initialLoading = toRef(props, "ready");

    const lyrics = ref<string[]>([]);
    const answerOptions = ref<string[][]>([]);
    const answers = ref<string[]>([]);

    const currentTurn = ref(0);
    const points = ref(0);

    const settingsStore = useSettingsStore();
    const { cachedLyrics, playerNameStore, maxLines, playerKeyBindings } =
      storeToRefs(settingsStore);
    const playerName = playerNameStore.value[props.player || 0];

    const skipKey = ref(playerKeyBindings.value[props.player || 0][5]);

    const emmitScore = () => {
      context.emit("recieveScore", props.player, points.value);
    };

    const emmitReadiness = () => {
      context.emit("recieveReadiness");
    };

    const handleKeyboardEvent = (e: KeyboardEvent) => {
      if (e.key === skipKey.value) {
        passTurn();
      }
    };

    const passTurn = () => {
      currentTurn.value += 1;
      if (currentTurn.value === cachedLyrics.value) {
        currentTurn.value = 0;

        lyrics.value = nextLyrics.value;
        answerOptions.value = nextAnswerOptions.value;
        answers.value = nextAnswers.value;

        nextLyrics.value = [];
        nextAnswerOptions.value = [];
        nextAnswers.value = [];

        setupGame();
      }
    };

    const recievePress = (value: string) => {
      if (value === answers.value[currentTurn.value]) {
        points.value += 1;
      } else {
        points.value -= 1;
      }
      emmitScore();
      passTurn();
    };

    const getAnswerOption = (lines: string[], index: number): string => {
      const randomLine = getRandom(lines);
      if (
        nextAnswers.value[index] === randomLine ||
        nextAnswerOptions.value[index].includes(randomLine)
      ) {
        return getAnswerOption(lines, index);
      }
      return randomLine;
    };
    const fetchLyrics = async (count: number): Promise<string[]> => {
      const { data } = await axios.get(count.toString());
      return data.map((song: { lyrics: string }) => song.lyrics);
    };
    const formatLyrics = async () => {
      let newLines = await fetchLyrics(cachedLyrics.value);

      newLines = newLines.map((lines) => lines.split("\n\n").join("\n")) || [
        "",
      ];

      newLines = newLines.map((lines) =>
        getLines(lines.split("\n"), maxLines.value).join("\n")
      );

      newLines = newLines.map((lines) => {
        const answer = getRandom(lines.split("\n"));
        nextAnswers.value.push(answer);
        nextAnswerOptions.value.push([answer]);
        return lines.replace(answer, "> __________________ <");
      });

      nextLyrics.value = newLines;
    };
    const generateFakes = async () => {
      await formatLyrics();

      let newLines = await fetchLyrics(cachedLyrics.value);

      newLines = newLines
        .map((lines) => lines.split("\n\n").join("\n"))
        .join("\n")
        .split("\n");

      for (let i = 0; i < nextAnswers.value.length; i++) {
        for (let count = 0; count < 4; count++) {
          nextAnswerOptions.value[i].push(getAnswerOption(newLines, i));
        }
      }

      nextAnswerOptions.value.map((options) => shuffleArray(options));
    };
    const setupGame = async () => {
      loading.value = true;
      await generateFakes();
      loading.value = false;
    };

    const switchInitialValues = async () => {
      await setupGame();

      lyrics.value = nextLyrics.value;
      answerOptions.value = nextAnswerOptions.value;
      answers.value = nextAnswers.value;
      emmitReadiness();
      document.addEventListener("keyup", handleKeyboardEvent);
    };

    onMounted(() => {
      switchInitialValues();
    });
    onUnmounted(() => {
      document.removeEventListener("keyup", handleKeyboardEvent);
    });
    return {
      initialLoading,
      lyrics,
      currentTurn,
      answerOptions,
      playerName,
      points,
      skipKey,
      recievePress,
      passTurn,
    };
  },
  components: { Question, Option },
});
</script>

<template>
  <div class="page">
    <div class="top-panel">
      <p>{{ playerName }}</p>
      <p>Points: {{ points }}</p>
    </div>
    <div v-if="initialLoading">
      <Question :lyrics="lyrics[currentTurn]" />
      <div class="option-list">
        <div
          v-for="(option, index) in answerOptions[currentTurn]"
          :key="option"
        >
          <Option
            :index="index"
            :player="player"
            :option="option"
            @recievePress="recievePress"
          />
        </div>
        <button class="key-button skip" @click="passTurn()">
          Skip
          <div class="key-button__key-tag">{{ skipKey }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import Player from "@/components/Player.vue";
import Timer from "@/components/Timer.vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settingsStore";
import router from "@/router";

export default defineComponent({
  name: "PlayView",
  setup() {
    const points = [0, 0];
    let playerReadiness = 0;

    const settingsStore = useSettingsStore();
    const { singlePlayer, playerNameStore } = storeToRefs(settingsStore);

    const event = reactive({
      ready: ref(false),
      message: ref("Generating Lyrics"),
      showOverlay: ref(true),
      overlayClickHandler: ref(() => {
        null;
      }),
    });

    const recieveReadiness = () => {
      playerReadiness += 1;

      if (
        playerReadiness === 2 ||
        (playerReadiness === 1 && singlePlayer.value)
      ) {
        event.message = "Generated! \n Click to start";
        event.overlayClickHandler = () => startGame();
      }
    };

    const startGame = () => {
      event.showOverlay = false;
      event.ready = true;
    };

    const recieveScore = (player: number, value: number) => {
      points[player] = value;
    };

    const finishGame = () => {
      if (singlePlayer.value) {
        event.message = `Game finished! \n\n Played by: \n ${playerNameStore.value[0]} \n\n your score was: \n ${points[0]} points \n\n Click to continue`;
      } else if (points[0] > points[1]) {
        event.message = `Game finished! \n\n Winner: \n ${playerNameStore.value[0]} Wins! \n\n your score was: \n ${points[0]} points \n\n Click to continue`;
      } else if (points[1] > points[0]) {
        event.message = `Game finished! \n\n Winner: \n ${playerNameStore.value[1]} Wins! \n\n your score was: \n ${points[1]} points \n\n Click to continue`;
      } else {
        event.message = `Game finished! \n\n It's a draw! \n\n Equally matched with: \n ${points[0]} points \n\n Click to continue`;
      }
      event.showOverlay = true;
      event.overlayClickHandler = () => router.go(-1);
    };

    return {
      finishGame,
      recieveReadiness,
      recieveScore,
      event,
      singlePlayer,
    };
  },
  components: { Player, Timer },
});
</script>

<template>
  <div class="navigation">
    <h1 class="title">Playing..</h1>
    <button class="navigation__link" @click="$router.push('/')">
      &lt; Back
    </button>
    <div v-if="event.ready">
      <Timer @finishGame="finishGame" />
    </div>
  </div>
  <div class="page">
    <div
      v-if="event.showOverlay"
      @click="event.overlayClickHandler()"
      class="overlay"
    >
      {{ event.message }}
    </div>
    <div class="split-page">
      <div class="split-page__container split-page__container--no-border">
        <Player
          :ready="event.ready"
          :player="0"
          @recieveScore="recieveScore"
          @recieveReadiness="recieveReadiness"
        />
      </div>
      <div class="split-page__container" v-if="!singlePlayer">
        <Player
          :ready="event.ready"
          :player="1"
          @recieveScore="recieveScore"
          @recieveReadiness="recieveReadiness"
        />
      </div>
    </div>
  </div>
</template>

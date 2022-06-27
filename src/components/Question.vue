<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "QuestionComponent",
  props: {
    lyrics: String,
  },
});
</script>

<template>
  <div class="lyrics">{{ lyrics }}</div>
</template>

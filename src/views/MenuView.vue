<template>
  <div class="navigation">
    <h1 class="title">Lyrics Guessing Game</h1>
  </div>
  <div class="menu-container">
    <button class="button button--big" @click="$router.push(`/play`)">
      Play
    </button>
    <button class="button button--big" @click="$router.push(`/settings`)">
      Settings
    </button>
  </div>
</template>

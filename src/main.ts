import axios from "axios";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.mount("#app");
axios.defaults.baseURL = "http://localhost:8000/api/";

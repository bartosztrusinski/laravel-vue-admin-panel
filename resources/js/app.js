import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faHome,
  faMessage,
  faPencil,
  faPlus,
  faTrashCan,
  faUser,
  faUsers,
  faXmark,
  faArrowRightFromBracket,
  faShieldHalved,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faUser,
  faPlus,
  faMessage,
  faHome,
  faTrashCan,
  faPencil,
  faUsers,
  faXmark,
  faBars,
  faArrowRightFromBracket,
  faShieldHalved,
  faCheck
);

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router);
app.mount("#app");

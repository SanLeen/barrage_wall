import Vue from 'vue'
import App from './App.vue'
import {Util} from "./utils/util";

Vue.config.productionTip = false;
Vue.prototype.$util = Util;
new Vue({
    render: h => h(App),
}).$mount('#app');

import Vue from 'vue'
import App from './App.vue'
import Util from "./utils/Util";

//关闭vue-dev-tool
const isDebug_mode = process.env.NODE_ENV !== 'production';
Vue.config.debug = isDebug_mode;
Vue.config.devtools = isDebug_mode;
Vue.config.productionTip = isDebug_mode;

Vue.prototype.$util = Util;
new Vue({
    render: h => h(App),
}).$mount('#app');

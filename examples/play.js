import Vue from 'vue';
import Element from 'main/index.js';
import 'packages/theme-chalk/src/index.scss';
// import App from './play/index.vue';
import TooltipDemo from './play/pages/TooltipDemo'

Vue.use(Element);

debugger;
new Vue({ // eslint-disable-line
  render: h => h(TooltipDemo)
}).$mount('#app');

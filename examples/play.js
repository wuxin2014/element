import Vue from 'vue';
import Element from 'main/index.js';
import 'packages/theme-chalk/src/index.scss';
// import App from './play/index.vue';
// import APP from './play/pages/TooltipDemo'
import App from './play/pages/CarouselDemo'

Vue.use(Element);
// Vue.use(Element, { size: 'small', zIndex: 3000 });
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };

new Vue({ // eslint-disable-line
  render: h => h(App)
}).$mount('#app');

import { createApp } from 'vue';
import App from './App.vue';
import { vDisabled, vLoading } from './directives';
import './assets/styles/directives.scss';

const app = createApp(App);

app.directive('disabled', vDisabled);
app.directive('loading', vLoading);

app.mount('#app');

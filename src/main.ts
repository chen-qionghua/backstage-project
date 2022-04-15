import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { HomeFilled, UserFilled, Coin } from "@element-plus/icons-vue";

const app = createApp(App)

// const icons = {
//   "HomeFilled":HomeFilled,
//   "UserFilled":UserFilled,
//   "Coin":Coin

// }

// for(const [key,value] of Object.entries(icons)){
//   app.component(key,value)
// }

app.component('HomeFilled',HomeFilled)
app.component('UserFilled',UserFilled)
app.component('Coin',Coin)



app.use(createPinia())

app.use(ElementPlus)
app.use(router)
app.mount('#app')

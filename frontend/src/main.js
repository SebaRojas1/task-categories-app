import { createApp } from 'vue'
import App from './pages/App.vue'
import router from './routes/index.js'
import './styles/style.css'

const app = createApp(App)
app.use(router)
app.mount('#app')

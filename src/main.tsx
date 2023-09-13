import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './routes/AppRouter.tsx'
import './styles/styles.css'
import { store } from './redux/store.ts'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </React.StrictMode>,
)

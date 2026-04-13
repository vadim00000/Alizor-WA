import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import App from './App.jsx'
import { model } from '../TrainModel.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App model={model}/>
  </StrictMode>,
)

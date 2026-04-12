import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import App from './App.jsx'
import { reactiveModel } from "/src/mobxReactiveModel.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App model={reactiveModel} />
  </StrictMode>,
)

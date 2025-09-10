import React from 'react'
import ReactDOM from 'react-dom/client'
import LVGLWidgetDesigner from './lvgl-widget-designer'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LVGLWidgetDesigner />
  </React.StrictMode>,
)

import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import App from './App.jsx'
import './index.css'

const theme = {
  token: {
    colorPrimary: '#1a7af8',
    colorError: '#FF4733',
    borderRadius: 6,
    colorBgLayout: '#f5f5f5',
    colorBorder: '#e8e8e9',
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </BrowserRouter>
)

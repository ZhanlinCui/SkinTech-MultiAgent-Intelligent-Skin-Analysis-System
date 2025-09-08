import ReactDOM from 'react-dom/client'
import './index.scss'
// import App from './vm-ui/vm-app/index.tsx'
import App from './App.tsx'

ReactDOM.createRoot(document.querySelector('#root') as Element).render(
  <>
    <App />
  </>
)

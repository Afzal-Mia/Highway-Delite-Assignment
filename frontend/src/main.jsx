import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import ContextProvider from './context/globalContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const serverAPI = "https://highway-delite-assignment-backend.onrender.com"

createRoot(document.getElementById('root')).render(
<>
  <ToastContainer />
  <ContextProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </ContextProvider>
</>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
import { AppRouter } from '../routes/AppRouter';
import './index.css'

createRoot(document.getElementById('root')!)
  .render(
    <StrictMode>
      <AppRouter />
    </StrictMode>
  );

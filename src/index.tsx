import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import './i18n/i18n';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { bg } from 'date-fns/locale/bg';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LocalizationProvider>
    </BrowserRouter>
  </React.StrictMode>
);

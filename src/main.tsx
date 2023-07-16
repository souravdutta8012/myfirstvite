import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

export default function AppProvider() {
  return (
    <App />
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppProvider />
)

import './App.css';
import { RouterProvider } from 'react-router-dom';
import { routers } from './Router';

export default function App() {
  return (
    <RouterProvider router={routers()} />
  );
}

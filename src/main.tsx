import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactFlowProvider } from '@xyflow/react';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>
);

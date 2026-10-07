import { useState } from 'react'
import { AppRoutes } from './routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import AnalyticsTracker from './components/AnalyticsTracker';

function App() {

  return (
    <BrowserRouter>
      <AnalyticsTracker/>
      <AppRoutes/>
  </BrowserRouter>);
}

export default App

import express from 'express';
import loaders from './loader';

const App = () => {
  process.env.TZ = 'Asia/Kolkata';
  const app = express();
  loaders({ expressApp: app });

  return app;
};

export default App;


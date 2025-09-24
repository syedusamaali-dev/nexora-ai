import 'dotenv/config';

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Nexora API running on http://localhost:${PORT}`);
    console.log(
      `Swagger UI: http://localhost:${PORT}/api-docs`
    );
  });
};

startServer();
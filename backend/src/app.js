import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import documentRoutes from './routes/document.routes.js';
import chatRoutes from './routes/chat.routes.js';
// import industryRoutes from './routes/industry.routes.js';

import { swaggerSpec } from './docs/swagger.js';
import { errorHandler } from './middleware/error.middleware.js';
import searchRoutes from './routes/search.routes.js';
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4200'
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Nexora API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/documents', documentRoutes);
app.use('/api/chats', chatRoutes);
// app.use('/api/industries', industryRoutes);
app.use('/api/search', searchRoutes);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use(errorHandler);

export default app;
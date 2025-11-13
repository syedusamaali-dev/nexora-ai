import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import documentRoutes from './routes/document.routes.js';
import chatRoutes from './routes/chat.routes.js';
import searchRoutes from './routes/search.routes.js';

import { swaggerSpec } from './docs/swagger.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

/* =========================================================
   CORS
========================================================= */

const allowedOrigins = [
  'http://localhost:4200',
  'https://nexora-ai-silk-eta.vercel.app'
];

app.use(
  cors({
    origin: (origin, callback) => {

      // Allow requests that don't contain an Origin header
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log('❌ CORS blocked:', origin);

      return callback(
        new Error(`CORS blocked: ${origin}`)
      );
    },

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS'
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ],

    credentials: false
  })
);


/* =========================================================
   BODY PARSING
========================================================= */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);


/* =========================================================
   HEALTH CHECK
========================================================= */

app.get('/api/health', (req, res) => {

  res.json({
    success: true,
    message: 'Nexora API is running',
    timestamp: new Date().toISOString()
  });

});


/* =========================================================
   ROUTES
========================================================= */

app.use(
  '/api/documents',
  documentRoutes
);

app.use(
  '/api/chats',
  chatRoutes
);

app.use(
  '/api/search',
  searchRoutes
);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);


/* =========================================================
   ERROR HANDLER
========================================================= */

app.use(errorHandler);


export default app;
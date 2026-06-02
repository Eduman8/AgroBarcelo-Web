import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { products } from './products.js';

const app = express();
const port = process.env.PORT || 3000;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: clientOrigin }));
app.use(express.json());

app.get('/api/health', (request, response) => {
  response.json({
    status: 'ok',
    project: 'AgroBarceló API'
  });
});

app.get('/api/products', (request, response) => {
  response.json(products);
});

app.listen(port, () => {
  console.log(`AgroBarceló API escuchando en http://localhost:${port}`);
});

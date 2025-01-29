import express from 'express';
import { recibirDatos } from '../controllers/bgLocation.js';

const router = express.Router();

router.post('/receive-data', recibirDatos);

export default router;

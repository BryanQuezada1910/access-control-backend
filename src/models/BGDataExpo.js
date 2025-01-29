import mongoose from 'mongoose';

// Modelo para probar la recepción de datos de la app expo ITNegocios

const registroSchema = new mongoose.Schema({
    data: { type: Object, required: true }, // Guarda el JSON recibido
    createdAt: { type: Date, default: Date.now }, // Fecha automática
});

export default mongoose.model('Registro', registroSchema);

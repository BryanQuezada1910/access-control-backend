import Registro from '../models/BGDataExpo.js';

export const recibirDatos = async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);

        // Crear y guardar el registro en MongoDB
        const nuevoRegistro = new Registro({ data: req.body });
        await nuevoRegistro.save();

        res.status(200).json({ message: 'Datos guardados correctamente' });
    } catch (error) {
        console.error('Error al guardar los datos:', error);
        res.status(500).json({ error: 'Error al guardar los datos' });
    }
};

require("dotenv").config({ path: './config/.env' });
const express = require('express');
const corsMiddleware = require('./middlewares/corsMiddleware');
const jsonMiddleware = require('./middlewares/jsonMiddleware');
const cookiesMiddleware = require('./middlewares/cookiesMiddleware');

const empresaRoutes = require('./routes/RegistroEmpresaRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const impuestoRoutes = require('./routes/ImpuestoRoutes');
const clientRoutes = require('./routes/ClientesRoutes');
const productRoutes = require('./routes/ProductRoutes');
const medidasRoutes = require('./routes/MedidasRoutes');
const monedaRoutes = require('./routes/MonedaRoutes');
const facturaRoutes = require('./routes/FacturaRoutes');
const CorreoRoutes = require('./routes/CorreoRoutes');
const certificacionRoutes = require('./routes/CertificacionRouter');
const comprobanteRoutes = require('./routes/ComprobanteFiscalRoutes'); // ✅ Agregado
const secuenciaFacturaRoutes = require('./routes/SecuenciaFacturaRoutes');
const razonAnulacionRoutes = require("./routes/RazonAnulacionRoutes");
const app = express();

// Usar middlewares
app.use('/uploads', express.static('uploads'));
app.use(corsMiddleware);
app.use(jsonMiddleware);
app.use(cookiesMiddleware);

// Usar las rutas
app.use('/api', empresaRoutes);
app.use('/api', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/impuestos', impuestoRoutes);
app.use('/api/clientes', clientRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/medidas', medidasRoutes);
app.use('/api/monedas', monedaRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/Email', CorreoRoutes);
app.use('/api/certificaciones', certificacionRoutes);
app.use('/api/comprobantes', comprobanteRoutes); // ✅ Nueva ruta
app.use('/api/obtener-encf', secuenciaFacturaRoutes);
app.use("/api/razon-anulacion", razonAnulacionRoutes);
// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ mensaje: '¡El backend funciona correctamente!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

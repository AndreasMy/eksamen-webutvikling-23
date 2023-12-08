// importer requirements
const db = require('./src/database/db');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const userRoutes = require('./src/routes/usersRoutes');
const postRoutes = require('./src/routes/postRoutes');
const loginRoutes = require('./src/routes/loginRoutes');

const secretKey = 'gokstadakademiet'; // MÅ IKKE ENDRES
const port = 3000; // MÅ IKKE ENDRES

const corsOptions = {
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true,
}; // MÅ IKKE ENDRES! Tillater sending av cookies/autentiseringsopplysninger

app.use(cors(corsOptions)); // MÅ IKKE ENDRES
app.use(express.json()); // MÅ IKKE ENDRES
app.use(express.urlencoded({ extended: true })); // MÅ IKKE ENDRES

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRoutes);
app.use('/', postRoutes);
app.use('/', loginRoutes);

// Start serveren
app.listen(port, () => {
  console.log(`Server => http://localhost:${port}`);
});

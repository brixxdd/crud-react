const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
//comentario prueba
const app = express();
// Configuración de CORS
const allowedOrigins = [
  'http://localhost:5173', // Origen del frontend de desarrollo (Vite)
  'http://localhost:5174', // Origen del frontend de desarrollo (Vite)
  'https://crud-react-frontend.vercel.app' // URL del frontend en Vercel
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
};

app.use(cors(corsOptions));

// --- MIDDLEWARES ---
const jsonParser = express.json(); // Middleware para parsear JSON

// --- CONFIGURACIÓN DE MULTER (PARA SUBIDA DE ARCHIVOS) ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(uploadsDir));

// --- CONFIGURACIÓN GENERAL ---
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        user: process.env.DB_USER || 'brian',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'escuelaDB',
        password: process.env.DB_PASSWORD || '2302',
        port: process.env.DB_PORT || 5432,
      }
);

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_secreto_y_largo';

const adminUser = { username: 'admin', passwordHash: '' };
bcrypt.hash('admin', 10).then(hash => {
  adminUser.passwordHash = hash;
});

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- RUTA DE LOGIN (PÚBLICA) ---
app.post('/login', jsonParser, async (req, res) => {
  const { username, password } = req.body;
  if (username === adminUser.username) {
    const match = await bcrypt.compare(password, adminUser.passwordHash);
    if (match) {
      const userPayload = { username: adminUser.username, role: 'admin' };
      const accessToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '8h' });
      res.json({ accessToken: accessToken });
    } else {
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});

// A partir de aquí, todas las rutas requieren autenticación
app.use(authenticateToken);

// --- RUTAS PARA ALUMNOS ---
app.post('/alumnos', upload.single('foto'), async (req, res) => {
  try {
    const { nombre, grado, email } = req.body;
    const fotoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await pool.query(
      'INSERT INTO alumnos(nombre, grado, email, foto_url) VALUES($1, $2, $3, $4) RETURNING *',
      [nombre, grado, email, fotoUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear alumno' });
  }
});

app.get('/alumnos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alumnos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener alumnos' });
  }
});

app.put('/alumnos/:id', jsonParser, async (req, res) => {
  try {
    const { nombre, grado, email } = req.body;
    const result = await pool.query(
      'UPDATE alumnos SET nombre=$1, grado=$2, email=$3 WHERE id=$4 RETURNING *',
      [nombre, grado, email, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar alumno' });
  }
});

app.delete('/alumnos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM alumnos WHERE id=$1', [req.params.id]);
    res.json({ message: 'Alumno eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar alumno' });
  }
});

// --- RUTAS PARA ALUMNOS_MATERIAS ---
app.post('/alumnos/:alumno_id/materias', jsonParser, async (req, res) => {
  try {
    const { materia_id } = req.body;
    const result = await pool.query(
      'INSERT INTO alumnos_materias(alumno_id, materia_id) VALUES($1, $2) RETURNING *'
      , [req.params.alumno_id, materia_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al inscribir alumno' });
  }
});

app.get('/alumnos/:alumno_id/materias', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT m.id, m.nombre FROM materias m JOIN alumnos_materias am ON m.id = am.materia_id WHERE am.alumno_id = $1'
      , [req.params.alumno_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener materias' });
  }
});

app.delete('/alumnos/:alumno_id/materias', async (req, res) => {
  try {
    await pool.query('DELETE FROM alumnos_materias WHERE alumno_id = $1', [req.params.alumno_id]);
    res.json({ message: 'Materias del alumno eliminadas' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar materias' });
  }
});

// --- RUTAS PARA MAESTROS ---
app.post('/maestros', upload.single('foto'), async (req, res) => {
  try {
    const { nombre, email } = req.body;
    const fotoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await pool.query(
      'INSERT INTO maestros(nombre, email, foto_url) VALUES($1, $2, $3) RETURNING *',
      [nombre, email, fotoUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear maestro' });
  }
});

app.get('/maestros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM maestros ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener maestros' });
  }
});

// --- RUTAS PARA MATERIAS ---
app.post('/materias', jsonParser, async (req, res) => {
  try {
    const { nombre } = req.body;
    const result = await pool.query(
      'INSERT INTO materias(nombre) VALUES($1) RETURNING *'
      , [nombre]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear materia' });
  }
});

app.put('/materias/:id', jsonParser, async (req, res) => {
  try {
    const { nombre } = req.body;
    const result = await pool.query(
      'UPDATE materias SET nombre=$1 WHERE id=$2 RETURNING *'
      , [nombre, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar materia' });
  }
});

app.delete('/materias/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM materias WHERE id=$1', [req.params.id]);
    res.json({ message: 'Materia eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar materia' });
  }
});

app.get('/materias-con-maestros', async (req, res) => {
  try {
    const query = `
      SELECT 
        m.id, 
        m.nombre, 
        COALESCE(
          json_agg(
            json_build_object('id', ma.id, 'nombre', ma.nombre)
          ) FILTER (WHERE ma.id IS NOT NULL), 
          '[]'
        ) AS maestros
      FROM materias m
      LEFT JOIN maestros_materias mm ON m.id = mm.materia_id
      LEFT JOIN maestros ma ON mm.maestro_id = ma.id
      GROUP BY m.id, m.nombre
      ORDER BY m.nombre;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener materias con maestros' });
  }
});

app.put('/materias/:id/maestros', jsonParser, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM maestros_materias WHERE materia_id = $1', [req.params.id]);
    if (req.body.maestro_ids && req.body.maestro_ids.length > 0) {
      const insertPromises = req.body.maestro_ids.map(maestro_id => {
        return client.query(
          'INSERT INTO maestros_materias (materia_id, maestro_id) VALUES ($1, $2)',
          [req.params.id, maestro_id]
        );
      });
      await Promise.all(insertPromises);
    }
    await client.query('COMMIT');
    res.status(200).json({ message: 'Maestros asignados' });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Error al asignar maestros' });
  } finally {
    client.release();
  }
});

app.get('/inscripciones', async (req, res) => {
  try {
    const query = `
      SELECT 
        a.nombre AS alumno_nombre,
        m.nombre AS materia_nombre,
        ma.nombre AS maestro_nombre
      FROM alumnos_materias am
      JOIN alumnos a ON am.alumno_id = a.id
      JOIN materias m ON am.materia_id = m.id
      LEFT JOIN maestros_materias mm ON am.materia_id = mm.materia_id
      LEFT JOIN maestros ma ON mm.maestro_id = ma.id
      ORDER BY a.nombre, m.nombre, ma.nombre;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});
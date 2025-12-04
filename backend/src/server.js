const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();
connectDB();

// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/caregiver', require('./routes/caregiverRoutes'));
app.use('/api/careseeker', require('./routes/careseekerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));

app.get('/', (req, res) => {
  res.send('CareConnect API is running');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

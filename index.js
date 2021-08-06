const express = require('express');

const app = express();
const port = process.env.PORT;
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const saucesRoutes = require('./routes/saucesRoutes');

app.use(helmet());
app.use(cors({ origin: 'http://127.0.0.1:8081' }));

app.use(express.json());
app.use('/public', express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/sauces', saucesRoutes);

app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

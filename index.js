const express = require('express');

const app = express();
const port = process.env.PORT;
const mongoose = require('mongoose');

const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const saucesRoutes = require('./routes/saucesRoutes');

app.use(express.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

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

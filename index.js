const express = require('express');
const app = express();
const port = process.env.PORT;
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const saucesRoutes = require('./routes/saucesRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/sauces', saucesRoutes);

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`)
    })
  })
  .catch(err => console.log(err));
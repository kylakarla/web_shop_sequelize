const express = require('express');
const sequelize = require('./util/db'); // importime valmis objekti

const app = express();
const PORT = 3000;

// Testime andmebaasi ühendust
sequelize.authenticate()
  .then(() => {
    console.log('Ühendus andmebaasiga loodud!');
  })
  .catch(err => {
    console.error('Andmebaasiga ühendus ebaõnnestus:', err);
  });

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Web Shop Sequelize töötab!' });
});

app.listen(PORT, () => {
  console.log(`Server töötab aadressil http://localhost:${PORT}`);
});

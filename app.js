const express = require('express');
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
  res.send("Hello from Version 1 (Blue Environment)");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
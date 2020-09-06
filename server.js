const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/html/kanban.html');
})

const port = 3000;
app.listen(process.env.PORT || port, () => {
  console.log(`Server is up and running on port ${port}`);
})
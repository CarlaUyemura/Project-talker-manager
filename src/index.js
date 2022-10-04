const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_request, response) => {
  const pathTalker = path.resolve(__dirname, 'talker.json');
  const fileTalkers = await fs.readFile(pathTalker, 'utf-8');
  const talkers = JSON.parse(fileTalkers);
  if (!talkers) {
    return response.status(200).send([]);
  }  
  response.status(200).json(talkers);
});

app.listen(PORT, () => {
  console.log('Online');
});

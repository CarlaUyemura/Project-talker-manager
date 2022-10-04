const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { token, validateLogin } = require('./authentication');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

const getTalkers = async () => {
  const pathTalker = path.resolve(__dirname, 'talker.json');
  const talkers = JSON.parse(await fs.readFile(pathTalker, 'utf-8'));
  return talkers;
};

app.get('/talker', async (_request, response) => {
  const talkers = await getTalkers();
  if (!talkers) return response.status(HTTP_OK_STATUS).send([]);

  response.status(HTTP_OK_STATUS).json(talkers);
});

app.get('/talker/:id', async (request, response) => {
  const talkers = await getTalkers();
  const { id } = request.params;

  const talker = talkers.find((person) => person.id === Number(id));

  if (!talker) {
    return response.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }  
  response.status(HTTP_OK_STATUS).json(talker);
});

const verifyLogin = (req, res, next) => {
  const { email, password } = req.body;
  const validate = validateLogin(email, password);
  if (validate === true) {
    return next();
  }
  res.status(400).json(validate);
};

app.post('/login', verifyLogin, (_request, response) => {
  const getToken = token();
  response.status(HTTP_OK_STATUS).json({ token: getToken });
});
app.listen(PORT, () => {
  console.log('Online');
});

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const {
  token, 
  validateLogin, 
  validateToken,
  validateName,
  validateDate,
  validateRate,
 } = require('./authentication');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const pathTalker = path.resolve(__dirname, 'talker.json');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

const getTalkers = async () => {
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
  if (validate === true) next();
  res.status(400).json(validate);
};

app.post('/login', verifyLogin, (_request, response) => {
  const getToken = token();
  response.status(HTTP_OK_STATUS).json({ token: getToken });
});

app.post('/talker', 
  validateToken,
  validateName,
  validateDate,
  validateRate,
  async (request, response) => {
    const talkers = await getTalkers();
    const talker = { ...request.body, id: talkers.length + 1 };
  talkers.push(talker);
  await fs.writeFile(pathTalker, JSON.stringify(talkers));
  response.status(201).json(talker);                                                       
});

app.listen(PORT, () => {
  console.log('Online');
});

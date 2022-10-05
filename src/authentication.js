const crypto = require('crypto');

const token = () => crypto.randomBytes(8).toString('hex');

const validateLogin = (email, pass) => {
  const verify = /\S+@\S+\.\S+/;
    if (!email) return { message: 'O campo "email" é obrigatório' };

    if (!verify.test(email)) return { message: 'O "email" deve ter o formato "email@email.com"' };

    if (!pass) return { message: 'O campo "password" é obrigatório' };

    if (pass.length < 6) return { message: 'O "password" deve ter pelo menos 6 caracteres' };
    
   return true;
};

const validateToken = (req, res, next) => {
  const randomToken = req.headers.authorization;
  if (!randomToken) {
    return res.status(401).json({ message: 'Token não encontrado' }); 
}
  if (randomToken.length !== 16) { 
    return res.status(401).json({ message: 'Token inválido' }); 
  }
  next();
};

const validateName = (req, res, next) => {
  const { name, age } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' }); 
  }
  
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' }); 
}
  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' }); 
  }

  if (age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' }); 
  }
  next();
};

const validateDate = (req, res, next) => {
  const { talk } = req.body;
  const verifyDate = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' }); 
  }
  const { watchedAt } = req.body.talk;
  if (!watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' }); 
  }
  if (!verifyDate.test(watchedAt)) {
    return res.status(400).json({ 
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
     }); 
  }
  next();
};

const validateRate = (req, res, next) => {
  const { rate } = req.body.talk;
  if (!rate) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' }); 
  }
  if (rate < 1 || rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

module.exports = { 
  token, 
  validateLogin, 
  validateToken,
  validateName,
  validateDate,
  validateRate,
};
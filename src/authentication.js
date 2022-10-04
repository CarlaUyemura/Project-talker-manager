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

module.exports = { 
  token, 
  validateLogin, 
};
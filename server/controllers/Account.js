const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const changePasswordPage = (req, res) => res.render('changePassword');

const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const changePassword = (req, res) => {
  const currentPassword = `${req.body.pass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;
  const { username } = req.session.account;

  if (!currentPassword || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  let doc;

  return Account.authenticate(username, currentPassword, async (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'This is not your current password!' });
    }

    try {
      doc = await Account.findOne({ username }).exec();
      if (!doc) {
        return res.status(500).json({ error: 'User was not found!' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'An error occured!' });
    }

    try {
      const hash = await Account.generateHash(newPass);
      doc.password = hash;
      await doc.save();

      req.session.destroy();
      return res.json({ redirect: '/' });
    } catch (error) {
      return res.status(500).json({ error: 'Error updating password!' });
    }
  });
  // if (err || !account) {
  //   return res.status(401).json({ error: 'This is not your current password!' });
  // }

  // try {
  //   doc = await Account.findOne({ username }).exec();
  //   if (!doc) {
  //     return res.status(500).json({ error: 'User was not found!' });
  //   }
  // } catch (error) {
  //   return res.status(500).json({ error: 'An error occured!' });
  // }

  // try {
  //   const hash = await Account.generateHash(newPass);
  //   doc.password = hash;
  //   await doc.save();

  //   req.session.destroy();
  //   return res.json({ redirect: '/' });
  // } catch (error) {
  //   return res.status(500).json({ error: 'Error updating password!' });
  // }
};

module.exports = {
  loginPage,
  changePasswordPage,
  login,
  logout,
  signup,
  changePassword,
};

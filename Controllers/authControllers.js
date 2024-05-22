const User = require('../Models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  const { username, password } = req.body;

  console.log('Register request received:', { username, password });

  try {
    let user = await User.findOne({ username });

    if (user) {
      console.log('user already exists')
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      username,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    console.log('passwod encrypted')
    await user.save();

    console.log('user save method called')

    console.log('User created with ID:', user.id);

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log('Login request received:', { username, password });

  try {
    let user = await User.findOne({ username });

    if (!user) {
      console.log('user not found')
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('password incorrect')

      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

    console.log('login successful')
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


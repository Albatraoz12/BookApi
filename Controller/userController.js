const User = require('../Model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userRegistration = (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(401).json({ error: 'please fill in the feilds' });

    User.findOne({ email: email }, (err, user) => {
      if (err) console.log(err);
      if (user) {
        return res.status(400).json({ error: 'user already exist' });
      }
      const newUser = new User({
        username: username,
        email: email,
        password: password,
      });
      newUser.password = bcrypt.hashSync(newUser.password, 10);
      newUser.save().then(() => {
        res.status(201).json({
          message: 'New user has been created!',
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (req.cookies.access_token)
    return res.status(401).json({ message: 'You are already logged in' });

  const user = await User.findOne({ email });

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.SECRET
      );

      return res
        .cookie('access_token', token, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .status(200)
        .json({ message: 'Logged in successfully 😊 👌' });
    } else if (!passwordMatch) {
      res.status(400).json({ message: 'Wrong Password, try again' });
    }
  } else {
    res.status(400).json({ message: 'sorry, could not login' });
  }
};

const getUser = (req, res) => {
  return res.json({
    user: { id: req.userId, role: req.userRole },
  });
};

const userLogout = (req, res) => {
  return res
    .clearCookie('access_token', {
      sameSite: 'none',
      secure: true,
    })
    .status(200)
    .json({ message: 'Successfully logged out 😏 🍀' });
};

module.exports = { userRegistration, userLogin, getUser, userLogout };

// console.log(req.cookies.access_token);
// if (req.cookies.access_token)
//   return res.status(401).json({ message: 'You are already logged in' });
// if (user) {
//   const token = jwt.sign(
//     { id: user._id, username: user.username, role: user.role },
//     'ZDdIbFVmaT1uImX1mRxA9Mt4NTT6BA6Z'
//   );

//   return res
//     .cookie('access_token', token, {
//       httpOnly: true,
//       sameSite: 'none',
//       secure: true,
//     })
//     .status(200)
//     .json({ message: 'Logged in successfully 😊 👌' });
// } else {
//   res.json({ message: 'sorry could not login' });
// }

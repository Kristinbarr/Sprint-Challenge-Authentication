const router = require('express').Router()
const bcrypt = require('bcryptjs')
const generateToken = require('./token-middleware')
const Users = require('../users/users-model')

router.post('/register', (req, res) => {
  let user = req.body // get user sent in request
  const hash = bcrypt.hashSync(user.password, 10) // hash the password
  user.password = hash // set hased password as the password

  // add the new user to database
  Users.add(user)
    .then((saved) => {
      res.status(201).json(saved) // send back the saved user
    })
    .catch((err) => {
      res.status(500).json({ message: 'cannot add the user', err })
    })
})

router.post('/login', (req, res) => {
  let { username, password } = req.body // capture username, pass from request

  Users.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user)
        res.status(200).json({
          message: `Welcome ${user.username}`,
          token
        })
      } else {
        res.status(401).json({ message: 'Invalid credentials' })
      }
    })
    .catch((err) => {
      res.status(500).json(err)
    })
})

module.exports = router

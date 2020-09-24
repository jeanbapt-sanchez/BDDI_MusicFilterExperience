const express = require('express')
const router = express.Router()

/* GET experience page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Music Filter Experience' })
})

module.exports = router

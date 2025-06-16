const express = require('express');
const router = express.Router();

 
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/auth', (req, res) => {
    res.render("auth");
});

router.get('/register', (req, res) => {
    res.render("register");
});

router.get('/menu', (req, res) => {
    res.render("menu");
});

module.exports = router;
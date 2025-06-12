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

router.get('/home_logged_in', (req, res) => {
    res.render("index_logged_in");
});

router.get('/reservations', (req, res) => {
    res.render("reservations");
});

router.get('/orders', (req, res) => {
    res.render("orders");
});
module.exports = router;

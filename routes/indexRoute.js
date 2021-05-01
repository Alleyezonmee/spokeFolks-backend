const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Welcome to Spoke Folks');
})

module.exports = router;
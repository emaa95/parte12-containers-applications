const express = require('express');
const redis = require('../redis');
const router = express.Router();

const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

// Route to get the todo counter
router.get('/statistics', async (_, res) => {
  const added_todos = (await redis.getAsync("added_todos")) === null ? 0 : await redis.getAsync("added_todos");

	res.send({
		added_todos: Number(added_todos),
	});
});

module.exports = router;

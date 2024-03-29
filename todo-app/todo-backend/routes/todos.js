const express = require('express');
const { Todo } = require('../mongo')
const redis = require('../redis/index');
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  // Increment the counter

  const current_added = await redis.getAsync("added_todos");
	redis.setAsync("added_todos", current_added ? Number(current_added) + 1 : 1);
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo); // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  if (!req.body.text || typeof req.body.done !== 'boolean') {
    return res.sendStatus(400);
  }
  req.todo.text = req.body.text;
  req.todo.done = req.body.done;

  const updatedTodo = await req.todo.save();

  res.send(updatedTodo); // Implement this
});

/* GET todo statistics from redis */
router.get('statistics', async(_,res) => {
  const currentCounter = await getAsync('todoCounter') || 0;

  res.json({"added_todos": currentCounter});
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;

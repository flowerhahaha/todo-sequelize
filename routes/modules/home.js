const router = require('express').Router()
const { Todo, User } = require('../../models')

// router: get homepage
router.get('/', async (req, res, next) => {
  try {
    const UserId = req.user.id
    const user = await User.findByPk(UserId)
    if (!user) {
      const errMessage = 'User not found. Please register first!'
      return res.status(200).render('error', { errMessage })
    }
    const todos = await Todo.findAll({
      raw: true,
      nest: true,
      where: { UserId }
    })
    return res.render('index', { todos })
  } catch (e) {
    next(e)
  }
})

module.exports = router
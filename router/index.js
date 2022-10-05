const Router = require('express').Router
const controller = require('../controller/user-controller')
const router = new Router()
const { check } = require('express-validator')
const { dataAccess } = require('../middleware/authmiddlewares')

router.post('/register',
    check('email', 'Вибачте, але ім\'я користувача має мати довжину від 6 до 30 символів.').isLength({ min: 6, max: 30 }),
    check('email', 'Введіть правильно поштову скриньку.').isEmail(),
    check('password', 'Виберіть надійніший пароль. Спробуйте комбінацію великих і малих літер, цифр, а також мати довжину не менше 8 символів.').isStrongPassword({ minLength: 8, minNumbers: 1, minSymbols: 0, minUppercase: 1, minLowercase: 1 }).custom(
        async (password, { req }) => {
            const confirm = req.body.confirm
            if (password !== confirm) {
                throw new Error('Ці паролі не збігаються. Повторіть спробу.')
            }
        }
    ),
    check('role', 'Відсутні права доступу користувача.').notEmpty()
    , controller.registration)
router.post('/login', controller.login)
router.post('/logout', controller.logout)
router.get('/users', dataAccess(["admin"]), controller.getUsers)

module.exports = router



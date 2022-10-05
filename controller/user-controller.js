const { validationResult } = require('express-validator')
const userService = require('../service/userService')
const DatabaseUserService = require('../service/databaseService')
const ApiError = require('../Error')

class authController {

    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Помилка при валідації введених даних', errors.array()))
            }
            const { email, password, role } = req.body
            await userService.registration(email, password, role, '192.168.33.126');
            req.session.user = {
                email,
                roles: role.split(',')
            }
            return res.json({ message: 'Користувач успішно зареєстрований!' })
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await userService.login(email, password)
            req.session.user = {
                email: userData.email,
                createdAt: Date.now()
            }
            return res.json({ role: userData.roles })
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            req.session.destroy(function (err) {

                if (err) {
                    console.error("--> session destroy failed.err -> ", err);
                }
                console.log('Destroyed session')
                res.clearCookie(process.env.SESSION_NAME);
                return res.json({ message: 'Ви успішно вийшли.' })
            })
        } catch (e) {
            next(e)
        }
    }


    async getUsers(req, res, next) {
        try {
            const getUsers = await DatabaseUserService.findAllUser()
            if (getUsers.length === 0) {
                throw ApiError.BadRequest('Таблиця з користувачами порожня.')
            }
            return res.status(200).json({ getUsers })

        } catch (e) {
            next(e)
        }
    }

}

module.exports = new authController()
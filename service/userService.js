const DatabaseUserService = require('../service/databaseService')
const bcrypt = require('bcryptjs')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../Error/index')

class UserService {

    async registration(email, password, role, ip) {

        const candidate = await DatabaseUserService.findOneUser({ email })
        if (candidate.length === 1) {
            throw ApiError.BadRequest('Це ім\'я користувача вже комусь належить. Спробуйте інше.')
        }

        const roleData = await DatabaseUserService.roleUser()
        if (!roleData) {
            throw ApiError.BadRequest('Помилка завантаження списку рівнів доступу.')
        }

        const result = role.split(',').filter(element => {
            return !roleData.some(obj => obj.name.trim() === element)
        })
        if (result.length !== 0) {
            throw ApiError.BadRequest(`Рівень доступу ${result.join(',')} не знайдено.`)
        }

        const hashPass = await bcrypt.hash(password, 8)
        await DatabaseUserService.createUser({
            email,
            'pass_word': hashPass,
            'role_user': role.split(','),
            'ip': ip
        })
    }

    async login(email, password) {
        const user = await DatabaseUserService.findOneUser({ email })
        if (user.length === 0) {
            throw ApiError.BadRequest('Не вдалося знайти ваш обліковий запис.')
        }
        const isPasswordEquals = await bcrypt.compare(password, user[0]['pass_word'])
        if (!isPasswordEquals) {
            throw ApiError.BadRequest('Неправильний пароль. Повторіть спробу.')
        }
        return new UserDto(user[0])
    }

    async logout() {

    }

}

module.exports = new UserService()
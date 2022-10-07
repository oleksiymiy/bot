const DatabaseUserService = require('../service/databaseService')
const dataAccess = (roles) => {

    return async (req, res, next) => {

        try {
            if (!req.session.user) {
                return res.status(403).json({ message: 'Доступ заборонений.' })
            }
            console.log(req.session.user)
            const userRoles = await DatabaseUserService.findOneUser({ 'email': req.session.user.email })
            let haseRole = false;
            userRoles[0]['role_user'].forEach(element => {
                if (roles.includes(element)) {
                    haseRole = true;
                }
            })

            if (!haseRole) {
                return res.status(403).json({ message: 'Доступ заборонений.' })
            }
            next()

        } catch (e) {
            next(e)
        }

    }

}


module.exports = {
    dataAccess,
}
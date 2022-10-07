 class UserDto {
    constructor(user) {
        this.email = user.email
        this.roles = user.role_user
    }
 }

module.exports = UserDto;
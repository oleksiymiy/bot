const { knex } = require('../db_config/postgres')

class DatabaseUserService {

    async createUser(data = {}) {
        return await knex.withSchema('backend').from('users').insert(data)
    }

    async updateUser(id_user, data = {}) {
        return await knex.withSchema('backend').from('users').where({ 'u_id': id_user }).update(data).returning('u_id')
    }

    async deleteUser(id_user) {
        return await knex.withSchema('backend').from('users').where({ 'u_id': id_user }).del()
    }

    async bannedUser(email = {}) {
        return await knex.withSchema('backend').select('*').from('users').where(email).update({ 'block': true }).returning('u_id')
    }

    async unBannedUser(email = {}) {
        return await knex.withSchema('backend').from('users').where(email).update({ 'block': false }).returning('u_id')
    }

    async roleUser() {
        return await knex.withSchema('backend').select('*').from('role')
    }

    async updateRole() {

    }

    async deleteRole() {

    }

    async findOneUser(filter = {}) {
        return await knex.withSchema('backend').select('*').from('users').where(filter)
    }

    async findAllUser() {
        //доробити pagination
        return await knex.withSchema('backend').select('*').from('users')
    }

}

module.exports = new DatabaseUserService()
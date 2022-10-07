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

    async findAllUser(page, size) {
        const { limit, offset } = getPagination(page, size)
        return await knex.raw(`select json_agg(rw) as data,
        max(cnt) as count
        from (
        select to_jsonb(telegram.account.*) as rw,
        count(*) over () as cnt from telegram.account
        order by acc_id asc
         limit ${limit} offset ${offset})q`).then((result) => {
            return {
                total: result.rows[0].count,
                data: result.rows[0].data,
                totalPages: Math.ceil(result.rows[0].count / limit),
                currentPage: page ? +page : 0
            }
        })
        //доробити pagination
        //return await knex.withSchema('backend').select('*').from('users')
    }

}

const getPagination = (page, size) => {
    const limit = size ? size : 10;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

module.exports = new DatabaseUserService()
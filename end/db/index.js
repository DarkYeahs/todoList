const mysql = require('mysql')
const config = require('../config/db')


class DBHandle {
    constructor(config) {
        this.pool = null

        this.init(config)
    }

    init(config) {
        this.pool  = mysql.createPool(config)
    }

    query(sql) {
        const promise = new Promise((resolve, reject) => {
            this.pool.getConnection(function(err, connection) {
                if (err) {
                    reject(err)
                    return
                }
                console.log(sql)
                connection.query(sql, function (error, results, fields) {
                    // const res = []

                    connection.release();
                
                    if (error) {
                        reject(error)
                        return
                    }

                    // for (let i = 0; i < results.length; i++) {
                    //     const item = results[i]
                    //     const keys = Object.keys(item)
                    //     console.log(keys)
                    // }

                
                    resolve(results)
                })
            })
        })

        return promise
    }

    async select(tableName, fields = '*', condition = '') {
        if (typeof fields !== 'string') fields = fields.join(',')

        let sql = `select ${fields} from ${tableName}`

        if (condition !== '') sql = `${sql} where ${condition}`

        const res = await this.query(sql)

        return res
    }

    async insert(tableName, data) {
        let values = Object.values(data).join('","')
        let keys = Object.keys(data).join(',')

        values = `"${values}"`

        const sql = `INSERT INTO ${tableName} (${keys}) VALUES (${values})`

        const res = await this.query(sql)

        return res
    }

    async modify(tableName, data, conditions, ) {
        let value = []
        let condition = []

        for (let key in data) {
            value.push(`${key}='${data[key]}'`)
        }

        for (let key in conditions) {
            condition.push(`${key}='${conditions[key]}'`)
        }

        value = value.join(',')
        condition = condition.join(' AND ')
        
        const sql = `UPDATE ${tableName} SET ${value} where ${condition}`

        const res = await this.query(sql)

        return res
    }
}

module.exports = new DBHandle(config)
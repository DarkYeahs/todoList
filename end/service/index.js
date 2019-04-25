const DB = require('../db')

class Service {
    constructor(DB) {
        this.db = DB
    }

    async query() {
        const timeStamp = new Date().setHours(0, 0, 0, 0)
        const deadline = timeStamp + 86400000
        const condition = `deadline <= ${deadline} AND deadline >= ${timeStamp}`
        const res = await this.db.select('to_do_list', '*', condition)
        
        return res
            
    }

    async insert(content, deadline, update_time) {
        const data = {
            content,
            deadline,
            update_time
        }
        
        const res = await this.db.insert('to_do_list', data)
        
        return res
    }

    async modify(data, condition) {
        const res = await this.db.modify('to_do_list', data, condition)
        
        return res
    }
}

const service = new Service(DB)

module.exports = service

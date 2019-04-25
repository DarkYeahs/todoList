import axios from 'axios'
import qs from 'qs';
import * as config from './config.js'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

class Service {
    constructor() {
        this.baseUrl = 'http://localhost:4000'
        this.init(this.baseUrl)
    }

    init(baseUrl) {
        this.instance = axios.create({
            baseURL: baseUrl,
            timeout: 5000,
        })

        // this.instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    }

    
    getList() {
        return this._get(config.GET_LIST_URL)
    }

    modify(data) {
        return this._post(config.MODIFY_LIST_URL, data)
    }

    add(data) {
        return this._post(config.ADD_LIST_URL, data)
    }

    _get(url, data, options = {}) {
        const promise = new Promise((resolve, reject) => {
            this.instance
                .get(url, {
                    params: data,
                    ...options,
                }).then(res => {
                    resolve(res.data)
                })
                .catch(e => {
                    reject(e)
                })
        })

        return promise
    }

    _post(url, data, options = {}) {
        let promise = new Promise((resolve, reject) => {
            // console.log(data)
            this.instance
                .post(url, qs.stringify(data), {
                    ...options,
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(res => {
                    resolve(res.data)
                })
                .catch(e => {
                    reject(e)
                })
        })
        return promise
    }
}

export default new Service()
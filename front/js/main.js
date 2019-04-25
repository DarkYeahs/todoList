import Vue from 'vue'
import store from '@store'
import App from '@components/app.vue'

import '@styles/main.scss'

Vue.filter('dateformate', function (val, format) {
    if (typeof val === 'number') val = new Date(val)
    const o = {
        "M+" : val.getMonth()+1, //month
        "d+" : val.getDate(), //day
        "h+" : val.getHours(), //hour
        "m+" : val.getMinutes(), //minute
        "s+" : val.getSeconds(), //second
        "q+" : Math.floor((val.getMonth()+3)/3), //quarter
        "S" : val.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(
                    RegExp.$1,
                    (val.getFullYear()+"").substr(4- RegExp.$1.length)
                )
    }

    for(var k in o){
        if(new RegExp("("+ k +")").test(format)){
            format = format.replace(RegExp.$1,RegExp.$1.length==1? o[k] : ("00"+ o[k]).substr((""+ o[k]).length))
        }
    }

    return format

})

new Vue({
    template: '<App />',
    store,
    components: {
        App
    }
}).$mount('#app');
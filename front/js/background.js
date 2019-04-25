import service from '@service'
import icon from '@images/icon.png'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    switch(message.type) {
        case 'getList':
            console.log('getList')
            service.getList()
                .then(data => {
                    sendResponse(data)
                    checkNotification(data.data, data.time)
                })
                .catch(e => {
                    sendResponse(e)
                })
            break;
        case 'modify':
            console.log('getList')
            clearNotification(message.data && message.data.list_id)
            service.modify(message.data)
                .then(data => {
                    sendResponse(data)
                })
                .catch(e => {
                    sendResponse(e)
                })
            break;

        case 'add':
            console.log('add')
            service.add(message.data)
                .then(data => {
                    sendResponse(data)
                })
                .catch(e => {
                    sendResponse(e)
                })
            break;
    }
    

    return true
});

function notification(content) {
    const opt = {
        type: 'basic',
        title: '通知',
        message: content,
        iconUrl: icon,
    }
    chrome.notifications.create('', opt, function(id){
        // setTimeout(function(){
        // chrome.notifications.clear(id, function(){});
        // }, 3000);
    });
}
let timeoutFlag = []
let timeoutFlagID = []
function startNotification(list, time) {
    const len = list.length

    for (let i = 0; i < len; i++) {
        let item = list[i]
        if (item.deadline <= time) continue
        let remian = item.deadline - time

        let flag = setTimeout(() => {
            notification(item.content)
            service.modify({list_id: item.list_id, status: 2})
        }, remian)

        timeoutFlag.push({
            id: item.list_id,
            flag: flag
        })

        timeoutFlagID.push(item.list_id)
    }
}

function clearNotification(id) {
    const len = timeoutFlag.length

    if (len === 0) return

    for (let i = 0; i < len; i++) {
        let item = timeoutFlag[i]
        if (item.id === id) {
            clearTimeout(item.flag)
            timeoutFlag.splice(i, 1)
            timeoutFlagID.splice(i, 1)
        }
    }
}

function getData() {
    service.getList()
        .then(({data, time}) => {
            startNotification(data, time)
        })
        .catch(e => {
            // sendResponse(e)
        })
}

function checkNotification(list, time) {
    let len = list.length

    if (len === 0) return

    for (let i = 0; i < len; i++) {
        let item = list[i]
        let remian = item.deadline - time
        if (timeoutFlagID.indexOf(item.list_id) === -1 && remian > 0) {
            let flag = setTimeout(() => {
                notification(item.content)
                service.modify({list_id: item.list_id, status: 2})
            }, remian)
    
            timeoutFlag.push({
                id: item.list_id,
                flag: flag
            })
    
            timeoutFlagID.push(item.list_id)
        }
    }
}


getData()

// notification()
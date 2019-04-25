<template>
    <div class="content">
        <div class="header">个人任务列表</div>
        <table>
            <thead>
                <tr>
                    <th class="sort">序号</th>
                    <th class="item-content">任务内容</th>
                    <th class="deadline">期限</th>
                    <th class="status">状态</th>
                    <th class="handle">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(item, index) in list"
                    :key="index"
                    :class="{
                        complete: item.status === 1,
                        expire: item.status === 2,
                    }">
                    <td class="sort">{{index + 1}}</td>
                    <td class="item-content">{{item.content}}</td>
                    <td class="deadline">{{item.deadline | dateformate('yyyy-MM-dd hh:mm')}}</td>
                    <td class="status">{{item.status | changeStatus}}</td>
                    <td class="handle">
                        <template v-if="item.status === 0">
                            <a href="javascript:;"
                                @click.stop="changeStatus(item)">完成</a>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
        <a href="javascript:;"
            class="add"
            @click.stop="toggleDialogVisible">+</a>
        <div class="dialog"
            v-if="isDialogVisible">
            <div class="input-item">
                <span>内容</span>
                <input type="text"
                    v-model="content" />
            </div>
            <div class="input-item">
                <span>期限</span>
                <input type="text"
                    v-model="deadline" />
            </div>
            <div class="dialog-handle">
                <a href="javascript:;"
                    @click.stop="cancel">取消</a>
                <a href="javascript:;"
                    class="confirm"
                    @click.stop="confirm">确认</a>
            </div>
        </div>
    </div>
</template>

<script>
import service from '@service'
import icon from '@images/icon.png'
export default {

    data() {
        return {
            list: [],
            isRequest: false,
            isDialogVisible: false,
            content: '',
            deadline: '',
        }
    },

    created () {
        this.getList()
        // this.notification()
    },

    filters: {
        changeStatus(type) {
            const list = ['未完成', '已完成', '已过期']

            return list[type] || '未完成'
        }
    },

    methods: {
        getList () {
            chrome.runtime.sendMessage({
                    type: 'getList'
                }, ({code, data}) => {
                    //这里可以利用同样的window.postMessage()将消息传回网页
                    if (code !== 0) return

                    this.list = data.sort((a, b) => {
                        const remain = Math.abs(b.status - 1) - Math.abs(a.status - 1)

                        if (remain === 0) return a.status - b.status
                        return remain
                    })
                    return true
                })
        },

        changeStatus(item) {
            if(this.isRequest) return
            this.isRequest = true
            chrome.runtime.sendMessage({
                    type: 'modify',
                    data: {
                        status: 1,
                        list_id: item.list_id
                    }
                }, ({code, data}) => {
                    this.isRequest = false
                    //这里可以利用同样的window.postMessage()将消息传回网页
                    if (code !== 0) return

                    let list = this.list

                    list = list.map(tmp => {
                        if (tmp.list_id === item.list_id) tmp.status = 1

                        return tmp
                    })

                    return true
                })
        },

        confirm() {
            if(this.isRequest) return
            this.isRequest = true
            chrome.runtime.sendMessage({
                    type: 'add',
                    data: {
                        content: this.content,
                        deadline: this.deadline
                    }
                }, ({code, data}) => {
                    this.isRequest = false
                    //这里可以利用同样的window.postMessage()将消息传回网页
                    if (code !== 0) return
                    this.isDialogVisible = false
                    this.content = ''
                    this.deadline = ''
                    location.reload()
                })
        },

        cancel() {
            this.isDialogVisible = false
            this.content = ''
            this.deadline = ''
        },

        toggleDialogVisible() {
            this.isDialogVisible = !this.isDialogVisible
            this.content = ''
            this.deadline = ''
        },

        notification() {
            var opt = {
                type: 'basic',
                title: '通知的title!',
                message: '测试通知的内容',
                iconUrl: icon,
            }
            chrome.notifications.create('', opt, function(id){
                // setTimeout(function(){
                // chrome.notifications.clear(id, function(){});
                // }, 3000);
            });
        }
    }
}
</script>

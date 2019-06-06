<template>
    <div class="wall">
        <div class="player" style="display: none">
            <audio id="player0" src="http://leenwong.cn/get/voice/1.wav"></audio>
            <audio id="player1" src="http://leenwong.cn/get/voice/2.wav"></audio>
            <audio id="player2" src="http://leenwong.cn/get/voice/3.wav"></audio>
            <audio id="player3" src="http://leenwong.cn/get/voice/4.wav"></audio>
            <audio id="player4" src="http://leenwong.cn/get/voice/5.wav"></audio>
            <audio id="player5" src="http://leenwong.cn/get/voice/6.wav"></audio>
        </div>
        <div class="bar"></div>
        <div class="timer">
            <span class="number">{{result.days}}</span>
            &nbsp;<div class="day">☀️</div>&nbsp;
            <span class="number">{{result.hours}}</span>
            :
            <span class="number">{{result.minutes}}</span>
            :
            <span class="number">{{result.seconds}}</span>
        </div>
        <div class="center"></div>
        <img @click="showPostDialog" class="avatar" src="../assets/avatar.jpg">
    </div>
</template>

<script>
    export default {
        name: "Wall",
        data() {
            return {
                messageList: [],
                postTags: '',
                postTag: '🥟',
                startDate: '2019/3/13 15:27:10',
                result: {days: 0, hours: 0, minutes: 0, seconds: 0},
                weather: ['☀', '🌤', '☔', '🌨', '🌩'],
                tag: '🥟',
                linked: false,
                showQR: false,
            }
        },
        mounted() {
            /**
             * 获取消息列表
             */
            this.getMessageList().then(() => this.showBarrage());

            setInterval(() => {
                let date1 = new Date(this.startDate);  //开始时间
                let date2 = new Date();    //结束时间
                let date3 = date2.getTime() - date1.getTime(); //时间差的毫秒数
                //计算出相差天数
                let days = Math.floor(date3 / (24 * 3600 * 1000));
                //计算出小时数
                let leave1 = date3 % (24 * 3600 * 1000);  //计算天数后剩余的毫秒数
                let hours = Math.floor(leave1 / (3600 * 1000));
                //计算相差分钟数
                let leave2 = leave1 % (3600 * 1000);     //计算小时数后剩余的毫秒数
                let minutes = Math.floor(leave2 / (60 * 1000));
                //计算相差秒数
                let leave3 = leave2 % (60 * 1000);     //计算分钟数后剩余的毫秒数
                let seconds = Math.round(leave3 / 1000);
                this.result = {
                    days: days,
                    hours: hours,
                    minutes: minutes,
                    seconds: seconds,
                };
                this.tag = this.weather[Math.ceil(Math.random() * 4)];
                this.linked = !this.linked;
                let HTMLTitle = days + ' ☀️ ' + hours + ':' + minutes + ':' + seconds;
                document.getElementsByTagName("title")[0].innerText = HTMLTitle;
                document.title = HTMLTitle;
            }, 1000);
            let tags = '🐶^🐱^🐭^🐹^🐰^🦊^🐻^🐼^🐨^🐯^🦁^🐮^🐷^🐸^🐵^🐔^🐧^🐦^🐤^🦆^🦅^🦉^🦇^🐺^🐗^🐴^🦄^🐝^🐛^🦋^🐌^🐞^🐜^🦟^🦗^🕷^🦂^🐢^🐍^🦎^🦖^🦕^🐙^🦑^🦐^🦞^🦀^🐡^🐠^🐟^🐬^🐳^🐋^🦈^🐊^🐅^🐆^🦓^🦍^🐘^🦛^🦏^🐪^🐫^🦒^🦘^🐃^🐂^🐄^🐎^🐖^🐏^🐑^🦙^🐐^🦌^🐕^🐩^🐈^🐓^🦃^🦚^🦜^🦢^🕊^🐇^🦝^🦡^🐁^🐀^🐿^🦔^🐲^🦧^🦮^🦥^🦦^🦨^🦩';
            this.postTags = tags.split('^');
        },
        methods: {
            getMessageList() {
                return new Promise(
                    (resolve, reject) => {
                        let xhr = new XMLHttpRequest();
                        xhr.open('get', `${this.$util.getServerUrl()}data/api/data/messageList`, true);
                        xhr.send();
                        xhr.onload = () => {
                            switch (xhr.status) {
                                case 200:
                                    let data = JSON.parse(xhr.response);
                                    this.messageList = data;
                                    (data && data.length > 0) ? resolve() : reject();
                                    break;
                            }
                        };
                    }
                );
            },

            showPostDialog() {
                let random = this.$util.getRandom(this.postTags.length - 1);
                this.postTag = this.postTags[random];
                let value = prompt(this.postTag);
                if (value) {
                    if (value.length <= 15) {
                        value = value.trim();
                        let xhr = new XMLHttpRequest();
                        xhr.open('post', `${this.$util.getServerUrl()}data/api/data/message`, true);
                        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                        xhr.send(JSON.stringify({mac: this.postTag, value: value}));
                        xhr.onload = () => {
                            switch (xhr.status) {
                                case 200:
                                    if (xhr.response) {
                                        let center = document.getElementsByClassName('center')[0];
                                        let barrage = this.buildBarrage(
                                            center.clientWidth, center.clientHeight,
                                            this.postTag, value
                                        );
                                        center.append(barrage);
                                        this.launchBarrage(barrage).then(
                                            () => center.removeChild(barrage)
                                        );
                                    }
                                    break;
                            }
                        };
                    } else {
                        alert('好长啊');
                    }
                }
            },

            /**
             * 显示弹幕
             */
            showBarrage() {
                let center = document.getElementsByClassName('center')[0];
                let sort = new Promise(
                    resolve => {
                        this.messageList.sort(() => Math.random() > .5 ? -1 : 1);
                        resolve();
                    }
                );
                sort.then(
                    () => {
                        this.messageList.forEach(
                            (item, index) => {
                                setTimeout(
                                    () => {
                                        let barrage = this.buildBarrage(center.clientWidth, center.clientHeight, item.mac, item.value);
                                        center.append(barrage);
                                        this.launchBarrage(barrage).then(
                                            () => center.removeChild(barrage)
                                        );
                                    },
                                    1000 * index
                                );
                            }
                        );
                    }
                );
            },

            /**
             * 构建弹幕
             * @param clientWidth 容器宽度
             * @param clientHeight 容器高度
             * @param tag 标签
             * @param message 信息
             * @returns {HTMLElement} 弹幕体
             */
            buildBarrage(clientWidth, clientHeight, tag, message) {
                let el = document.createElement('span');
                el.innerHTML = '&nbsp;' + tag + ':' + message + '&nbsp;';
                el.style.position = 'absolute';
                el.style.left = clientWidth + 'px';
                el.style.top = this.$util.getRandom(clientHeight - 30) + 'px';
                el.style.whiteSpace = 'nowrap';
                el.style.borderRadius = '14px 4px 4px 14px';
                el.style.background = 'linear-gradient(-5deg, #FED6E3 0%, #A8EDEA 100%)';
                el.addEventListener('click', $event => {
                    document.getElementById('player' + this.$util.getRandom(5)).play();
                    $event.target.style.animation = 'shake 0.5s';
                });
                el.addEventListener('animationend', $event => $event.target.style.animation = '');
                return el;
            },

            /**
             * 发射弹幕
             * @param item 弹幕体
             * @returns {Promise<any>} 显示结束回调
             */
            launchBarrage: (item) => {
                return new Promise(
                    (resolve) => {
                        let int = setInterval(
                            () => {
                                item.style.left = ((item.offsetLeft - 1) + 'px');
                                if (item.offsetLeft < -item.clientWidth) {
                                    window.clearInterval(int);
                                    resolve();
                                }
                            },
                            20
                        );
                    }
                );
            }
        },
    }
</script>

<style lang="scss" scoped>
    .wall {
        height: 100%;
        overflow: auto;
        background-image: linear-gradient(to top, #30cfd0 0%, #330867 100%);
        background-size: 2400% 1400%;
        animation: bg-move 16s ease infinite alternate;
        -webkit-animation: bg-move 16s ease infinite alternate;
        -moz-animation: bg-move 16s ease infinite alternate;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        letter-spacing: 1px;

        > .bar {
            height: 0.4em;
            width: 100%;
            background-color: #EDEDED;
            box-shadow: 0 0 6px #333333;
            border-radius: 0 0 0.4em 0.4em;
        }

        .timer {
            margin: 0;
            padding: 0;
            width: 100%;
            /*display: flex;*/
            display: none;
            align-items: center;
            justify-content: center;
            background-color: #EDEDED;
            box-shadow: 0 0 6px #333333;
            border-radius: 0 0 0.4em 0.4em;
            font-weight: lighter;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

            .number {
                font-weight: normal;
                font-size: 1em;
                color: black;
            }

            .day {
                margin: 0;
                padding: 0;
                animation: rotate .8s linear infinite;
                -webkit-animation: rotate .8s linear infinite;
            }
        }

        .center {
            flex: 1;
            width: 100%;
            position: relative;
            overflow: hidden;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
            color: #999999;
            font-size: 1.1em;
        }

        .avatar {
            box-shadow: 0 0 6px #333333;
            border-radius: 45% 45% 2px 2px;
            height: 5em;
            width: 5em;
        }
    }
</style>

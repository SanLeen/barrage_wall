<template>
    <div class="wall">
        <div class="player" style="display: none">
            <audio id="player0" src="https://leenwong.cn/get/voice/1.wav"></audio>
            <audio id="player1" src="https://leenwong.cn/get/voice/2.wav"></audio>
            <audio id="player2" src="https://leenwong.cn/get/voice/3.wav"></audio>
            <audio id="player3" src="https://leenwong.cn/get/voice/4.wav"></audio>
            <audio id="player4" src="https://leenwong.cn/get/voice/5.wav"></audio>
            <audio id="player5" src="https://leenwong.cn/get/voice/6.wav"></audio>
        </div>
        <div class="bar"></div>
        <div class="center"></div>
        <img @click="showPostDialog" class="avatar" src="../assets/avatar.jpg">
    </div>
</template>

<script>
    import Avatar from "../utils/Avatar";
    import DataInterface from "../utils/DataInterface";
    import Loop from "../utils/Loop";
    import Ring from "../utils/Ring";

    export default {
        name: "Wall",
        data() {
            return {
                messageList: [],
                loop: new Loop(),
                titleRing: new Ring(['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']),
            }
        },
        mounted() {
            this.initialize();
        },
        beforeDestroy() {
            this.titleRing.destroy();
        },
        methods: {
            initialize() {
                DataInterface.getMessages().then(
                    data => {
                        this.messageList = data;
                        (data && data.length > 0) ? this.showBarrage() : null;
                    }
                );

                this.loop.run(
                    () => {
                        let title = this.titleRing.source.value;
                        document.getElementsByTagName("title")[0].innerText = title;
                        document.title = title;
                        this.titleRing.next();
                    }
                );
            },

            showPostDialog() {
                let postTag = Avatar.getRandomAvatar();
                let value = prompt(postTag);
                if (value) {
                    if (value.length <= 15) {
                        value = value.trim();
                        DataInterface.putMessage(
                            JSON.stringify({mac: postTag, value: value})
                        ).then(
                            () => {
                                let center = document.getElementsByClassName('center')[0];
                                let barrage = this.buildBarrage(
                                    center.clientWidth, center.clientHeight,
                                    postTag, value
                                );
                                center.append(barrage);
                                this.launchBarrage(barrage).then(() => center.removeChild(barrage));
                            }
                        );
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
                this.messageList.sort(() => Math.random() > .5 ? -1 : 1);
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
                let style = {
                    position: 'absolute',
                    left: clientWidth + 'px',
                    top: this.$util.getRandom(clientHeight - 30) + 'px',
                    whiteSpace: 'nowrap',
                    borderRadius: '14px 4px 4px 14px',
                    background: 'linear-gradient(-5deg, #FED6E3 0%, #A8EDEA 100%)',
                };
                el.innerHTML = '&nbsp;' + tag + ':' + message + '&nbsp;';
                Object.assign(el.style, style);
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

        .center {
            flex: 1;
            height: 100%;
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

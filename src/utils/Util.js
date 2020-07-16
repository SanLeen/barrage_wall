export default class Util {
    static getRandom(range) {
        return Math.round(Math.random() * range);
    }

    static getServerUrl() {
        return location.protocol + '//leenwong.cn/';
    }
}

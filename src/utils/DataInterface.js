export default class DataInterface {
    static ServerUrl = location.protocol + '//leenwong.cn/';

    static getXMLHttpRequest(method, url) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, this.ServerUrl + url, true);
        return xhr;
    }

    static getMessages() {
        let xhr = this.getXMLHttpRequest('get', 'data/api/data/messageList');
        xhr.send();
        return new Promise(
            (resolve, reject) => {
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject();
                    }
                };
            }
        );
    }

    static putMessage(data) {
        let xhr = this.getXMLHttpRequest('post', 'data/api/data/message');
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send(data);
        return new Promise(
            (resolve, reject) => {
                xhr.onload = () => {
                    if (xhr.status === 200 && xhr.response) {
                        resolve();
                    } else {
                        reject();
                    }
                };
            }
        );
    }
}

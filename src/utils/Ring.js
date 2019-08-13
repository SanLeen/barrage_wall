export default class Ring {
    source = {};

    constructor(array) {
        let handle = () => {
            let last = {};
            array.forEach(
                i => {
                    let obj = new Object({value: i});
                    if (this.source.value) {
                        last.next = obj;
                    } else {
                        this.source = obj;
                    }
                    last = obj;
                }
            );
            last.next = this.source;
        };

        if (array && array.length && array.length > 0) {
            handle();
        }
    }

    next() {
        this.source = this.source.next;
    }
}

export default class EventListener {
    #listeners = {}; // 私有字段存储监听器，确保监听器数组不会被外部直接访问

    // 触发事件
    emit(eventName, data) {
        for (let listener of this.#listeners[eventName]) {
            listener.apply(this, [this, ...data]);
        }
    }
/*
emit方法将事件发射器实例(this)作为第一个参数传递给监听器
使用展开运算符...data支持多参数传递
*/

    // 注册事件监听
    on(name, listener) {
        if (!this.#listeners[name]) {
            this.#listeners[name] = [];
        }
        this.#listeners[name].push(listener);
    }
}

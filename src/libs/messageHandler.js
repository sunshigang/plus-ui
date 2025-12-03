class MessageHandler {
  constructor() {
    if (MessageHandler.instance) {
      return MessageHandler.instance;
    }
    this.commandHandlers = new Map();
    this.init();
    MessageHandler.instance = this;
    console.log('✅ MessageHandler 单例初始化完成');
  }

  init() {
    window.addEventListener('message', (e) => {
      console.log('📩 MessageHandler 收到原始message：', e.data);
      // 核心修复：解析JSON字符串为对象（处理UE发送的带格式JSON字符串）
      let parsedData = e.data;
      if (typeof parsedData === 'string') {
        try {
          parsedData = JSON.parse(parsedData); // 解析JSON字符串为对象
        } catch (err) {
          console.warn('❌ 解析message.data失败（非JSON字符串）：', err);
          return;
        }
      }

      // 从解析后的对象中解构Command和Args
      const { Command, Args } = parsedData || {};
      if (!Command) {
        return;
      }
      if (this.commandHandlers.has(Command)) {
        console.log(`✅ 找到${Command}的回调，执行中...`);
        this.commandHandlers.get(Command).forEach((callback) => {
          callback(Args);
        });
      } else {
        console.warn(`❌ 未找到${Command}的注册回调`);
      }
    });
  }

  onCommand(command, callback) {
    if (!command || typeof callback !== 'function') {
      console.error('Invalid command or callback for message handler.');
      return;
    }
    if (!this.commandHandlers.has(command)) {
      this.commandHandlers.set(command, []);
    }
    this.commandHandlers.get(command).push(callback);
    console.log(`✅ 成功注册${command}回调，当前回调数：`, this.commandHandlers.get(command).length);
  }

  offCommand(command, callback) {
    if (this.commandHandlers.has(command)) {
      const callbacks = this.commandHandlers.get(command).filter((cb) => cb !== callback);
      if (callbacks.length > 0) {
        this.commandHandlers.set(command, callbacks);
      } else {
        this.commandHandlers.delete(command);
      }
      console.log(`✅ 移除${command}回调后，剩余回调数：`, callbacks.length);
    }
  }

  clearAllCommands() {
    this.commandHandlers.clear();
    console.log('✅ 清空所有Command回调');
  }
}

const messageHandler = new MessageHandler();
export default messageHandler;
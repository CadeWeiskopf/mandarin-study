/** @type {MessagePort[]} */
const connections = [];
const messageQueue = [];
const previousMessages = [];
let isProcessing = false;

/** @param {MessageEvent} connectEvent */
onconnect = (connectEvent) => {
  const port = connectEvent.ports[0];
  connections.push(port);
  if (previousMessages.length > 0) {
    port.postMessage({ isInit: true, data: previousMessages });
  }

  /** @param {MessageEvent} messageEvent */
  port.onmessage = (messageEvent) => {
    console.log("worker got", messageEvent, "from", port);
    enqueue(messageEvent.data);
  };

  port.start();
};

const enqueue = (message) => {
  messageQueue.push(message);
  if (!isProcessing) {
    processMessages();
  }
};

const processMessages = () => {
  isProcessing = messageQueue.length > 0;
  if (!isProcessing) {
    return;
  }
  const message = messageQueue.shift();
  handleMessage(message).then(() => {
    processMessages();
  });
};

const handleMessage = async (message) => {
  connections.forEach((connection) => {
    connection.postMessage(message);
    previousMessages.push(message);
  });
};

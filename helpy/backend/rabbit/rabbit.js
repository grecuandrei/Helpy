const amqplib = require('amqplib');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const amqpUrl = 'amqp://rabbitmq:5672';

exports.sendMail = async (mailAddress, content) => {
    console.log("[Rabbit][INFO]: Waiting for Rabbit")
    await sleep(10000)
    console.log("[Rabbit][INFO]: Waiting for Rabbit completed")
    const connection = await amqplib.connect(amqpUrl, 'heartbeat=60');
    const channel = await connection.createChannel();
    try {
      console.log('[Rabbit][INFO]: Publishing');
      const exchange = 'gigel';
      const queue = 'task_queue';
      const routingKey = 'task_queue';
      
      await channel.assertExchange(exchange, 'direct', {durable: true});
      await channel.assertQueue(queue, {durable: true});
      await channel.bindQueue(queue, exchange, routingKey);
      
      const msg = {'mail_address': mailAddress, 'content': content};
      channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(msg)));
      console.log('[Rabbit][INFO]: Message published');
    } catch(e) {
      console.error('[Rabbit][ERROR]: Error in publishing message', e);
    } finally {
      console.info('[Rabbit][INFO]: Closing channel and connection if available');
      await channel.close();
      await connection.close();
      console.info('[Rabbit][INFO]: Channel and connection closed');
    }
};
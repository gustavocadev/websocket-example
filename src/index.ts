import { Elysia } from 'elysia';

const port = Bun.env.PORT || 8080;

new Elysia()
  .ws('/ws', {
    open: (ws) => {
      console.log('Client connected');
    },

    message: (ws, data) => {
      console.log(data);
      // ws.send('Hello from server!');
    },
  })
  .listen(port);

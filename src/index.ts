import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';

const port = Bun.env.PORT || 8080;

const todos = [
  { id: 1, text: 'Buy milk' },
  { id: 2, text: 'Buy eggs' },
  { id: 3, text: 'Buy bread' },
];

const app = new Elysia()
  .use(cors())
  .ws('/ws', {
    // open connection and send initial data
    open(ws) {
      // ws.subscribe('todos').send(todos);
      ws.subscribe('todos').send({
        type: 'todos',
        payload: todos,
      });
    },
    body: t.Object({
      type: t.String(),
      payload: t.Any(),
    }),
    // listen for messages
    message(ws, msg) {
      if (msg.type === 'createTodo') {
        const newTodo = msg.payload;
        todos.push({ ...newTodo, id: todos.length + 1 });

        // so the server re-broadcasts incoming message to everyone
        app.server!.publish(
          'todos',
          JSON.stringify({
            type: 'todos',
            payload: todos,
          })
        );
      }
    },
  })
  .listen(port);

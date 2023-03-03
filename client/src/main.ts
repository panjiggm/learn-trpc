import {
  createTRPCProxyClient,
  httpBatchLink,
  splitLink,
  wsLink,
  createWSClient,
} from '@trpc/client';
import { AppRouter } from '../../server/index';

const client = createTRPCProxyClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => {
        return op.type === 'subscription';
      },
      true: wsLink({
        client: createWSClient({
          url: 'ws://localhost:3000/trpc',
        }),
      }),
      false: httpBatchLink({
        url: 'http://localhost:3000/trpc',
      }),
    }),
  ],
});

document.addEventListener('click', () => {
  client.users.update.mutate({ userId: '2', name: 'Teteng' });
});

async function hello() {
  client.users.onUpdate.subscribe(undefined, {
    onData: (id) => {
      console.log('Updated, ', id);
    },
  });
  // const result = await client.secretData.query();

  // console.log('RESULT', result);
}

hello();

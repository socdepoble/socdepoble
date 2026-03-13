import { createServer } from 'vite';

async function serve() {
  const server = await createServer({
    configFile: '/Users/javillinares/Documents/Antigravity/Sóc de Poble/vite.config.js',
    server: { port: 3006 },
  });
  await server.listen();
  console.log('Listening on 3006...');
}

serve().catch(console.error);

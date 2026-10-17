import serverless from 'serverless-http';
import app from '../../api-app';

// Wraps the same Express app used locally so every /api/* route behaves identically on Netlify.
const run = serverless(app);

export const handler = async (event: any, context: any) => {
  // Normalise the path so Express always sees /api/...
  let p: string = event.path || '/';
  p = p.replace(/^\/\.netlify\/functions\/api/, '');
  if (!p.startsWith('/api')) p = '/api' + (p.startsWith('/') ? p : '/' + p);
  event.path = p;
  return run(event, context);
};

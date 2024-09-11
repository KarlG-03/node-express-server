import { connect, disconnect } from './config/db';

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await disconnect();
});

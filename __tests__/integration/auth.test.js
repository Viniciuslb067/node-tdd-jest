const request = require('supertest');

const { User } = require('../../src/app/models');
const app = require('../../src/app');
const truncate = require('../utils/truncate');

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should authenticate with valid credentials', async () => {
    const user = await User.create({
      name: 'Vinicius',
      email: 'vinicius@gmail.com',
      password: 'password',
    });

    const response = await request(app).post('/login').send({
      email: user.email,
      password: 'password',
    });

    expect(response.status).toBe(200);
  });

  it('Should not authenticate with invalid credentials', async () => {
    const user = await User.create({
      name: 'Vinicius',
      email: 'vinicius@gmail.com',
      password: 'password',
    });

    const response = await request(app).post('/login').send({
      email: user.email,
      password: '123',
    });

    expect(response.status).toBe(401);
  });

  it('Should return jwt token when authenticated', async () => {
    const user = await User.create({
      name: 'Vinicius',
      email: 'vinicius@gmail.com',
      password: 'password',
    });

    const response = await request(app).post('/login').send({
      email: user.email,
      password: 'password',
    });

    expect(response.body).toHaveProperty('token');
  });

  it('Should be able to access protected routes when authenticated', async () => {
    const user = await User.create({
      name: 'Vinicius',
      email: 'vinicius@gmail.com',
      password: 'password',
    });

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('Should not be able to access protected routes without jwt token', async () => {
    const response = await request(app).get('/dashboard');

    expect(response.status).toBe(401);
  });

  it('Should be able to access protected routes with a invalid jwt token', async () => {
    const response = await request(app).get('/dashboard').set('Authorization', `Bearer 123123`);

    expect(response.status).toBe(401);
  });
});

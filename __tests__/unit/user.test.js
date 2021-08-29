const bcrypt = require('bcryptjs');
const { User } = require('../../src/app/models');

const truncate = require('../utils/truncate');

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Should encrypt user password', async () => {
    const user = await User.create({
      name: 'Vinicius',
      email: 'vinicius@gmail.com',
      password: 'password',
    });

    const compareHash = await bcrypt.compare('password', user.password);

    expect(compareHash).toBe(true);
  });
});

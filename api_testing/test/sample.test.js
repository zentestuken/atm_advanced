import { expect  } from 'chai';
import { registerUser } from '../support/api-methods.js';

const testUserData = {
  email: 'yauhen@mymail4.com',
  password: 'Yauhen12345',
  username: 'yauhen4'
};

describe('RealWorld tests', function () {
  it('should register a new user', async function () {
    const response = await registerUser(...Object.values(testUserData));
    expect(response.status).to.equal(200);
    expect(response.body.user).to.have.property('email', testUserData.email);
    expect(response.body.user).to.have.property('username', testUserData.username);
    expect(response.body.user).to.have.property('token').that.is.a('string');

    expect(process.env.TOKEN).to.equal(response.body.user.token);
  })
});
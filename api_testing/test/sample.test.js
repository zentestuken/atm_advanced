import { expect  } from 'chai';
import axios from 'axios';
import { registerUser } from '../support/api-methods.js';

const testUserData = {
  email: 'yauhen@mymail2.com',
  password: 'Yauhen12345',
  username: 'yauhen2'
};

describe('RealWorld tests', function () {
  it('should register a new user', async function () {
    const response = await registerUser(...Object.values(testUserData));
    expect(response.status).to.equal(200);
    expect(response.body.user).to.have.property('email', testUserData.email);
    expect(response.body.user).to.have.property('username', testUserData.username);
    expect(response.body.user).to.have.property('token').that.is.a('string');
  })
});
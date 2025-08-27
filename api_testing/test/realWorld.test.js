import {
  registerUser,
  login,
  getCurrentUser,
  registerAndLoginAsTestUser,
  getAllArticles,
  createArticle
} from '../support/api-methods.js';
import { generateRegisterUserData } from '../support/helpers.js';
import { articleData } from './testData.js';

describe('RealWorld tests', function () {
  it('register a new user', async function () {
    const testUserData = generateRegisterUserData();
    const response = await registerUser(...Object.values(testUserData));
    expect(response.status).to.equal(200);
    expect(response.body.user).to.have.property('email', testUserData.email);
    expect(response.body.user).to.have.property('username', testUserData.username);
    expect(response.body.user).to.have.property('token').that.is.a('string');
  })

  it('same user cannot be registered twice', async function () {
    const testUserData = generateRegisterUserData();
    const response = await registerUser(...Object.values(testUserData));
    expect(response.status).to.equal(200);
    const responseDuplicate = await registerUser(...Object.values(testUserData));
    expect(responseDuplicate.status).to.equal(409);
    expect(responseDuplicate.error.message).to.equal('duplicate user');
  })

  it('login', async function () {
    const testUserData = generateRegisterUserData();
    await registerUser(...Object.values(testUserData));
    const response = await login(testUserData.email, testUserData.password);
    expect(response.status).to.equal(200);
    expect(response.body.user).to.have.property('email', testUserData.email);
    expect(response.body.user).to.have.property('username', testUserData.username);
    expect(response.body.user).to.have.property('token').that.is.a('string');
  })

  it('cannot login with invalid credentials', async function () {
    const response = await login('wrongemail@wrongemail.com', 'wrongpassword');
    expect(response.status).to.equal(401);
    expect(response.error.message).to.equal('An error has occurred');
  })

  it('get current user data', async function () {
    const testUserData = await registerAndLoginAsTestUser();
    const response = await getCurrentUser();
    expect(response.status).to.equal(200);
    expect(response.body.user).to.have.property('email', testUserData.email);
    expect(response.body.user).to.have.property('username', testUserData.username);
    expect(response.body.user).to.have.property('token', testUserData.token);
  })

  it('get all articles', async function () {
    const response = await getAllArticles();
    expect(response.status).to.equal(200);
    expect(response.body.articles).to.have.length.greaterThan(0);
    expect(response.body.articles[0]).to.have.property('slug');
    expect(response.body.articles[0]).to.have.property('title');
    expect(response.body.articles[0]).to.have.property('description');
    expect(response.body.articles[0]).to.have.property('body');
    expect(response.body.articles[0]).to.have.property('author').which.is.an('object');
  })

  it('create article', async function () {
    const testUserData = await registerAndLoginAsTestUser();
    const response = await createArticle(...Object.values(articleData));
    expect(response.status).to.equal(201);
    expect(response.body.article.title).to.equal(articleData.title);
    expect(response.body.article.description).to.equal(articleData.description);
    expect(response.body.article.body).to.equal(articleData.body);
    expect(response.body.article.tagList).to.deep.equal(articleData.tagList.sort());
    expect(response.body.article.author.username).to.equal(testUserData.username);
  })
});

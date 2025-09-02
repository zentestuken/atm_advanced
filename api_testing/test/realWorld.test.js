import {
  registerUser,
  login,
  getCurrentUser,
  registerAndLoginAsTestUser,
  getArticles,
  createArticle,
  updateCurrentUser,
  deleteArticle,
  getArticleBySlug,
} from '../support/api-methods.js'
import {
  generateRegisterUserData,
  getRandomLetters,
  generateArticleData,
} from '../support/helpers.js'
import {
  UserResponseDTO,
  ArticleResponseDTO,
  ArticlesResponseDTO,
  ErrorResponseDTO,
} from '../support/dto/response-dtos.js'

describe('Tests without pre-registration', () => {
  it('register a new user', async function () {
    const testUserData = generateRegisterUserData()
    const response = await registerUser(...Object.values(testUserData))
    expect(response.status).to.equal(200)

    const user = new UserResponseDTO(response.body)
    expect(user.email).to.equal(testUserData.email)
    expect(user.username).to.equal(testUserData.username)
    expect(user.token).to.be.a('string')
  })

  it('same user cannot be registered twice', async function () {
    const testUserData = generateRegisterUserData()
    await registerUser(...Object.values(testUserData))
    const responseDuplicate = await registerUser(...Object.values(testUserData))
    expect(responseDuplicate.status).to.equal(409)

    const error = new ErrorResponseDTO(responseDuplicate.body)
    expect(error.message).to.equal('duplicate user')
  })

  it('login', async function () {
    const testUserData = generateRegisterUserData()
    await registerUser(...Object.values(testUserData))
    const response = await login(testUserData.email, testUserData.password)
    expect(response.status).to.equal(200)

    const user = new UserResponseDTO(response.body)
    expect(user.email).to.equal(testUserData.email)
    expect(user.username).to.equal(testUserData.username)
  })

  it('cannot login with invalid credentials', async function () {
    const response = await login('wrongemail@wrongemail.com', 'wrongpassword')
    expect(response.status).to.equal(401)

    const error = new ErrorResponseDTO(response.body)
    expect(error.message).to.equal('An error has occurred')
  })

  it('get all articles', async function () {
    const response = await getArticles()
    expect(response.status).to.equal(200)

    const articlesData = new ArticlesResponseDTO(response.body)
    expect(articlesData.articles).to.have.length.greaterThan(0)

    const article = articlesData.articles[0]
    expect(article.title).to.be.a('string')
    expect(article.description).to.be.a('string')
    expect(article.authorUsername).to.be.a('string')
  })

  it('get articles by author', async function () {
    const allArticlesResponse = await getArticles()
    const allArticlesData = new ArticlesResponseDTO(allArticlesResponse.body)
    const authorUsername = allArticlesData.articles[0].authorUsername
    const expectedCount = allArticlesData.articles
      .filter(article => article.authorUsername === authorUsername).length
    const articlesByAuthorResponse = await getArticles({ author: authorUsername })

    const articlesByAuthor = new ArticlesResponseDTO(articlesByAuthorResponse.body)
    expect(articlesByAuthor.articles).to.have.lengthOf(expectedCount)

    articlesByAuthor.articles.forEach(article => {
      expect(article.authorUsername).to.equal(authorUsername)
    })
  })

  it('get articles by nonexistent author', async function () {
    const authorUsername = 'nonexistent_author_' + getRandomLetters(10)
    const articlesByAuthorResponse = await getArticles({ author: authorUsername })

    const articlesByAuthor = new ArticlesResponseDTO(articlesByAuthorResponse.body)
    expect(articlesByAuthor.articles).to.have.lengthOf(0)
  })

  it('get articles by nonexistent tag', async function () {
    const tag = 'nonexistent_tag_' + getRandomLetters(10)
    const articlesByTagResponse = await getArticles({ tag })

    const articlesByTag = new ArticlesResponseDTO(articlesByTagResponse.body)
    expect(articlesByTag.articles).to.have.lengthOf(0)
  })
})

describe('Tests with pre-registerd user', () => {
  let testUserData

  beforeEach(async () => {
    testUserData = await registerAndLoginAsTestUser()
  })

  it('get current user data', async function () {
    const response = await getCurrentUser()
    expect(response.status).to.equal(200)

    const user = new UserResponseDTO(response.body)
    expect(user.email).to.equal(testUserData.email)
    expect(user.username).to.equal(testUserData.username)
    expect(user.token).to.equal(testUserData.token)
  })

  it('update current user', async function () {
    const randomLetters = getRandomLetters(7)
    const updateData = {
      email: testUserData.email + randomLetters,
      username: testUserData.username + randomLetters,
      bio: 'This is my updated bio' + randomLetters,
      image: `https://example.com/updated-image-${randomLetters}.jpg`
    }
    const response = await updateCurrentUser(updateData)
    expect(response.status).to.equal(200)

    const user = new UserResponseDTO(response.body)
    expect(user.email).to.equal(updateData.email)
    expect(user.username).to.equal(updateData.username)
    expect(user.bio).to.equal(updateData.bio)
    expect(user.image).to.equal(updateData.image)
    expect(user.token).to.have.length.greaterThan(0)
  })

  it('cannot update current user token', async function () {
    const randomLetters = getRandomLetters(7)
    const updateData = {
      token: randomLetters,
    }
    const response = await updateCurrentUser(updateData)
    expect(response.status).to.equal(500)

    const error = new ErrorResponseDTO(response.body)
    expect(error.message).to.equal('An error has occurred')
  })

  it('cannot update current user with invalid attribute name', async function () {
    const response = await updateCurrentUser({ hokage: true })
    expect(response.status).to.equal(500)

    const error = new ErrorResponseDTO(response.body)
    expect(error.message).to.equal('An error has occurred')
  })

  it('current user not changed when updating with no parameters', async function () {
    const response = await updateCurrentUser({})
    expect(response.status).to.equal(200)

    const user = new UserResponseDTO(response.body)
    expect(user.email).to.equal(testUserData.email)
    expect(user.username).to.equal(testUserData.username)
    expect(user.bio).to.equal(testUserData.bio)
    expect(user.image).to.equal(testUserData.image)
    expect(user.token).to.have.length.greaterThan(0)
  })

  it('create article', async function () {
    const articleData = generateArticleData()
    const response = await createArticle(...Object.values(articleData))
    expect(response.status).to.equal(201)

    const article = new ArticleResponseDTO(response.body)
    expect(article.title).to.equal(articleData.title)
    expect(article.description).to.equal(articleData.description)
    expect(article.body).to.equal(articleData.body)
    expect(article.tagList).to.deep.equal(articleData.tagList.sort())
    expect(article.authorUsername).to.equal(testUserData.username)
  })

  it('delete article', async function () {
    const articleData = generateArticleData()
    const createResponse = await createArticle(...Object.values(articleData))
    const slug = new ArticleResponseDTO(createResponse.body).slug

    const deleteResponse = await deleteArticle(slug)
    expect(deleteResponse.status).to.equal(204)

    const getResponse = await getArticleBySlug(slug)
    expect(getResponse.status).to.equal(404)
    const error = new ErrorResponseDTO(getResponse.body)
    expect(error.message).to.equal('not found')
  })

  it('cannot delete nonexistent article', async function () {
    const slug = 'nonexistent-article-' + getRandomLetters(10)

    const deleteResponse = await deleteArticle(slug)
    expect(deleteResponse.status).to.equal(404)
    const error = new ErrorResponseDTO(deleteResponse.body)
    expect(error.message).to.equal('not found')
  })

  it('get articles by tag', async function () {
    const articleData = generateArticleData()
    const createResponse = await createArticle(...Object.values(articleData))
    const tag = new ArticleResponseDTO(createResponse.body).tagList[0]

    const articlesByTagResponse = await getArticles({ tag })
    expect(articlesByTagResponse.status).to.equal(200)
    const articlesByTag = new ArticlesResponseDTO(articlesByTagResponse.body)
    expect(articlesByTag.articles).to.have.lengthOf(1)
  })
})

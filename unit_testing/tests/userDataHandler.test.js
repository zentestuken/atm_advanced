const UserDataHandler = require('../src/data_handlers/user_data_handler.js')
const nock = require('nock')
const userData = require('../data/users.json')

const testUserData = userData[1]
let userDataHandler

function setupMock () {
  if (process.env.MOCK) {
    nock(global.SERVER_URL)
      .get('/users')
      .reply(200, userData)
  }
}

describe('when users were not loaded', () => {
  beforeEach(async () => {
    setupMock()
    userDataHandler = new UserDataHandler()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  test('loadUsers should load users', async () => {
    await userDataHandler.loadUsers()
    expect(userDataHandler.users.length).toBeGreaterThan(0)
    expect(userDataHandler.users[0]).toHaveProperty('name')
  })

  test('getUserEmailsList should throw error when no users', () => {
    expect(() => userDataHandler.getUserEmailsList())
      .toThrow('No users loaded!')
  })

  test('getNumberOfUsers should return 0 number of users', async () => {
    expect(userDataHandler.getNumberOfUsers()).toBe(0)
  })

  test('should throw error when no users', async () => {
    const searchParams = { name: 'Yauhen' }
    expect(() => userDataHandler.findUsers(searchParams))
      .toThrow('No users loaded!')
  })
})

describe('when users loading failed', () => {
  beforeEach(async () => {
    nock(global.SERVER_URL)
      .get('/users')
      .replyWithError('Connection refused')
    userDataHandler = new UserDataHandler()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  test('loadUsers should throw error when network request fails', async () => {
    nock.cleanAll()
    nock(global.SERVER_URL)
      .get('/users')
      .replyWithError('Connection refused')
    await expect(userDataHandler.loadUsers())
      .rejects
      .toThrow('Failed to load users data: Error: Connection refused')
  })
})

describe('when users were loaded', () => {
  beforeAll(async () => {
    setupMock()
    userDataHandler = new UserDataHandler()
    await userDataHandler.loadUsers()
  })

  test('getUserEmailsList should return emails list', async () => {
    const expectedArrayOfEmails = userDataHandler.users.map(user => user.email)
    const expectedEmailsList = expectedArrayOfEmails.join(';')
    const emailsList = userDataHandler.getUserEmailsList()
    expect(emailsList).toBe(expectedEmailsList)
  })

  test('getNumberOfUsers should return number of users', async () => {
    expect(userDataHandler.getNumberOfUsers()).toBe(userDataHandler.users.length)
  })

  test('should find user by one parameter', async () => {
    const existingUserData = userDataHandler.users[0]
    const searchParams = {
      username: existingUserData.username
    }
    const matchingUsers = userDataHandler.findUsers(searchParams)
    expect(matchingUsers).toHaveLength(1)
    expect(matchingUsers[0]).toEqual(existingUserData)
  })

  test('should find user by multiple parameters', async () => {
    const existingUserData = userDataHandler.users[1]
    const searchParams = {
      name: existingUserData.name,
      email: existingUserData.email,
      website: existingUserData.website
    }
    const matchingUsers = userDataHandler.findUsers(searchParams)
    expect(matchingUsers).toHaveLength(1)
    expect(matchingUsers[0]).toEqual(existingUserData)
  })

  test('should throw error with no searchParameters argument', async () => {
    expect(() => userDataHandler.findUsers())
      .toThrow('No search parameters provoded!')
  })

  test('should throw error when no matching users', async () => {
    const searchParams = {
      name: 'Nonexistent Name',
      email: 'nothing@void.by'
    }
    expect(() => userDataHandler.findUsers(searchParams))
      .toThrow('No matching users found!')
  })
})

describe('isMatchingAllSearchParams tests', () => {
  beforeAll(async () => {
    userDataHandler = new UserDataHandler()
  })

  test('should match user by name (string)', () => {
    const searchParams = { name: testUserData.name }
    const result = userDataHandler.isMatchingAllSearchParams(testUserData, searchParams)
    expect(result).toBe(true)
  })

  test('should match user by id (number)', () => {
    const searchParams = { id: testUserData.id }
    const result = userDataHandler.isMatchingAllSearchParams(testUserData, searchParams)
    expect(result).toBe(true)
  })

  test('should match user by multiple parameters', () => {
    const searchParams = {
      name: testUserData.name,
      username: testUserData.username,
      email: testUserData.email
    }
    const result = userDataHandler.isMatchingAllSearchParams(testUserData, searchParams)
    expect(result).toBe(true)
  })

  test('should not match when single parameter is different', () => {
    const searchParams = { name: 'John Doe' }
    const result = userDataHandler.isMatchingAllSearchParams(testUserData, searchParams)
    expect(result).toBe(false)
  })

  test('should not match when one of multiple parameters is different', () => {
    const searchParams = {
      name: testUserData.name,
      username: 'wrong_username',
      email: testUserData.email
    }
    const result = userDataHandler.isMatchingAllSearchParams(testUserData, searchParams)
    expect(result).toBe(false)
  })

  test('should match with empty search parameters', () => {
    const searchParams = {}
    const result = userDataHandler.isMatchingAllSearchParams(testUserData, searchParams)
    expect(result).toBe(true)
  })

  test('should not match for nested search parameter', () => {
    const searchParams1 = {
      'address.street': testUserData.address.street
    }
    const searchParams2 = {
      street: testUserData.address.street
    }
    const result1 = userDataHandler.isMatchingAllSearchParams(testUserData, searchParams1)
    const result2 = userDataHandler.isMatchingAllSearchParams(testUserData, searchParams2)
    expect(result1).toBe(false)
    expect(result2).toBe(false)
  })
})

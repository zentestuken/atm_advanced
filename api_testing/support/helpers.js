export const getRandomLetters = (length) => {
  let result = '';
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return result;
}

export function generateRegisterUserData() {
  const randomLetters = getRandomLetters(10);
  return {
    email: `user_${randomLetters}@mymail.com`,
    password: 'Yauhen12345',
    username: `user_${randomLetters}`
  };
}

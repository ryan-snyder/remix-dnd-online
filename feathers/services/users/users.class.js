const { Service } = require('feathers-nedb');
const logger = require('../../logger');
exports.Users = class Users extends Service {
  // create a new user and add additional data
  create(data, params) {
    console.log(data)
    console.log(params)
    const { email, password } = data;
    //TODO: Consider removing characters and parties from user info
    const user = {
      email,
      password,
      characters: [],
      parties: []
    };
    logger.info('Creating user...')
    return super.create(user, params);
  }  
};

const {
    getUserbyIDHandler,
    addUserHandler,
  } = require('./handler');
  
  const routes = [
    {
      method: 'GET',
      path: '/users/{userId}',
      handler: getUserbyIDHandler,
    },
    {
        method: 'POST',
        path: '/users',
        handler: addUserHandler,
      },
  ];
  
  module.exports = routes;
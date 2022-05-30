const {
    getUserbyIDHandler,
    addUserHandler,
    QuestionnaireHandler,
    addDiscussionHandler,
    addReplyHandler,
    getallDiscussionHandler,
    getDiscussionbyIDHandler,
    getDiscussionbyuserIDHandler,
    getPsikologHandler,
    getHistoryHandler,
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
    {
      method: 'POST',
      path: '/questionnaires',
      handler: QuestionnaireHandler,
    },
    {
      method: 'POST',
      path: '/discussions',
      handler: addDiscussionHandler,
    },
    {
      method: 'POST',
      path: '/discussions/{discussionId}',
      handler: addReplyHandler,
    },
    {
      method: 'GET',
      path: '/discussions',
      handler: getallDiscussionHandler,
    },
    {
      method: 'GET',
      path: '/discussions/{discussionId}',
      handler: getDiscussionbyIDHandler,
    },
    {
      method: 'GET',
      path: '/discussion/{userId}',
      handler: getDiscussionbyuserIDHandler,
    },
    {
      method: 'GET',
      path: '/psikolog',
      handler: getPsikologHandler,
    },
    {
      method: 'GET',
      path: '/history/{userId}',
      handler: getHistoryHandler,
    },
  ];
  
  module.exports = routes;
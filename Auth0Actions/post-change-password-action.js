/**
* Handler that will be called during the execution of a PostChangePassword flow.
*
* @param {Event} event - Details about the user and the context in which the change password is happening.
* @param {PostChangePasswordAPI} api - Methods and utilities to help change the behavior after a user changes their password.
*/
exports.onExecutePostChangePassword = async (event, api) => {
  // Perform any asynchronous actions, e.g. send notification to Slack.
  // console.log('user last password reset', event);  
  // if (!event.user.last_password_reset) {
  const axios = require('axios');
  const options =
  {
    method: 'POST',
    url: event.secrets.ORG_API_URL + 'organisation-profile/activation-by-user/' + event.user.email,
    headers: { 'content-type': 'application/json', 'x-api-key': event.secrets.ORG_API_KEY },
    // data:
    // {
    //   'userId': event.user.email,
    // }
  };
  axios(options)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    })
  // }
};

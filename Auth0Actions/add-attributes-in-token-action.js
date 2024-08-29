/**
 * This PostLogin action is used to add custom claims to the ID token for providing additional user information.
 * Specifically,this action add connection details and user mfa values to the ID token.
 * This is to establish a secured connection and enforce MFA on user if its enabled for the user.


* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
  console.log('user', event.user);
  const namespace = "https://ccs-sso";
  api.idToken.setCustomClaim(`${namespace}/connection`, event.connection.name);
  if (event.user.user_metadata && event.user.user_metadata.use_mfa === true) {
    api.idToken.setCustomClaim(`${namespace}/use_mfa`, true);
  }
  return;
};


/**
* Handler that will be invoked when this action is resuming after an external redirect. If your
* onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
// exports.onContinuePostLogin = async (event, api) => {
// };

/**
* This PostLogin action is designed to enforce multi-factor authentication (MFA) based on
* user metadata and their previous authentication methods in the current session. 
* It avoids prompting users for MFA if they have already completed it during their session.
* Additionally, it specifically targets users whose metadata indicates they should use MFA.

* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/

exports.onExecutePostLogin = async (event, api) => {

  if (event.transaction?.protocol === 'oauth2-refresh-token') {
    return;
  }
  //Avoid prompting a user for multifactor authentication if they have successfully completed MFA in their current session
  let authMethods = [];
  if (event.authentication && Array.isArray(event.authentication.methods)) {
    authMethods = event.authentication.methods;
    console.log("MFA log2  context.authentication.methods");
    console.log(event.authentication.methods);
  }

  let findMFA = authMethods.find((method) => method.name === 'mfa');
  console.log("Finding authMethods for mfa", findMFA);
  console.log("Finding authMethods for !!mfa", !!findMFA);


  const completedMfa = !!authMethods.find((method) => method.name === 'mfa');
  console.log("MFA log3  ccompletedMfa");
  console.log(completedMfa);
  if (completedMfa) {
    return;
  }

  let socialLogin = !!event.user.identities.find((identity) => identity.provider === "google-oauth2");
  console.log('user.user_metadata-', event.user.user_metadata);

  // run only for the specified clients
  //if (CLIENTS_WITH_MFA.indexOf(context.clientID) !== -1) {
  // uncomment the following if clause in case you want to request a second factor only from user's that have user_metadata.use_mfa === true
  if (event.user.user_metadata && event.user.user_metadata.use_mfa === true) {
    console.log('Inside mfa true condition');
    api.multifactor.enable('any', { allowRememberBrowser: false });
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

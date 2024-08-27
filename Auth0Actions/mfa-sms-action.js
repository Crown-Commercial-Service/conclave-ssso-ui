/**
* This SendPhoneMessage action sends a custom SMS message using an external API.
* It constructs a message using data from the event and secrets, then makes a POST request to send the message.
* Handler that will be called during the execution of a SendPhoneMessage flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {SendPhoneMessageAPI} api - Methods and utilities to help change the behavior of sending a phone message.
*/
exports.onExecuteSendPhoneMessage = async (event, api) => {
  const axios = require('axios');
  const options = 
	{
        method: 'POST',
        url: event.secrets.NOTIFICATION_API_URL,
        headers: { 'content-type': 'application/json', 'x-api-key':event.secrets.NOTIFICATION_API_KEY},
         data:       
        {
            'phoneNumber': event.message_options.recipient, 
            //'phoneNumber': '447747087648',
            //'phoneNumber': '+14043833639',                
            'templateId': event.secrets.TEMPLATE_ID,
            'message': [
                        {
                        'key': 'code',
                        'message': event.message_options.text
                        }
                      ]
        }
     
    };
  try {
    // Making an api call to send the text message
    const response = await axios(options);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

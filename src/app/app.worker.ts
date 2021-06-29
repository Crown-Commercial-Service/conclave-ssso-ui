/// <reference lib="webworker" />
let access_token : string = '';

onmessage = (event) => {
  //const response = `worker response to ${event.data}` + "worker value " + i++;
  if(event.data.command == 'STORE_TOKEN'){
    access_token = event.data.access_token;
  }
  else if(event.data.command == 'ACCESS_TOKEN'){
    postMessage(access_token);
  } 
  else if(event.data.command == 'CHECK_ACCESS_TOKEN'){
    postMessage(access_token.length > 0);
  }
};
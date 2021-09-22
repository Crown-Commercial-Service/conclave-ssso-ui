var stat = "unchanged";

window.onload = onLoad();

function onLoad() {
    setTimer();
    window.addEventListener("message", receiveMessage, false);
}

function check_session() {
    let win = window.parent.document.getElementById("opIFrame").contentWindow;
    let client_id = this.localStorage.getItem('client_id');
    let session_state = this.localStorage.getItem('session_state');
    let mes = client_id + ' ' + session_state;
    win.postMessage(mes, '*');
}

function setTimer() {
    check_session();
    timerID = setInterval(check_session, 10 * 1000);
}


function receiveMessage(e) {
    if (e.origin !== this.localStorage.getItem('securityapiurl')) { return; }
    stat = e.data;
    noticeToParentWindow(stat);
}

function noticeToParentWindow(stat) {
    if (stat == "changed" || stat == "error") {
        console.log('changed');
        let secApiURl = this.localStorage.getItem('securityapiurl');
        let redirect_uri = this.localStorage.getItem('redirect_uri') + '/authsuccess';
        let client_id = this.localStorage.getItem('client_id');
        let secApi = secApiURl + '/security/authorize?client_id=' + client_id
            + '&redirect_uri=' + redirect_uri + '&response_type=code' +
            '&scope=email profile openid offline_access&prompt=none';
        window.parent.location.href = secApi;
        return false;
    } else {
        console.log('not-changed');
    }
}
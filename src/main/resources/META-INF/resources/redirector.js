const queryString = window.location.search;

console.log("Query String: ", queryString);
console.log("Base URL: ", window.location.origin);

// Link to the Developer Sandbox Registration Service which we strore in the 'application.properties'
registrationServiceURL = window.location.origin + '/config'

function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

// loads json data from url, the callback is called with
// error and data, with data the parsed json.
var getJSON = function(method, url, token, callback, body) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    if (token != null)
        xhr.setRequestHeader('Authorization', 'Bearer ' + token)
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status >= 200 && status < 300) {
            console.log('getJSON success: ' + url);
            callback(null, xhr.response);
        } else {
            console.log('getJSON error: ' + url);
            callback(status, xhr.response);
        }
    };
    if (body)
        xhr.send(JSON.stringify(body));
    else
        xhr.send();
};

// this loads the js library at location 'url' dynamically and
// calls 'cbSuccess' when the library was loaded successfully
// and 'cbError' when there was an error loading the library.
function loadAuthLibrary(url, cbSuccess, cbError) {
    var script = document.createElement('script');
    script.setAttribute('src', url);
    script.setAttribute('type', 'text/javascript');
    var loaded = false;
    var loadFunction = function() {
        if (loaded) return;
        loaded = true;
        cbSuccess();
    };
    var errorFunction = function(error) {
        if (loaded) return;
        cbError(error)
    };
    script.onerror = errorFunction;
    script.onload = loadFunction;
    script.onreadystatechange = loadFunction;
    document.getElementsByTagName('head')[0].appendChild(script);
}

function loadDataFromRegistrationService(registrationServiceBaseURL) {
    // this is where the Registration Services stores SSO / keycloak configuration
    configURL = registrationServiceBaseURL + '/api/v1/authconfig';
    getJSON('GET', configURL, null, function(err, data) {
        if (err !== null) {
            console.log('error loading client config' + err);
            showError(err);
        } else {
            loadAuthLibrary(data['auth-client-library-url'], function() {
                console.log('client library load success!')
                var clientConfig = JSON.parse(data['auth-client-config']);
                console.log('using client configuration: ' + JSON.stringify(clientConfig))
                keycloak = Keycloak(clientConfig);
                keycloak.init({
                    onLoad: 'check-sso',
                    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                }).success(function(authenticated) {
                    if (authenticated == true) {
                        console.log('user is authenticated');
                        // start 15s interval token refresh.
                        intervalRefRefresh = setInterval(refreshToken, 15000);
                        keycloak.loadUserInfo()
                            .success(function(data) {
                                console.log('retrieved user info..');
                                idToken = keycloak.idToken
                                showUser(data.preferred_username)
                                // now check the signup state of the user.
                                updateSignupState();
                            })
                            .error(function() {
                                console.log('Failed to pull in user data');
                                showError('Failed to pull in user data.');
                            });
                    } else {
                        console.log('User not authenticated - redirecting to the Developer Sandbox');
                        setTimeout(function () {
                            window.location.href = 'https://developers.redhat.com/developer-sandbox';
                        }, 3000);
//                        hideUser();
//                        hideAll();
//                        idToken = null
//                        show('state-getstarted');
                    }
                }).error(function() {
                    console.log('Failed to initialize authorization');
                    showError('Failed to initialize authorization.');
                });
            }, function(err) {
                console.log('error loading client library' + err);
                showError(err);
            });
        }
    });
}

httpGetAsync(registrationServiceURL, loadDataFromRegistrationService);

// setTimeout(function () {
//     window.location.href = 'https://developers.redhat.com/developer-sandbox';
// }, 5000);
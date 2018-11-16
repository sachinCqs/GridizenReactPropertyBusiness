import { NetInfo } from 'react-native';

//const baseUrl = 'http://35.227.91.200:5002/vendor/';
const baseUrl = 'http://192.168.0.100:5002/vendor/';


// const imageVal = 'http://18.188.245.163:5000/enduser/users/image-path.json/Profile-d23cd636f3892986b2b2c5c9906eee50.jpg/profile';
// const imageCount = 0;

// function setImageCount(){
//     imageCount++;
// }

var NodeAPI = (variables, apiName, apiMethod, token, userid) => {
    console.log("internetConnection===>" + navigator.onLine)
    // if (navigator.onLine) {
    var init = apiMethod == "GET" ? {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "vendorid": userid ? userid : '',
            "Authorization": token ? 'JWT ' + token : ''
        },
    } :
        {
            method: apiMethod,
            headers: {
                'Content-Type': "application/json",
                "vendorid": userid ? userid : '',
                "Authorization": token ? 'JWT ' + token : ''
            },
            body: JSON.stringify(variables)
        }
    console.log(baseUrl + apiName + "===body" + JSON.stringify(init));
    console.log("Request ==> " + init);
    return fetch(baseUrl + apiName, init)
        .then(response => response.json()
            .then(responseData => {
                console.log("===" + JSON.stringify(responseData))
                return responseData;
            }))
        .catch(err => {
            return { msg: "Server encountered a problem please retry." }
        });
    // } else {
    //     //alert('Internet connection required.')
    //     return { msg: "Internet connection required." }
    // }
}

function thirdPartyAPI(variables, url, apiMethod) {
    var init = apiMethod == "GET" ? {
        method: "GET"
    } :
        {
            method: apiMethod,
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(variables)
        }

    return fetch(url, init)
        .then(response => response.json()
            .then(responseData => {
                return responseData;
            }))
        .catch(err => {
            return { msg: "Server encountered a problem please retry." }
        });
}

export { NodeAPI, thirdPartyAPI };
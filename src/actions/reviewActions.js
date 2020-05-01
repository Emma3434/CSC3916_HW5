import actionTypes from '../constants/actionTypes';
import runtimeEnv from '@mars/heroku-js-runtime-env';
/*
export function submitReview(review){
    const env = runtimeEnv();
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(review),
            mode: 'cors'})
            .then( (response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .catch( (e) => console.log(e) );
    }
}*/

function reviewPosted(review){
    return {
        type: actionTypes.POST_REVIEW,
        review: review
    }
}

export function submitReview(review){
    const env = runtimeEnv();
	var formBody = [];
	for(var property in review)
	{
		var encodedKey = encodeURIComponent(property);
		var encodedValue = encodeURIComponent(review[property]);
		formBody.push(encodedKey + "=" + encodedValue);
	}
	formBody = formBody.join("&");
	
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Authorization': localStorage.getItem('token')
            },
			body: formBody,
            mode: 'cors'})
            .then( (response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then( (res) => {
                dispatch(reviewPosted(res));
            })
            .catch( (e) => console.log(e) );
    }
}
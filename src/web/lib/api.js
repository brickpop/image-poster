// CLIENT API

import axios from 'axios';

// SESSION

export function getSession() {
	return axios.get(`/api/session`)
		.then(response => {
			if (response && response.error) throw new Error(response.error);
			else return response.data;
		})
}

export function logout() {
	return axios.delete(`/api/session`)
		.then(response => {
			if (response && response.error) throw new Error(response.error);
			else return response.data;
		})
}

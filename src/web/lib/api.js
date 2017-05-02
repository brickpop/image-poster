// CLIENT API

import Promise from 'bluebird';
import axios from 'axios';
import request from 'superagent/lib/client';

// SESSION

// export function getSession() {
// 	return axios.get(`/api/session`)
// 		.then(response => {
// 			if (response && response.error) throw new Error(response.error);
// 			else return response.data;
// 		})
// }

// export function logout() {
// 	return axios.delete(`/api/session`)
// 		.then(response => {
// 			if (response && response.error) throw new Error(response.error);
// 			else return response.data;
// 		})
// }

export function getAlbums() {
	return axios.get(`/api/web/albums`)
		.then(response => {
			if (response && response.error) throw new Error(response.error);
			else return response.data;
		})
}

export function upload(params) {
	if (!params || !params.files || !params.name) return Promise.reject(new Error("Invalid parameters"));

	var id;
	return Promise.try(() => axios.post(`/api/web/albums`, { name: params.name }))
		.then(response => {
			if (response && response.data && response.data.error) throw new Error(response.data.error);
			else if (!response.data.id) throw new Error("Unable to create the album");
			else id = response.data.id;
		})
		.then(() => {
			return Promise.map(params.files, file => {
				const req = request.post(`/api/web/albums/${id}`);
				req.attach(file.name, file);

				return new Promise((resolve, reject) => {
					req.end((err, res) => {
						if (err) return reject(err);
						else resolve(res);
					});
				})
			})
		})
		.then(() => id);
}

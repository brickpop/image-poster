import { getAlbums } from '../lib/api';

export function loadAlbums() {
	return (dispatch, getState) => {
		const state = getState();
		if(!state || !state.app) return;

		getAlbums()
			.then(data => {
				if (data && data.error) return alert("oops! " + data.error);
				dispatch({ type: 'SET', albums: data });
			})
			.catch(err => {
				alert("oops! " + (err && err.message || err));
			});
	}
}

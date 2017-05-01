import { makeStore } from './index';
import Album from '../../../models/album';

export async function makeInitialStore(params){
	const store = makeStore();

	try {
		// DB operations here
		var state = {};

		// if(params.user && params.user._id){
		//   authenticated only content
		// }

		state.albums = await Album.find().sort('-created').lean().exec();

		// Set the initial state
		store.dispatch({ type: 'SET', ...state });
		return store;
	}
	catch(err){
		return store;
	}
}

export function dehydrate(store){
	if(!store || !store.getState) return {};
	return JSON.stringify(store.getState());
}

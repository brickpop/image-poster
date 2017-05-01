import { combineReducers } from 'redux';
import app from './app';
// import user from './user';
import albums from './albums';

export default combineReducers({
	app,
	albums
});

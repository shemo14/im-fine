const INITIAL_STATE = { batteryNotify: false };export default (state = INITIAL_STATE, action) => {	switch (action.type) {		case 'batteryNotify':			console.log('reducer battery', action.payload);			return { batteryNotify: action.payload };		default:			return state;	}};
const initialState = { // global properties here
	daysAgo: 0
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
		case 'SET':
			if(!action.app) return state;
			else return action.app;

    default:
      return state;
  }
}

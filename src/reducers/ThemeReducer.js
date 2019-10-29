const INITIAL_STATE = { lang: 'light' };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'chooseTheme':
            console.log('reducer theme', action.payload);
            return { theme: action.payload };
        default:
            return state;
    }
};

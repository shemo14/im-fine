const INIT_STATE = { user: null };


export default ( state = INIT_STATE, action ) => {
    switch (action.type) {
        case ('profile_data'):
            return ({ ...state, user: action.data });
        case ('update_profile'):
            return ({ ...state, user: action.data });
        case ('logout'):
            return ({ ...state, user: null });
        default :
            return state;
    }}

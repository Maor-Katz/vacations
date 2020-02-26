const initialState = {};

export const saveUser = (state = initialState, action) => {
    switch (action.type) {
        case 'SAVE_USER':
            let newState = Object.assign({}, state, {
                user: action.user
            })
            return newState;
        default:
            return state;
    }
}
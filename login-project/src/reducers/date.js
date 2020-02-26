const initialState = {
    from: '',
    to: '',
    description:''
};

export const date = (state = initialState, action) => {
    switch (action.type) {
        case 'FROM':
            let newState = Object.assign({}, state, {
                from: action.value
            })
            return newState;
        case 'TO':
            let newState1 = Object.assign({}, state, {
                to: action.value
            })
            return newState1
        case 'DESCRIPTION':
            let newState2 = Object.assign({}, state, {
                description: action.value
            })
            return newState2
        default:
            return state;
    }
}
const initialState = {
    description: '',
    destination: '',
    img_url: '',
    dates: '',
    price: '',
    vac_id: ''
};

export const newVac = (state = initialState, action) => {
    switch (action.type) {
        case 'DESCRIPTION':
            let newState = Object.assign({}, state, {
                description: action.value
            })
            return newState;
        case 'DESTINATION':
            let newState1 = Object.assign({}, state, {
                destination: action.value
            })
            return newState1
        case 'IMG_URL':
            let newState2 = Object.assign({}, state, {
                img_url: action.value
            })
            return newState2
        case 'DATES':
            let newState3 = Object.assign({}, state, {
                dates: action.value
            })
            return newState3
        case 'PRICE':
            let newState4 = Object.assign({}, state, {
                price: action.value
            })
            return newState4
        case 'VAC_ID':
            let newState5 = Object.assign({}, state, {
                vac_id: action.value
            })
            return newState5
        default:
            return state;
    }
}
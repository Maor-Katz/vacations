const changeHandler = (userObj, field, e) => {
    const value = e.target.value;
    userObj[field] = value;
}

const checkSizeOfValues = (obj) => {// function that checks how many values object contains- for validations.
    let size = 0, key;
    for (key in obj) {
        if (obj[key])
            size++
    }
    return size;
};

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
}


module.exports = {
    changeHandler,
    checkSizeOfValues,
    customStyles
}
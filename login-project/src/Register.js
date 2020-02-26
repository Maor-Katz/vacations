import React from 'react';
import './App.css';
import {connect} from "react-redux";
import '@fortawesome/fontawesome-free/css/all.min.css';
import {changeHandler, checkSizeOfValues, customStyles} from './functions'
import Modal from "react-modal";
import {saveUser} from "./actions/actionsFile";

export class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {register: {}, modalIsOpen: false, errorMessage: ''}
    }

    getUserDetails = async () => {
        const {register} = this.state;
        const {dispatch} = this.props;
        let response = await fetch(`http://localhost:1000/auth/${register.username}`, {
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.token
            }
        });
        let data = await response.json();
        dispatch(saveUser(data[0]));
        localStorage.userName = register.username;
        localStorage.user_id = data[0].id
        this.props.history.push('Vacations', data[0]);
    }

    submitDetails = () => {
        const {register, errorMessage} = this.state;
        console.log(this.state)
        let sizeOfVals = checkSizeOfValues(register);
        if (sizeOfVals !== 4) {// validations - user needs to fill all fields
            this.setState({modalIsOpen: true, errorMessage: 'Please fill all fields!'})
            return
        } else { // validation succeed:
            let connectionSucceed = false
            fetch('http://localhost:1000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname: register.firstName,
                    lastname: register.lastName,
                    username: register.username,
                    password: register.password
                })
            })
                .then((response) => {
                    if (response.status === 200) {
                        connectionSucceed = true;
                    }
                    return response.json();
                })
                .then((myJson) => {
                    if (connectionSucceed) {
                        // this.props.history.push('login');
                        localStorage.token = myJson.token;
                        this.getUserDetails()
                    }
                }).catch(err => {
                this.setState({modalIsOpen: true, errorMessage: 'User is already exists'})
            })
        }
    }


    render() {
        const {register, modalIsOpen, errorMessage} = this.state
        return (<div className="containerWrapper">
                <div className="containerRegister">
                    <header className="heading"> Registration</header>
                    <hr></hr>
                    <div className="row registerRow">
                        <div className="col-sm-12">
                            <div className="row">
                                <div className="col-xs-4">
                                    <label className="firstname lables">First Name :</label></div>
                                <div className="col-xs-8">
                                    <input type="text" name="fname" id="fname" placeholder="Enter your First Name..."
                                           className="form-control" onChange={(e) => {
                                        changeHandler(register, 'firstName', e)
                                    }}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="row">
                                <div className="col-xs-4">
                                    <label className="lables">Last Name :</label></div>
                                <div className="col-xs-8">
                                    <input type="text" name="lname" id="lname" placeholder="Enter your Last Name..."
                                           className="form-control last" onChange={(e) => {
                                        changeHandler(register, 'lastName', e)
                                    }}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="row">
                                <div className="col-xs-4">
                                    <label className="lables">Username :</label></div>
                                <div className="col-xs-8">
                                    <input type="email" name="email" id="email" placeholder="Enter your username..."
                                           className="form-control" onChange={(e) => {
                                        changeHandler(register, 'username', e)
                                    }}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="row">
                                <div className="col-xs-4">
                                    <label className="lables">Password :</label></div>
                                <div className="col-xs-8">
                                    <input type="password" name="password" id="password"
                                           placeholder="Enter your Password..."
                                           className="form-control" onChange={(e) => {
                                        changeHandler(register, 'password', e)
                                    }}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="row">
                                <div className="col-xs-4 ">
                                    <label className="lables">Gender:</label>
                                </div>
                                <div className="col-xs-4 male">
                                    <input type="radio" name="gender" id="gender" value="boy"/><span
                                    className="gender">male</span>
                                </div>
                                <div className="col-xs-4 female">
                                    <input type="radio" name="gender" id="gender" value="girl"/><span
                                    className="gender">female</span>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="btn btn-secondary" onClick={() => {
                                    this.submitDetails()
                                }}>Submit
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={modalIsOpen}
                    style={customStyles}
                >


                    <h2 className="text-center">{errorMessage}</h2>
                    <div className="centerText">
                        <button className="btn btn-login "
                                onClick={() => this.setState({modalIsOpen: false})}>OK
                        </button>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({

})


export default connect(mapStateToProps)(Register)


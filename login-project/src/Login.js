import React from 'react';
import './App.css';
import {saveUser} from "./actions/actionsFile";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import Modal from 'react-modal';
import {changeHandler, checkSizeOfValues, customStyles} from './functions'

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {login: {}, modalIsOpen: false, userId: 0}
    }

    getUserDetails = async () => {
        const {login} = this.state;
        const {dispatch} = this.props;
        let response = await fetch(`http://localhost:1000/auth/${login.firstName}`, {
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.token
            }
        });
        let data = await response.json();
        dispatch(saveUser(data[0]));
        localStorage.userName = login.firstName;
        localStorage.user_id = data[0].id
        this.props.history.push('Vacations', data[0]);
    }

    login = () => {
        const {login, userId} = this.state;
        let sizeOfVals = checkSizeOfValues(login);
        if (sizeOfVals !== 2) {// validations - user needs to fill all fields
            this.setState({modalIsOpen: true})
            return
        } else { // validation succeed
            let connectionSucceed = false;

            fetch('http://localhost:1000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: login.firstName, password: login.password})
            })
                .then((response) => {
                    if (response.status === 200) {
                        connectionSucceed = true
                    }
                    return response.json();
                })
                .then((myJson) => {
                    if (connectionSucceed) {
                        console.log(myJson.token)
                        localStorage.token = myJson.token;
                        // user logged in, now what?:
                        this.getUserDetails()

                        //
                    }
                });

        }
    }

    render() {
        const {login, modalIsOpen} = this.state;
        return (
            <div className="Login">
                <section className="login-block">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4 login-sec">
                                <h2 className="text-center">Login Now</h2>
                                <div className="login-form">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="text-uppercase">Username</label>
                                        <input type="text" className="form-control"
                                               placeholder="Please enter user name..." onChange={(e) => {
                                            changeHandler(login, 'firstName', e)
                                        }}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1"
                                               className="text-uppercase">Password</label>
                                        <input type="password" className="form-control"
                                               placeholder="Please enter password..." onChange={(e) => {
                                            changeHandler(login, 'password', e)
                                        }}/>
                                    </div>
                                    <div className="form-check">
                                        <label className="form-check-label">
                                            <Link to="/register"> <small className="registarButton">Not a member?
                                                Register!</small></Link>
                                        </label>
                                        <button className="btn btn-login float-right"
                                                onClick={() => this.login()}>Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-8 banner-sec">
                                <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                                    <div className="carousel-inner" role="listbox">
                                        <div className="carousel-item active">
                                            <img className="d-block img-fluid2"
                                                 src="https://static.pexels.com/photos/33972/pexels-photo.jpg"
                                                 alt="First slide"/>
                                            <div className="carousel-caption d-none d-md-block">
                                                <div className="banner-text">
                                                    <h2>Welcome to your next vacation</h2>
                                                    <ul>
                                                        <li>Best prices</li>
                                                        <li>Best destinations</li>
                                                        <li>Personal attention</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Modal
                    isOpen={modalIsOpen}
                    style={customStyles}
                >
                    <h2 className="text-center">Please fill all fields!</h2>
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

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(Login)


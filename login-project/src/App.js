import React from 'react';
import './App.css';
import {Route, BrowserRouter as Router, Redirect, Switch} from 'react-router-dom'
import Login from "./Login";
import Register from "./Register";
import Vacations from "./Vacations";
import Reports from "./Reports";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                    <Route path="/vacations" component={Vacations}/>
                    <Route path="/reports" component={Reports}/>
                    <Redirect exact from="/" to="login"/>
                </Switch>
            </Router>
        );
    }
}

export default App;

import React,{useEffect} from "react";
import DatePicker from "react-datepicker";
import {putDate} from "./actions/actionsFile";
import "react-datepicker/dist/react-datepicker.css";
import {connect} from "react-redux";

class Picker extends React.Component {
    state = {
        startDate: new Date()
    };

    changeDate = (e) => {
        const {dispatch, direct} = this.props
        const chosenDate = `${e.getDate()}.${e.getMonth() + 1}`
        dispatch(putDate(direct, chosenDate))
        this.setState({
            startDate: e
        });
    }

    render() {
        return (
            <DatePicker
                selected={this.state.startDate}
                onChange={(e) => this.changeDate(e)}
            />
        );
    }
}


const mapStateToProps = state => ({
    form: state.date
})

export default connect(mapStateToProps)(Picker)


import React from 'react';
import {connect} from "react-redux";
import {newVac, putDate} from "./actions/actionsFile";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from './Card'
import Picker from './Picker'
import Modal from "react-modal";
import {customStyles} from "./functions";

class Vacations extends React.Component {

    state = {vacations: [], modalIsOpen: false, modalOption: 'add'}

    checkVacationsFollow = async () => {// check which vacations user is following
        let response = await fetch(`http://localhost:1000/vacations/${this.props.location.state.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.token
            }
        });
        let vacationsFollow = await response.json()
        return vacationsFollow
    }

    getVacations = async () => {
        try {
            const vacationsFollow = await this.checkVacationsFollow()
            vacationsFollow.forEach(va => va.isFollow = true)//adding flag in order to recognize vacation that user is following at

            let response2 = await fetch(`http://localhost:1000/vacations`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.token
                }
            })
            let allVacations = await response2.json()
            let isDisplay;//flag to know if vacation display at user's vacations
            let otherVacations;
            if (vacationsFollow.length > 0) {
                otherVacations = allVacations.filter(vac => {// array of vacations that user is not following
                    for (let i = 0; i < vacationsFollow.length; i++) {
                        if (vac.id === vacationsFollow[i].vac_id) {
                            isDisplay = false;
                            break;
                        }
                        isDisplay = true;
                    }
                    return isDisplay;
                })
            } else {
                otherVacations = allVacations
            }

            let newArr = [...vacationsFollow, ...otherVacations]
            this.setState({vacations: newArr})
        } catch (e) {
            alert('Unauthorized timeout, please login!')
            this.props.history.push('login')
        }
    }
    searchVacation = async () => {
        const {form} = this.props
        let response = await fetch(`http://localhost:1000/vacations/api/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.token
            },
            body: JSON.stringify({
                description: form['description'],
                dates: `${form['from']}-${form['to']}`
            })
        });
        let searchResults = await response.json()
        const vacationsFollow = await this.checkVacationsFollow()
        searchResults.forEach(va => {//check which vacation user is following
            va.vac_id = va.id
            vacationsFollow.forEach(vaca => {
                if (va.id === vaca.vac_id) {
                    va.isFollow = true;
                }
            })
        })
        this.setState({vacations: searchResults})
    }

    handleChange = (e) => {
        const {dispatch} = this.props;
        dispatch(putDate('DESCRIPTION', e.target.value))
    }

    componentDidMount() {
        this.getVacations()
    }

    clear = () => {
        document.getElementById('filled-search').value = ''
        this.getVacations();
        this.resetFormFields();
    }

    modalChangeHandler = (field, e) => {
        const {dispatch} = this.props
        dispatch(newVac(field, e.target.value))
    }

    addVac = async () => {
        const {newVac} = this.props
        let response2 = await fetch(`http://localhost:1000/vacations/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.token
            },
            body: JSON.stringify(newVac)
        })
        let allVacations = await response2.json()
        this.getVacations();
        this.setState({modalIsOpen: false})
        this.resetFormFields();
    }

    editVacationModal = (details) => {
        const {dispatch} = this.props
        dispatch(newVac('DESTINATION', details.destination))
        dispatch(newVac('DESCRIPTION', details.description))
        dispatch(newVac('IMG_URL', details.img_url))
        dispatch(newVac('DATES', details.dates))
        dispatch(newVac('PRICE', details.price))
        dispatch(newVac('VAC_ID', details.vac_id ? details.vac_id : details.id))
        this.setState({modalIsOpen: true, modalOption: 'edit'})
    }
    openModalForAddingVac = () => {
        this.resetFormFields();
        this.setState({modalIsOpen: false})
    }
    resetFormFields = () => {
        const {dispatch} = this.props
        dispatch(newVac('DESTINATION', ''))
        dispatch(newVac('DESCRIPTION', ''))
        dispatch(newVac('IMG_URL', ''))
        dispatch(newVac('DATES', ''))
        dispatch(newVac('PRICE', 0))
    }
    saveVacation = async () => {
        const {newVac} = this.props;
        let response2 = await fetch(`http://localhost:1000/vacations/edit/${newVac.vac_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.token
            },
            body: JSON.stringify(newVac)
        })
        let allVacations = await response2.json()
        this.getVacations();
        this.setState({modalIsOpen: false})
        this.resetFormFields();
    }
    enableButton = () => {// check if 5 fields are filled
        const {newVac} = this.props;
        let counter = 0;
        Object.values(newVac).forEach(x => {
            if (x) {
                counter++
            }
        })
        if (counter > 4) {
            return false
        } else
            return true
    }

    render() {
        const {vacations, modalIsOpen, modalOption} = this.state
        const {form, newVac} = this.props
        return (
            <div className="Vacations">
                <div className="title">Vacations</div>
                <div className="userAndLogout">
                    <div>Hi {this.props.location.state.username}!</div>
                    {this.props.location.state.isAdmin ? <div>Admin</div> : ''}
                    <a href="/login" className="logoutButton">Logout</a></div>
                {this.props.location.state.isAdmin ?
                    <Button variant="contained" color="primary"//case we want edit an existing vacation
                            onClick={() => this.props.history.push('Reports', {
                                data: this.props.location.state,
                                vacations
                            })}>Reports
                    </Button> : ''}
                {/*you need to insert description & dates together in order to find holiday!!!*/}
                {/*please search by description and not by destination!!!*/}
                <div className='filterVacations'><span className="textFilter">Filter By:</span>
                    <span className="textField"><TextField id="filled-search" label="Description" type="search"
                                                           variant="filled"
                                                           onChange={(e) => this.handleChange(e)}/></span>
                    <span className="picker"><Picker direct={"FROM"}/></span>
                    <span className="picker"><Picker direct={"TO"}/></span>
                    <Button variant="contained" color="primary" onClick={() => this.searchVacation()}
                            className="searchBarButton"
                            disabled={form.description ? false : true}>
                        Search
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => this.clear()}
                            className="searchBarButton">
                        Clear
                    </Button>
                </div>
                <div className="vacationList">
                    {vacations.map((v, index) => <div key={index} className="specificVacation"><Card details={v}
                                                                                                     isAdmin={this.props.location.state.isAdmin}
                                                                                                     getVacations={this.getVacations}
                                                                                                     editVacationModal={this.editVacationModal}/>
                    </div>)}
                </div>
                {this.props.location.state.isAdmin ? <div>
                    <button className="addButton"
                            onClick={() => this.setState({modalIsOpen: true, modalOption: 'add'})}>+Add
                    </button>
                </div> : ''}
                <Modal
                    isOpen={modalIsOpen}
                    style={customStyles}>
                    <div className="modalField">
                    <span className="textField"><TextField id="filled-search" label="Description" type="search"
                                                           variant="filled"
                                                           onChange={(e) => this.modalChangeHandler('DESCRIPTION', e)}
                                                           defaultValue={newVac.description}/></span>
                        <span className="textField"><TextField id="filled-search" label="Destination" type="search"
                                                               variant="filled"
                                                               onChange={(e) => this.modalChangeHandler('DESTINATION', e)}
                                                               defaultValue={newVac.destination}/></span>
                        <span className="textField"><TextField id="filled-search" label="Image" type="search"
                                                               variant="filled"
                                                               onChange={(e) => this.modalChangeHandler('IMG_URL', e)}
                                                               defaultValue={newVac.img_url}/></span>
                        <span className="textField"><TextField id="filled-search" label="Dates" type="search"
                                                               variant="filled"
                                                               onChange={(e) => this.modalChangeHandler('DATES', e)}
                                                               defaultValue={newVac.dates}/></span>
                        <span className="textField"><TextField id="filled-search" label="Price" type="number"
                                                               variant="filled"
                                                               onChange={(e) => this.modalChangeHandler('PRICE', e)}
                                                               defaultValue={newVac.price}/></span>
                    </div>
                    <div className="modalBtns">
                        {modalOption === 'add' ?
                            <Button variant="contained" color="primary"//case we want to add new vacation
                                    className="btnModal" onClick={() => this.addVac()}
                                    disabled={this.enableButton()}>
                                Add
                            </Button> :
                            <Button variant="contained" color="primary"//case we want edit an existing vacation
                                    className="btnModal"
                                    onClick={() => this.saveVacation()}
                                    disabled={!Object.values(this.props.newVac).every(x => x)}>
                                Save
                            </Button>}

                        <Button variant="contained" color="primary" onClick={() => this.openModalForAddingVac()}
                                className="btnModal">
                            cancel
                        </Button>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.saveUser.user,
    form: state.date,
    newVac: state.newVac
})

export default connect(mapStateToProps)(Vacations)


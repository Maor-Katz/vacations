import React from 'react';
import Chart from 'chart.js';
import Button from '@material-ui/core/Button';

class Reports extends React.Component {

    componentDidMount() {
        let destinations = [];
        let followersArr = [];

        this.props.location.state.vacations.forEach(x => {
            destinations.push(x.destination)
            followersArr.push(x.followers)
        });

        let ctx = document.getElementById('myChart').getContext('2d');
        let chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: destinations,
                datasets: [{
                    label: 'Followers',
                    backgroundColor: 'rgb(63,81,181)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: followersArr
                }]
            },

            options: {scales: {
		xAxes: [{
			display: true
		}],
     yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
	}}
        });

    }

    render() {
        return (
            <div className="Reports">
                <div className="backToVacWrapper"><Button variant="contained"
                                                          color="primary"//case we want edit an existing vacation
                                                          className="backToVac"
                                                          onClick={() => this.props.history.push('Vacations', this.props.location.state.data)}>
                    back To Vacations
                </Button></div>
                <canvas id="myChart">

                </canvas>
            </div>
        );
    }
}

export default Reports


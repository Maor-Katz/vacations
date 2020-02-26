import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {red} from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    avatar: {
        backgroundColor: red[500],
    }
}));

export default function RecipeReviewCard(props) {
    const classes = useStyles();

    const deleteVacation = async (vacationId) => {
        let response1 = await fetch(`http://localhost:1000/vacations/follow/${vacationId}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.token
            }
        });
        let data = await response1.json()
        let response2 = await fetch(`http://localhost:1000/vacations/vacation/${vacationId}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.token
            }
        });
        let data2 = await response2.json()
        props.getVacations();
    }


    const followVacation = () => {
        if (props.details.isFollow) { // it means we want to unfollow
            fetch(`http://localhost:1000/vacations/follow`, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.token
                },
                body: JSON.stringify({
                    user_id: localStorage.user_id,
                    vacation_id: props.details.vac_id || props.details.id
                }),
            })
                .then((response) => response.json())
                .then(data => {
                    props.details.isFollow = false
                    setCount(Math.random())//in order to render Card component
                })
        } else {// it means we want to follow
            fetch(`http://localhost:1000/vacations/follow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.token
                },
                body: JSON.stringify({
                    user_id: localStorage.user_id,
                    vacation_id: props.details.vac_id || props.details.id
                }),
            })
                .then((response) => response.json())
                .then(data => {
                    props.details.isFollow = true
                    setCount(Math.random())//in order to render Card component
                })
        }
    };
    const [count, setCount] = useState(0);
    const {isAdmin} = props;
    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {localStorage.userName ? localStorage.userName.charAt(0) : undefined}
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">

                        {isAdmin ? <IconButton aria-label="delete" className={classes.margin}
                                               onClick={() => deleteVacation(props.details.vac_id || props.details.id)}>
                            <DeleteIcon fontSize="small"/>
                        </IconButton> : ''}
                    </IconButton>
                }
                title={`${props.details.destination} : ${props.details.description}`}
                subheader={`${props.details.price}$`}
            />
            <CardMedia
                className={classes.media}
                image={props.details.img_url}
                title={props.details.destination}
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {props.details.dates}
                </Typography>
                {isAdmin ? <EditIcon className="editBtn" onClick={() => props.editVacationModal(props.details)}/> : ''}
            </CardContent>
            <CardActions disableSpacing>
                {!isAdmin && <IconButton aria-label="add to favorites">
                    <FavoriteIcon className={props.details.isFollow ? 'red' : ''} onClick={() => followVacation()}/>
                </IconButton>}
            </CardActions>
        </Card>
    );
}
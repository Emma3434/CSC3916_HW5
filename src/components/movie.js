import React, { Component }  from 'react';
import {connect} from "react-redux";
import { Glyphicon, Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import { Image } from 'react-bootstrap'
import { withRouter } from "react-router-dom";
import {fetchMovie} from "../actions/movieActions";
import runtimeEnv from '@mars/heroku-js-runtime-env';
import { Col, Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

//support routing by creating a new component
/*https://reactjs.org/docs/forms.html*/


class Movie extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            info: {
                text: "",
                rating: 0
            }
        }
    };

    handleSubmit(){
        const env = runtimeEnv();
        var info = {
            /*match the this.state */
            'movie': this.props.selectedMovie.title,
            'review': this.state.info.text,
            'rating': this.state.info.rating,
        };

        return fetch(`${env.REACT_APP_API_URL}/review`,{
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(info),
            mode: 'cors'})
            .then( (response) => {
                if(!response.ok){
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then( (res) => {
                window.location.reload();
            })
            .catch( (e) => console.log(e) );
    }

    handleChange(event){
        let handleChange = Object.assign({}, this.state.info);

        handleChange[event.target.id] = event.target.value;
        this.setState({
            info: handleChange
        });
    }

    componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null)
            dispatch(fetchMovie(this.props.movieId));
    }

    render() {  //change to match HW 4 schema
        const ActorInfo = ({actors}) => {
            return actors.map((actor, i) =>
                <p key={i}>
                    <b>{actor.actorName}</b> {actor.charName}
                </p>
            );
        };

        const ReviewInfo = ({reviews}) => {
            return reviews.map((review, i) =>
                <p key={i}>
                <b>{review.reviewer}</b> {review.review}
                    <Glyphicon glyph={'star'} /> {review.rating}
                </p>
            );
        }

        const DetailInfo = ({currentMovie}) => {
            if (!currentMovie) { // evaluates to true if currentMovie is null
                return <div>Loading...</div>;
            }
            return (
                <Panel>
                    <Panel.Heading>Movie Detail</Panel.Heading>
                    <Panel.Body><Image className="image" src={currentMovie.imageUrl} thumbnail /></Panel.Body>
                    <ListGroup>
                        <ListGroupItem>{currentMovie.title}</ListGroupItem>
                        <ListGroupItem><ActorInfo actors={currentMovie.actors} /></ListGroupItem>
                        <ListGroupItem><h4> <Glyphicon glyph={'star'} /> {currentMovie.avgRating} </h4></ListGroupItem>
                    </ListGroup>
                    <h4>Reviews:</h4>
                    <Panel.Body><ReviewInfo reviews={currentMovie.reviews} /></Panel.Body>
                </Panel>
            );
        };
        return (
            <div>
                <DetailInfo currentMovie={this.props.selectedMovie} />
                <Form horizontal>
                    <FormGroup controlId="text">
                        <Col componentClass={ControlLabel} sm={2}>
                            Review
                        </Col>
                        <Col sm={10}>
                            <FormControl onChange={this.handleChange} value={this.state.info.text} type="text" placeholder="Share your thought" />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="rating">
                        <Col componentClass={ControlLabel} sm={2}>
                            Rating
                        </Col>
                        <Col sm={10}>
                            <FormControl onChange={this.handleChange} value={this.state.info.rating} type="rating" placeholder="Rate the movie (1-5)" />
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col smOffset={2} sm={10}>
                            <Button onClick={this.handleSubmit}>Submit</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(ownProps);
    return {
        selectedMovie: state.movie.selectedMovie,
        movieId: ownProps.match.params.movieId
    }
}

export default withRouter(connect(mapStateToProps)(Movie));
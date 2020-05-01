import React, { Component }  from 'react';
import {connect} from "react-redux";
import { Col, Form, FormGroup, FormControl, ControlLabel, Button, Glyphicon, Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import { Image } from 'react-bootstrap'
import { withRouter } from "react-router-dom";
import {fetchMovie} from "../actions/movieActions";
import { submitReview } from "../actions/reviewActions";

//support routing by creating a new component

class Movie extends Component {

    constructor(props) {
        super(props);
        this.updateReviewDetails = this.updateReviewDetails.bind(this);
        this.postReview = this.postReview.bind(this);

        this.state = {
            details:{
                title: this.props.selectedMovie.title,
                username: localStorage.getItem("username"),
                comment: '',
                rating:0
            }
        };
    }

    updateReviewDetails(event){
        let updateReviewDetails = Object.assign({}, this.state.details);

        updateReviewDetails[event.target.id] = event.target.value;
        this.setState({
            details: updateReviewDetails
        });
    }

    postReview() {
        const {dispatch} = this.props;
        dispatch(submitReview(this.state.details))
            .then(
                ()=>
                {
                    this.props.history.push('/');
                });
    }

    componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null)
            dispatch(fetchMovie(this.props.movieId));
    }

    render() {
        const ActorInfo = ({actors}) => {
            return actors.map((actor, i) =>
                <p key={i}>
                    <b>{actor.actorName}</b> {actor.characterName}
                </p>
            );
        };

        const ReviewInfo = ({reviews}) => {
            return reviews.map((review, i) =>
                <p key={i}>
                    <b>{review.username}</b> {review.comment} &nbsp;&nbsp;&nbsp;
                    <Glyphicon glyph={'star'} /> {review.rating}
                </p>
            );
        }

        const ReviewForm = ({currentMovie}) => {
            return (
                <Form horizontal key="reviewForm">
                    <FormGroup controlId="rating" key="ratingFormGroup">
                        <Col componentClass={ControlLabel} sm={3}>
                            Rating (under 5)
                        </Col>
                        <Col sm={9}>
                            <FormControl key="ratingFormControl" onChange={this.updateReviewDetails} value={this.state.details.rating} type="Number" min="0" max="5" />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="comment">
                        <Col componentClass={ControlLabel} sm={3}>
                            Comment
                        </Col>
                        <Col sm={9}>
                            <FormControl key="ratingFormControl" onChange={this.updateReviewDetails} value={this.state.details.comment} type="text" placeholder="Your Review..." />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="title">
                        <FormControl type="hidden" value={currentMovie.title} onLoad={this.updateReviewDetails} />
                    </FormGroup>

                    <FormGroup controlId="username">
                        <FormControl type="hidden" value={localStorage.getItem("username")} onLoad={this.updateReviewDetails} />
                    </FormGroup>

                    <FormGroup>
                        <Col smOffset={2} sm={10}>
                            <Button onClick={this.postReview}>Post Review</Button>
                        </Col>
                    </FormGroup>
                </Form>
            );
        }

        const DetailInfo = ({currentMovie}) => {
            if (!currentMovie) { // evaluates to true if currentMovie is null
                return <div>Loading...</div>;
            }
            return (
                <Panel>
                    <Panel.Heading key="movieDetailHeading">Movie Detail</Panel.Heading>
                    <Panel.Body key="movieImage"><Image className="image" src={currentMovie.imageUrl} thumbnail /></Panel.Body>
                    <ListGroup key="movieDetailList">
                        <ListGroupItem>{currentMovie.title}</ListGroupItem>
                        <ListGroupItem><ActorInfo actors={currentMovie.actors} /></ListGroupItem>
                        <ListGroupItem><h4><Glyphicon glyph={'star'} /> {currentMovie.averageRating} </h4></ListGroupItem>
                    </ListGroup>
                    <Panel.Body><ReviewInfo reviews={currentMovie.reviews} /></Panel.Body>
                </Panel>
            );
        };
        return (
            <div>
                <DetailInfo currentMovie={this.props.selectedMovie} />
                <ReviewForm currentMovie={this.props.selectedMovie} />
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
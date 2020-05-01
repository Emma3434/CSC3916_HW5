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
                    <b>{review.username}</b> <i>commented</i>
                    &nbsp;&nbsp;&nbsp; {review.comment} &nbsp;&nbsp;&nbsp;
                    <Glyphicon glyph={'star'} /> {review.rating}
                </p>
            );
        }

        const ReviewForm = ({currentMovie}) => {
            return (
                <Form horizontal key="reviewForm">
                    <FormGroup controlId="rating" key="ratingFormGroup">
                        <h5>Rating (Please enter a number between 0 and 5)</h5>
                        <div>
                            <FormControl key="ratingFormControl" onChange={this.updateReviewDetails} value={this.state.details.rating} type="Number" min = "0" max = "5"/>
                        </div>
                    </FormGroup>

                    <FormGroup controlId="comment">
                        <h5>Comments</h5>
                        <div>
                            <FormControl key="ratingFormControl" onChange={this.updateReviewDetails} value={this.state.details.comment} type="text" placeholder="Leave your comments here..." />
                        </div>
                    </FormGroup>

                    <FormGroup controlId="title">
                        <FormControl type="hidden" value={currentMovie.title} onLoad={this.updateReviewDetails} />
                    </FormGroup>

                    <FormGroup controlId="username">
                        <FormControl type="hidden" value={localStorage.getItem("username")} onLoad={this.updateReviewDetails} />
                    </FormGroup>

                    <FormGroup>
                        <Col smOffset={2} sm={9}>
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
                        <ListGroupItem><h4><Glyphicon glyph={'star'} /> {currentMovie.averageRating} </h4></ListGroupItem>
                        <ListGroupItem>{currentMovie.title}</ListGroupItem>
                        <ListGroupItem>
                            <h4>Leading Actors</h4>
                            <ActorInfo actors={currentMovie.actors} />
                        </ListGroupItem>
                    </ListGroup>
                    <Panel.Body>
                        <h4>Reviews</h4>
                        <ReviewInfo reviews={currentMovie.reviews} />
                    </Panel.Body>
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
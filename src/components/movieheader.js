import React, { Component } from 'react';
import {Navbar, NavItem, Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {connect} from "react-redux";
import { withRouter } from "react-router-dom";
import {logoutUser} from "../actions/authActions";

class MovieHeader extends Component {

    logout(){
        this.props.dispatch(logoutUser());
    }

    render() {
        return (
            <div>
            <Navbar>
            <Navbar.Header>
            <Navbar.Brand>
            Meme Portal
        </Navbar.Brand>
        </Navbar.Header>
        <Nav>
        <LinkContainer to="/movielist">
            <NavItem eventKey={1}>Users </NavItem>
        </LinkContainer>
        <LinkContainer to={'/movie/'+ (this.props.selectedMovie ? this.props.selectedMovie.title: '')}>
            <NavItem eventKey={2}>Movie Detail</NavItem>
        </LinkContainer>
        <LinkContainer to="/signin">
            <NavItem eventKey={3}>{this.props.loggedIn ? <button onClick={this.logout.bind(this)}>Logout</button> : 'Login'}</NavItem>
        </LinkContainer>
        </Nav>
        </Navbar>
        <header className="App-header">
            <h1 className="App-title">{(this.props.selectedMovie ? this.props.selectedMovie.title : '')}</h1>
        </header>
        </div>

    );
    }
}
//disabled={!this.props.loggedIn}
const mapStateToProps = state => {
    return {
        loggedIn: state.auth.loggedIn,
        username: state.auth.username,
        selectedMovie: state.movie.selectedMovie,
    }
}

export default withRouter(connect(mapStateToProps)(MovieHeader));
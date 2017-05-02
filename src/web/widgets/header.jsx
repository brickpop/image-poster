import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link, Route } from 'react-router-dom';

@withRouter
@connect(({ user }) => ({ user }))
class Header extends Component {
	static propTypes = {
		// user: PropTypes.object.isRequired,
		title: PropTypes.string,
		leftLink: PropTypes.string,
		rightLink: PropTypes.string
	}

	renderAlbumsHeader() {
		return (
			<div className="row">
				<div className="col-md-3"></div>
				<div className="col-md-6">
					<h3>Albums</h3>
				</div>
				<div className="col-md-3">
					<Link to="/upload" className="btn">Upload</Link>
				</div>
			</div>
		);
	}

	renderAlbumHeader() {
		return (
			<div className="row">
				<div className="col-md-3 text-left">
					<Link to={`/albums`} className="btn">All Albums</Link>
				</div>
				<div className="title col-md-6">
					<h3>{this.props.title}</h3>
				</div>
				<div className="col-md-3">
					<Link to={this.props.rightLink} className="btn">Upload more</Link>
				</div>
			</div>
		)
	}

	renderAlbumUploadHeader(){
		return (
			<div className="row">
				<div className="col-md-3 text-left">
					<Link to={this.props.leftLink} className="btn">Back to Album</Link>
				</div>
				<div className="title col-md-6">
					<h3>{this.props.title}</h3>
				</div>
			</div>
		)
	}

	renderUploaderHeader(){
		return (
			<div className="row">
				<div className="col-md-3 text-left">
					<Link to={`/albums`} className="btn">All Albums</Link>
				</div>
				<div className="title col-md-6">
					<h3>Upload</h3>
				</div>
			</div>
		)
	}

	render() {
		return (
			<div id="header">
				<Route exact path="/albums" render={() => this.renderAlbumsHeader()} />

				<Route exact path="/albums/:slug" render={() => this.renderAlbumHeader()} />

				<Route exact path="/albums/:slug/upload" render={() => this.renderAlbumUploadHeader()} />
				<Route exact path="/upload" render={() => this.renderUploaderHeader()} />
			</div>
		);
	}
}

export default Header;

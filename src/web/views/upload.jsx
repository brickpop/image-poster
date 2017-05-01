import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

@connect(({ app, albums }) => ({ app, albums }))
class Upload extends Component {
	static propTypes = {
		app: PropTypes.object.isRequired,
		user: PropTypes.object.isRequired,
		albums: PropTypes.array.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	state = {
	}


	render() {
		// const dateStr = daysAgoToString(this.props.app.daysAgo);

		return (
			<div>
			</div>
		);
	}
}

export default Upload;

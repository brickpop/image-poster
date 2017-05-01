import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

@connect(({ user }) => ({ user }))
class Login extends Component {
	static propTypes = {
		user: PropTypes.object.isRequired
	}

	render() {
		if(this.props.user && this.props.user._id) return <div/>;

		return (
			<div id="login">
				<div onClick={ () => location.href = "/api/web/login" } className="txt-pointer">
				<img src="../media/login.png" className="img-responsive" />
				</div>
			</div>
		);
	}
}

export default Login;

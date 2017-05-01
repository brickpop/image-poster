module.exports = function (nga, admin) {
  return nga.dashboard()
		.template(require('./pages/landing.html'));
};

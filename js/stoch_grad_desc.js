var StochGradDesc = function(X, y, theta, alpha, num_iters, means = null, std = null) {

  	if (X && !Array.isArray(X)) throw new Error('X must be an array');
  	if (y && !Array.isArray(y)) throw new Error('y must be an array');
  	if (theta && !Array.isArray(theta)) throw new Error('thate must be an array');

	this.X = X;
	this.y = y;
	this.means = means;
	this.std = std;
	this.theta = theta;
	this.alpha = alpha;
	this.num_iters = num_iters;
	this.current_iter = 0;

	this.J = [];
};

StochGradDesc.prototype.hypothesis = function(x) {
	return _.chain(this.theta)
		.map(function(t, index) { return t * x[index] })
		.sum()
		.value();
};

StochGradDesc.prototype.changepoint = function(data) {
	var jlength = data.length;
	if (jlength > 50) {
		var subset = data.slice(jlength-20, jlength);
		var diff = _.map(subset.slice(1, subset.length), function(x, index) { return Math.abs(x - subset[index]); });

		var ave = _.sum(diff) / diff.length;
		return this.alpha * 0.00001 < ave;
	}

	return true;
};

StochGradDesc.prototype.gradient = function() {
	var self = this;
	var loop = true;
	
	while(loop) {
		var cost_array = [];
		_.each(self.X, function(x, x_idx) {
			var h = self.hypothesis(x);
			self.theta = _.map(self.theta, function(t, t_idx) {
				var cost_part = h - self.y[x_idx];
				var theta = t - self.alpha * cost_part * x[t_idx];

				cost_array.push(0.5 * cost_part * cost_part);
				return theta;
			})
		})

		var cost_sum = _.sum(cost_array) / cost_array.length;
		self.J.push(cost_sum);
		
		loop = self.changepoint(self.J);

		self.current_iter++; 

		if (self.current_iter >= self.num_iters) loop = false;
	}
}
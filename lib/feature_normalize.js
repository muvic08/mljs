var findStd = function(darray, means) {

	var std = new Array(means.length).fill(0);
	var dlength = darray.length;

	var secmoment = _.chain(darray)
		.map(function(x) {
			return _.map(x, function(arr, column) {
				return ((arr - means[column]) * (arr - means[column]));
			})
		})
		.value();

	_.each(means, function(x, column) {
		std[column] = (_.sumBy(secmoment, function(arr) { return arr[column]; }))/dlength;
		std[column] = Math.sqrt(std[column]);
	});

	return std;

}

var findMultiMean = function(darray) {
	return _.map(darray[0], function(x, column) {
		return _.meanBy(darray, function(arr) {
			return arr[column];
		});
	});
}

var featureNormalize = function (darray, means, std) {
	return _.map(darray, function(x) {
		return _.map(x, function(arr, column) {
			return (arr - means[column]) / std[column];
		})
	});
}

var featureDenormalize = function (darray, mean, std) {
	return _.map(darray, function(arr) {
		return (arr * std) + mean;
	});
}


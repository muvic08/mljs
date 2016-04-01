function appendFirstColumn(data) {
	return _.map(data, function(x) {
		return [1].concat(x);
	})
}

function runtest(darray, gd) {

	testX = featureNormalize(darray, gd.means.X, gd.std.X);
	testX = appendFirstColumn(testX);

	var h = _.map(testX, function(x) {
		return gd.hypothesis(x);
	});

	var h2 = featureDenormalize(h, gd.means.y[0], gd.std.y[0]);
	console.log(gd);
	console.log(h2);

	_.each(gd.J, function(x) {
		//console.log(x);
	})
	
}

function trainGradient(data, means, std) {
	
	var X = appendFirstColumn(data.X);
	var y = _.flatten(data.y);

	var theta = new Array(X[0].length).fill(0);
	var alpha = 0.01;
	var num_iters = 2000;

	var gd = new StochGradDesc(X, y, theta, alpha, num_iters, means, std);
	gd.gradient();

	var testX = [[1427, 3], [4478, 5]];
	runtest(testX, gd);


}

function processData(data) {
	var data = $.csv.toArrays(data);
	data = _.shuffle(data);

	var y = [];
	var ymulti = [];
	var X = _.map(data, function(x) {
		var y_value = parseFloat(x[x.length-1]);
		y.push(y_value);
		ymulti.push([y_value]);

		var x_arr = _.map(x.slice(0,x.length-1), function(a) { return parseFloat(a) });

		return x_arr;
	});

	var means = {};
	means.X = findMultiMean(X);
	means.y = findMultiMean(ymulti);

	var std = {};
	std.X = findStd(X, means.X);
	std.y = findStd(ymulti, means.y);

	var norms = {};
	norms.X = featureNormalize(X, means.X, std.X);
	norms.y = featureNormalize(ymulti, means.y, std.y);

	trainGradient(norms, means, std);

}

$(document).ready(function() {
	$.ajax({
	    type: "GET",
	    url: "data.txt",
	    dataType: "text",
	    success: function(data) {processData(data);}
	});
});


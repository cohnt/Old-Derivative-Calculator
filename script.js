//----------------------------------------------------------------------------------------------------
// CONSTANTS
//----------------------------------------------------------------------------------------------------



//----------------------------------------------------------------------------------------------------
// GLOBAL VARIABLES
//----------------------------------------------------------------------------------------------------

var page = {};

//----------------------------------------------------------------------------------------------------
// CLASSES
//----------------------------------------------------------------------------------------------------



//----------------------------------------------------------------------------------------------------
// FUNCTIONS
//----------------------------------------------------------------------------------------------------

function setup() {
	console.log("FUNCTION CALL: setup()");

	page.userFunc = document.getElementById("userFunc"); //
	page.calcButton = document.getElementById("calcButton");
	page.solution = document.getElementById("solution");

	page.calcButton.addEventListener("click", solve);
}
function solve() {
	console.log("FUNCTION CALL: solve()");

	try {
		var rawFuncString = page.userFunc.value;
		var funcArray = rawFuncStringToArray(rawFuncString);
		var derivativeArray = differentiate(funcArray);
		var imgUrl = parseToImgURL(derivativeArray);
		page.solution.setAttribute("src", imgUrl);
	}
	catch(err) {
		alert(String(err[0]) + String(err[1]));
		if(!isNaN(Number(err[1]))) {
			window.setTimeout(function() {
				page.userFunc.setSelectionRange(err[1], err[1]+1);
				page.userFunc.focus();
			}, 0);
		}
		else {
			window.setTimeout(function() {
				page.userFunc.focus();
			}, 0);
		}
	}
}
function rawFuncStringToArray(str) {
	console.log("FUNCTION CALL: rawFuncStringToArray(" + str + ")");

	var fArray = [];

	return fArray;
}
function differentiate(func) {
	console.log("FUNCTION CALL: differentiate(" + func + ")");

	var dArray = [];

	return dArray;
}
function parseToImgURL(d) {
	console.log("FUNCTION CALL: parseToImgURL(" + d + ")");

	var url = "";

	return url;
}

//----------------------------------------------------------------------------------------------------
// EXECUTED CODE
//----------------------------------------------------------------------------------------------------


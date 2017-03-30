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

	var rawFuncString = page.userFunc.value;
	var funcArray = rawFuncStringToArray(rawFuncString);
	var derivativeArray = differentiate(funcArray);
	var imgUrl = parseToImgURL(derivativeArray);
	page.solution.setAttribute("src", imgUrl);
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


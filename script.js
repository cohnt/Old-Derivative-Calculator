//----------------------------------------------------------------------------------------------------
// CONSTANTS
//----------------------------------------------------------------------------------------------------

var mathSpecialStrings = ["(", ")", "+", "-", "*", "/", "^", "arcsin", "arccos", "arctan", "cos", "sin", "tan", "cot", "sec", "csc", "sqrt", "log", "ln", "PI", "E", "T", ","];
var precedence = {
	"+": 2,
	"-": 2,
	"*": 3,
	"/": 3,
	"^": 5,
	"sin": 4,
	"cos": 4,
	"tan": 4,
	"cot": 4,
	"sec": 4,
	"csc": 4,
	"arcsin": 4,
	"arccos": 4,
	"arctan": 4,
	"sqrt": 4,
	"log": 4,
	"ln": 4,
};
var associativity = {
	"+": "left",
	"-": "left",
	"*": "left",
	"/": "left",
	"^": "right",
	"sin": "right",
	"cos": "right",
	"tan": "right",
	"cot": "right",
	"sec": "right",
	"csc": "right",
	"arcsin": "right",
	"arccos": "right",
	"arctan": "right",
	"sqrt": "right",
	"log": "right",
	"ln": "right",
};
var funcArgs = {
	"+": 2,
	"-": 2,
	"*": 2,
	"/": 2,
	"^": 2,
	"sin": 1,
	"cos": 1,
	"tan": 1,
	"cot": 1,
	"sec": 1,
	"csc": 1,
	"arcsin": 1,
	"arccos": 1,
	"arctan": 1,
	"sqrt": 1,
	"log": 1,
	"ln": 1,
}

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
	//This is helpful: https://www.codeproject.com/kb/recipes/differentiation.aspx

	try {
		var rawFuncString = page.userFunc.value;
		var funcArray = rawFuncStringToArray(rawFuncString);
		var stack = convertInfixToPostfix(funcArray);
		var derivativeArray = differentiate(stack);
		var cleanArray = mathClean(derivativeArray);
		var imgUrl = parseToImgURL(cleanArray);
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

	var currentString = str;
	var nextChar;
	var num = "";
	var lastCharOperator = true;
	var negative;
	var currentCharIndex = 0;
	while(currentString.length > 0) {
		while(currentString[0] == " " && currentString.length > 0) {
			currentString = currentString.substr(1);
			++currentCharIndex;
		}
		if(currentString.length == 0) {
			break;
		}
		nextChar = false;
		negative = false;
		if(lastCharOperator && currentString[0] == "-" && !isNaN(currentString[1])) {
			negative = true;
		}
		if(!negative) {
			for(var i=0; i<mathSpecialStrings.length; ++i) {
				if(0 == currentString.indexOf(mathSpecialStrings[i])) {
					fArray.push(mathSpecialStrings[i]);
					currentString = currentString.substr(mathSpecialStrings[i].length);
					currentCharIndex += mathSpecialStrings[i].length;
					nextChar = true;
					if(!(mathSpecialStrings[i] == "(" || mathSpecialStrings[i] == ")")) {
						lastCharOperator = true;
					}
					break;
				}
			}
		}
		if(!nextChar) {
			lastCharOperator = false;
			num = "";
			if(currentString[0] == "-") {
				num += "-";
				currentString = currentString.substr(1);
				++currentCharIndex;
			}
			if(currentString[0] == ".") {
				num += "0";
				currentString = currentString.substr(1);
				++currentCharIndex;
			}
			if(!isOperand(currentString[0])) {
				throw(currentCharIndex);
			}
			while(!isNaN(currentString[0]) || currentString[0] == ".") {
				num = num + currentString[0];
				currentString = currentString.substr(1);
				++currentCharIndex;
			}
			fArray.push(num);
		}
	}
	return fArray;
}
function differentiate(func) {
	console.log("FUNCTION CALL: differentiate(" + func + ")");

	return func;
}
function parseToImgURL(d) {
	console.log("FUNCTION CALL: parseToImgURL(" + d + ")");

	var url = "";

	return url;
}
function isOperand(char) {
	console.log("isOperand(" + char + ")");

	if(!isNaN(Number(char))) {
		return true;
	}
	else if(char == "PI") {
		return true;
	}
	else if(char == "E") {
		return true;
	}
	else if(char == "T") {
		return true;
	}
	else {
		return false;
	}
}
function isOperator(char) {
	var foo = false;
	for(var i=0; i<mathSpecialStrings.length; ++i) {
		if(char == mathSpecialStrings[i]) {
			foo = true;
			break;
		}
	}
	return foo;
}
function mathClean(math) {
	console.log("mathClean("+math+")");
	
	return math;
}
function convertInfixToPostfix(infix) {
	console.log("FUNCTION CALL: convertInfixToPostfix("+infix+")");
	
	//The SHUNTING-YARD ALGORITHM...

	var postfix = [];
	stack = [];
	var stackLast;
	for(var i=0; i<infix.length; ++i) {
		if(isOperand(infix[i])) {
			postfix.push(infix[i]);
		}
		else if(infix[i] == "(") {
			stack.push(infix[i]);
		}
		else if(infix[i] == ")") {
			stackLast = stack.pop();
			while(stackLast != "(") {
				if(typeof stackLast == "undefined") {
					throw("Mismatched parentheses!");
				}
				postfix.push(stackLast);
				stackLast = stack.pop();
			}
		}
		else if(infix[i] == ",") {
			stackLast = stack[stack.length-1];
			while(stackLast != "(") {
				postfix.push(stackLast);
				stack.pop();
				stackLast = stack[stack.length-1];
				if(typeof stackLast == "undefined") {
					throw("Comma error!");
				}
			}
		}
		else if(isOperator(infix[i])) {
			if(stack.length == 0 || stack[stack.length-1] == "(") {
				stack.push(infix[i]);
			}
			else if(precedence[infix[i]] > precedence[stack[stack.length-1]]) {
				stack.push(infix[i]);
			}
			else if((precedence[infix[i]] == precedence[stack[stack.length-1]]) && (associativity[infix[i]] == "right")) {
				stack.push(infix[i]);
			}
			else {
				postfix.push(stack.pop());
				stack.push(infix[i]);
			}
		}
	}
	while(stack.length > 0) {
		postfix.push(stack.pop());
	}
	for(var i=0; i<postfix.length; ++i) {
		if(postfix[i] == "(") {
			throw("Mismatched parentheses!");
		}
	}
	console.log(postfix);
	return postfix;
}

//----------------------------------------------------------------------------------------------------
// EXECUTED CODE
//----------------------------------------------------------------------------------------------------

window.setTimeout(setup, 0);
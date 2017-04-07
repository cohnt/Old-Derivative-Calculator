//----------------------------------------------------------------------------------------------------
// CONSTANTS
//----------------------------------------------------------------------------------------------------

var mathSpecialStrings = ["(", ")", "+", "-", "*", "/", "^", "arcsin", "arccos", "arctan", "cos", "sin", "tan", "cot", "sec", "csc", "sqrt", "log", "ln", "PI", "E", "T"];
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
};
var mathDataCodes = {
	"(": ["%28"],
	")": ["%29"],
	"+": ["%2B"],
	"-": ["-"],
	"*": ["%2A"],
	"/": ["%5Cfrac%7B", "%7D%7B", "%7D"],
	"^": ["%5E%7B", "%7D"],
	"arcsin": ["%5Carcsin%7B", "%7D"],
	"arccos": ["%5Carccos%7B", "%7D"],
	"arctan": ["%5Carctan%7B", "%7D"],
	"sin": ["%5Csin%7B", "%7D"],
	"cos": ["%5Ccos%7B", "%7D"],
	"tan": ["%5Ctan%7B", "%7D"],
	"sec": ["%5Csec%7B", "%7D"],
	"csc": ["%5Ccsc%7B", "%7D"],
	"cot": ["%5Ccot%7B", "%7D"],
	"sqrt": ["%5Csqrt%5B%20%5D%7B", "%7D"],
	"log": ["%5Clog%7B", "%7D"],
	"ln": ["%5Cln%7B", "%7D"],
	"PI": ["%5Cpi%7B%7D"],
	"E": ["e"],
	"T": ["T"]
};

//----------------------------------------------------------------------------------------------------
// GLOBAL VARIABLES
//----------------------------------------------------------------------------------------------------

var page = {};
var lastSolution;

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
		var funcArray = rawFuncStringToArray(rawFuncString);        console.log(funcArray);                 prettyPrintMultiDimArray(funcArray);
		var prefixArray = convertInfixToPrefix(funcArray);          console.log(prefixArray);               prettyPrintMultiDimArray(prefixArray);
		var stackTree = makeStackTree(prefixArray);                 console.log(stackTree);                 prettyPrintMultiDimArray(stackTree);
		var derivativeArray = differentiate(stackTree);             console.log(derivativeArray);           prettyPrintMultiDimArray(derivativeArray);
		var simplifiedDerivativeArray = simplify(derivativeArray);  console.log(simplifiedDerivativeArray); prettyPrintMultiDimArray(simplifiedDerivativeArray);
		var infix = convertStackToInfix(simplifiedDerivativeArray); console.log(infix);                     prettyPrintMultiDimArray(infix);
		lastSolution = infix;
		var imgUrlData = parseStackToImgURL(simplifiedDerivativeArray);
		var imgUrl = makeUrl(imgUrlData);
		page.solution.setAttribute("src", imgUrl);
	}
	catch(err) {
		console.log(err);
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
					if(!(mathSpecialStrings[i] == "(" || mathSpecialStrings[i] == ")" || mathSpecialStrings[i] == "T" || mathSpecialStrings[i] == "E" || mathSpecialStrings[i] == "PI")) {
						lastCharOperator = true;
					}
					else if(mathSpecialStrings[i] == "T" || mathSpecialStrings[i] == "E" || mathSpecialStrings[i] == "PI") {
						lastCharOperator = false;
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

	for(var i=0; i<fArray.length; ++i) {
		if(fArray[i] == "-") {
			fArray.splice(i, 1, "+");
			fArray.splice(i+1, 0, "-1");
			fArray.splice(i+2, 0, "*");
		}
	}

	return fArray;
}
function makeStackTree(pf) {
	console.log("FUNCTION CALL: makeStackTree("+pf+")");

	var st = [];

	if(isOperator(pf[0])) {
		if(!isBinaryOperator(pf[0])) {
			st.push(pf[0]);
			var substrIndex = findArgIndexAndLength(pf, 0);
			var substr = pf.slice(1, 1+substrIndex[1]);
			st.push(makeStackTree(substr));
		}
		else {
			st.push(pf[0]);
			var substr1Index = findArgIndexAndLength(pf, 0);
			var substr1 = pf.slice(1, 1+substr1Index[1]);
			st.push(makeStackTree(substr1));
			var substr2Index = findArgIndexAndLength(pf, 1+substr1Index[1]);
			var substr2 = pf.slice(substr2Index[0]);
			st.push(makeStackTree(substr2));
		}
	}
	else {
		st.push(pf[0]);
	}

	return st;
}
function findArgIndexAndLength(pf, start) {
	console.log("findArgIndexAndLength("+pf+", "+start+")");

	var i = start;
	var unmetArgs = 1;
	do {
		++i;
		--unmetArgs;
		console.log(pf[i]);
		if(isBinaryOperator(pf[i])) {
			unmetArgs += 2;
		}
		else if(isOperator(pf[i])) {
			unmetArgs += 1;
		}
	}
	while(unmetArgs > 0);

	return [start, i];
}
function differentiate(stack) {
	console.log("FUNCTION CALL: differentiate("+stack+")");

	if(isOperand(stack[0])) {
		if(stack[0] == "T") {
			return [1];
		}
		else {
			return [0];
		}
	}
	else {
		var u = stack[1].slice(0);
		if(stack.length == 3) {
			var v = stack[2].slice(0);
		}
		switch(stack[0]) { //Apply differentiation rules here.
			case "+": //Sum Rule: u+v -> du+dv
				return ["+", differentiate(u), differentiate(v)];
				break;
			case "-": //Sum Rule: u-v -> du-dv
				return ["-", differentiate(u), differentiate(v)];
				break;
			case "*": //Product Rule: uv -> udv+vdu
				return ["+", ["*", u, differentiate(v)], ["*", differentiate(u), v]];
				break;
			case "/": //Quotient Rule: u/v -> (vdu-udv)/(v^2)
				return ["/", ["-", ["*", differentiate(u), v], ["*", u, differentiate(v)]], ["^", v, ["2"]]]
				break;
			case "^":
				if(!isNaN(Number(u[0])) || u[0] == "PI" || u[0] == "E") { //k^v -> k^v*ln(k)*dv
					return ["*", ["*", ["^", u, v], ["ln", u]], differentiate(v)];
				}
				else if(!isNaN(Number(v[0])) || v[0] == "PI" || v[0] == "E") { //u^k -> k*u^(k-1)*du
					return ["*", ["*", v, ["^", u, ["-", v, "1"]], differentiate(u)]];
				}
				else { //Logarithm Rule (?): u^v -> (u^v)*((dv*ln(u))+(v*(du/u)))
					return ["*", ["^", u, v], ["+", ["*", differentiate(v), ["ln", u]], ["*", v, ["/", differentiate(u), u]]]];
				}
				break;
			case "sin": //sin(u) -> cos(u)*du
				return ["*", ["cos", u], differentiate(u)];
				break;
			case "cos": //cos(u) -> -1*sin(u)*du
				return ["*", ["-1"], ["*", ["sin", u], differentiate(u)]];
				break;
			case "tan": //tan(u) -> (sec(u))^2*du
				return ["*", ["^", ["sec", u], ["2"]], differentiate(u)];
				break;
			case "sec": //sec(u) -> sec(u)*tan(u)*du
				return ["*", ["sec", u], ["*", ["tan", u], differentiate(u)]];
				break;
			case "csc": //csc(u) -> -1*csc(u)*cot(u)*du
				return ["*", ["*", ["-1"], ["csc", u]], ["*", ["cot", u], differentiate(u)]];
				break;
			case "cot": //cot(u) -> -1*(csc(u))^2*du
				return ["*", ["-1"], ["*", ["^", ["csc", u], ["2"]], differentiate(u)]];
				break;
			case "arcsin": //arcsin(u) -> du/(sqrt(1-u^2))
				return ["/", differentiate(u), ["sqrt", ["-", ["1"], ["^", u, ["2"]]]]];
				break;
			case "arccos": //arccos(u) -> -1*du/(sqrt(1-u^2))
				return ["/", ["*", ["-1"], differentiate(u)], ["sqrt", ["-", ["1"], ["^", u, ["2"]]]]];
				break;
			case "arctan": //arctan(u) -> du/(1+u^2)
				return ["/", differentiate(u), ["+", ["1"], ["^", u, ["2"]]]];
				break;
			case "sqrt": //sqrt(u) -> du/(2*sqrt(u))
				return ["/", differentiate(u), ["*", ["2"], ["sqrt", u]]];
				break;
			case "log": //log(u) -> du/(u*ln(10))
				return ["/", differentiate(u), ["*", u, ["ln", ["10"]]]];
				break;
			case "ln": //ln(u) -> u^(-1)*du
				return ["*", ["^", u, ["-1"]], differentiate(u)];
				break;
		}
	}
}
function convertStackToInfix(stack) {
	console.log("FUNCTION CALL: convertStackToInfix("+stack+")");

	if(stack.length == 1) {
		return stack[0];
	}
	else if(stack.length == 2) {
		return stack[0] + "(" + convertStackToInfix(stack[1]) + ")";
	}
	else if(stack.length == 3) {
		return "(" + convertStackToInfix(stack[1]) + ")" + stack[0] + "(" + convertStackToInfix(stack[2]) + ")";
	}
}
function parseStackToImgURL(d) {
	console.log("FUNCTION CALL: parseStackToImgURL("+d+")");

	if(d.length == 1) {
		if(!isNaN(Number(d[0]))) {
			return d[0];
		}
		else {
			return mathDataCodes[d[0]][0];
		}
	}
	else if(d.length == 2) {
		return "(" + mathDataCodes[d[0]][0] + parseStackToImgURL(d[1]) + mathDataCodes[d[0]][1] + ")";
	}
	else if(d.length == 3) {
		switch(d[0]) {
			case "/":
				return mathDataCodes[d[0]][0] + parseStackToImgURL(d[1]) + mathDataCodes[d[0]][1] + parseStackToImgURL(d[2]) + mathDataCodes[d[0]][2];
				break;
			case "^":
				return "(" + parseStackToImgURL(d[1]) + mathDataCodes[d[0]][0] + parseStackToImgURL(d[2]) + mathDataCodes[d[0]][1] + ")";
				break;
			default:
				return "(" + parseStackToImgURL(d[1]) + ")" + mathDataCodes[d[0]][0] + "(" + parseStackToImgURL(d[2]) + ")";
				break;
		}
	}
}
function makeUrl(data) {
	console.log("FUNCTION CALL: makeUrl("+data+")");
	
	return "http://latex.numberempire.com/render?" + data;
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
	if(char == "T" || char == "PI" || char == "E") {
		return false;
	}
	var foo = false;
	for(var i=0; i<mathSpecialStrings.length; ++i) {
		if(char == mathSpecialStrings[i]) {
			foo = true;
			break;
		}
	}
	return foo;
}
function isBinaryOperator(char) {
	//
	return (char == "+") || (char == "-") || (char == "*") || (char == "/") || (char == "^");
}
function convertInfixToPrefix(infix) {
	console.log("FUNCTION CALL: convertInfixToPrefix("+infix+")");

	//http://scanftree.com/Data_Structure/infix-to-prefix don't fail me now...

	infix.reverse();
	
	//The SHUNTING-YARD ALGORITHM...

	var postfix = [];
	stack = [];
	var stackLast;
	for(var i=0; i<infix.length; ++i) {
		if(isOperand(infix[i])) {
			postfix.push(infix[i]);
		}
		else if(infix[i] == ")") { //Originally (
			stack.push(infix[i]);
		}
		else if(infix[i] == "(") { //Originally )
			stackLast = stack.pop();
			while(stackLast != ")") { //Originally (
				if(typeof stackLast == "undefined") {
					throw("Mismatched parentheses!");
				}
				postfix.push(stackLast);
				stackLast = stack.pop();
			}
		}
		else if(infix[i] == ",") {
			stackLast = stack[stack.length-1];
			while(stackLast != ")") { //Originally (
				postfix.push(stackLast);
				stack.pop();
				stackLast = stack[stack.length-1];
				if(typeof stackLast == "undefined") {
					throw("Comma error!");
				}
			}
		}
		else if(isOperator(infix[i])) {
			if(stack.length == 0 || stack[stack.length-1] == ")") { //Originally (
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
		if(postfix[i] == ")") { //Originally (
			throw("Mismatched parentheses!");
		}
	}

	postfix.reverse();

	var prefix = postfix.slice(0);

	console.log(prefix);

	return prefix;
}
function simplify(math) {
	console.log("simplify("+math+")");
	//Note: https://en.wikipedia.org/wiki/Symbolic_computation#Simplification

	var layers = getArrayDepth(math, 1);

	for(var i=0; i<layers; ++i) {
		math = removeAddSubtractZeros(math);
		math = removeMultiplyDivideZeros(math);
		math = removeMultiplyDivideOnes(math);
		math = sumsOfT(math);
		math = integerArithmetic(math);
		math = trigMath(math);
		math = logMath(math);
		math = expMath(math);
	}

	return math;
}
function getArrayDepth(a, currentDepth) {
	console.log("getArrayDepth("+a+", "+currentDepth+")");

	var depths = [currentDepth];

	for(var i=0; i<a.length; ++i) {
		if(Array.isArray(a[i])) {
			depths.push(getArrayDepth(a[i], currentDepth+1));
		}
	}

	return Math.max.apply(null, depths);
}
function isZero(x) {
	//
	return x == "0" || x == "-0";
}
function removeAddSubtractZeros(math) {
	console.log("FUNCTION CALL: removeAddSubtractZeros("+math+")");
	//When adding or subtracting a zero, get rid of it.

	if(math.length == 1) {
		return [math[0]];
	}
	else if(math.length == 2) {
		return [math[0], removeAddSubtractZeros(math[1])];
	}
	else if(math.length == 3) {
		var o = math[0];
		if(isZero(math[1][0]) && o == "+") {
			return removeAddSubtractZeros(math[2]);
		}
		else if(isZero(math[1][0]) && o == "-") {
			return ["*", ["-1"], removeAddSubtractZeros(math[2])];
		}
		else if(isZero(math[2][0]) && (o == "+" || o == "-")) {
			return removeAddSubtractZeros(math[1]);
		}
		else {
			return [math[0], removeAddSubtractZeros(math[1]), removeAddSubtractZeros(math[2])];
		}
	}
}
function removeMultiplyDivideZeros(math) {
	console.log("FUNCTION CALL: removeMultiplyDivideZeros("+math+")");
	//When multiplying by a zero, make it zero.

	if(math.length == 1) {
		return [math[0]];
	}
	else if(math.length == 2) {
		return [math[0], removeMultiplyDivideZeros(math[1])];
	}
	else if(math.length == 3) {
		var o = math[0];
		var a = math[1][0];
		var b = math[2][0];
		if((isZero(a) || isZero(b)) && o == "*") {
			return ["0"];
		}
		else if(isZero(a) && o == "/") {
			if(isZero(b)) {
				alert("Warning, your answer contains 0/0. Answer may be innacurate.");
			}
			return ["0"];
		}
		else {
			return [math[0], removeMultiplyDivideZeros(math[1]), removeMultiplyDivideZeros(math[2])];
		}
	}
}
function removeMultiplyDivideOnes(math) {
	console.log("FUNCTION CALL: removeMultiplyDivideOnes("+math+")");

	if(math.length == 1) {
		return [math[0]];
	}
	else if(math.length == 2) {
		return [math[0], removeMultiplyDivideOnes(math[1])];
	}
	else if(math.length == 3) {
		var o = math[0];
		var a = math[1][0];
		var b = math[2][0];
		if(a == "1" && o == "*") {
			return removeMultiplyDivideOnes(math[2]);
		}
		else if(b == "1" && (o == "*" || o == "/")) {
			return removeMultiplyDivideOnes(math[1]);
		}
		else {
			return [math[0], removeMultiplyDivideOnes(math[1]), removeMultiplyDivideOnes(math[2])];
		}
	}
}
function sumsOfT(math) {
	console.log("FUNCTION CALL: sumsOfT("+math+")");

	if(math.length == 1) {
		return [math[0]];
	}
	else if(math.length == 2) {
		return [math[0], sumsOfT(math[1])];
	}
	else if(math.length == 3) {
		if(math[1][0] == "T" && math[2][0] == "T" && math[0] == "+") {
			return ["*", ["2"], ["T"]];
		}
		else {
			return [math[0], sumsOfT(math[1]), sumsOfT(math[2])];
		}
	}
}
function integerArithmetic(math) {
	console.log("FUNCTION CALL: integerArithmetic("+math+")");

	if(math.length == 1) {
		return [math[0]];
	}
	else if(math.length == 2) {
		return [math[0], integerArithmetic(math[1])];
	}
	else if(math.length == 3) {
		var a = Number(math[1][0]);
		var b = Number(math[2][0]);
		var o = math[0];
		if(isInt(a) && isInt(b)) {
			switch(o) {
				case "+":
					return [String(a+b)];
					break;
				case "-":
					return [String(a-b)];
					break;
				case "*":
					return [String(a*b)];
					break;
				case "^":
					return [String(Math.pow(a, b))];
					break;
			}
		}
		else {
			return [math[0], integerArithmetic(math[1]), integerArithmetic(math[2])];
		}
	}
}
function trigMath(math) {
	console.log("FUNCTION CALL: trigMath("+math+")");

	if(math.length == 1) {
		return [math[0]];
	}
	else if(math.length == 2) {
		var x = math[1][0];
		switch(math[0]) {
			case "sin":
				if(x == "0") {
					return ["0"];
				}
				break;
			case "cos":
				if(x == "0") {
					return ["1"];
				}
				break;
			case "tan":
				if(x == "0") {
					return ["0"];
				}
				break;
			case "sec":
				if(x == "0") {
					return ["1"];
				}
				break;
			case "csc":
				if(x == "0") {
					return ["/", ["1"], ["0"]];
				}
				break;
			case "cot":
				if(x == "0") {
					return ["/", ["1"], ["0"]];
				}
				break;
			case "arcsin":
				if(x == "0") {
					return ["0"];
				}
				break;
			case "arccos":
				if(x == "0") {
					return ["/", ["PI"], ["2"]];
				}
				break;
			case "arctan":
				if(x == "0") {
					return ["0"];
				}
				break;
		}
		return [math[0], trigMath(math[1])];
	}
	else if(math.length == 3) {
		return [math[0], trigMath(math[1]), trigMath(math[2])];
	}
}
function logMath(math) {
	console.log("FUNCTION CALL: logMath("+math+")");

	if(math.length == 1) {
		return [math[0]];
	}
	else if(math.length == 2) {
		var x = math[1][0];
		switch(math[0]) {
			case "log":
				if(isInt(Number(x)) && isInt(Math.log10(Number(x)))) {
					return [String(Math.log10(Number(x)))];
				}
				else if(x == "10") {
					return ["1"];
				}
				else if(x == "^") { //log(a^b) = b*log(a)
					return ["*", logMath(math[1][2]), ["log", logMath(math[1][1])]];
				}
				break;
			case "ln":
				if(x == "0") {
					return ["/", ["-1"], ["0"]];
				}
				else if(x == "E") {
					return ["1"];
				}
				else if(x == "^") { //log(a^b) = b*log(a)
					return ["*", logMath(math[1][2]), ["ln", logMath(math[1][1])]];
				}
				break;
		}
		return [math[0], logMath(math[1])];
	}
	else if(math.length == 3) {
		return [math[0], logMath(math[1]), logMath(math[2])];
	}
}
function expMath(math) {
	console.log("FUNCTION CALL: expMath("+math+")");

	if(math.length == 1) {
		return [math[0]];
	}
	else if(math.length == 2) {
		return [math[0], expMath(math[1])];
	}
	else if(math.length == 3) {
		var o = math[0];
		var a = math[1][0];
		var b = math[2][0];
		if(o == "^") {
			if(isZero(a) && isZero(b)) {
				alert("Warning, your answer contains 0^0. Answer may be innacurate.");
				return ["1"];
			}
			if(isZero(a)) {
				return ["0"];
			}
			else if(isZero(b)) {
				return ["1"];
			}
			else if(a == "1") {
				return ["1"];
			}
			else if(b == "1") {
				return [a];
			}
			else {
				return [math[0], expMath(math[1]), expMath(math[2])]; 
			}
		}
		else {
			return [math[0], expMath(math[1]), expMath(math[2])];
		}
	}
}
function isInt(x) {
	//
	return x % 1 == 0
}
function prettyPrintMultiDimArray(a, numIndents) {
	for(var i=0; i<a.length; ++i) {
		var indent = "";
		for(var j=0; j<numIndents-1; ++j) {
			indent = indent + "\t";
		}
		if(numIndents > 0) {
			indent = indent + "\u21B3\t";
		}
		if(!Array.isArray(a[i])) {
			console.log(indent + String(a[i]));
		}
		else {
			prettyPrintMultiDimArray(a[i], numIndents+1);
		}
	}
}

//----------------------------------------------------------------------------------------------------
// EXECUTED CODE
//----------------------------------------------------------------------------------------------------

window.setTimeout(setup, 0);
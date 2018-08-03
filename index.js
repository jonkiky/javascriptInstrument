var fs = require('fs');
var parser = require('esprima');
var generator = require('escodegen')





var console_log_template =  {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "CallExpression",
                            "callee": {
                                "type": "MemberExpression",
                                "computed": false,
                                "object": {
                                    "type": "Identifier",
                                    "name": "console"
                                },
                                "property": {
                                    "type": "Identifier",
                                    "name": "log"
                                }
                            },
                            "arguments": [
                                {
                                    "type": "BinaryExpression",
                                    "operator": "+",
                                    "left": {
                                        "type": "Literal",
                                        "value": "Output",
                                        "raw": "\"Output\""
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "123"
                                    }
                                }
                            ]
                        }
                    }



var globalVars = [];
function instrument(ACT,parent){
	console.log(ACT)
	if(ACT.type == "Program"){
			// get all global variables
			console.log(ACT.body)
			findAllGlobalVar(ACT.body)
	}
			// after get all global var check each function 
	for(var e in ACT.body){
				instrument(ACT.body[e],ACT.body)
	}
	
	if(ACT.type == "FunctionDeclaration"){
		// get params 
		console.log("================================")
		console.log("function")
		console.log(ACT.body.body)
		// find all parms
		if(ACT.params.length>0){
			console.log(ACT.params);
			for(var e in ACT.params){
				console.log("Add console")
				console.log(ACT.params[e].name)
				var log = JSON.parse(JSON.stringify(console_log_template));
				log.expression.arguments[0].right.name = ACT.params[e].name;
				log.expression.arguments[0].left.value = "function."+ACT.id.name+":Enter";
				ACT.body.body.unshift(log);
			}
			// add global monitors
			ACT.body.body.unshift(globalVarMonitor);

		}

		for(let i in ACT.boy.body){
			instrument(ACT.boy.body[i],ACT.boy.body)
		}
	}
	if(ACT.type=="ExpressionStatement"){
		// call function
		if(ACT.expression.type == "CallExpression" && ACT.expression){
			// get function name
			ACT.expression.callee.name;
		}

	}

	if(ACT.type=="IfStatement"){
		// branch

		
	}

	if(ACT.type=="VariableDeclaration"){
		// local var
		
	}


}

function findAllGlobalVar(ACT){

		for(var e in ACT){
			if(ACT[e].type == "VariableDeclaration"){
				console.log("getGlobalVar")
				console.log(ACT[e])
				globalVars.push(ACT[e])
			}
		}
		getGlobalVarMonitor();
}


function getGlobalVarMonitor(){
	console.log("getGlobalVarMonitor")
	for(var e in globalVars){
		var log = JSON.parse(JSON.stringify(console_log_template));
		console.log("getGlobalVarMonitor"+JSON.stringify(globalVars[e]))
		var gName = globalVars[e].declarations[0].id.name;
		log.expression.arguments[0].right.name = gName;
		log.expression.arguments[0].left.value = "global Var:";
		globalVarMonitor.push(log);
	}
}





var globalVarMonitor=[];
// get test js
fs.readFile("./test2.js","utf8", function(err,content){

	var syntax = parser.parse(content);

	//console.log(JSON.stringify(syntax,null,4));

	instrument(syntax,null)


	var code = generator.generate(syntax);

	console.log("================================")
	console.log(code)



})

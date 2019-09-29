//List of all tokens
const tokenList = [
    {
        name: "reserved",
        hardRegex: /^(global|body|create|destroy|external|getarg|get|global|import|int|mod|new|procedure|process|read|real|send|resource|returns|scanf|sem|sprintf|stop|writes|write|cap|ref|end|res|val|var|to|af|op|or|fa|fi|if)$/, 
        softRegex: /^(global|body|create|destroy|external|getarg|get|global|import|int|mod|new|procedure|process|read|real|send|resource|returns|scanf|sem|sprintf|stop|writes|write|cap|ref|end|res|val|var|to|af|op|or|fa|fi|if)/,
        print: "onlyWord"
    }
    ,
    {
        name: "id",
        hardRegex: /^[a-zA-Z]+[a-zA-Z0-9]*$/,
        softRegex: /^[a-zA-Z]+[a-zA-Z0-9]*/,
        print: "wordAndToken"
    },
    {
        name: "tk_cadena",
        hardRegex: /^".*"$/,
        softRegex: /^".*"/,
        print: "wordAndToken"
    },
    {
        name: "tk_asig",
        hardRegex: /^:=$/,
        softRegex: /^:=/,
        print: "onlyToken"
    },
    {
        name: "tk_coma",
        hardRegex: /^,$/,
        softRegex: /^,/,
        print: "onlyToken"
    },
    {
        name: "tk_cuad_der",
        hardRegex: /^\]$/,
        softRegex: /^\]/,
        print: "onlyToken"
    },
    {
        name: "tk_cuad_izq",
        hardRegex: /^\[$/,
        softRegex: /^\[/,
        print: "onlyToken"
    },
    {
        name: "tk_distinto",
        hardRegex: /^!=$/,
        softRegex: /^!=/,
        print: "onlyToken"
    },
    {
        name: "tk_dos_puntos",
        hardRegex: /^:$/,
        softRegex: /^:/,
        print: "onlyToken"
    },
    {
        name: "tk_ejecuta",
        hardRegex: /^->$/,
        softRegex: /^->/,
        print: "onlyToken"
    },
    {
        name: "tk_igual",
        hardRegex: /^=$/,
        softRegex: /^=/,
        print: "onlyToken"
    },
    {
        name: "tk_menorque",
        hardRegex: /^<$/,
        softRegex: /^</,
        print: "onlyToken"
    },
    {
        name: "tk_mayorque",
        hardRegex: /^>$/,
        softRegex: /^>/,
        print: "onlyToken"
    },
    {
        name: "tk_expr_sinc",
        hardRegex: /^\?$/,
        softRegex: /^\?/,
        print: "onlyToken"
    },
    {
        name: "tk_multiplicacion",
        hardRegex: /^\*$/,
        softRegex: /^\*/,
        print: "onlyToken"
    },
    {
        name: "tk_par_izq",
        hardRegex: /^\($/,
        softRegex: /^\(/,
        print: "onlyToken"
    },
    {
        name: "tk_par_der",
        hardRegex: /^\)$/,
        softRegex: /^\)/,
        print: "onlyToken"
    },
 
    {
        name: "tk_punto_y_coma",
        hardRegex: /^;$/,
        softRegex: /^;/,
        print: "onlyToken"
    },
    {
        name: "tk_num_real",
        hardRegex: /^(-)?[0-9].[0-9]+[0-9]*$/,
        softRegex: /^(-)?[0-9].[0-9]+[0-9]*/,
        print: "wordAndToken"
    },
    {
        name: "tk_num",
        hardRegex: /^(-)?[0-9]+[0-9]*$/,
        softRegex: /^(-)?[0-9]+[0-9]*/,
        print: "wordAndToken"
    },
    {
        name: "tk_resta",
        hardRegex: /^-$/,
        softRegex: /^-/,
        print: "onlyToken"
    },
    {
        name: "tk_separa",
        hardRegex: /^\[\]/,
        softRegex: /^\[\]/,
        print: "onlyToken"
    },
    {
        name: "tk_suma",
        hardRegex: /^\+$/,
        softRegex: /^\+/,
        print: "onlyToken"
    },
    {
        name: "mod",
        hardRegex: /^mod$/,
        softRegex: /^mod/,
        print: "onlyToken"
    },
    {
        name: "tk_div",
        hardRegex: /^\/$/,
        softRegex: /^\//,
        print: "onlyToken"
    },
    {
        name: "tk_punto",
        hardRegex: /^\.$/,
        softRegex: /^\./,
        print: "onlyToken"
    }
]
 

//Additional Regexs
const commentRegex = /#.*/;


// Useful Variables
var lexical_analysis;
var partial_lexical_analysis;
var wordsToAnalyse = []


//Function to get next token
function getNextToken(){
    if(wordsToAnalyse.length==0)
        lexicalAnalyzer(null, true)
    token = wordsToAnalyse.shift()
    findToken(token.word, token.row)
    console.log(partial_lexical_analysis)
}


//Function that splits the code by breaklines and spaces to obtain the WORD
function lexicalAnalyzer(input, only_load) {
    var code;
    lexical_analysis = "";
    if (!input) 
        code = document.getElementById("codeTextArea").value;
    else 
        code = input;   
    var lines = code.split(/\n/);
    for(var i = 0; i < lines.length; i++){
        var line = lines[i].replace(commentRegex, '');
        var words = splitWithIndex(line)
        for(let word of words){
            if(word.name != ""){
                if(!only_load){ //Sometimes we only need to load all the words but no do the analysis
                    findToken(word, i+1)
                    if(partial_lexical_analysis.match(/Error lexico/)){
                        i = Number.MAX_SAFE_INTEGER //Force break of two loops
                        break;
                    }           
                }  
                wordsToAnalyse.push({word:word, row: i+1})
            }    
        }
    }
    if(!only_load)
        console.log(lexical_analysis)
}
 

//Function that finds the token that matches that WORD, but only when it is an absolute match
function findToken(word, row){
    var matched = false;
    for(let token of tokenList){
        if(word.name.match(token.hardRegex)){
            matched = true;
            print(token, word.name, word.column, row)
            break;
        }
    }
    if(!matched){
        deepFindToken(word.name, row, word.column)
    }
}


//Function that finds the token that matches one word, but only when it is within another one
function deepFindToken(word, row, column) {
    var matched = false;
    var min_index_token = Number.MAX_SAFE_INTEGER;
    var token_to_match;
    for (let token of tokenList) {
        if (word.match(token.softRegex)) {
            matched = true;
            // Get index of the matched regexep
            matched_word = token.softRegex.exec(word)
            if (matched_word.index < min_index_token) {
                min_index_token = matched_word.index;
                token_to_match = token;
            }else if(matched_word.index == min_index_token){ //Solve problem with global1(
                if(token_to_match.softRegex.exec(word)[0] != matched_word[0])
                    token_to_match = token;
            }
        }
    }
    if (matched) {
        var matched_regexp = token_to_match.softRegex.exec(word)[0];
        print(token_to_match, matched_regexp, column, row)
        if (!(word === matched_regexp) && (matched_regexp.length != 0)) {
            var cropped_word = word.replace(matched_regexp, '');
            column += matched_regexp.length
            deepFindToken(cropped_word.trim(), row, column);
        }
    } else {
        partial_lexical_analysis = ">>> Error lexico(linea:" + row + ",posicion:" + column + ")\n"
        lexical_analysis += partial_lexical_analysis
    }
}


//Function that splits by spaces and saves the column of the word
function splitWithIndex(line){
    var splits = line.split(/\s(?=(?:(?:[^"]*"){2})*[^"]*$)/g);
    var words=[]
    var index=0
    for(let split of splits){
        if(split!='')
            words.push({ column: index+1, name: split})
        index += split.length + 1
    }     

    return words
}


//Function that prints the token
function print(token, word, column, row){
    if (token.print == "onlyWord")
        partial_lexical_analysis = "<" + word + "," + row + "," + column + ">\n";
    else if (token.print == "onlyToken")
        partial_lexical_analysis =  "<" + token.name + "," + row + "," + column + ">\n";
    else if (token.print == "wordAndToken")
        partial_lexical_analysis = "<" + token.name + "," + word + "," + row + "," + column + ">\n";
    
    lexical_analysis += partial_lexical_analysis
}


//Function that reads a file
function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}
 
function testInputs() {
    const input1 = `global sizes
   # matrix dimension, default 10
   var N := 10
   # number of processes, default 2
   var PR := 2
   # strip size
   var S : int
   body sizes
     getarg(1, N); getarg(2, PR); S := N/PR
     if N mod PR != 0 ->
       write("N must be a multiple of PR"); stop (1)
     fi
   end`;
 
    const output1 = `<global,1,1>
<id,sizes,1,8>
<var,3,4>
<id,N,3,8>
<tk_asig,3,10>
<tk_num,10,3,13>
<var,5,4>
<id,PR,5,8>
<tk_asig,5,11>
<tk_num,2,5,14>
<var,7,4>
<id,S,7,8>
<tk_dos_puntos,7,10>
<int,7,12>
<body,8,1>
<id,sizes,8,6>
<getarg,9,4>
<tk_par_izq,9,10>
<tk_num,1,9,11>
<tk_coma,9,12>
<id,N,9,14>
<tk_par_der,9,15>
<tk_punto_y_coma,9,16>
<getarg,9,18>
<tk_par_izq,9,24>
<tk_num,2,9,25>
<tk_coma,9,26>
<id,PR,9,28>
<tk_par_der,9,30>
<tk_punto_y_coma,9,31>
<id,S,9,33>
<tk_asig,9,35>
<id,N,9,38>
<tk_div,9,39>
<id,PR,9,40>
<if,10,4>
<id,N,10,7>
<mod,10,9>
<id,PR,10,13>
<tk_distinto,10,16>
<tk_num,0,10,19>
<tk_ejecuta,10,21>
<write,11,6>
<tk_par_izq,11,11>
<tk_cadena,"N must be a multiple of PR",11,12>
<tk_par_der,11,40>
<tk_punto_y_coma,11,41>
<stop,11,43>
<tk_par_izq,11,48>
<tk_num,1,11,49>
<tk_par_der,11,50>
<fi,12,4>
<end,13,1>
                  `;
    const input2 = `2.5598055not3!=88&56.a`;
 
    const output2 = `<tk_num,2.5598055,1,1>
    <id,not3,1,10>
    <tk_distinto,1,14>
    <tk_num,88,1,16>
    >>> Error lexico(linea:1,posicion:18)`;
    const input3 = `!=$`;
    const output3 = `<tk_distinto,1,1>
    >>> Error lexico(linea:1,posicion:3)`;
    const input4 = `     ()(()()()()()())()&getarg!=
global1
global
i1if
ifif
if`
  const output4 = ` SIN GETARG ERROR LEXICO`
 
 
    console.log(lexicalAnalyzer(input1));
 
}
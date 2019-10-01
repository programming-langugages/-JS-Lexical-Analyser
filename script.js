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
        name: "tk_cor_der",
        hardRegex: /^\]$/,
        softRegex: /^\]/,
        print: "onlyToken"
    },
    {
        name: "tk_cor_izq",
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
        name: "tk_multi",
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
        name: "tk_num",
        hardRegex: /(^(-)?[0-9]*\.[0-9]+[0-9]*$)|(^(-)?[0-9]+[0-9]*$)/,
        softRegex: /(^(-)?[0-9]*\.[0-9]+[0-9]*)|(^(-)?[0-9]+[0-9]*)/,
        print: "wordAndToken"
    },
    {
        name: "tk_menos",
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
    },
    {
        name: "tk_swap",
        hardRegex: /^:=:$/,
        softRegex: /^:=:/,
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
    if(!only_load){
        console.log(lexical_analysis)
        $('#result').html(lexical_analysis.replace(/&/g, '&amp;')
                                        .replace(/>/g, '&gt;')
                                        .replace(/</g, '&lt;')
                                        .replace(/\n/g,'<br/>'))
    }  
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

const input5 = `90.00.50`;
const output5 = `<tk_num,90.00,1,1>
<tk_punto,1,6>
<tk_num,50,1,7>`

const input6 = `1&23948998`;
const output6 = `<tk_num,1,1,1>
>>> Error lexico(linea:1,posicion:2)`;
    console.log(lexicalAnalyzer(input1));

const input7 = ``;

const output7 = `<resource,1,1>
<id,factorial,1,10>
<tk_par_izq,1,19>
<tk_par_der,1,20>
<procedure,3,4>
<id,fact,3,14>
<tk_par_izq,3,18>
<id,k,3,19>
<tk_dos_puntos,3,20>
<int,3,22>
<tk_par_der,3,25>
<returns,3,27>
<id,f,3,35>
<tk_dos_puntos,3,36>
<int,3,38>
<if,4,7>
<id,k,4,10>
<tk_menorque,4,12>
<tk_num,0,4,14>
<tk_ejecuta,4,16>
<id,f,4,19>
<tk_asig,4,21>
<tk_num,-1,4,24>
<tk_separa,5,7>
<id,k,5,10>
<tk_igual,5,12>
<tk_num,0,5,14>
<or,5,16>
<id,k,5,19>
<tk_igual,5,21>
<tk_num,1,5,23>
<tk_ejecuta,5,25>
<id,f,5,28>
<tk_asig,5,30>
<tk_num,1,5,33>
<tk_separa,6,7>
<id,k,6,10>
<tk_mayorque,6,12>
<tk_num,1,6,14>
<tk_ejecuta,6,16>
<id,f,6,19>
<tk_asig,6,21>
<id,k,6,24>
<tk_multi,6,26>
<id,fact,6,28>
<tk_par_izq,6,32>
<id,k,6,33>
<tk_menos,6,34>
<tk_num,1,6,35>
<tk_par_der,6,36>
<fi,7,7>
<end,8,4>
<id,fact,8,8>
<var,10,4>
<id,n,10,8>
<tk_dos_puntos,10,9>
<int,10,11>
<writes,11,4>
<tk_par_izq,11,10>
<tk_cadena,"Cuántos factoriales hay? ",11,11>
<tk_par_der,11,38>
<tk_punto_y_coma,11,39>
<read,11,41>
<tk_par_izq,11,45>
<id,n,11,46>
<tk_par_der,11,47>
<write,12,4>
<tk_par_izq,12,9>
<tk_par_der,12,10>
<fa,13,4>
<id,i,13,7>
<tk_asig,13,9>
<tk_num,1,13,12>
<to,13,14>
<id,n,13,17>
<tk_ejecuta,13,19>
<write,14,7>
<tk_par_izq,14,12>
<id,i,14,13>
<tk_coma,14,14>
<tk_cadena,"el factorial es ",14,16>
<tk_coma,14,34>
<id,fact,14,36>
<tk_par_izq,14,40>
<id,i,14,41>
<tk_par_der,14,42>
<tk_par_der,14,43>
<af,15,4>
<end,16,1>
<id,factorial,16,5>

`;



}

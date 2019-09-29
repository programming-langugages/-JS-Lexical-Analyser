//List of all tokens
const tokenList = [{
    name: "reserved",
    regex: /(global|var|body|destroy|end|external|fa|fi|getarg|get|global|import|if|int|mod|new|op|process|read|real|ref|resource|res|returns|scanf|sem|sprintf|stop|to|val|var|writes|write)/,
    unique: true
},
{
    name: "id",
    regex: /^[a-zA-Z]+[0-9]*/,
    unique: false
},
{
    name: "tk_cadena",
    regex: /^"[a-zA-Z0-9_ ]*"/,
    unique: false
},
{
    name: "tk_asig",
    regex: /^:=/,
    unique: true
},
{
    name: "tk_coma",
    regex: /^,/,
    unique: true
},
{
    name: "tk_cuad_der",
    regex: /^\]/,
    unique: true
},
{
    name: "tk_cuad_izq",
    regex: /^\[/,
    unique: true
},
{
    name: "tk_distinto",
    regex: /^!=/,
    unique: true
},
{
    name: "tk_dos_puntos",
    regex: /^:/,
    unique: true
},
{
    name: "tk_ejecuta",
    regex: /^->/,
    unique: true
},
{
    name: "tk_expr_sinc",
    regex: /^\?/,
    unique: true
},
{
    name: "tk_multiplicacion",
    regex: /^\*/,
    unique: true
},
{
    name: "tk_par_izq",
    regex: /^\(/,
    unique: true
},
{
    name: "tk_par_der",
    regex: /^\)/,
    unique: true
},

{
    name: "tk_punto_y_coma",
    regex: /^;/,
    unique: true
},
{
    name: "tk_resta",
    regex: /^-/,
    unique: true
},
{
    name: "tk_separa",
    regex: /^\[\]/,
    unique: true
},
{
    name: "tk_suma",
    regex: /^\+/,
    unique: true
},
{
    name: "tk_num_real",
    regex: /^[0-9].[0-9]+[0-9]*/,
    unique: false
},
{
    name: "tk_num",
    regex: /^[0-9]+[0-9]*/,
    unique: false
},

{
    name: "mod",
    regex: /^mod/,
    unique: true
},
{
    name: "tk_div",
    regex: /^\//,
    unique: true
}
]

const tokenList2 = [{
    name: "reserved",
    regex: /(global|var|body|destroy|end|external|fa|fi|getarg|get|global|import|if|int|mod|new|op|process|read|real|ref|resource|res|returns|scanf|sem|sprintf|stop|to|val|var|writes|write)/,
    unique: true
},
{
    name: "id",
    regex: /^[a-zA-Z]+[0-9]*/,
    unique: false
},
{
    name: "tk_cadena",
    regex: /^"[a-zA-Z0-9_ ]*"/,
    unique: false
},
{
    name: "tk_asig",
    regex: /^:=/,
    unique: true
},
{
    name: "tk_coma",
    regex: /^,/,
    unique: true
},
{
    name: "tk_cuad_der",
    regex: /^\]/,
    unique: true
},
{
    name: "tk_cuad_izq",
    regex: /^\[/,
    unique: true
},
{
    name: "tk_distinto",
    regex: /^!=/,
    unique: true
},
{
    name: "tk_dos_puntos",
    regex: /^:/,
    unique: true
},
{
    name: "tk_ejecuta",
    regex: /^->/,
    unique: true
},
{
    name: "tk_expr_sinc",
    regex: /^\?/,
    unique: true
},
{
    name: "tk_multiplicacion",
    regex: /^\*/,
    unique: true
},
{
    name: "tk_par_izq",
    regex: /^\(/,
    unique: true
},
{
    name: "tk_par_der",
    regex: /^\)/,
    unique: true
},

{
    name: "tk_punto_y_coma",
    regex: /^;/,
    unique: true
},
{
    name: "tk_resta",
    regex: /^-/,
    unique: true
},
{
    name: "tk_separa",
    regex: /^\[\]/,
    unique: true
},
{
    name: "tk_suma",
    regex: /^\+/,
    unique: true
},
{
    name: "tk_num_real",
    regex: /^[0-9].[0-9]+[0-9]*/,
    unique: false
},
{
    name: "tk_num",
    regex: /^[0-9]+[0-9]*/,
    unique: false
},

{
    name: "mod",
    regex: /^mod/,
    unique: true
},
{
    name: "tk_div",
    regex: /^\//,
    unique: true
}
]

//Regexs
const commentRegex = /#.*/;
const stringRegex = /".*"/;

var answer = "";

//Function that splits the code by breaklines and spaces to obtain the WORD
function lexicalAnalyzer(){
    console.log("START LEXICAL")
    var code = document.getElementById("codeTextArea").value;
    var lines = code.split(/\n/);
   
    for(var i = 0; i < lines.length; i++){
        var line = lines[i].replace(commentRegex, '');
        var words = splitWithIndex(line)
        for(let word of words){
            if(word.name != "")
                findToken(word, i+1)
        }
    }
    console.log(answer)
}

//Function that find the token that matches that WORD
function findToken(word, row){
    var matched = false;
    for(let token of tokenList){
        if(word.name.match(token.regex)){
            matched = true;
            if(token.name == "id")
                answer += "<" + token.name + "," + word.name + "," + row + "," + word.column + ">\n"     
            else if (token.name == "reserved")   
                answer +="<" + word.name + "," + row + "," + word.column + ">\n"  
            else
                answer += "<" + token.name + "," + row + "," + word.column + ">\n"  
            break;
        }
    }
    if(!matched){
        deepFindToken(word.name, row, word.column)
    }
}


function deepFindToken(word, row, column) {
    var matched = false;
    var min_index_token = Number.MAX_SAFE_INTEGER;
    var token_to_match;
    for (let token of tokenList2) {
        if (word.match(token.regex)) {
            matched = true;
            // Get index of the matched regexep
            if (token.regex.exec(word).index < min_index_token) {
                min_index_token = token.regex.exec(word).index;
                token_to_match = token;
            }
        }
    }
    if (matched) {
        var matched_regexp = token_to_match.regex.exec(word)[0];
        if(token_to_match.name == "id")
            answer += "<" + token_to_match.name + "," + matched_regexp + "," + row + "," + column + ">\n"     
        else if (token_to_match.name == "reserved")   
            answer +="<" + matched_regexp + "," + row + "," + column + ">\n"  
        else
            answer += "<" + token_to_match.name + "," + row + "," + column + ">\n"  
        if (!(word === matched_regexp) && (matched_regexp.length != 0)) {
            var cropped_word = word.replace(matched_regexp, '');
            column += matched_regexp.length
            deepFindToken(cropped_word.trim(), row, column, answer);
        }

    } else {
        answer += ">>> Error lexico(linea:" + row + ",posicion:" + column + ")\n"
    }
}

//Function that splits by spaces and saves the column of the word
function splitWithIndex(line){
    var splits = line.split(/\s/)
    var words=[]
    var index=0
    for(let split of splits){
     words.push({ column: index+1, name: split})
     index += split.length + 1
    }
    return words
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


    lexicalAnalyzer(input1);

}
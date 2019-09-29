//DIE EINZIGE, DIE FUNKTIONERT



//List of all tokens
const tokenList = [
    {
        name: "reserved",
        regex: /^(global|var|body|destroy|end|external|fa|fi|getarg|get|global|import|if|int|mod|new|op|process|read|real|ref|resource|res|returns|scanf|sem|sprintf|stop|to|val|var|writes|write)/,
        unique: true
    }
    ,
    {
        name: "id",
        regex: /^[a-zA-Z]+[a-zA-Z0-9]*/,
        unique: false
    },
    {
            name: "reserved",
            regex: /^(global|var|body|destroy|end|external|fa|fi|getarg|get|global|import|if|int|mod|new|op|process|read|real|ref|resource|res|returns|scanf|sem|sprintf|stop|to|val|var|writes|write)$/,
            unique: true
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

//Regex for a comment
const commentRegex = /#.*/;
const beginOfStringRegex = /".+/;
const endOfStringRegex = /.+"/;


//Function that splits the code by breaklines and spaces to obtain the WORD
function lexicalAnalyzer(input) {
    var code;
    var lexical_analysis = "";
    var answer = "";
    if (!input) code = document.getElementById("codeTextArea").value;
    else code = input;
    var lines = code.split(/\n/);
    console.log(lines);
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].replace(commentRegex, '');
        //var words = splitWithIndex(line);
        console.log(count_white_spaces(line));
        console.log("Processing line " + line.toString());
        lexical_analysis += findToken(line.trim(), i + 1, count_white_spaces(line) + 1, answer);
        // for(let word of words){
        //   answer = "";
        //   console.log("Entering");
        //   console.log(word);
        //     //if(word != "")
        //       //lexical_analysis +=  findToken(word, i+1, answer)
        // }
    }
    console.log("Analysis");
    console.log(lexical_analysis);
}

function count_white_spaces(line) {
    var counter = 0;
    for (var i = 0; i < line.length; i++) {
        if (line[i] == ' ') {
            counter += 1
        } else {
            break;
        }
    }
    return counter;
}
//Function that find the token that matches that WORD
function findToken(word, row, column, answer) {
    var matched = false;
    //Check if the string is either empty or is composed of whitespaces
    if (!word || (word.length === 0) || (word.match(/^\s*$/))) return answer
    counter = 0;

    var min_index_token = Number.MAX_SAFE_INTEGER;
    var token_to_match;
    for (let token of tokenList) {
        console.log("Comparision");
        console.log(token);
        console.log(word);
        console.log(word.match(token.regex));
        if (word.match(token.regex)) {
            matched = true;
            counter += 1
            // console.log("Which ");
            // console.log(token);
            // console.log(token.regex.exec(word));
            // Get index of the matched regexep
            // console.log(token.regex.exec(word).index);
            if (token.regex.exec(word).index < min_index_token) {
                min_index_token = token.regex.exec(word).index;
                token_to_match = token;
            }
        }
    }
    console.log("Matched? " + matched);
    if (matched) {
        console.log("Matched!");
        console.log(token_to_match);
        console.log(token_to_match.regex.exec(word));
        console.log(token_to_match.regex.exec(word).index);
        console.log("Matched!");
        var matched_regexp = token_to_match.regex.exec(word)[0];
        console.log("MATCHED REGULAR EXPRESSION");
        console.log(matched_regexp);
        //column += token_to_match.regex.exec(word).index;
        if (token_to_match.name == "reserved")
            answer += "<" + matched_regexp + "," + row + "," + column + ">\n";
        else if (token_to_match.name == "id")
            answer += "<" + token_to_match.name + "," + matched_regexp + "," + row + "," + column + ">\n";
        else if (token_to_match.unique == true)
            answer += "<" + token_to_match.name + "," + row + "," + column + ">\n";
        else
            answer += "<" + token_to_match.name + "," + matched_regexp + "," + row + "," + column + ">\n";
        console.log("Answer until now");
        console.log(answer + " " + word + " " + column + " " + row);
        if (!(word === matched_regexp) && (matched_regexp.length != 0)) {
            var cropped_word = word.replace(matched_regexp, '');

            console.log("Next")
            console.log(cropped_word.trim());

            var offset = find_next_column(word, token_to_match.regex.exec(word).index + matched_regexp.length, cropped_word.trim());
            console.log("Fixing");
            console.log(token_to_match.regex.exec(word).index + matched_regexp.length);
            console.log(word[token_to_match.regex.exec(word).index + matched_regexp.length ]);
            console.log("offset " + offset);
            column += matched_regexp.length + offset // + count_white_spaces(word);
            return findToken(cropped_word.trim(), row, column, answer);
        }

    } else {
        answer += ">>> Error lexico(linea:" + row + ",posicion:" + column + ")\n"
        return answer;
    }
    return answer;
}

function find_next_column(line, start, next) {
    counter = 0;
    for (var i = start; i < line.length; i++) {
        if (line[i] == next[0]) {
            break;
        } else counter += 1;
    }
    return counter;
}
//Function that splits by spaces and saves the column of the word
function splitWithIndex(line) {
    var splits = line.split(/\s/)
    var words = []
    var index = 0
    for (let split of splits) {
        words.push({
            column: index + 1,
            name: split
        })
        index += split.length + 1
    }
    console.log("words " + words.toString());
    return words
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

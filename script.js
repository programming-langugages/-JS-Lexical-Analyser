//List of all tokens
const tokenList = [
    {
        name: "reserved",
        regex: /^(global|var|body|destroy|end|external|fa|fi|get|getarg|global|import|int|mod|new|op|process|read|real|ref|res|resource|returns|scanf|sem|sprintf|stop|to|val|var|write|writes)$/
    },
    {
        name: "id",
        regex: /^[a-zA-Z]+[0-9]*/
    },
    {
        name: "tk_asig",
        regex: /^:=/
    },
    {
        name: "tk_coma",
        regex: /^,/
    },
    {
        name: "tk_cuad_der",
        regex: /^\]/
    },
    {
        name: "tk_cuad_izq",
        regex: /^\[/
    },
    {
        name: "tk_distinto",
        regex: /^!=/
    },
    {
        name: "tk_dos_puntos ",
        regex: /^:/
    },
    {
        name: "tk_ejecuta",
        regex: /^->/
    },
    {
        name: "tk_expr_sinc",
        regex: /^\?/
    },
    {
        name: "tk_multiplicacion",
        regex: /^\*/
    },
    {
        name: "tk_par_der",
        regex: /^\(/
    },
    {
        name: "tk_par_izq",
        regex: /^\)/
    },
    {
        name: "tk_punto_y_coma",
        regex: /^;/
    },
    {
        name: "tk_resta",
        regex: /^-/
    },
    {
        name: "tk_separa",
        regex: /^\[\]/
    },
    {
        name: "tk_suma",
        regex: /^\+/
    },
    {
        name: "tk_num",
        regex: /^[0-9]*$/
    },
    {
        name: "tk_num_real",
        regex: /^[0-9].[0-9]*/
    }
]

//Regex for a comment
const commentRegex = /#.*/;
const beginOfStringRegex = /".+/;
const endOfStringRegex = /.+"/;


//Function that splits the code by breaklines and spaces to obtain the WORD
//Function that splits the code by breaklines and spaces to obtain the WORD
function lexicalAnalyzer(input){
    var code;
    var lexical_analysis = "";
    var answer = "";
    if(!input) code = document.getElementById("codeTextArea").value;
    else code = input;
    var lines = code.split(/\n/);
    for(var i = 0; i < lines.length; i++){
        var line = lines[i].replace(commentRegex, '');
        var words = splitWithIndex(line)
        for(let word of words){
          answer = "";
          console.log(word);
            if(word.name != "")
              lexical_analysis +=  findToken(word, i+1, answer)
        }
    }
    console.log("Analysis");
    console.log(lexical_analysis);
}


//Function that find the token that matches that WORD
function findToken(word, row, answer){
  var matched = false;
    for(let token of tokenList){


        if(word.name.match(token.regex)){
          matched = true;
            console.log(token);
            console.log(word.name);
            console.log(word);
            console.log(token.regex.exec(word.name));
            var matched_regexp = token.regex.exec(word.name)[0];

            if(token.name == "id")
                answer += "<" + token.name + "," + matched_regexp + "," + row + "," + word.column + ">\n" ;
            else if (token.name == "reserved")
                answer += "<" + word.name + "," + row + "," + word.column + ">\n";
            else
                answer += "<" + token.name + ","  + row + "," + word.column  + ">\n";
            if(!(word.name === matched_regexp) && (matched_regexp.length != 0)){
              console.log("Redone");
              console.log(matched_regexp);
              var cropped_word = word.name.replace(matched_regexp,'');
              word.name = cropped_word;
              console.log(word);
              console.log(row + matched_regexp.length);
              console.log("answer");
              console.log(answer);
              findToken(word, row + matched_regexp.length, answer);
            }

            break;

        }
    }
  if(!matched)
    answer += ">>> Error lexico(linea:" + word.column + ",posicion:" + row + ")\n";
  return answer;
}


//Function that splits by spaces and saves the column of the word
function splitWithIndex(line){
    var splits=line.split(/\s/)
    var words=[]
    var index=0
    for(let split of splits){
     words.push({ column: index+1, name: split})
     index += split.length + 1
    }
    console.log("words " + words.toString());
    return words
   }

//Function that reads a file
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}
function testInputs(){
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


    console.log(lexicalAnalyzer(input1));

}

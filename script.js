//List of all tokens
const tokenList = [
    {
        name: "reserved",
        regex: /^(global|var|body|destroy|end|external|fa|fi|get|getarg|global|import|int|mod|new|op|process|read|real|ref|res|resource|returns|scanf|sem|sprintf|stop|to|val|var|write|writes)$/   
    },
    {
        name: "id",
        regex: /^[a-zA-Z]+[0-9]*$/
    },
    { 
        name: "tk_asig",
        regex: /:=/
    }
]

//Regex for a comment
const commentRegex = /#.*/;


//Function that splits the code by breaklines and spaces to obtain the WORD
function lexicalAnalyzer(){
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
}


//Function that find the token that matches that WORD
function findToken(word, row){
    for(let token of tokenList){
        if(word.name.match(token.regex)){
            if(token.name == "id")
                console.log("<" + token.name + "," + word.name + "," + row + "," + word.column + ">")     
            else if (token.name == "reserved")   
                console.log("<" + word.name + "," + row + "," + word.column + ">")  
            else
                console.log("<" + token.name + "," + row + "," + word.column + ">")   
            break;
        }    
    }
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
    return words
   }
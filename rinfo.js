/*
* Grammar:
*  <section name='variables'>
*    <keyword_custom> : <type>
*  </section>
*  <section name='comenzar'>
*    <keyword_custom> <operator value=':='> <operands and operators>
*    <keyword name='repetir'> <operand>
*      <keywords>
*  </section name='fin'>
*/


class RInfo{
  constructor(code){
    this.code = code
    this.VAR_ACCEPTED_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
    this.BUILT_IN_SECTIONS = ['variables', 'comenzar', 'fin']
    this.BUILT_IN_DATATYPES = ['numero', 'booleano']
    this.BUILT_IN_KEYWORDS = ['repetir', 'mover', 'derecha']
    this.BUILT_IN_OPERATORS = [':=', '+', '-']
  }

  lexer(){
    let tokens = []
    let line = 1
    let column = 0
    let buffer = ""
    let keyword = ""
    let ident_level = 0
    try {
      this.code.split('').forEach((char, index) => {
        buffer += char

        line += char === "\n"
        column = (char === "\n") ? 0 : column + 1
        if (char === " "){
          ident_level++
        } else if (char === "\n"){
          ident_level = 0
        }

        if (buffer === ": ") {
          tokens.push({
            type: 'declaration',
            value: buffer[0]
          })
        }

        if ((char === " " || char === "\n") && keyword.length === 0){
          buffer = ""
          keyword = ""
          return
        }
        buffer = (char === " ") ? "" : buffer

        // console.log(buffer)

        if (this.BUILT_IN_SECTIONS.includes(buffer)){
          tokens.push({
            type: 'section',
            value: buffer
          })
          buffer = ""
          keyword = ""
          return
        }

        if (this.BUILT_IN_DATATYPES.includes(buffer)){
          tokens.push({
            type: 'datatype',
            value: buffer
          })
          buffer = ""
          keyword = ""
          return
        }

        if (this.BUILT_IN_OPERATORS.includes(buffer)){
          tokens.push({
            type: 'operator',
            value: buffer
          })
          buffer = ""
          keyword = ""
          return
        }

        if (this.BUILT_IN_KEYWORDS.includes(buffer)){
          tokens.push({
            type: 'keyword',
            value: buffer,
            ident_level
          })
          buffer = ""
          keyword = ""
          return
        }

        // console.log(buffer, !isNaN(buffer))
        if ((buffer !== "" && buffer !== " ") && !isNaN(buffer)){
          tokens.push({
            type: 'operand',
            value: Number(buffer)
          })
          buffer = ""
          keyword = ""
          return
        }

        // console.log(buffer)
        if (this.VAR_ACCEPTED_CHARACTERS.includes(char)){
          keyword += char
          // console.log(keyword)
        } else if (keyword !== "" && ((char === " " || char === "\n"))){
          tokens.push({
            type: 'keyword_custom',
            value: keyword,
            ident_level: (ident_level > 0) ? ident_level - 1 : 0
          })
          keyword = ""
          return
        } else if (buffer === ":") {
          return
        } else {
          var BreakException = {
            error: `Unexpected character ${char} at line ${line} column ${column}`
          }
          throw BreakException
        }
      });
    } catch (e) {
      return e
    }
    return {
      error: false,
      tokens
    }
  }


  parser(tokens){
    const len = tokens.length
    let index = 0
    const vars = {}
    if (tokens[len-1].type !== "section" && tokens[len-1].value !== "fin"){
      return console.log("Unexpected end of program, expected fin")
    }
    while(index < len){
      //look for variables section
      if (tokens[index].type === "section" && tokens[index].value === "variables") {
        //save variable names and types
        do {
          if (!tokens[index+1]) {
            return console.log("Unexpected end of line, expected variable name")
          } else if (tokens[index + 1].type !== "keyword_custom") {
            return console.log(`Unexpected token ${tokens[index + 1].value}, expected variable name`)
          } else if (tokens[index + 1].ident_level !== 2) {
            return console.log("Unexpected identation level")
          }
          if (!tokens[index+2]) {
            return console.log("Unexpected end of line, expected variable name")
          } else if (tokens[index + 2].type !== "declaration") {
            return console.log(`Unexpected token ${tokens[index + 2].value}, expected :`)
          }
          if (!tokens[index+3]) {
            return console.log("Unexpected end of line, expected variable name")
          } else if (tokens[index + 3].type !== "datatype") {
            return console.log(`Unexpected token ${tokens[index + 3].value}, expected datatype`)
          }
          //if reached this part, all goes ok
          const varName = tokens[index+1].value
          //random initial value
          vars[varName] = (tokens[index + 3].value === "numero") ? Math.floor(Math.random() * 100) : true

          index += 3 //keyword_custom + declaration + datatype
        } while (tokens[index+1].type !== "section" && tokens[index+1].value !== "comenzar")
        index++
      }
      //look for code section
      if (tokens[index].type === "section" && tokens[index].value === "comenzar") {
        let current_ident_level = 2
        do {
          //look for variables operations
          //FIXME only works with numerical operations
          //if exist and is a variable name and
          //TODO check for ident level
          if (tokens[index+1] && tokens[index+1].type === "keyword_custom"){
            const varName = tokens[index+1].value
            //if var was defined in previous section
            if (varName in vars){
              //if it is an assigment of the variable
              if (tokens[index+2] && tokens[index+2].type === "operator" && tokens[index+2].value === ":="){
                let result = ""
                index += 2 //keyword_custom + operator
                do {
                  if (tokens[index+1]) {
                    result += tokens[index+1].value
                  }
                  // console.log(tokens[index+1].value, result, varName)
                  index++
                //until no more operands lefts
                } while ((tokens[index+1] && tokens[index+1].value !== "fin" && tokens[index+1].ident_level === undefined)
                //|| (tokens[index+1].type === "keyword_custom" && tokens[index+1].ident_level === 0) //case varName+imm+varName2
                || (tokens[index+1].type === "keyword_custom" && tokens[index].type === "operator"))  //case varName1+varName2
                // console.log(tokens[index+1], result)
                //assign the value extracted from the result expression to the variable
                try {
                  vars[varName] = eval(result)
                } catch (e) {
                  //expression result contains variables
                  if (e instanceof ReferenceError) {
                    const extractWords = str => str.match(/[a-zA-Z]+/g);
                    let varNamesInExpression = extractWords(result)
                    varNamesInExpression = [...new Set(varNamesInExpression)]; //remove repeted elements
                    // console.log(varNamesInExpression)
                    varNamesInExpression.forEach((varName) => {
                      //FIXME if an expression its like `veces+veces` will return `vars['vars['veces']']+veces`
                      //   POSSIBLE SOLUTION: MAKE A SET OF VARNAMEINEXPRESSION AND REPLACE ALL OCURRENCE IN RESULT
                      result = result.replaceAll(varName, `vars['${varName}']`)
                    })
                    // console.log(result)
                    vars[varName] = eval(result)
                    if (isNaN(vars[varName])) {
                      return console.log(`Expression ${result} contains syntax errors`) //case some var not declared in result expression
                    }
                  } else if (e instanceof SyntaxError) {
                    // console.log(e)
                    return console.log(`Expression ${result} contains syntax errors`)   //case something like this `5 ++ 7` in result expression
                  }
                }
              } else if (tokens[index+2]) { //this case probably is useful for `repetir varName`
                index++
              } /*else {
                return console.log(`Unexpected value ${tokens[index+1].value}, expected :=`)
              }*/
            } else {
              return console.log(`Variable ${varName} is undefined`)
            }
          } else { //line wasnt a variable
            index++
          }
          //look for repetir
          //look for normal instructions (e.g: mover, derecha)
          // console.log(tokens[index], tokens[index+1])
        } while (tokens[index+1].type !== "section" && tokens[index+1].value !== "fin")
      }
      index++ //DEBUG
    }
    console.log(vars)
  }

  run(){
    const { tokens, error } = this.lexer()
    if (error) {
      return console.error('\x1b[31m%s\x1b[0m', error)
    }
    console.log(tokens)
    this.parser(tokens)
  }
}

const code =
`variables
  veces : numero
  b : booleano
  foo : numero
  times : numero
comenzar
  times := 9
  veces := 5
  foo := veces + 3 - 1 + times + veces
  times := veces + 1 + times + foo + 5
  repetir 3
    mover
  repetir foo
    mover
    derecha
    times := times + 3
  derecha
  foo := foo + 1
fin`
const rinfo = new RInfo(code)
rinfo.run()

//BUG if penultimate line of code is something like this `foo := foo + foo`, `fin` line doesnt get stored

// TODO
// si HFELE
//   juntarFlor
// si HPELE
//   juntarPapel
// si HFELB
//   depositarFlor
// si HPELB
//   depositarPapel
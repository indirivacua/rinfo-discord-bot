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
      index++ //DEBUG
    }
    console.log(vars)
  }

  run(){
    const { tokens, error } = this.lexer()
    if (error) {
      return console.error('\x1b[31m%s\x1b[0m', error)
    }
    this.parser(tokens)
    console.log(tokens)
  }
}

const code =
`variables
  veces : numero
  b : booleano
comenzar
  veces := 5
  foo := veces + 3 - 1
  repetir 3
    mover
  repetir foo
    mover
    derecha
  derecha
fin`
const rinfo = new RInfo(code)
rinfo.run()

// TODO
// si HFELE
//   juntarFlor
// si HPELE
//   juntarPapel
// si HFELB
//   depositarFlor
// si HPELB
//   depositarPapel
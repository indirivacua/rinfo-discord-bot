/*
* Grammar:
*  <section name=variables>
*     <keyword_custom> : <type>
*/


class RInfo{
  constructor(code){
    this.code = code
    this.VAR_ACCEPTED_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
    this.BUILT_IN_SECTIONS = ['variables', 'comenzar', 'fin']
    this.BUILT_IN_DATATYPES = ['numero']
    this.BUILT_IN_KEYWORDS = ['repetir', 'mover', 'derecha']
    this.BUILT_IN_OPERATORS = [':=']
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
        column++
        if (char === " "){
          ident_level++
        } else if (char === "\n"){
          ident_level = 0
        }

        if ((char === " " || char === "\n") && keyword.length === 0){
          buffer = ""
          keyword = ""
          return
        }
        buffer = (char === " ") ? "" : buffer

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
        } /*else {
          var BreakException = {
            error: `Unexpected character at line ${line} column ${column}`
          }
          throw BreakException
        }*/
      });
    } catch (e) {
      return e
    }
    return {
      error: false,
      tokens
    }
  }


  parser(){
  }

  run(){
    const { tokens, error } = this.lexer()
    if (error) {
      return console.error(error)
    }
    this.parser(tokens)
    console.log(tokens)
  }
}

const code =
`variables
  veces: numero
comenzar
  veces := 5
  repetir 3
    mover
  repetir veces
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
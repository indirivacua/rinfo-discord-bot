class Node{
  constructor(){
    this.left = null
    this.right = null
    this.data = null
  }
  setData(data){
    this.data = data
  }
  setBranches(){
    this.left = new Tree()
    this.right = new Tree()
  }
  setBranchesCustom(left, right){
    this.left = left
    this.right = right
  }
  getData(){
    return this.data
  }
  getLeft(){
    return this.left
  }
  getRight(){
    return this.right
  }
}

class Tree{
  constructor(){
    this.root = new Node()
  }
  isEmpty(){
    return (this.root.getData()) ? false : true
  }
  insert(data, branch=null){
    if (this.isEmpty()){
      this.root.setData(data)
      this.root.setBranches()
    } else {
      if (data < this.root.getData()) {
        let node_left = this.root.getLeft()
        node_left.insert(data, branch)
      } else {
        if (data > this.root.getData()) {
          let node_right = this.root.getRight()
          node_right.insert(data, branch)
        }
      }
    }
  }
  inOrder(){
    if (!this.isEmpty()){
      this.root.getLeft().inOrder()
      console.log(this.root.getData())
      this.root.getRight().inOrder()
    }
  }
}

a = new Tree();
console.log(a.isEmpty())
a.insert(5);
a.insert(7);
a.insert(2);
a.insert(3);
a.insert(6);
a.inOrder();

function checkPriorty(PRIORITY, char, element){
  let index = 0
  let orderChar = 0
  let oderElement = 0
  let length = PRIORITY.length
  // console.log(char, element)
  while (index < length){
    if (Array.isArray(PRIORITY[index])){
      if (PRIORITY[index].includes(char)){
        orderChar = index
      }
      if (PRIORITY[index].includes(element)){
        oderElement = index
      }
    } else {
      if (char ===PRIORITY[index])
        orderChar = index
      if (element ===PRIORITY[index])
        oderElement = index
    }
    index++
  }
  return (orderChar > oderElement)
}

function infija2postfija(expression) {
  let stack = []
  let index = 0
  let length = expression.length
  let OPERATORS = ['+','-','*','/']
  let PRIORITY = ['^', ['*','/'], ['+','-']].reverse() //orden de menor a mayor
  let out = ''
  let retorno = ""
  // console.log(PRIORITY)
  while (index < length) {
    const char = expression[index]
    if (OPERATORS.includes(char)){
      if (stack.length !== 0){
        while (stack[stack.length-1] && !checkPriorty(PRIORITY, char, stack[stack.length-1])){ //retorna true si operador tiene mayor prioridad al tope de la pila
          // console.log(char, !checkPriorty(PRIORITY, char, stack[stack.length-1]), stack[stack.length-1])
          out = stack.pop()
          retorno += out
          console.log(out)
        }
        stack.push(char)
      } else {
        stack.push(char)
      }
    } else if (char === "(") {
      stack.push(char)
    } else if (char === ")") {
      if (stack.length !== 0) {
        while (stack[length-1] !== "("){
          out = stack.pop()
          retorno += out
          console.log(out)
        }
        out = stack.pop()
        retorno += out
        console.log(out)
      }
    } else { //es un operando
      out = char
      retorno += out
      console.log(out)
    }
    index++
  }
  stack.forEach((el) => {
    out = el
    retorno += out
    console.log(out)
  })
  return retorno
}

expression_postfija = infija2postfija("2+5*3+1") //253*+1+
console.log(expression_postfija)

class ExpressionTree{
  constructor(expression_postfija){
    let OPERATORS = ['+','-','*','/']
    let index = 0
    let char = ''
    let length = expression_postfija.length
    this.stack = []
    let n, r, hRight, hLeft
    while (index < length) {
      char = expression_postfija[index]
      if (OPERATORS.includes(char)){
        r = new Tree()
        r.insert(char)
        hRight = this.stack.pop()
        hLeft = this.stack.pop()
        r.root.setBranchesCustom(hLeft, hRight)
        this.stack.push(r)
      } else { // es un operando
        n = new Tree()
        n.insert(char)
        this.stack.push(n)
      }
      index++
    }
  }
  getStack(){
    return this.stack[0]
  }
  inOrder(node){
    if (node){
      this.getStack().getLeft().inOrder()
      console.log(this.root.getData())
      this.getStack().getRight().inOrder()
    }
  }
}

et = new ExpressionTree(expression_postfija)
console.log(et)
console.log(et.getStack())
et.getStack().inOrder()
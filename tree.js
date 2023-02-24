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
  insert(data){
    if (this.isEmpty()){
      this.root.setData(data)
      this.root.setBranches()
    } else {
      if (data < this.root.getData()) {
        const node_left = this.root.getLeft()
        node_left.insert(data)
      } else {
        if (data > this.root.getData()) {
          const node_right = this.root.getRight()
          node_right.insert(data)
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

t = new Tree();
console.log(t.isEmpty())
t.insert(5);
t.insert(7);
t.insert(2);
t.insert(3);
t.insert(6);
t.inOrder();

/////////////////////////////////////////////////////////////////////////////////////////

// returns true if operador has higher priority than stack top
function checkPriorty(char, element, PRIORITY){
  let order_char = 0, oder_element = 0
  for (let index = 0; index < PRIORITY.length; index++) {
    const priority_element = PRIORITY[index];
    if (Array.isArray(priority_element)){
      if (priority_element.includes(char)){
        order_char = index
      }
      if (priority_element.includes(element)){
        oder_element = index
      }
    } else {
      if (char === priority_element){
        order_char = index
      }
      if (element === priority_element){
        oder_element = index
      }
    }
  }
  return (order_char > oder_element)
}

function infix2postfix(expression, OPERATORS) {
  let stack = []
  let PRIORITY = ['^', ['*','/'], ['+','-']].reverse() //lowest to highest priority
  let out = ''
  let result = ""
  for (let index = 0; index < expression.length; index++) {
    const char = expression[index]
    if (OPERATORS.includes(char)){ //its an operator
      if (stack.length !== 0){
        while (stack[stack.length-1] && !checkPriorty(char, stack[stack.length-1], PRIORITY)){
          out = stack.pop()
          result += out
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
        while (stack[stack.length-1] !== "("){
          out = stack.pop()
          result += out
          console.log(out)
        }
        out = stack.pop()
        result += out
        console.log(out)
      }
    } else { //its an operand
      out = char
      result += out
      console.log(out)
    }
  }
  stack.forEach((el) => {
    out = el
    result += out
    console.log(out)
  })
  return result
}

let OPERATORS = ['+','-','*','/']
expression_postfix = infix2postfix("2+5*3+1", OPERATORS) //253*+1+
console.log(expression_postfix)

/////////////////////////////////////////////////////////////////////////////////////////

class ExpressionTree{
  constructor(expression_postfix, OPERATORS){
    this.stack = []
    for (let index = 0; index < expression_postfix.length; index++) {
      const char = expression_postfix[index]
      if (OPERATORS.includes(char)){
        const r = new Tree()
        r.insert(char)
        const node_right = this.stack.pop()
        const node_left = this.stack.pop()
        r.root.setBranchesCustom(node_left, node_right)
        this.stack.push(r)
      } else { //its an operand
        const n = new Tree()
        n.insert(char)
        this.stack.push(n)
      }
    }
  }
  getTree(){
    return this.stack[0]
  }
}

et = new ExpressionTree(expression_postfix, OPERATORS)
console.log(et)
console.log(et.getTree())
et.getTree().inOrder()
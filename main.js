 // 动态创建dom元素
  // dom：一个字符串，表示创建什么标签
  // arr：一个对象，表示标签的行内属性，如果为null或者undefined就表示没有行内属性，就不会执行
  // son：一个数组(可选)，如果数组内为一个字符串则appendchild一个文本节点，否则就执行函数的嵌套，用来创建子节点，如果为null或者undefined就表示没有子节点，就不会执行
  // 返回值为一个标签,最后把这个标签放到某个标签里面就行了,比如appendchild()
  function myCreateElement(dom,arr,son){
    var div = document.createElement(dom)
    if(arr !== null && arr !== undefined){
      Object.keys(arr).forEach((k,index)=>{
        div.setAttribute(k,arr[k])
      })
    }
    if(son !== null & son !== undefined){
      son.forEach((c,index)=>{
        if(typeof c === 'string'){
          var text=document.createTextNode(c)
          text.data = c;
          div.appendChild(text)
        }else{
          div.appendChild(c)
        }
      })
    }
    return div;
   }
   
    class creatDom{//生成dom树
      constructor(parms){
        //圆圈的大小及距离
       this.nodeSizeWidth=parms.nodeSizeWidth
        if(!this.nodeSizeWidth){this.nodeSizeWidth = 80}
       this.nodeSizeHeight=parms.nodeSizeHeight
        if(!this.nodeSizeHeight){this.nodeSizeHeight = 60}
        //样式
       this.lineStrokeWidth=parms.lineStrokeWidth,
       this.lineStrokeColor=parms.lineStrokeColor
       this.ellipseStrokeWidth=parms.ellipseStrokeWidth
       this.ellipseStrokeColor=parms.ellipseStrokeColor
       this.ellipseStrokeFill=parms.ellipseStrokeFill
       this.textAnchor=parms.textAnchor
       //父容器
       this.container = parms.container
      this.svg = d3.select(this.container).append('svg')
                  .attr('class','svg')
      this.grp = this.svg.append('g')
        .classed('main',true)
      this.links = this.grp.append('g')
        .classed('links',true)
        console.log(this.grp)
      this.nodes = this.grp.append('g')
        .classed('nodes',true)
      this.node = this.nodes
       
      }
        render(root){
          let tree = d3.tree().nodeSize([this.nodeSizeWidth,this.nodeSizeHeight])(root)
          this.grp.attr('transform', `translate(${window.innerWidth/2},100)`);
  
          this.links
          .selectAll('line.link')
          .data(root.links())
          .join('line')
          .attr('stroke',d=>{
            if(!this.lineStrokeColor){return 'black'}
            else if(typeof this.lineStrokeColor === 'function'){return this.lineStrokeColor()}
            else{return this.lineStrokeColor}
          })
          .attr('stroke-width',d=>{
            if(!this.lineStrokeWidth){return '1px'}
            else if(typeof this.lineStrokeWidth === 'function'){return this.lineStrokeWidth()}
            else {return this.lineStrokeWidth}
          })
          .classed('link', true)
          .transition()
          .duration(1000)
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);
  
          let el = this.node
          .selectAll('g.node')
          .data(root.descendants(),d=>d.key)
          .join('g')
          .classed('node', true)
          
          
            el
          .selectAll('ellipse')
          .data(d=>[d],d=>d.key)
          .join('ellipse')
          .attr('rx', 20)
          .attr('ry', 20)    
          .attr('fill',d=>{
            if(!this.ellipseStrokeFill){return 'white'}
            else if(typeof this.ellipseStrokeFill === 'function'){return this.ellipseStrokeFill()}
            else {return this.ellipseStrokeFill}
          })
          .attr('stroke',d=>{
            if(!this.ellipseStrokeColor){return 'black'}
            else if (typeof this.ellipseStrokeColor === 'function'){return this.ellipseStrokeColor()}
            else {return this.ellipseStrokeColor}
          })
          .attr('stroke-width',d=>{
            if(!this.ellipseStrokeWidth){return '1px'}
            else if(!this.ellipseStrokeWidth){return ellipseStrokeWidth()}
            else {return this.ellipseStrokeWidth}
          })
           el
          .selectAll('text')
          .data(d=>[d],d=>d.key)
          .join('text')
          .attr('text-anchor',d=>{
            if(!this.textAnchor){return 'middle'}
            else if(typeof this.textAnchor === 'function'){return this.textAnchor()}
            else {return this.textAnchor}
          })
          .attr('alignment-baseline', 'central')
          .text(d => d.data.name);
          
          el
          .transition()
          .duration(1000)
          .attr('data-type', d => d.data.type)
          .attr('transform', d => `translate(${d.x},${d.y})`)
  
      }
   
      //value 一个表达式字符串
      creatTree(value){
        const n = new Parsing(value).lexIcal()//生成数据结构
        const root = make_parse_tree(value);//处理字符串
        let arr = []//存放所有需要渲染的数据
        console.log(root)
        let cache = [];//存放当前需要渲染的临时数据
        creatArray(root)//生成深度优先排序的数组并放到arr里面
        console.log(arr)
        let shijian = 0//定时器的时间
        for(let i = 0 ; i<arr.length;i++){  
          if(cache.length === 0){      
              cache.push(arr[i])
              this.timer(arr[i],++shijian*1000)
          }else if(cache.length === 1 && arr[i].data.name === "()"||cache.length === 1 && arr[i].data.name === "+" ||cache.length === 1 && arr[i].data.name === "-"){
              cache.pop()
              cache.push(arr[i])
              this.timer(arr[i],++shijian*1000)
          }else{
            if(arr[i].depth === arr[i-1].depth){
              i+=1
              cache.pop()
              cache.push(arr[i])
              this.timer(arr[i],++shijian*1000)
            }else{
              let num2 = i
              while(true){
                num2++
              if(arr[num2].depth === arr[i-1].depth){
                i = num2+1
                cache.pop()
                this.timer(arr[i],++shijian*1000)
                break;
              }
              }
              cache.push(arr[i])
            }
            
          }
        }
  
        //root:为能代表根节点的对象
        function creatArray(root){
          let arr2 = [];
          for(let i = root.descendants().length; i>0;i--){
            arr2.push(i)
          }
  
          dg(root)
          function dg(root){
            if(root.children){
              if(root.children[0]){
                dg(root.children[0])
                root.children[0].key = arr2[arr2.length-1]
                arr2.pop()
                arr.push(root.children[0])
              }
              if(root.children[1]){
                dg(root.children[1])
                root.children[1].key = arr2[arr2.length-1]
                arr2.pop()
                arr.push(root.children[1])
              }
            }
          }
          root.key = arr2[arr2.length-1]
          arr2.pop()
          arr.push(root)//dg函数不会把根节点push到arr，所以这里要手动push一次
        }
  
          //expr：表达式字符串
          function make_parse_tree(expr) {
            const ptree = math.parse(expr);
            const get_name = node => {
              switch (node.type) {
                //case "ArrayNode": return '[]';
                //case "AssignmentNode": return '=';
                //case "BlockNode": return 'Block';
                //case "ConditionalNode": return ;
                case "ConstantNode": return node.value;
                //case "FunctionAssignmentNode": return `${node.name}(${node.params.join(', ')})`;
                //case "FunctionNode": return get_name(node.fn);
                //case "IndexNode": return ;
                //case "ObjectNode": return ;
                case "OperatorNode": return node.op;
                case "ParenthesisNode": return '()';
                //case "RangeNode": return ;
                case "SymbolNode": return node.name;
                default: throw new Error();
              }
            }
            const get_children = node => {
              switch (node.type) {
                //case "ArrayNode": return '[]';
                //case "AssignmentNode": return '=';
                //case "BlockNode": return 'Block';
                //case "ConditionalNode": return ;
                case "ConstantNode": return [];
                //case "FunctionAssignmentNode": return `${node.name}(${node.params.join(', ')})`;
                //case "FunctionNode": return get_name(node.fn);
                //case "IndexNode": return ;
                //case "ObjectNode": return ;
                case "OperatorNode": return node.args;
                case "ParenthesisNode": return [node.content];
                //case "RangeNode": return ;
                case "SymbolNode": return [];
                default: throw new Error();
              }
            }
            
            ptree.traverse((node, path, parent) => {node.name = get_name(node)})
            
            // console.log(ptree)
            const root = d3.hierarchy(ptree, get_children);
      
            root.dx = 10;
            root.dy = window.innerWidth / (root.height + 1);
            // console.log(root)
            return root;
        }
        return n.calc()
      }
      // data：需要进行渲染成dom的数据
      // i：定时器函数的延时时间
       timer(data,i){//定时器函数：指定多少秒后执行渲染函数
          setTimeout(d=>{
            this.render(data)
          },i)
        }
    }
      
      class Node{//定义数据结构
        constructor(option,children){
          this.option = option//运算符
          this.children = children//运算符左右的变量或算式
        }
        
        //计算结果
        calc(){
          let a
          let b
          if(typeof this.children[0] ==='number'){//计算运算符左边的结果
            a = this.children[0]
          }else{
            a = this.children[0].calc()
          }
  
          if(typeof this.children[1] === 'number'){//计算运算符右边的结果
            b = this.children[1]
          }else{
            b = this.children[1].calc()
          }
  
          switch (this.option){//判断运算符 返回计算结果
            case '+':
             return a+b
            case '-':
             return a-b
            case '*':
             return a*b
            case '/':
              if(b === 0){
                throw 'error: 除数不能为0'
              }
             return a/b
            default:
             throw 'error: 您输入的表达式有误'
          }
        }
       
        toString(){ //在控制台打印数据结构          例如1+2+3打印出来因该是这种结构： +
          let output = ''//存放数据                                                 1
          let r = ''//存放数据的缩进                                                 + 
          put(this,r)   //                                                            2
          function put(item,space){//item：数据  space：上一层递归的空格缩进            3
            output += r
            output+=`${item.option}\n`
            r += '\xa0'
  
            item.children.forEach(i=>{
              if(typeof i === 'number'){
                output += r
                output += `${i}\n`  
              }else{
              put(i,r)
              r = (space+='\xa0')
              }
            })
            return output
          }      
          return output
        }
  
        //svg:树的根节点
        //arr：节点距离根节点的坐标
       
      }
      
      class Parsing{//解析字符串
        constructor(value){
          this.value = value//value：用来解析的表达式字符串
        }
         lexIcal(){//词法解析：解析字符和运算符以原本的数据顺序放进一个数组
          let ex = this.value//传过来的字符串
          let token = ''//存放临时的变量
          let op = []//解析完成之后生成的数组
          let hang = 1//行
          let lie = 1//列
          let index = 0//下标
          for(let i = 0;i<ex.length;i++){
            if(/\n/.test(ex[i])){//检测换行符
              hang++
              lie = 1
              index++
              if(i === ex.length-1 && token !==''){//若换行符为最后一个，就将token值push进op
                op.push({
                    token:Number(token),
                    hang:hang,
                    lie:lie-1,
                    index:index-1
                  })
              }
              continue
            }else if(/[ ]/.test(ex[i])){//检测空格
              lie++
              index++
              if(i === ex.length-1 && token !==''){//若空格符为最后一个，就将token值push进op
                op.push({
                    token:Number(token),
                    hang:hang,
                    lie:lie-1,
                    index:index-1
                  })
              }
              continue
            }
            switch(ex[i]){
              case '+':
              case '-':
              case '*':
              case '/':
              case '(':
              case ')':
                if(ex[i] === '+' || ex[i] === '-'){//检测负数和正数，数字前面加正负号只有两种情况 1是符号为整个字符串的的一个 2是符号左边为左括号
                  if(op.length === 0 && token === ''){
                    token += ex[i];
                    break;
                  }else if(op[op.length-1] && op[op.length-1].token === '(' && token === ''){
                    token += ex[i]
                    break;
                  }
                }
                if(token !==''){//检测到当前字符串为括号或运算符时将往op里面push一个对象，对象的token值为当前的token值，并将当前的token清空
                  op.push({
                    token:Number(token),
                    hang:hang,
                    lie:lie-1,
                    index:index-1
                  })
                }
                token = ''
                op.push({
                  token:ex[i],
                  hang:hang,
                  lie:lie,
                  index:index
                })
                break
              default:
                if(ex[i] === '.' && (/^\d+\.\d+$/.test(token) || /^\d+\.$/.test(token))){//检测变量的小数点是否大于1
                  alert('error 小数点大于1： 在第 '+ hang +'行 第 '+(lie)+'列 下标为' +(index)+'处');
                  throw 'error 小数点大于1： 在第 '+ hang +'行 第 '+(lie)+'列 下标为' +(index)+'处'
                }
                if(/\d/.test(ex[i])||ex[i] === '.'){
                 token +=ex[i]
                  if(i ===ex.length-1){//当循环到数组末尾时直接将当前token 添加进op 
                   op.push({
                     token:Number(token),
                     hang:hang,
                     lie:lie,
                     index:index
                   })
                   token = ''
                  }
                }else{
                  alert('Error 应为运算符或变量: 在'+hang+'行'+lie+'列 下标为'+index+'处');
                  throw 'Error 应为运算符或变量: 在'+hang+'行'+lie+'列 下标为'+index+'处'
                }
            }
           lie++
           index++
          }
          return this.grammar(op)
        }
  
          // ex：通过词法解析之后得到的对象数组
         grammar(ex){//语法解析
          let n = /^\n$/
          let start= true
          let count = false
          return Tree(grammarParsing(ex))
          
          // op:字符串表达式
          function grammarParsing(op){
          cutover('start')
          for(let i = 0;i<op.length;i++){
            if(start){//变量状态
              cutover('count')
              if(op[i].token === '('){//判断是否为左括号，如果是则调用括号函数
                brackets(i)
              }else if(!(typeof op[i].token === 'number' || typeof op[i].token === 'object')){
                // op[i] = op[i].token
                alert('error: 应为变量 在第'+op[i].hang+'行 第'+op[i].lie+'列 下标为'+op[i].index+'处')
                throw 'error: 应为变量 在第'+op[i].hang+'行 第'+op[i].lie+'列 下标为'+op[i].index+'处'
              }
            }else if(count){//运算符状态
                if(op[i].token === '('){
                  brackets(i)
                }
                if(count && i === op.length-1){
                  alert('error: 缺少变量 在第'+op[i].hang+'行 第'+op[i].lie+'列 下标为'+op[i].index+'处')
                  throw 'error: 缺少变量 在第'+op[i].hang+'行 第'+op[i].lie+'列 下标为'+op[i].index+'处'
                }
                cutover('start')
                switch(op[i].token){
                  case '+':
                  case '-':
                    // 加减法运算会在遍历完当前表达式之后顺序生成Node数据结构，如果包裹在括号里面则会立即生成
                    break;
                  case '*':
                  case '/':            
                    if(op[i-1].token|| op[i-1].token.constructor == Array){//判断运算符前面的值是不是Node对象或者有token值
                      if(op[i+1].token === '('){
                        brackets(i+1) 
                      }else if(op[i-1].token.constructor == Array){
                        let arrr = []
                        arrr.push(op[i-1])
                        op[i-1]= Tree(arrr)
                      }
                      if( typeof op[i+1].token !== 'number'&& op[i+1].token.constructor !== Array){//判断运算符后面token的值是不是number或者node对象
                        alert('error: 缺少变量 在第'+op[i].hang+'行 第'+op[i].lie+'列 下标为'+op[i].index+'处')
                        throw 'error: 缺少变量 在第'+op[i].hang+'行 第'+op[i].lie+'列 下标为'+op[i].index+'处' 
                      }
                      //将运算符和它左右两边的值交给Tree函数变成Node数据结构，并且将前后的值赋为" "，因为此时左右两边的值和中间的值合在一起了，然后将op里值为" "的删除
                          // 删除之后由于长度减了2，所以i的值也要减2
                      let ar = []
                      ar.push( op[i-1], op[i], op[i+1])
                      op[i-1]=''
                      op[i+1]=''
                      de(op)
                      op[i-1].token =  Tree(ar)
                      i-=2
                      op[i+1].token === '(' ? i-- : i++;
                      cutover('count')
                    }
                    break;
                default:
                  alert('error: 应为运算符 在第'+op[i].hang+'行 第'+op[i].lie+'列 下标为'+op[i].index+'处')
                  throw 'error: 应为运算符 在第'+op[i].hang+'行 第'+op[i].lie+'列 下标为'+op[i].index+'处'
                }
                
              }
            }
            
            // i：为语法解析正在解析的数组中的第i个元素的下标
            function brackets(i){//当检测到左括号( "(" )的时候会调用这个函数 
              let index2 = 0 //用来存储循环的次数，用来判断两个括号之间有多少个值
              for(let k = i;k<op.length;k++){
                index2++
                let j = k+1
              
                if(op[j] &&op[j].token === '('){
                  brackets(j)         
                }
                
                if(op[k].token === ')'){
                  let arr = []//存储两个括号以及括号中间的所有值
                  for(let x = i;x< i+index2;x++){
                    arr.push(op[x])
                  }
                  //将左括号和右括号删除
                  arr.splice(0,1)
                  arr.splice(arr.length-1,arr.length)
                  k=Infinity
                  // if((typeof arr[arr.length-1].token !== 'number' && typeof arr[arr.length-1].token !== 'object')&&typeof arr[arr.length-1] !== 'number' && typeof arr[arr.length-1]!== 'object'){
                  // throw 'error: 缺少变量 在第'+hang+'行 第'+lie+'列 下标为'+index+'处'
                  // }
                  if(index2 === 3){
                    op[i].token = op[i+1].token
                  }else{
                    op[i].token =  grammarParsing(arr)
                  }
                  for(let s = i+1;s<i+index2;s++){
                    op[s] = ''
                  }
                }
                if(k === op.length-1 && k != ')'){
                  alert('error: 缺少右括号 ')
                  throw 'error: 缺少右括号 '
                }
              }
              de(op)
            }
  
            // item：只能是两个特点的字符串："start"和"count" 用来更改有限状态机的状态（有限状态机是一种编程思想）
            // 为"start"时表示此时检测的应该是一个变量或者括号1，为"count"是则表示此时检测的应该是一个运算符或者括号；如果不是，则抛出异常
            function cutover(item){//更改状态
                if(item === 'start'){
                  start = true
                  count = false
                }else if(item === 'count'){
                  start = false
                  count = true
                }
              }
              return op
          }
  
          // ex:为一个对象数组，然后改造成Node类的数据结构
          function Tree(ex){//生成Node树，生成Tree结构的数据结构
            if(ex.length ===1 && ex[0].token.constructor!==Array){
              return ex[0].token
            }else if(ex.length === 1 && ex[0].token.constructor == Array){
              return Tree(ex[0].token)
            }
  
            while(true){
              if(ex.length === 1 && ex[0].token){
                if(ex.length === 1 && 1<ex[0].token.length){
                ex[0] = Tree(ex[0].token)
                }else if(ex.length ===1 &&ex[0].token.constructor !== Array){
                return ex[0].token
                }
              }
              if(1<ex.length){
                if(ex[0].constructor !== Array && !ex[0].token){
                  if(ex[0].token !== undefined){
                    ex[0] = ex[0].token
                  }
                }else if(ex[0].token.constructor == Array ){
                  ex[0]=  Tree( ex[0].token)
                }else if(ex[0].token){
                  ex[0] = ex[0].token
                }
  
                if(ex[2].constructor !== Array && !ex[2].token){
                  ex[2] = ex[2].token
                }else if(ex[2].token.constructor == Array ){
                  ex[2]=  Tree( ex[2].token)
                }else if(ex[2].token){
                  ex[2] = ex[2].token
                }
                ex[1] = new Node(ex[1].token,[ex[0],ex[2]])
                ex[0] = ''
                ex[2] = ''
                ex = de(ex)
              }else {
                if(ex[0][0]!==undefined){
                  return ex[0][0]
                }else{
                  return ex[0]
                }
              }
            }
          }
  
          // arr：为一个对象数组，如果当前对象的token值为：" "则将当前对象删除
            function de(arr){//用来删除空格
              for(let i = 0; i<arr.length;i++){
                if(arr[i] === ''){
                  arr.splice(i,1)
                  i--
                }
              }
              return arr
            }
        }
      }
  
      const win = document.body
      //创建dom元素
      win.appendChild(myCreateElement('div',{class:'header'},["Complete Binary Tree and Calculator"]))
      win.appendChild(myCreateElement('div',{class:"features"},[
        myCreateElement("div",{class:"title"},[
          myCreateElement("input",{type:'text',class:'text'}),
          myCreateElement('span',{class:'denghao'},["="]),
          myCreateElement('input',{class:'result',type:'text',disabled:"disabled"}),
          myCreateElement('button',{class:'createTree'},["createTree"])
        ])
      ])
      )
      
    
      const creatdom =  new creatDom({
      container:win,
       nodeSizeWidth:80,
       nodeSizeHeight:60,
       lineStrokeWidth:d=>'1px',
       lineStrokeColor:d=>'black',
       ellipseStrokeWidth:d=>'1px',
       ellipseStrokeColor:d=>'black',
       ellipseStrokeFill:d=>'white',
       textAnchor:d=>'middle',
     })   
     let dom  = document.querySelector('.createTree') 
     let inp  = document.querySelector('.text')
     let result =document.querySelector('.result')
       dom.addEventListener('click',e=>{//点击createTree这个按钮生成dom树
         if(inp.value !==''){
           result.value = creatdom.creatTree(inp.value)
         }
       })
       window.addEventListener('keyup', e => {//在window下敲击空格生成dom树
         if (e.keyCode === 13) {
           if(inp.value !==''){
             result.value = creatdom.creatTree(inp.value)
           }
         }
       })
       window.onresize = e=>{//浏览器窗口大小发生变化时
         if(inp.value !==''){
            result.value = creatdom.creatTree(inp.value)
          }
       }
       //单元测试
    //  { 
    //   console.assert( new Node('-',[1,new Node('+',[1,new Node('*',[6,3])])]).calc() === -18 )
    //   console.assert(new Node('+',[1,1]).calc() === 2)
    //   console.assert(new Node('*',[8,new Node('-',[8,5])]).calc()===24)
    //   console.assert(new Node('+',[new Node('/',[4,2]),3]).calc() === 5)
    //   console.assert(new Node('*',[new Node('/',[4,2]),new Node('/',[4,2])]).calc() === 4)
    //   console.assert(new Node('-',[2,new Node('/',[4,2])]).calc() === 0)
    //   console.assert(new Node('/',[6,3]).calc() === 2)
    //   console.assert(new Node('+',[new Node('-',[5,3]),new Node('-',[5,new Node('*',[new Node('/',[4,2]),new Node('/',[6,3])])])]).calc() ===3 )
    //   console.assert(new Node('+',[new Node('-',[5,3]),new Node('-',[5,3])]).calc() === 4)
    //   console.log(new Node('+',[1,new Node('+',[2,new Node('+',[3,5])])]).toString())
    //   console.log(new Node('+',[1,new Node('+',[new Node('-',[6,7]),new Node('+',[3,5])])]).toString())
    //   console.log(new Node('+',[new Node('+',[2,new Node('+',[3,5])]),1]).toString())
    //   console.log(new Node('+',[new Node('-',[5,3]),new Node('-',[5,new Node('*',[new Node('/',[4,2]),new Node('/',[6,new Node('*',[2,new Node('/',[8,4])])])])])]).toString())   
    //   console.assert(new Parsing(`1+2+3+4+5`).lexIcal().calc() === 15)
    //   console.assert(new Parsing(`((((((((((((1+2))))))))))))+3+4+5`).lexIcal().calc() === 15)
    //   console.assert(new Parsing(`(2+4)/2`).lexIcal().calc() === 3)
    //   console.assert(new Parsing(`1+2+3+4+5`).lexIcal().calc() === 15)
    //   console.assert( new Parsing('2*4+3*2').lexIcal().calc() === 14)
    //   console.assert(new Parsing('22+2*(3+2)').lexIcal().calc() === 32)
    //   console.assert(new Parsing('(22+2)*3+2').lexIcal().calc() === 74)
    //   console.assert(new Parsing('(22+2)*(3+2)').lexIcal().calc() === 120)
    //   console.assert(new Parsing('(22-4)+(4/2)').lexIcal().calc() === 20)
    //   console.assert(new Parsing(`2+(2+2*(3+2))`).lexIcal().calc() === 14 )
    //   console.assert(new Parsing(`(3+(5*(4-2)))+(2+4*(3+2))`).lexIcal().calc() === 35)
    //   console.assert(new Parsing(`2*(30+(5*(4-2)))*3+(4+5*(2-1))`).lexIcal().calc() === 249)
    //   console.assert(new Parsing(`(2+2+(3*2+(3+2*(3+2))))`).lexIcal().calc() === 23)
    //   console.assert(new Parsing(`(30+(2*3))*3`).lexIcal().calc() === 108)
    //   console.assert(new Parsing('3*2+(5)').lexIcal().calc() === 11)
      // try{
      //   console.log(new Parsing('2+2-').lexIcal())
      // }catch(e){
      //   console.log(e)
      // }
  
    //   try{
    //     console.log(new Parsing('5+2*(6/2)+').lexIcal())
    //   }catch(e){
    //     console.log(e)
    //   }
  
    //   try{
    //     console.log(new Parsing('5*2+3+(4/2+)').lexIcal())
    //   }catch(e){
    //     console.log(e)
    //   }
      
    //   try{
    //     console.log(new Parsing("1+2*(*)").lexIcal())
    //   }catch(e){
    //     console.log(e)
    //   }
  
    //   try{
    //     console.log(new Parsing('4/2+').lexIcal())
    //   }catch(e){
    //     console.log(e)
    //   }
  
    //   try{
    //     console.log(new Parsing('1+a').lexIcal())
    //   }catch(e){
    //     console.log(e)
    //   }
      
  
    //   try{
    //     console.log(new Parsing('2+3=5').lexIcal())
    //   }catch(e){
    //     console.log(e)
    //   }
  
    //   try{
    //     console.log(new Parsing('(3+2)-(4+num)').lexIcal())
    //   }catch(e){
    //     console.log(e)
    //   }
    //   try{
    //     console.log(new Parsing('1.2+2..2').lexIcal())     
    //   }catch(e){
    //     console.log(e)
    //   }
    //   try{
    //    console.log(new Parsing('3/0').lexIcal())
    //   }catch(e){
    //     console.log(e)
    //   }
    //   try{   
    //     console.log(new Parsing('3+3 3').lexIcal())
    //   }catch(e){
    //     console.log(e)
    //   }
    //   try{
    //     console.log(new Parsing('*3+3').lexIcal())
    //   }catch(e){
    //     console.log(e)
    //   }
    //   try{ 
    //     console.log(new Parsing('(3+2+(2+2)').lexIcal())
    //   }catch(e){
    //     console.log(e)
    //   }
    
    //   // console.lognew Parsing('+22+3').lexIcal())
    //   // console.log(new Parsing('5+2*(6/2)+').lexIcal())
    //   // console.log(new Parsing('5*2+3+(4/2+)').lexIcal())
    //   // console.log(new Parsing("1+2*(*)").lexIcal())
    //   // console.log(new Parsing('4/2+').lexIcal())
    //   // console.log(new Parsing('1+a').lexIcal())
    //   // console.log(new Parsing('2+3=5').lexIcal())
    //   // console.log(new Parsing('(3+2)-(4+num)').lexIcal())
    // }
  
(function(g){

    let allRules = {
        require: function(val, errorMsg){
            if (!val && val === '') {
                return errorMsg || '必填'
            }
        },
        mobile: function(val, errorMsg){
            if ( !/^1[34578]\d{9}$/.test(val) ) {
                return errorMsg || '请输入手机号码'
            }
        },
        email: function(val, errorMsg){
            if ( !/.+@.+\..+/.test(val) ) {
                return errorMsg || '邮箱格式错误'
            }
        }
    }

	function Verify(options){
        this.cache = []
        this.allRules = allRules

        let originalOptions = {
            dom: document.getElementsByTagName('form')[0]
        }
        this.opt = Object.assign({}, originalOptions, options)

        cleanWhitespace(this.opt.dom)
        this._bindInput()
    }

    function on(context, eventType, callback) {
        if(!document.addEventListener) {
            context.attachEvent('on' + eventType, callback);
        }else {
            context.addEventListener(eventType, callback);
        }
    }

    let _proto = Verify.prototype

    // 获取input
    _proto._bindInput = function(selectors){
        this.inputs = this.opt.dom.querySelectorAll('input')
        let input = this.inputs

        for (var i = input.length - 1; i >= 0; i--) {
            on(input[i], 'blur', (e) => {
               this._validate(e.target)
            })

             on(input[i], 'focus', (e) => {
               toggleTips(e.target)
            })
        }

        return input
    }

    // 验证
    _proto._validate = function(input){
        let dom = this.opt.dom
        let flag = 0
        let inputRule = input.getAttribute('rule')
        let name = input.getAttribute('name')
        let val = input.value
        let resMsg = []
        let cache = this.cache

        if (inputRule && inputRule !== '') {
            inputRule = inputRule.split(' ')
            inputRule.forEach((i) => {
                if (allRules[i]) {
                    let msg = allRules[i].call(input, val)
                    msg && resMsg.push(msg)
                }
            })
        } else {
            return '没有规则'
        }

        if (resMsg && resMsg.length !== 0){
            flag = 1
        } else {
            flag = 0
        }

        let msg = resMsg.join()

        if (flag === 1) {
            removeClass(input, 'adopt')
            addClass(input, 'error')
            toggleTips(input, true ,msg)
            cache.indexOf(name) === -1 && cache.push(name)
        }

        if (flag === 0) {
            removeClass(input, 'error')
            addClass(input, 'adopt')
            toggleTips(input, false)
            cache.splice(cache.indexOf(name), 1)
        }

        return msg

    }

    // 去除空白节点
    function cleanWhitespace(node) {
        for (var n = 0; n < node.childNodes.length; n++) {
            var child = node.childNodes[n];
            if (
                child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue))
            ) {
                node.removeChild(child);
                n--;
            } else if (child.nodeType === 1) {
                cleanWhitespace(child);
            }
        }
    }

    function toggleTips(input, isShow = true, msg){
        if (!input) return
        let tips = input.nextSibling
        toggleElement(tips, isShow, msg)
    }

    // html节点样式文本控制
    function toggleElement(node, isShow, result) {
        if(!node) return;
        node.style.display = isShow ? 'block' : 'none'
        if(result) node.innerHTML = result
    }

    function hasClass(node, className) {
        return !!node.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    }

    function addClass(node, className) {
        if (!hasClass(node, className)) node.className += " " + className
    }

    function removeClass(node, className) {
        if (hasClass(node, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
            node.className = node.className.replace(reg, ' ')
        }
    }

    // 增加规则
    _proto.add = function(dom, rules){

    }

    _proto.check = function(){
        let rules = this.allRules
        let cache = this.cache
        let inputs = this.inputs
        let arrMsg = []
        let that = this

        // blur 和 click冲突
        setTimeout(function(){
            for (var i = 0; i < inputs.length; i++) {
                that._validate(inputs[i])
            }
        }, 0)

        for (var i = 0; i < cache.length; i++) {
            if (rules[cache[i]]) {
                var error = rules[cache[i]]()
                if (error) {
                    arrMsg.push(error)
                }
            }
        }
        return arrMsg
    }

    g.Verify = Verify

})(window)

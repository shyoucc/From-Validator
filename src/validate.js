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
        this.opt = Object.assign({}, options)

        this.bindInput(this.opt.dom)

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
    _proto.bindInput = function(selectors){
        cleanWhitespace(selectors)
        let input = selectors.querySelectorAll('input')

        for (var i = input.length - 1; i >= 0; i--) {
            on(input[i], 'blur', (e) => {
               validate(e.target)
            })

             on(input[i], 'focus', (e) => {
               toggleTips(e.target)
            })
        }

        return input
    }

    function toggleTips(input, isShow = true, msg){
        if (!input) return
        let tips = input.nextSibling
        toggleElement(tips, isShow, msg)
    }

    // 验证
    function validate(input, opt){
        let flag = 0
        let inputRule = input.getAttribute('rule')
        let val = input.value
        let resMsg = []

        if (inputRule && inputRule !== '') {
            inputRule = inputRule.split(' ')
            inputRule.forEach((i) => {
                if (allRules[i]) {
                    let msg = allRules[i].call(input, val)
                    msg && resMsg.push(msg)
                }
            })
            console.log(resMsg.length, 'resMsg')
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
        }

        if (flag === 0) {
            removeClass(input, 'error')
            addClass(input, 'adopt')
            toggleTips(input, false)
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
        let that = this

        for (var i = 0; i < rules.length; i++) {
            (function(one){
                that.cache.push(function(){
                    let ruleArr = one.rule.split(':')
                    let errorMsg = one.errorMsg
                    let ruleName = ruleArr.shift()
                    ruleArr.unshift(dom.value)
                    ruleArr.push(errorMsg)
                    return allRules[ruleName].apply(dom, ruleArr)
                })
            })(rules[i])

        }
    }

    _proto.check = function(){
        console.log(this.cache, 'this.cache')
        for (var i = 0; i < this.cache.length; i++) {
            var error = this.cache[i]()
            if (error) {
                console.log(error, 'error')
                return error
            }
        }
    }

    g.Verify = Verify

})(window)

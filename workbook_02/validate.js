(function(w){

    let allRules = {
        isRequire: function(val, errorMsg){
            if (!val && val === '') {
                return errorMsg
            }
        },
        isMobile: function(val, errorMsg){
            if ( !/^1[34578]\d{9}$/.test(val) ) {
                return errorMsg
            }
        }
    }

	function Verify(options){
        this.cache = []
	}

    function on(context, eventType, callback){
        context.addEventListener(eventType, callback)
    }

    let _proto = Verify.prototype

    _proto.add = function(dom, rules){
        let self = this

        for (var i = 0; i < rules.length; i++) {
            (function(one){
                self.cache.push(function(){
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

    w.Verify = Verify

})(window)

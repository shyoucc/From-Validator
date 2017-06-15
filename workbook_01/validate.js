class Validate {
	constructor (options) {
		let defaultopt = {
			element: '',
			btn: '',
			tips: ''
		}
		this.options = Object.assign({}, defaultopt, options)

		this.btn = this.$(this.options.btn)
		this.input = this.$(this.options.element)
		this.tips = this.$(this.options.tips)

		this.addEventHandler(this.btn, 'click', this.checkInput.bind(this))
	}

	$ (node) {
		return document.querySelector(node)
	}

	hasClass(node, className) {
	    return !!node.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
	}

	addClass(node, className) {
	    if (!this.hasClass(node, className)) node.className += " " + className;
	}

	removeClass(node, className) {
	    if (this.hasClass(node, className)) {
	        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
	        node.className = node.className.replace(reg, ' ');
	    }
	}

    countLength(str) {
        var count = 0;
        for (var i = 0; i < str.length; i++) {
            var code = str[i].charCodeAt(); // 转换成ASCII
            if (code >=0 && code <= 128) {
                count++;
            }
            else {
                count += 2;
            }
        }
        return count;
    }

	checkInput () {

		let input = this.input
		let val = input.value.trim()

		if (!val) {
			this.tips.innerHTML = '不能为空'
			this.addClass(input, 'error')
		}
		else if (this.countLength(val) < 4 || this.countLength(val) > 16) {
			this.tips.innerHTML = '字符数为4~16位，字母、数字、英文符号长度为1，中文符号长度为2'
			this.addClass(input, 'error')
		}
		else {
			this.tips.innerHTML = null
			this.removeClass(input, 'error')
		}


	}

	addEventHandler (element, event, listener) {
		element.addEventListener(event, listener, false)
	}

}
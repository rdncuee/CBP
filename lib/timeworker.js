(function(global){
    function init() {
        self.addEventListener('message', function(exectime) {
            setTimeout(() => {
               self.postMessage("-")
            }, exectime)
          }, false)
    }

    typeof module !== 'undefined' ? module.exports = init 
    :typeof define === 'function' ? define(init)
    :global.init = init
}(this))
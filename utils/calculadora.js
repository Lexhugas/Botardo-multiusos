const math = require('mathjs'); 

function calculate(expression) {
    try {
        const result = math.evaluate(expression);
        return result; 
    } catch (error) {
        return 'Error: La expresión matemática es inválida.'; 
    }
}

module.exports = { calculate };

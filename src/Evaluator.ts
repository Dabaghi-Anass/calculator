export abstract class Evaluator{
    static precedence(operator : string) : number{
        switch (operator) {
            case '+':
            case '-':
                return 1;
            case '*':
            case '/':
            case '%':
                return 2;
            case '^':
                return 3;
            default:
                return 0;
        }
    }
    static getPolishForm(expression : string){
        const output = [];
        const stack = [];
        for (let i = 0; i < expression.length; i++) {
            const token = expression[i];
            if (/[0-9]/.test(token)) {
                let number = token;
                while (i + 1 < expression.length && /[0-9.]/.test(expression[i + 1])) {
                    number += expression[i + 1];
                    i++;
                }
                output.push(parseFloat(number));
            } else if (token === '(') {
                stack.push(token);
            } else if (token === ')') {
                while (stack.length > 0 && stack[stack.length - 1] !== '(') output.push(stack.pop());
                stack.pop();
            } else {
                while (
                    stack.length > 0 &&
                    Evaluator.precedence(token) <= Evaluator.precedence(stack[stack.length - 1])
                )  output.push(stack.pop());   
                stack.push(token);
            }
        }
        while (stack.length > 0) output.push(stack.pop());
        return output!;
    }
    static calculate(o1 : number,o2 : number,operator : string){
        switch (operator) {
            case '+':
                return o1 + o2;
            case '-':
                return o1 - o2;
            case '*':
                return o1 * o2;
            case '%':
                return o1 % o2;
            case '^':
                return Math.pow(o1,o2);
            case '/':
                if (o2 === 0) {
                    throw new Error("Division by zero");
                }
                return o1 / o2;
            default:
                throw new Error("Invalid operator: " + operator);
        }
    }
    static evaluatePostfix(expression : (string|number|undefined)[]) {
        const stack : number[] = [];
        for (let i = 0; i < expression.length; i++) {
            const token = expression[i];
            if (typeof token === 'number') {
                stack.push(token);
            } else {
                const operand2 = stack.pop()!;
                const operand1 = stack.pop()!;
                stack.push(Evaluator.calculate(operand1,operand2,token!))
            }
        }
        if (stack.length !== 1) {
            throw new Error("Invalid expression");
        }
    
        return stack[0];
    }
        
    static evaluate(expression : string) : number{
        try {
            expression = expression.replace(/\s+/g,"");
            const polishPostfix = Evaluator.getPolishForm(expression);
            const result = Evaluator.evaluatePostfix(polishPostfix);
            if(isNaN(result)) throw new Error("Invalid expression");
            return result;
        } catch (error : any) {
            throw new Error(error.message)
        }
    }
}
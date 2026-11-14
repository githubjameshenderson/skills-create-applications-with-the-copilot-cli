// Supported operations: addition (+), subtraction (-), multiplication (*), and division (/).
const operations = {
  "+": (left, right) => left + right,
  "-": (left, right) => left - right,
  "*": (left, right) => left * right,
  "/": (left, right) => {
    if (right === 0) {
      throw new Error("Cannot divide by zero.");
    }

    return left / right;
  },
};

function calculate(leftInput, operator, rightInput) {
  const left = Number(leftInput);
  const right = Number(rightInput);
  const operation = Object.hasOwn(operations, operator) ? operations[operator] : undefined;

  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error("Both operands must be valid finite numbers.");
  }

  if (!operation) {
    throw new Error(`Unsupported operator: ${operator}`);
  }

  return operation(left, right);
}

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length !== 3) {
    console.error("Usage: node src/calculator.js <number> <operator> <number>");
    console.error("Supported operators: +, -, *, /");
    process.exitCode = 1;
  } else {
    try {
      console.log(calculate(args[0], args[1], args[2]));
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}

module.exports = { calculate };

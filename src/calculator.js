// Supported operations: addition (+), subtraction (-), multiplication (*), division (/),
// modulo (%), exponentiation (^ or **), and square root (sqrt <number>).
function toFiniteNumber(input) {
  if (
    (typeof input !== "number" && typeof input !== "string") ||
    (typeof input === "string" && input.trim() === "")
  ) {
    throw new Error("Operands must be valid finite numbers.");
  }

  const number = Number(input);

  if (!Number.isFinite(number)) {
    throw new Error("Operands must be valid finite numbers.");
  }

  return number;
}

function modulo(a, b) {
  const dividend = toFiniteNumber(a);
  const divisor = toFiniteNumber(b);

  if (divisor === 0) {
    throw new Error("Cannot calculate modulo by zero.");
  }

  return dividend % divisor;
}

function power(base, exponent) {
  const numericBase = toFiniteNumber(base);
  const numericExponent = toFiniteNumber(exponent);
  const result = numericBase ** numericExponent;

  if (!Number.isFinite(result)) {
    throw new Error("Power result must be a finite real number.");
  }

  return result;
}

function squareRoot(n) {
  const number = toFiniteNumber(n);

  if (number < 0) {
    throw new Error("Cannot calculate the square root of a negative number.");
  }

  return Math.sqrt(number);
}

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
  "%": modulo,
  "^": power,
  "**": power,
};

function calculate(leftInput, operator, rightInput) {
  const left = toFiniteNumber(leftInput);
  const right = toFiniteNumber(rightInput);
  const operation = Object.hasOwn(operations, operator) ? operations[operator] : undefined;

  if (!operation) {
    throw new Error(`Unsupported operator: ${operator}`);
  }

  return operation(left, right);
}

if (require.main === module) {
  const args = process.argv.slice(2);

  try {
    if (args[0] === "sqrt" && args.length === 2) {
      console.log(squareRoot(args[1]));
    } else if (args[0] !== "sqrt" && args.length === 3) {
      console.log(calculate(args[0], args[1], args[2]));
    } else {
      console.error("Usage: node src/calculator.js <number> <operator> <number>");
      console.error("       node src/calculator.js sqrt <number>");
      console.error("Supported operators: +, -, *, /, %, ^, **");
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { calculate, modulo, power, squareRoot };

const { spawnSync } = require("node:child_process");
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { calculate, modulo, power, squareRoot } = require("../calculator");

const calculatorPath = path.join(__dirname, "..", "calculator.js");

describe("calculate", () => {
  it("adds the example operands", () => {
    assert.equal(calculate("2", "+", "3"), 5);
  });

  it("subtracts the example operands", () => {
    assert.equal(calculate("10", "-", "4"), 6);
  });

  it("multiplies the example operands", () => {
    assert.equal(calculate("45", "*", "2"), 90);
  });

  it("divides the example operands", () => {
    assert.equal(calculate("20", "/", "5"), 4);
  });

  it("supports decimal and negative operands", () => {
    assert.equal(calculate(-2.5, "*", "4"), -10);
  });

  it("supports modulo and exponentiation operators", () => {
    assert.equal(calculate("5", "%", "2"), 1);
    assert.equal(calculate("10", "%", "3"), 1);
    assert.equal(calculate("2", "^", "3"), 8);
    assert.equal(calculate("2", "**", "3"), 8);
  });

  it("throws a clear error when dividing by zero", () => {
    assert.throws(() => calculate("1", "/", "0"), {
      message: "Cannot divide by zero.",
    });
  });

  it("treats negative zero as a zero divisor", () => {
    assert.throws(() => calculate("1", "/", "-0"), {
      message: "Cannot divide by zero.",
    });
  });

  it("rejects unsupported operators", () => {
    for (const operator of ["?", "constructor", "toString", "__proto__"]) {
      assert.throws(() => calculate("1", operator, "2"), {
        message: `Unsupported operator: ${operator}`,
      });
    }
  });

  it("rejects non-numeric and non-finite operands", () => {
    for (const value of ["", "not-a-number", "NaN", "Infinity"]) {
      assert.throws(() => calculate(value, "+", "2"), {
        message: "Operands must be valid finite numbers.",
      });
    }
  });
});

describe("modulo", () => {
  it("returns the remainder of a divided by b", () => {
    assert.equal(modulo(5, 2), 1);
    assert.equal(modulo(10, 3), 1);
    assert.equal(modulo(-10, 3), -1);
  });

  it("rejects a zero divisor", () => {
    assert.throws(() => modulo(10, 0), {
      message: "Cannot calculate modulo by zero.",
    });
  });
});

describe("power", () => {
  it("raises the base to the exponent", () => {
    assert.equal(power(2, 3), 8);
    assert.equal(power(2, -2), 0.25);
  });

  it("rejects results that are not finite real numbers", () => {
    assert.throws(() => power(-2, 0.5), {
      message: "Power result must be a finite real number.",
    });
    assert.throws(() => power(0, -1), {
      message: "Power result must be a finite real number.",
    });
  });
});

describe("squareRoot", () => {
  it("returns the non-negative square root", () => {
    assert.equal(squareRoot(16), 4);
    assert.equal(squareRoot(25), 5);
    assert.equal(squareRoot(0), 0);
  });

  it("rejects negative numbers", () => {
    assert.throws(() => squareRoot(-1), {
      message: "Cannot calculate the square root of a negative number.",
    });
  });
});

describe("calculator CLI", () => {
  it("prints a result for a valid operation", () => {
    const result = spawnSync(process.execPath, [calculatorPath, "2", "+", "3"], {
      encoding: "utf8",
    });

    assert.equal(result.status, 0);
    assert.equal(result.stdout, "5\n");
    assert.equal(result.stderr, "");
  });

  it("prints usage and exits unsuccessfully when arguments are missing", () => {
    const result = spawnSync(process.execPath, [calculatorPath, "2", "+"], {
      encoding: "utf8",
    });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Usage:/);
    assert.match(result.stderr, /Supported operators: \+, -, \*, \/, %, \^, \*\*/);
  });

  it("prints a clear division-by-zero error and exits unsuccessfully", () => {
    const result = spawnSync(process.execPath, [calculatorPath, "20", "/", "0"], {
      encoding: "utf8",
    });

    assert.equal(result.status, 1);
    assert.equal(result.stderr, "Cannot divide by zero.\n");
  });

  it("prints results for the extended-operation image examples", () => {
    const cases = [
      { args: ["5", "%", "2"], expected: "1\n" },
      { args: ["2", "^", "3"], expected: "8\n" },
      { args: ["2", "**", "3"], expected: "8\n" },
      { args: ["sqrt", "16"], expected: "4\n" },
    ];

    for (const { args, expected } of cases) {
      const result = spawnSync(process.execPath, [calculatorPath, ...args], {
        encoding: "utf8",
      });

      assert.equal(result.status, 0);
      assert.equal(result.stdout, expected);
      assert.equal(result.stderr, "");
    }
  });

  it("prints clear errors for invalid modulo and square-root inputs", () => {
    const moduloResult = spawnSync(process.execPath, [calculatorPath, "10", "%", "0"], {
      encoding: "utf8",
    });
    const squareRootResult = spawnSync(process.execPath, [calculatorPath, "sqrt", "-1"], {
      encoding: "utf8",
    });

    assert.equal(moduloResult.status, 1);
    assert.equal(moduloResult.stderr, "Cannot calculate modulo by zero.\n");
    assert.equal(squareRootResult.status, 1);
    assert.equal(
      squareRootResult.stderr,
      "Cannot calculate the square root of a negative number.\n",
    );
  });
});

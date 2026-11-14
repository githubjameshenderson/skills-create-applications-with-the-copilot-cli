const { spawnSync } = require("node:child_process");
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { calculate } = require("../calculator");

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
    for (const operator of ["%", "^", "constructor", "toString", "__proto__"]) {
      assert.throws(() => calculate("1", operator, "2"), {
        message: `Unsupported operator: ${operator}`,
      });
    }
  });

  it("rejects non-numeric and non-finite operands", () => {
    for (const value of ["not-a-number", "NaN", "Infinity"]) {
      assert.throws(() => calculate(value, "+", "2"), {
        message: "Both operands must be valid finite numbers.",
      });
    }
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
    assert.match(result.stderr, /Supported operators: \+, -, \*, \//);
  });

  it("prints a clear division-by-zero error and exits unsuccessfully", () => {
    const result = spawnSync(process.execPath, [calculatorPath, "20", "/", "0"], {
      encoding: "utf8",
    });

    assert.equal(result.status, 1);
    assert.equal(result.stderr, "Cannot divide by zero.\n");
  });
});

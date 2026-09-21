export const SAMPLE_LEFT = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}

const users = ["ada", "grace"];`;

export const SAMPLE_RIGHT = `function greet(name, greeting = "Hello") {
  console.log(greeting + ", " + name);
  return true;
}

const users = ["ada", "grace", "katherine"];`;

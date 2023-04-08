# One

## What is One?

One is a simple, lightweight, and fast framework for building web applications.
It is contained in a single file of 1.7KB and requires zero dependencies and no build step.

## Contents

One is a lightweight and easy-to-use framework for building web applications. What sets One apart is its focus on simplicity and transparency - everything is done within a single class.

At only 11KB in size (1.7KB when gzip compressed), the class includes implementation of basic features found in modern frameworks, such as if statements, for loops, slots, and props. With zero dependencies and no build step required.

## How to use

### Installation

```bash
npm install @toshusai/one
```

### Usage

You may inherit the `One` class and implement the template method.

```ts
import { One } from "@toshusai/one";

export class BasicComponent extends One {
  render() {
    return `<div>Hello World!</div>`;
  }

  mounted() {
    console.log("Can you see me in the console?");
  }
}
```

To initialize the application, create an instance and pass the root HTMLElement as an argument to the mount method.

```ts
const element = document.getElementById("app")!;
new BasicComponent().mount(element);
```

## Supported features

- `v-if` If statements
- `v-for` For loops
- `<slot></slot>` Multiple slots
- `:value="value"` Two-way binding
- `@click="onClick"` Event listeners

## License

MIT License

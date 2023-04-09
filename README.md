# One

## What is One?

One is a lightweight, easy-to-use framework for building web applications that is simple, transparent, and fast. It consists of a single class contained in a single file of 1.7KB and requires zero dependencies and no build step.

## Overview

One is a lightweight framework that makes it easy to build web applications with its focus on simplicity and transparency. The entire framework is contained within a single class, making it easy to use and understand. At only 11KB TypeScript in size (1.7KB JavaScript when gzip compressed), the class includes implementation of basic features found in modern frameworks, such as if statements, for loops, slots, and props. With zero dependencies and no build step required, One is a great choice for building small to medium-sized web applications.

## How to use

Installation

```bash
npm install @toshusai/one
```

## Usage

To use One, simply inherit the One class and implement the template method.

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

## Features

One supports the following features:

- `v-if` for if statements
- `v-for` for for loops
- `<slot></slot>` for multiple slots
- `:value="value"` for two-way binding
- `@click="onClick"` for event listeners

## License

MIT License

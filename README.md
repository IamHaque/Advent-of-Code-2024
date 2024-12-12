# Advent of Code 2024 - Deno Solutions

Welcome to my **Advent of Code 2024** repository, where programming meets
holiday cheer! 🎄 Dive into this collection of fun, challenging puzzles designed
to test your problem-solving skills and spread the joy of coding. Each day's
challenge is solved in **Deno**, with a clear and consistent structure to make
navigation and replication a breeze.

## **What is Advent of Code?**

Think of it as an Advent calendar, but instead of chocolates, you get daily
programming puzzles! Created by [Eric Wastl](https://adventofcode.com/about),
Advent of Code is a beloved tradition among developers of all skill levels.
Whether you're prepping for interviews, practicing algorithms, or simply
competing with friends, there's something here for everyone.

### **Why Participate?**

- Sharpen your coding skills 🚀
- Learn something new every day 📚
- Join a vibrant, global community 🌎

No computer science degree? No problem! These puzzles require only basic
programming knowledge and a knack for logical thinking. Plus, every challenge is
optimized to run on hardware as old as Santa's sled (okay, maybe 10 years old
😉).

---

## **Folder Structure**

Here’s how the magic is organized:

```
├── .vscode
│   └── settings.json
├── day_01
│   ├── input.txt
│   ├── main.ts
│   └── sample.txt
├── day_02
│   ├── input.txt
│   ├── main.ts
│   └── sample.txt
├── day_03
│   ├── input.txt
│   ├── main.ts
│   └── sample.txt
├── day_04
│   ├── input.txt
│   ├── main.ts
│   ├── sample.txt
│   └── sample_02.txt
├── deno.json
├── main.ts
├── markdown.md
└── utils.ts
```

### **Key Components**

1. **`.vscode/`:** Houses editor-specific settings to streamline development.
2. **`day_<number>/`:** Each folder contains:
   - `main.ts`: The solution script for that day.
   - `input.txt`: The actual puzzle input.
   - `sample.txt` (and `sample_02.txt` if provided): Sample inputs for debugging
     and testing.
3. **Root-Level Files:**
   - `deno.json`: Deno configuration file for smooth execution.
   - `main.ts`: Entry script to run specific day solutions.
   - `markdown.md`: Documentation and notes.
   - `utils.ts`: Shared utility functions used across days.

---

## **How to Run the Solutions**

Unwrapping a puzzle solution is as simple as running this command:

```bash
# Replace [day number] with the day you want to run
deno run start [day number]
```

### **Example**

To solve Day 1’s challenge:

```bash
deno run start 1
```

### **Requirements**

- Install [Deno](https://deno.land) if you haven’t already.
- Ensure `deno.json` is in the root directory for configurations.

---

## **Contributing**

Collaboration is the spirit of the season! 🎅 If you’d like to contribute:

1. Fork this repository.
2. Try solving the puzzles or improving existing solutions.
3. Submit a pull request to share your ideas!

Encountered an issue? Feel free to open an issue with suggestions or questions.

---

## **License**

This project is open-source and licensed under the MIT License. Check out the
LICENSE file for more details.

---

Let’s code and celebrate this Advent season together. Happy solving! 🎄✨

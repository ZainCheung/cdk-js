# cdk-js
[中文版](README.zh.md)

Generator and parser for redemption codes for javascript

## Introduction

This project is a generator and parser for redemption codes. It can generate unique redemption codes based on an increment id, and parse the redemption codes back into the original increment id. This project is suitable for applications that require the generation of large numbers of unique codes in a short period of time.


## Getting Started

### Installation

You can get the project by using the `npm` or `pnpm` or `yarn` command:

```bash
npm i cdkey-js
```

### Usage
In your node.js project, you can use this project as follows:

```typescript
import { Cdk, CdkI, GenerateRandomSecret } from "cdkey-js";
// or 
// const {Cdk, CdkI, GenerateRandomSecret} = require('cdkey-js/dist/cjs');

const ExampleCharTable: string[] = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'M',
    'N',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
];

// In practice, please generate a key table in advance, not at runtime.
// GenerateRandomSecret(true); will generate a random key table and print it to the console.
// then you can copy the key table to your code.
const cdk: CdkI = new Cdk(GenerateRandomSecret(), ExampleCharTable);

export async function TestCdk() {
    const incrementID = 123456;
    try {
        const generatedCode = cdk.generate(incrementID);
        console.log('Generated Code:', generatedCode);

        const parsedID = cdk.parse(generatedCode);
        console.log('Parsed ID:', parsedID);

        const batchCodes = cdk.batchGenerate(incrementID, 5);
        console.log('Batch Generated Codes:', batchCodes);
    } catch (error) {
        console.error('Error:', error);
    }
}

```

In this example, we first generate a random secret table, then create a new `cdk` object with the secret table
and a character table. We then use the `generate` method to generate a redemption code based on an increment id,
and the `parse` method to parse the redemption code back into the original increment id.

## Performance

The `Generater` in this project is highly efficient. In benchmark tests, it was able to generate 1,000,000 redemption
codes in approximately 3 seconds. This makes it suitable for applications that require the generation of large
numbers of unique codes in a short period of time.

Please note that actual performance may vary depending on the specific hardware and software environment.
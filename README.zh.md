# cdk-js
[English Version](README.md)

为js准备的激活码生成器和解析器,支持 `typescript`

## 介绍

这个项目是一个激活码生成器和解析器。它可以根据自增id生成唯一的激活码，并将激活码解析回原始的自增id。这个项目适合需要在短时间内生成大量唯一码的应用。

## 入门指南

### 安装

你可以使用 `npm` 或 `pnpm` 或 `yarn` 命令来获取这个项目：

```bash
npm i cdkey-js
```

### 使用
在你的node.js项目，你可以这样使用这个项目：

```typescript
import { Cdk, CdkI, GenerateRandomSecret } from "cdkey-js";
// 或者 
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

// 实际使用中请提前生成一个秘钥表 不要在运行时生成
// GenerateRandomSecret(true); 会生成一个随机秘钥表并打印到控制台
// 然后你可以将秘钥表复制到你的代码中
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

在这个例子中，我们首先生成一个随机秘钥表，然后使用这个秘钥表和一个字符表创建一个新的 `cdk` 对象。
然后我们使用 `generate` 方法根据一个自增id生成一个激活码，并使用 `parse` 方法将激活码解析回原始的自增id。

## 性能

这个项目中的 `Generater` 是非常高效的。在基准测试中，它能够在大约 3 秒内生成 1,000,000 个激活码。这使得它适用于需要在短时间内生成大量唯一码的应用。

请注意，实际性能可能会因具体硬件和软件环境而异。

import { Cdk, CdkI } from './index'; // change to './index' from 'cdk-js' when using this in your project

// 示例的秘钥和字符表数据
export const ExampleSecret: number[][] = [
    [3, 6, 7, 1, 22, 17, 23, 8],
    [9, 10, 11, 12, 13, 14, 15, 16],
    [18, 19, 20, 21, 24, 25, 26, 27],
    [28, 29, 30, 31, 32, 33, 34, 35],
    [36, 37, 38, 39, 40, 41, 42, 43],
    [44, 45, 46, 47, 48, 49, 50, 51],
    [52, 53, 54, 55, 56, 57, 58, 59],
    [60, 61, 62, 63, 64, 65, 66, 67],
    [3, 6, 7, 1, 22, 17, 23, 8],
    [9, 10, 11, 12, 13, 14, 15, 16],
    [18, 19, 20, 21, 24, 25, 26, 27],
    [28, 29, 30, 31, 32, 33, 34, 35],
    [36, 37, 38, 39, 40, 41, 42, 43],
    [44, 45, 46, 47, 48, 49, 50, 51],
    [52, 53, 54, 55, 56, 57, 58, 59],
    [60, 61, 62, 63, 64, 65, 66, 67],
];

export const ExampleCharTable: string[] = [
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

// 示例使用
const cdk: CdkI = new Cdk(ExampleSecret, ExampleCharTable);

export async function TestCdk() {
    const incrementID = 123456;
    try {
        const generatedCode = await cdk.generate(incrementID);
        console.log('Generated Code:', generatedCode);

        const parsedID = await cdk.parse(generatedCode);
        console.log('Parsed ID:', parsedID);

        const batchCodes = await cdk.batchGenerate(incrementID, 5);
        console.log('Batch Generated Codes:', batchCodes);
    } catch (error) {
        console.error('Error:', error);
    }
}

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleCharTable = exports.ExampleSecret = void 0;
exports.TestCdk = TestCdk;
const index_1 = require("./index"); // change to './index' from 'cdk-js' when using this in your project
// 示例的秘钥和字符表数据
exports.ExampleSecret = [
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
exports.ExampleCharTable = [
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
const cdk = new index_1.Cdk(exports.ExampleSecret, exports.ExampleCharTable);
function TestCdk() {
    return __awaiter(this, void 0, void 0, function* () {
        const incrementID = 123456;
        try {
            const generatedCode = yield cdk.generate(incrementID);
            console.log('Generated Code:', generatedCode);
            const parsedID = yield cdk.parse(generatedCode);
            console.log('Parsed ID:', parsedID);
            const batchCodes = yield cdk.batchGenerate(incrementID, 5);
            console.log('Batch Generated Codes:', batchCodes);
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}

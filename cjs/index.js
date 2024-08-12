"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Cdk = void 0;
const crypto = __importStar(require("crypto"));
/**
 * 兑换码生成器
 */
class Cdk {
    constructor(secret, charTable) {
        this.validateSecret(secret);
        this.validateCharTable(charTable);
        this.secret = secret;
        this.charTable = charTable;
    }
    validateSecret(secret) {
        if (secret.length !== 16) {
            throw new Error('Secret length must be 16');
        }
        for (const s of secret) {
            if (s.length !== 8) {
                throw new Error('Secret element length must be 8');
            }
        }
    }
    validateCharTable(charTable) {
        if (charTable.length !== 32) {
            throw new Error('CharTable length must be 32');
        }
    }
    /**
     * 生成激活码
     * @param incrementID 自增ID
     * @returns 10位激活码
     */
    generate(incrementID) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.toBinaryString(incrementID, 32);
            const inputArr = this.binaryStringToDecimalArray(id, 4);
            const randomFresh = crypto.randomInt(0, 16);
            const freshBinary = this.toBinaryString(randomFresh, 4);
            const secretKey = this.secret[randomFresh];
            if (!inputArr ||
                !secretKey ||
                inputArr.length !== 8 ||
                secretKey.length !== 8) {
                throw new Error('Secret key not found');
            }
            let sign = 0;
            let newId = '';
            for (let i = 0; i < 8; i++) {
                const inputVal = inputArr[i];
                const secretVal = secretKey[i];
                if (inputVal === undefined || secretVal === undefined) {
                    throw new Error('inputArr or secretKey contains undefined values');
                }
                sign += inputVal * secretVal;
                newId += this.xorBinaryStrings(this.toBinaryString(inputVal, 4), this.toBinaryString(secretVal, 4));
            }
            const sign14 = this.toBinaryString(sign, 14);
            const finalBinaryCode = sign14 + freshBinary + newId;
            return this.binaryStringToCode(finalBinaryCode);
        });
    }
    /**
     * 解析激活码
     * @param code 激活码
     * @returns 自增ID
     */
    parse(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const binaryString = yield this.convertToBinary(code);
            const signatureBinary = binaryString.substring(0, 14);
            const freshnessBinary = binaryString.substring(14, 18);
            const incrementIDBinary = binaryString.substring(18);
            const signNum = this.binaryStringToDecimal(signatureBinary);
            const freshInt = this.binaryStringToDecimal(freshnessBinary);
            const secretKey = this.secret[freshInt];
            if (!secretKey) {
                throw new Error('Secret key not found');
            }
            let originalId = '';
            for (let i = 0; i < 8; i++) {
                const secretKeyVal = secretKey[i];
                if (secretKeyVal === undefined) {
                    throw new Error('Secret key not found');
                }
                originalId += this.xorBinaryStrings(incrementIDBinary.substr(i * 4, 4), this.toBinaryString(secretKeyVal, 4));
            }
            const lastId = this.binaryStringToDecimal(originalId);
            const inputArr = this.binaryStringToDecimalArray(originalId, 4);
            let signInt = 0;
            for (let i = 0; i < 8; i++) {
                const inputVal = inputArr[i];
                const secretVal = secretKey[i];
                if (inputVal === undefined || secretVal === undefined) {
                    throw new Error('inputArr or secretKey contains undefined values');
                }
                signInt += inputVal * secretVal;
            }
            if (signInt !== signNum) {
                throw new Error('Invalid code');
            }
            return lastId;
        });
    }
    /**
     * 批量生成激活码
     * @param startIncrementID 起始自增ID
     * @param count 生成数量
     */
    batchGenerate(startIncrementID, count) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            for (let i = 0; i < count; i++) {
                const code = yield this.generate(startIncrementID + i);
                results.push(code);
            }
            return results;
        });
    }
    // 将字符转换为二进制字符串
    convertToBinary(s) {
        return __awaiter(this, void 0, void 0, function* () {
            let binaryString = '';
            for (let i = 0; i < s.length; i++) {
                const char = s[i];
                if (char === undefined) {
                    throw new Error(`Invalid character in code: ${s[i]}`);
                }
                const charIndex = this.charTable.indexOf(char);
                if (charIndex === -1) {
                    throw new Error(`Invalid character in code: ${s[i]}`);
                }
                binaryString += charIndex.toString(2).padStart(5, '0');
            }
            return binaryString;
        });
    }
    // 异或操作
    xorBinaryStrings(s1, s2) {
        let result = '';
        for (let i = 0; i < s1.length; i++) {
            const str1 = s1[i];
            const str2 = s2[i % s2.length];
            if (str1 === undefined || str2 === undefined) {
                throw new Error('Invalid input strings');
            }
            const b1 = parseInt(str1, 10);
            const b2 = parseInt(str2, 10);
            result += (b1 ^ b2).toString();
        }
        return result;
    }
    toBinaryString(num, length) {
        return num.toString(2).padStart(length, '0');
    }
    binaryStringToDecimal(binary) {
        return parseInt(binary, 2);
    }
    binaryStringToDecimalArray(binary, chunkSize) {
        const arr = [];
        for (let i = 0; i < binary.length; i += chunkSize) {
            arr.push(this.binaryStringToDecimal(binary.substr(i, chunkSize)));
        }
        return arr;
    }
    binaryStringToCode(binary) {
        let result = '';
        for (let i = 0; i < binary.length; i += 5) {
            result +=
                this.charTable[this.binaryStringToDecimal(binary.substr(i, 5))];
        }
        return result;
    }
}
exports.Cdk = Cdk;

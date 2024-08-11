import * as crypto from 'crypto';

/**
 * 兑换码生成器接口
 */
export interface CdkI {
    generate(input: number): Promise<string>;
    parse(code: string): Promise<number>;
    batchGenerate(startIncrementID: number, count: number): Promise<string[]>;
}

/**
 * 兑换码生成器
 */
export class Cdk implements CdkI {
    private readonly secret: number[][];
    private readonly charTable: string[];

    constructor(secret: number[][], charTable: string[]) {
        this.validateSecret(secret);
        this.validateCharTable(charTable);
        this.secret = secret;
        this.charTable = charTable;
    }

    private validateSecret(secret: number[][]): void {
        if (secret.length !== 16) {
            throw new Error('Secret length must be 16');
        }
        for (const s of secret) {
            if (s.length !== 8) {
                throw new Error('Secret element length must be 8');
            }
        }
    }

    private validateCharTable(charTable: string[]): void {
        if (charTable.length !== 32) {
            throw new Error('CharTable length must be 32');
        }
    }

    /**
     * 生成激活码
     * @param incrementID 自增ID
     * @returns 10位激活码
     */
    async generate(incrementID: number): Promise<string> {
        const id = this.toBinaryString(incrementID, 32);
        const inputArr = this.binaryStringToDecimalArray(id, 4);
        const randomFresh = crypto.randomInt(0, 16);
        const freshBinary = this.toBinaryString(randomFresh, 4);
        const secretKey = this.secret[randomFresh];

        if (
            !inputArr ||
            !secretKey ||
            inputArr.length !== 8 ||
            secretKey.length !== 8
        ) {
            throw new Error('Secret key not found');
        }

        let sign = 0;
        let newId = '';
        for (let i = 0; i < 8; i++) {
            const inputVal = inputArr[i];
            const secretVal = secretKey[i];
            if (inputVal === undefined || secretVal === undefined) {
                throw new Error(
                    'inputArr or secretKey contains undefined values'
                );
            }
            sign += inputVal * secretVal;
            newId += this.xorBinaryStrings(
                this.toBinaryString(inputVal, 4),
                this.toBinaryString(secretVal, 4)
            );
        }
        const sign14 = this.toBinaryString(sign, 14);
        const finalBinaryCode = sign14 + freshBinary + newId;

        return this.binaryStringToCode(finalBinaryCode);
    }

    /**
     * 解析激活码
     * @param code 激活码
     * @returns 自增ID
     */
    async parse(code: string): Promise<number> {
        const binaryString = await this.convertToBinary(code);
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
            originalId += this.xorBinaryStrings(
                incrementIDBinary.substr(i * 4, 4),
                this.toBinaryString(secretKeyVal, 4)
            );
        }
        const lastId = this.binaryStringToDecimal(originalId);

        const inputArr = this.binaryStringToDecimalArray(originalId, 4);
        let signInt = 0;
        for (let i = 0; i < 8; i++) {
            const inputVal = inputArr[i];
            const secretVal = secretKey[i];
            if (inputVal === undefined || secretVal === undefined) {
                throw new Error(
                    'inputArr or secretKey contains undefined values'
                );
            }
            signInt += inputVal * secretVal;
        }
        if (signInt !== signNum) {
            throw new Error('Invalid code');
        }
        return lastId;
    }

    /**
     * 批量生成激活码
     * @param startIncrementID 起始自增ID
     * @param count 生成数量
     */
    async batchGenerate(
        startIncrementID: number,
        count: number
    ): Promise<string[]> {
        const results: string[] = [];
        for (let i = 0; i < count; i++) {
            const code = await this.generate(startIncrementID + i);
            results.push(code);
        }
        return results;
    }

    // 将字符转换为二进制字符串
    private async convertToBinary(s: string): Promise<string> {
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
    }

    // 异或操作
    private xorBinaryStrings(s1: string, s2: string): string {
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

    private toBinaryString(num: number, length: number): string {
        return num.toString(2).padStart(length, '0');
    }

    private binaryStringToDecimal(binary: string): number {
        return parseInt(binary, 2);
    }

    private binaryStringToDecimalArray(
        binary: string,
        chunkSize: number
    ): number[] {
        const arr: number[] = [];
        for (let i = 0; i < binary.length; i += chunkSize) {
            arr.push(this.binaryStringToDecimal(binary.substr(i, chunkSize)));
        }
        return arr;
    }

    private binaryStringToCode(binary: string): string {
        let result = '';
        for (let i = 0; i < binary.length; i += 5) {
            result +=
                this.charTable[this.binaryStringToDecimal(binary.substr(i, 5))];
        }
        return result;
    }
}

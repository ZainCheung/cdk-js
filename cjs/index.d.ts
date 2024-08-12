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
export declare class Cdk implements CdkI {
    private readonly secret;
    private readonly charTable;
    constructor(secret: number[][], charTable: string[]);
    private validateSecret;
    private validateCharTable;
    /**
     * 生成激活码
     * @param incrementID 自增ID
     * @returns 10位激活码
     */
    generate(incrementID: number): Promise<string>;
    /**
     * 解析激活码
     * @param code 激活码
     * @returns 自增ID
     */
    parse(code: string): Promise<number>;
    /**
     * 批量生成激活码
     * @param startIncrementID 起始自增ID
     * @param count 生成数量
     */
    batchGenerate(startIncrementID: number, count: number): Promise<string[]>;
    private convertToBinary;
    private xorBinaryStrings;
    private toBinaryString;
    private binaryStringToDecimal;
    private binaryStringToDecimalArray;
    private binaryStringToCode;
}

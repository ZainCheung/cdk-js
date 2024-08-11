import { ExampleSecret, ExampleCharTable } from '../lib/example';
import { Cdk, CdkI } from '../lib/index';


test("generate code",  async () => {
    const cdk: CdkI = new Cdk(ExampleSecret, ExampleCharTable);
    const incrementID = 123456;
    try {
        const generatedCode = await cdk.generate(incrementID);
        expect(generatedCode).not.toBeNull();
        expect(generatedCode).not.toBe('');
        expect(generatedCode).not.toBeUndefined();
        expect(generatedCode).not.toBeNaN();
        expect(generatedCode).toHaveLength(10);
    } catch (error) {
        console.error('Error:', error);
    }
});

test("parse code",  async () => {
    const cdk: CdkI = new Cdk(ExampleSecret, ExampleCharTable);
    const incrementID = 123456;
    try {
        const generatedCode = await cdk.generate(incrementID);
        const parsedID = await cdk.parse(generatedCode);
        expect(parsedID).toBe(incrementID);
    } catch (error) {
        console.error('Error:', error);
    }
});

test("batch generate code",  async () => {
    const cdk: CdkI = new Cdk(ExampleSecret, ExampleCharTable);
    const incrementID = 123456;
    try {
        const batchCodes: string[] = await cdk.batchGenerate(incrementID, 5);
        expect(batchCodes).toHaveLength(5);
        for (const code of batchCodes) {
            expect(code).toHaveLength(10);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// skip performance test for now
// if you want to test performance, remove the .skip from the test below
test.skip("batch generate code test performance",  async () => {
    const cdk: CdkI = new Cdk(ExampleSecret, ExampleCharTable);
    const incrementID = 123456;
    const count = 1000000;
    try {
        const batchCodes: string[] = await cdk.batchGenerate(incrementID, count);
        expect(batchCodes).toHaveLength(count);
    } catch (error) {
        console.error('Error:', error);
    }
});



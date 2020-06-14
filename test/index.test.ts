import { Resolver } from 'typed-di-container';

class A {
    private value: number = 1;

    method(): number {
        return this.value;
    }
}

class B {
    private instanceA: A;

    constructor(instanceA: A) {
        this.instanceA = instanceA;
    }

    callAMethod(): number {
        return this.instanceA.method();
    }
}

class C {
    public value: number = 2;

    method({ value }: { value: number }) {
        this.value = value;
    }
}

const resolver = new Resolver([
    [A, {}],
    [
        B,
        { deps: [A] }
    ],
    [
        C,
        {
            deps: [B, A],
            calls: [
                (c: C) => c.method({ value: 15 })
            ]
        }
    ]
]);

console.log(resolver.get(B).callAMethod()); // 1
console.log(resolver.get(C).value); // 15

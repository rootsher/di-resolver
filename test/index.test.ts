import { Resolver } from '@rootsher/di-resolver';

class A {
    private value: number = 1;

    method(): number {
        return this.value;
    }
}

class B {
    private a: A;

    constructor(a: A) {
        this.a = a;
    }

    callAMethod(): number {
        return this.a.method();
    }
}

class C {
    public value: number = 2;

    constructor(private b: B, a: A) {}

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

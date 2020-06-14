# @rootsher/di-resolver

## installation

```sh
$ npm install @rootsher/di-resolver
```

## example usage

* define class A:

```ts
// [A]
class A {
    private value: number = 1;

    method(): number {
        return this.value;
    }
}
```

* define class B:

```ts
// [B, { deps: [A] }]
class B {
    private a: A;

    constructor(a: A) {
        this.a = a;
    }

    callAMethod(): number {
        return this.a.method();
    }
}
```

* define class C:

```ts
// [C, { deps: [B, A] }]
class C {
    public value: number = 2;

    constructor(private b: B, a: A) {}

    method({ value }: { value: number }) {
        this.value = value;
    }
}
```

* create dependency injection container definitions:

```ts
import { Resolver } from 'typed-di-container';

const resolver = new Resolver([
    [A],
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
```

* simple access to instances (`resolver.get([class])`):

```ts
console.log(resolver.get(B).callAMethod()); // 1
console.log(resolver.get(C).value); // 15
```

## IDE support

```ts
// IDE will help with types ("value" property, "method" method etc.)
"resolver.get(C).[value/method]"
```

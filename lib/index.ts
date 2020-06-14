type Constructor<T = any, S = any> = new (...args: S[]) => T;
type Definition<T = any> = { deps?: Dependency[], calls?: Call<T>[] };
type Dependency = any;
type Call<T> = (Class: T) => void;

export class Resolver {
    private definitions = new Map<Constructor, Definition>();
    private container = new WeakMap<Constructor, any>();
    // to detect circular depenendcies:
    private seen = new WeakMap<Constructor, null>();

    constructor(definitions: Iterable<readonly [Constructor, Definition]>) {
        this.definitions = new Map<Constructor, Definition>(definitions);

        for (const [ Class ] of this.definitions) {
            this.get(Class);
        }
    }

    public get<T>(Class: Constructor<T>): T {
        if (this.container.has(Class)) {
            return this.container.get(Class);
        }

        if (this.seen.has(Class)) {
            throw new Error(`Detected circular dependency: ${Class}`);
        }

        this.seen.set(Class, null);

        const {
            deps: dependencies = [],
            calls = []
        }: Definition<T> = this.definitions.get(Class) || {};
        const instance: T = new Class(
            ...dependencies.map((dependency: Dependency) => this.get<T>(dependency))
        );

        calls.forEach((call: Call<T>) => call(instance));

        this.container.set(Class, instance);

        return instance;
    }
}

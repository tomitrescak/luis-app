declare var global: any;
declare interface TestResult {
    spec: string;
    message?: string;
    stack?: string;
}
declare interface TestResults {
    goodResults: TestResult[];
    wrongResults: TestResult[];
}

declare class StoryGroup {
    name: string;
    storyGroups?: StoryGroup[];
    stories: any[];
    parent: StoryGroup;
    private _decorator?;
    constructor(name: string, parent?: StoryGroup);
    readonly root: StoryGroup;
    decorator: any;
    add(storyName: string, component: Function): this;
    addFolder(folderName: string): StoryGroup;
    addWithInfo(storyName: string, info: string, component: Function): this;
    addDecorator(decorator: any): this;
}
declare function story(storyName: string, info: string | Function, component?: Function): void;
declare function decorator(decorator: any): void;
declare function action(name: string, impl?: Function): any;
declare function tests(impl: Function): void;
declare function describe(storyName: any, func: any): TestResults;
declare function it(desc: any, func: any): void;
declare function before(func: any): void;
declare function beforeEach(func: any): void;
declare function after(func: any): void;
declare function afterEach(func: any): void;
declare function fit(desc: any, func: any): void;
declare function xit(desc: any, func: any): void;
declare function xdescribe(storyName: any, func: any): any;
declare function registerGlobals(): void;
declare function storiesOf(name: string, imp?: Function | any): any;
declare function stories(state: {
    runningTests: boolean;
}): StoryGroup;

1) in unit-test we not access real db

two courses like
1) unit test

Rely on replacements(mocks, stubs, spies)
Run very often
2) integration test: verify different interfaces of the code

 Accessing real resources(servers,dbs)
 end to end (for uis)-simulate user interaction
 
 
 advantages:
 Improve code quality and maintainbility
 Catch bugs early or avoid them
 Confidence and peace of mind when changing,extending or refatoring
 Test code frequently and easily
 
 
 Unit Test introduction in Ts:
 
 .setup from scratch
 .Assertions
 .Testing workflows(hooks)
 .Testing errors
 .Debug and coverage
 
 environment for unit-test:
 
 npm init
 npm install -save-dev typescript ts-node @types/node
 npm install -save-dev jest ts-jest @types/jest
 create src folder
 src/app/Utils.ts
 src/test/Utils.test.ts
 
 jest config.js
 
 
 .Assertions:
 
 expect().toHaveBeenCalled
 expect(). here get so many functions called Assertion function
 
  expect(error).toBeInstanceOf(Error);
  expect(error).toHaveProperty('message','empty url')
 
 
 expect('string').toBe() for equal to string values
 expect({}).toEqual({})   for equal to objects
 
 
 unit-testing hooks:
 
 beforeEach(()=>{})
 afterEach(()=>{})
 
 
 beforeEach is called before execute each test case
 beforeAll is called before execute all test cases
 
 
 skip and only:
 
 describe.only to run only describe or test case
  test.skip to run skip the test case
 
 
 to avoid coverage the function:
 
 /* istanbul ignore next */
 
 
 test doubles:
 understand the concepts behind stubbing and mocking(brifly)
 
 mocks are not stubs
 
 Test Double as the generic term fro any kind of pretend object used in place of a real object for tesing purposes.
 the name comes form the notion of a stund Double in movies
 
 
 Dummy: Object are passed around but never actually used.
 Usually they are just used to fill parameter lists.
 
 Fake: object actually have working implementations, but usually take some shortcut
 which makes them not suitable for production(an in memory database is a good example)
 
 stubs: provide canned answers to calls made during the test, usally not responding
 at all to any thing outside what programmed in for the test.
 
 spies: are stubs that also record some information based on how they were called.
one from of this might be an email service that records how many messages it was sent

mocks :are what we are talking about here: objects pre-programmed with
 expectations which form a specification of the calls they are expected to receive.
 
 
 
 
unit test for Hadle subscribe methods:
 
  describe('',()=>{
 
     it('success scenario',done()=>{

   handle.subsribe({
next:()=>{},
complete:()=>{
done();
}
}).unsubcribe();
})

it('fail scenario',done()=>{

   handle.subsribe({
next:()=>{},
error:()=>{}
}).unsubcribe();
done();
})
 
 
  })

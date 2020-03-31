# patternmatching
Simplify complex control flows and quickly surface runtime errors by using pattern matching semantics similar to those found in functional languages.

## Why?
Certain types of runtime errors (especially TypeErrors) can lead to increasingly unexpected behavior the further they propagate. By using `Match` functions for flow control rather than `if` statements we can be alerted higher up the call stack when a value is not of the type (or types) that we expect.

For example, in the following code the `user` object might be undefined but the code will still attempt to pass the `id` property to `db.userLoggedIn()`. Depending on the implementation of `db.userLoggedIn()` this may or may not result in unexpected data being written to the database:
```
if ( user.isAdmin ) {
	db.adminUserLoggedIn( user.id );
} else {
	db.userLoggedIn( user.id );
}
```

The same code using `Match` will immediately throw an error if `user` does not have the expected properties because it tests values strictly:
```
let recordUserLogin = Match(
	Case( { isAdmin: true, id: Number }, ( user ) => { db.adminUserLoggedIn( user.id ); } ),
	Case( { isAdmin: false, id: Number }, ( user ) => { db.userLoggedIn( user.id ); } )
);

recordUserLogin( user );
```

In order to make the original code as robust as `Match` we would need to add additional checks that might be forgotten:
```
if (
	user.hasOwnProperty( 'isAdmin' ) &&
	( user.isAdmin === true ) &&
	user.hasOwnProperty( 'id' ) &&
	( typeof user.id === 'number' )
) {
	db.adminUserLoggedIn( user.id );
} else if (
	user.hasOwnProperty( 'isAdmin' ) &&
	( user.isAdmin === false ) &&
	user.hasOwnProperty( 'id' ) &&
	( typeof user.id === 'number' )
) {
	db.userLoggedIn( user.id );
} else {
	throw new Error( 'Object "user" is not of the expected format' );
}
```
One of the main benefits of `Match` is that, while it is not exhaustive, it allows for more thorough validation of input more consistently than relying on developers to write boilerplate guards against common soures of Errors.

More creative usages are also possible, like the recursive implementation of factorial below.

## Usage
A `Case` expresses a logical predicate and a callback function to be called if the predicate is satisfied.

A `Match` is a function that accepts an arbitrary number of `Case` instances and returns a new test function. The returned test function is called with one or more values that will be evaluated against the `Case`s supplied to the `Match` function in the order that they were supplied. The first `Case` instance that matches the values supplied to the test function will have its callback called with the test values as its arguments. If no `Case` instance matches the values supplied to the test function then the test function will throw an Error.

All `Case` instances supplied to `Match` must have the same number of values in the predicate, and all invocations of the returned test function must be made with this same number of values.

### Case
```
Case( item, function )
```
```
Case( [ item, ...item ], function )
```
The first argument passed to `Case` may be either a single item or an array of items.
The second argument passed to `Case` must be a function.
If the callback passed to `Case` is executed it will be called with the values passed to the test function returned by `Match`.
`Case` returns a new instance of `Case`.

Items passed to `Case` may be of the following types:
* The following literal types: `object`, `string`, `number`, `boolean` (e.g. `{ a: 1 }`, `Hello`, `0`, `true`);
* The following primitive types for generic type-based matching: `Object`, `String`, `Number`, `Boolean`;
* User-defined classes (e.g. `User`, if a `User` class has been defined and exists in the current context).

Literal types will strictly match values, and in the case of objects, will be deeply-compared.
Primitive types will match any instance of that type (e.g. `Number` will match `0` but not `'0'`. Primitive types can also be used as values for object properties (e.g. `{ key: Boolean }` will match any object with a property called `key` that has a value of type `Boolean`). User-defined classes will match any instance of that class (e.g. `User` will match live instances of `User` but not live instances of other classes).

### Match
```
Match( Case, ...Case )
```
The arguments passed to `Match` must all be instances of `Case` and must all exect the same number of items to be matched.
`Match` returns a new function that will return the results of the callback for the `Case` that is matched or will throw an Error if no case is matched.

### An example of correct usage
```
// Creates a new Case instance that will match the value 0 and will return false
// when it is matched.
let caseFalse = Case( 0, () => false );
// Creates a new Case instance that will match the value 1 and will return true
// when it is matched.
let caseTrue = Case( 1, () => true );

// Creates a new test function over caseFalse and caseTrue
let test = Match(
	caseFalse,
	caseTrue
 );

test( 0 ); // Returns false
test( 1 ); // Returns true
```

### An example of incorrect usage
```
// This will throw an Error because the first Case expects one value but the
// second Case expects two values. All cases supplied to Match must expect the
// same number of values.
let test = Match(
	Case( [ 0 ], () => false ),
	Case( [ -1, 1], () => true )
 );
```

### More examples
```
/**
 * XOR for three boolean values
 */
const xor = Match(
	Case( [ false, false, false ], () => false ),
	Case( [ false, false, true ], () => true ),
	Case( [ false, true, false ], () => true ),
	Case( [ false, true, true ], () => false ),
	Case( [ true, false, false ], () => true ),
	Case( [ true, false, true ], () => false ),
	Case( [ true, true, false ], () => false ),
	Case( [ true, true, true ], () => false )
);

xor( true, false, true ); // Returns false
xor( false, true, false ); // Returns true

/**
 * Factorial
 */
const factorial = Match(
	Case( 0, () => 1 ),
	Case( Number, ( n ) => n * factorial( n - 1 ) )
);

factorial( 3 ); // Returns 6
```

## Tests
Run `npm test`.

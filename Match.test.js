const { Match, Case } = require( './Match.js' );

test( 'validates that the pattern of each Case expects the same number of test values', () => {

	let obj;

	obj  = Match(
		Case( true, () => true ),
		Case( false, () => false )
	);
	expect( typeof obj ).toBe( 'function' );

	obj  = Match(
		Case( [ true, true ], () => true ),
		Case( [ false, false ], () => false )
	);
	expect( typeof obj ).toBe( 'function' );

	expect( () => {

		const obj = Match(
			Case( [ true, false ], () => true ),
			Case( [ false ], () => false )
		);
	} ).toThrow();
} );

test( 'throws an exception if a value is not matched by the supplied patterns', () => {

	const obj = Match(
		Case( true, () => true )
	);

	expect( () => {
		obj( false );
	} ).toThrow();
} );

test( 'evaluates boolean patterns correctly', () => {

	// Implement XOR
	const xor = Match(
		Case( [ true, false ], () => true ),
		Case( [ false, true ], () => true ),
		Case( [ true, true ], () => false ),
		Case( [ false, false ], () => false )
	);

	expect( xor( true, true ) ).toBe( false );
	expect( xor( true, false ) ).toBe( true );
	expect( xor( false, true ) ).toBe( true );
	expect( xor( false, false ) ).toBe( false );
} );

test( 'evaluates number patterns correctly', () => {

	const month = Match(
		Case( 1, () => 'January' ),
		Case( 2, () => 'February' ),
		Case( 3, () => 'March' ),
		Case( 4, () => 'April' ),
		Case( 5, () => 'May' ),
		Case( 6, () => 'June' ),
		Case( 7, () => 'July' ),
		Case( 8, () => 'August' ),
		Case( 9, () => 'September' ),
		Case( 10, () => 'October' ),
		Case( 11, () => 'November' ),
		Case( 12, () => 'December' )
	);

	expect( month( 3 ) ).toBe( 'March' );
	expect( month( 11 ) ).toBe( 'November' );
} );

test( 'evaluates string patterns correctly', () => {

	const catchphrase = Match(
		Case( 'Bart', () => 'Cowabunga, dude!' ),
		Case( 'Homer', () => 'D\'oh!' )
	);

	expect( catchphrase( 'Bart' ) ).toBe( 'Cowabunga, dude!' );
	expect( catchphrase( 'Homer' ) ).toBe( 'D\'oh!' );
} );

test( 'evaluates object patterns correctly', () => {

	const objects = Match(
		Case( { a: true, b: false }, () => 'a is true and b is false.' ),
		Case( { a: 1, b: 2 }, () => 'a is 1 and b is 2.' ),
		Case( { a: 'hello', b: 'world' }, () => 'a is "hello" and b is "world".' ),
		Case( { a: { a: true, b: false }, b: { a: 1, b: 2 } }, () => 'a is { a: true, b: false } and b is { a: 1, b: 2 }.' )
	);

	expect( objects( { a: true, b: false } ) ).toBe( 'a is true and b is false.' );
	expect( objects( { a: 1, b: 2 } ) ).toBe( 'a is 1 and b is 2.' );
	expect( objects( { a: 'hello', b: 'world' } ) ).toBe( 'a is "hello" and b is "world".' );
	expect( objects( { a: { a: true, b: false }, b: { a: 1, b: 2 } } ) ).toBe( 'a is { a: true, b: false } and b is { a: 1, b: 2 }.' );

	const objectsWithPrimitiveTypePredicates = Match(
		Case( { a: Boolean, b: Number }, () => 'a is a boolean and b is a number.' ),
		Case( { a: String, b: Object }, () => 'a is a string and b is an object.' )
	);

	expect( objectsWithPrimitiveTypePredicates( { a: true, b: 1 } ) ).toBe( 'a is a boolean and b is a number.' );
	expect( objectsWithPrimitiveTypePredicates( { a: 'hello', b: { a: 'world' } } ) ).toBe( 'a is a string and b is an object.' );
} );

test( 'evaluates language primitive patterns correctly', () => {

	const primitive = Match(
		Case( Object, () => 'Value was an object.' ),
		Case( String, () => 'Value was a string.' ),
		Case( Number, () => 'Value was a number.' ),
		Case( Boolean, () => 'Value was a boolean.' )
	);

	expect( primitive( true ) ).toBe( 'Value was a boolean.' );
	expect( primitive( 1 ) ).toBe( 'Value was a number.' );
	expect( primitive( 'Test' ) ).toBe( 'Value was a string.' );
	expect( primitive( {} ) ).toBe( 'Value was an object.' );
} );

test( 'evaluates class patterns correctly', () => {

	class Captain { }

	class FirstOfficer { }

	class Quartermaster { }

	const shareOfThePlunder = Match(
		Case( Captain, () => '1/8' ),
		Case( FirstOfficer, () => '1/16' ),
		Case( Quartermaster, () => '2/16' )
	);

	const personWhoIsCaptain = new Captain();
	const personWhoIsQuartermaster = new Quartermaster();

	expect( shareOfThePlunder( personWhoIsCaptain ) ).toBe( '1/8' );
	expect( shareOfThePlunder( personWhoIsQuartermaster ) ).toBe( '2/16' );
} );

test( 'handles recursion correctly', () => {

	const factorial = Match(
		Case( 0, () => 1 ),
		Case( Number, ( n ) => n * factorial( n - 1 ) )
	);

	expect( factorial( 3 ) ).toBe( 6 );
} );
const { _Case, Case } = require( './Case.js' );

test( 'exposes "test" and "execute" methods', () => {

	const obj = Case( [ true ], () => true );

	expect( obj.constructor.name ).toBe( '_Case' );

	expect( obj.test ).toBeDefined();
	expect( typeof obj.test ).toBe( 'function' );

	expect( obj.execute ).toBeDefined();
	expect( typeof obj.execute ).toBe( 'function' );
} );

test( 'the "test" method validates that the number of arguments matches the number of pattern items', () => {

	const obj = Case( [ true ], () => true );

	expect( () => {
		obj.test( true, false );
	} ).toThrow();
} );

test( 'the "execute" method executes the "callback" argument passed to the constructor', () => {

	const callback = jest.fn();

	const obj = Case( [ true ], callback );

	obj.execute();

	expect( callback ).toHaveBeenCalled();
} );

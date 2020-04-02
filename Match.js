const { _Case, Case } = require( './Case.js' );

const Match = ( ...cases ) => {

	let casePatternLengths = [];

	// Test each supplied Case for validity when Match is called (rather than when the function
	// it returns is called, which may be at a different location in the code).
	for ( let i = 0; i < cases.length; i++ ) {

		let caseToTest = cases[i];

		if ( ! ( caseToTest instanceof _Case ) ) {
			throw new Error( `Value supplied to Match at index ${i} is not an instance of class Case.` );
		}

		casePatternLengths.push( caseToTest.pattern.length );
	}

	// Check that all of the case pattern lengths are equal and provide a helpful
	// error message if not.
	if ( ! casePatternLengths.every( ( value ) => value === casePatternLengths[0] ) ) {
		throw new Error( `Case pattern lengths supplied to Match are not equal: ${casePatternLengths}.` );
	}

	return ( ...values ) => {

		for ( let i = 0; i < cases.length; i++ ) {

			let caseToTest = cases[i];

			if ( caseToTest.test( ...values ) ) {
				return caseToTest.execute( ...values );
			}
		}

		throw new Error( `Value(s) were not matched: ${values}.` );
	}
};

module.exports = {
	Match,
	Case
};

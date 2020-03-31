class _Case {

	constructor( pattern, callback ) {

		this._validatePattern( pattern );
		this._validateCallback( callback );

		if ( ! Array.isArray( pattern ) ) {
			this.pattern = [ pattern ];
		} else {
			this.pattern = pattern;
		}

		this.callback = callback;
	}

	/**
	 * Public methods
	 */

	test( ...values ) {

		if ( this.pattern.length !== values.length ) {
			throw new Error( `The number of items in the specified pattern does not match the number of values passed to the "test()" method.` );
		}

		for ( let i = 0; i < this.pattern.length; i++ ) {

			let patternThing = this.pattern[i];
			let valueThing = values[i];
			let valueMatches = false;

			// Match class instances to their classes.
			if ( this._isFunction( patternThing ) ) {

				// Match primitive type instances to their types. Primitive types are functions. We can test
				// for an intended match against any value for a primitive type by looking at the name of the
				// type and matching any appropriate value.
				//
				// If patternThing does not match a primitive type treat it as a user-defined class and ensure
				// that valueThing is an instance of patternThing.
				switch ( patternThing ) {

					case Object:
						valueMatches = this._isPlainObject( valueThing );
						break;

					case String:
						valueMatches = this._isString( valueThing );
						break;

					case Number:
						valueMatches = this._isNumber( valueThing );
						break;

					case Boolean:
						valueMatches = this._isBoolean( valueThing );
						break;

					default:
						valueMatches = (
							this._isUserClass( patternThing ) &&
							this._isUserClassInstance( valueThing ) &&
							( valueThing instanceof patternThing )
						);
						break;
				}
			}

			// Match literal values. In this case we want to assert the strict equality of patternThing
			// and valueThing, not just that valueThing is of the type specified by patternThing.
			if ( this._isPlainObject( patternThing ) ) {
				valueMatches = this._isPlainObject( valueThing ) && this._deepEqualWithOptionalLeftSidePrimitiveTypes( patternThing, valueThing );
			}

			if ( this._isString( patternThing ) ) {
				valueMatches = this._isString( valueThing ) && this._deepEqualWithOptionalLeftSidePrimitiveTypes( patternThing, valueThing );
			}

			if ( this._isNumber( patternThing ) ) {
				valueMatches = this._isNumber( valueThing ) && this._deepEqualWithOptionalLeftSidePrimitiveTypes( patternThing, valueThing );
			}

			if ( this._isBoolean( patternThing ) ) {
				valueMatches = this._isBoolean( valueThing ) && this._deepEqualWithOptionalLeftSidePrimitiveTypes( patternThing, valueThing );
			}

			if ( ! valueMatches ) {
				return false;
			}
		}

		return true;
	}

	execute( ...values ) {
		return this.callback( values );
	}

	/**
	 * Private methods
	 */

	_validatePattern( pattern ) {

		const isInvalid = ( item ) => {

			return (
				! this._isLanguagePrimitive( item ) &&
				! this._isUserClass( item ) &&
				! this._isPlainObject( item ) &&
				! this._isString( item ) &&
				! this._isNumber( item ) &&
				! this._isBoolean( item )
			);
		};

		if ( Array.isArray( pattern ) ) {

			for ( let i = 0; i < pattern.length; i++ ) {

				let patternThing = pattern[i];

				if ( isInvalid( pattern[i] ) ) {
					throw new Error( `Pattern element supplied to Case at pattern index ${i} is of an invalid type: "${typeof pattern}".` );
				}
			}
		} else {

			if ( isInvalid( pattern ) ) {
				throw new Error( `Pattern element supplied to Case is of an invalid type: "${typeof pattern}".` );
			}
		}
	}

	_validateCallback( callback ) {

		if ( ! this._isFunction( callback ) ) {
			throw new Error( 'Callback supplied to Case is not a function.' );
		}
	}

	_isLanguagePrimitive( x ) {
		return (
			this._isFunction( x ) &&
			(
				x === Object ||
				x === String ||
				x === Number ||
				x === Boolean
			)
		);
	}

	_isUserClass( x ) {
		return ( typeof x === 'function' ) && ( x.toString().substring( 0, 5 ) === 'class' );
	}

	_isUserClassInstance( x ) {
		return ( typeof x === 'object' ) && ( x.constructor.toString().substring( 0, 5 ) === 'class' );
	}

	_isPlainObject( x ) {
		return typeof x === 'object' && ( x.constructor.name === 'Object' );
	}

	_isFunction( x ) {
		return typeof x === 'function';
	}

	_isString( x ) {
		return typeof x === 'string';
	}

	_isNumber( x ) {
		return typeof x === 'number';
	}

	_isBoolean( x ) {
		return typeof x === 'boolean';
	}

	// Adapted from https://stackoverflow.com/a/32922084.
	_deepEqualWithOptionalLeftSidePrimitiveTypes( a, b ) {

		const typeOfA = typeof a;
		const typeOfB = typeof b;

		// If a and b are both objects and are superficially strongly equal do a recursive
		// comparison of their properties.
		if (
			a &&
			b &&
			typeOfA === 'object' &&
			typeOfA === typeOfB
		) {

			return (
				( Object.keys( a ).length === Object.keys( b ).length ) &&
				( Object.keys( a ).every( ( key ) => this._deepEqualWithOptionalLeftSidePrimitiveTypes( a[ key ], b[ key ] ) ) )
			);
		// Otherwise check for language primitive types.
		} else {

			switch ( a ) {

				case Object:
					return this._isPlainObject( b );

				case String:
					return this._isString( b );

				case Number:
					return this._isNumber( b );

				case Boolean:
					return this._isBoolean( b );

				// Finally default to a strong equality check.
				default:
					return ( a === b );
			}
		}
	}
}

const Case = ( pattern, callback ) => { return new _Case( pattern, callback ); };

module.exports = {
	_Case,
	Case
};

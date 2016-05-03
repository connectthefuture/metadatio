/**
 * Created by sm on 01/05/16.
 */

import ValidatorTypes from './validator-types.metadata';
import {ValidatorException} from '../base/exceptions';


/**
 * Validators help you
 *
 *
 * @module Metadatio
 * @submodule metadata
 * @class Validator
 * @constructor
 * @param type {string} Define the type of validation to use. Type must be one TODO: Link ValidatorTypes defined.
 * @param validator {string|function} The validator to match values against
 */
export default class Validator {
    constructor(type, validator) {
        this.type = type;
        this.validator = validator;

        if(!ValidatorTypes[this.type]) {
            throw new ValidatorException('Validator type is wrong');
        }

        if(!validator) {
            throw new ValidatorException('Validator does not have a match to check');
        }

        switch(this.type) {
            case ValidatorTypes.exact:
                if(typeof(this.validator) === 'object') {
                    throw new ValidatorException('Validator for type \'exact\' must not be an object');
                }
                break;

            case ValidatorTypes.regex:
                if(!(this.validator instanceof RegExp)) {
                    throw new ValidatorException('Validator for type \'regex\' must be a regular expression');
                }
                break;

            case ValidatorTypes.range:
            case ValidatorTypes.length:
                if(this.validator.min === undefined && this.validator.max === undefined) {
                    throw new ValidatorException('Validator for type \'' + this.type + '\' must specify at least one of \'min\' and \'max\'')
                }

                if((this.validator.min !== undefined && typeof(this.validator.min) !== 'number') || (this.validator.max !== undefined && typeof(this.validator.max) !== 'number')) {
                    throw new ValidatorException('Options (min, max) for \'' + this.type + '\' validators must be numbers');
                }

                break;

            case ValidatorTypes.fn:
                if(typeof(this.validator) !== 'function') {
                    throw new ValidatorException('Validators of type \'fn\' must receive a function to validate against');
                }
                break;
        }
    }

    validate(value) {
        switch(this.type) {
            case ValidatorTypes.exact:
                if(typeof(value) === 'object') {
                    throw new ValidatorException('Value provided for validator type \'exact\' must not be an object');
                }
                return value === this.validator;

            case ValidatorTypes.regex:
                if(typeof(value) !== 'string') {
                    throw new ValidatorException('Value provided for validator type \'regex\' must be a string');
                }
                return !!value.match(this.validator);

            case ValidatorTypes.range:
                if(typeof(value) !== 'number') {
                    throw new ValidatorException('Value provided for validator type \'range\' must be a number');
                }
                let rangeMin = this.validator.min ? value >= this.validator.min : true;
                let rangeMax = this.validator.max ? value <= this.validator.max : true;
                return rangeMin && rangeMax;

            case ValidatorTypes.length:
                if(typeof(value) !== 'string' && !(value instanceof Array)) {
                    throw new ValidatorException('Value provided for validator type \'length\' must be either a string or an array');
                }
                let lengthMin = this.validator.min ? value.length >= this.validator.min : true;
                let lengthMax = this.validator.max ? value.length <= this.validator.max : true;
                return lengthMin && lengthMax;

            case ValidatorTypes.fn:
                const value = this.validator.call(this, value);
                if(value !== true && value !== false) {
                    throw new ValidatorException('Validator functions must return either \'true\' or \'false\'');
                }
                
                return value;

        }

        return false;
    }
}
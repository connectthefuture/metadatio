/**
 * Created by sm on 14/05/16.
 */

export class ValidatorActions {

    constructor() {

    }

    validate(uuid, value) {
        
    }

    static getInstance() {
        if(!ValidatorActions.instance) ValidatorActions.instance = new ValidatorActions();
        return ValidatorActions.instance;
    }
}

export default ValidatorActions.getInstance();
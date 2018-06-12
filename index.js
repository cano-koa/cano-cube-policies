const Cube = require('cano-cube');
const requireAll = require('require-all');
const map = require('lodash/map');
const path = require('path');

/**
  * @class PoliciesCube
  * @classdesc This cube is for instance and load policies to the cano app core
  * @extends Cube
  * @author Antonio Mejias
  */
class PoliciesCube extends Cube {

    /**
     * @constructs
     * @author Antonio Mejias
     */
    constructor(cano) {
        super(cano)
    }

    /**
     * @override
     * @method prepare
     * @description Ask if the cano.app.policies object exist, if not exist
     * the method create the proton.app.policies object
     * @author Antonio Mejias
     */
    prepare() {
        return new Promise((resolve) => {
            if (!this.cano.app.policies) this.cano.app.policies = {};
            resolve();
        })
    }

    /**
     * @override
     * @method up
     * @description This method run the cube policies main logic, in this case, instance
     * all the policies in the api folder and bind it to the cano app core
     * @author Antonio Mejias
     */
    up() {
        return new Promise((resolve) => {
            const requiredPolicies = requireAll(this.policyPath)
            map(requiredPolicies, (Policy, fileName) => {
                const policy = typeof Policy === 'function' ? new Policy() : new Policy.default();
                global[fileName] = policy;
                this.bindToApp('policies', fileName, policy)
            })
            resolve()
        })
    }

    /**
     * @method policiyPath
     * @description This method is a getter that return the absolute path where the
     * policies are located
     * @author Antonio Mejias
     */
    get policyPath() {
        return path.join(this.cano.app.paths.api, '/policies')
    }
}

module.exports = PoliciesCube;

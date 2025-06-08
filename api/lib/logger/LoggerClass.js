const logger = require('./logger');

let instance = null;

class LoggerClass {
    constructor() {
        if(!instance) {
            instance =this 
        }
        return instance;
    }

    #createLogObject( email, location, procType, log){
        // log = this.mask(logs);
        return {
            email, location, procType, log
        }
    }

    info(email, location, procType, log){
        let logs = this.#createLogObject(email, location, procType, log);
        logger.info(logs);
    }

    warn(email, location, procType, log){
        let logs = this.#createLogObject(email, location, procType, log);
        logger.warn(logs);
    }
    error(email, location, procType, log){
        let logs = this.#createLogObject(email, location, procType, log);
        logger.error(logs);
    }
    verbose(email, location, procType, log){
        let logs = this.#createLogObject(email, location, procType, log);
        logger.verbose(logs);
    }
    silly(email, location, procType, log){
        let logs = this.#createLogObject(email, location, procType, log);
        logger.silly(logs);
    }
    http(email, location, procType, log){
        let logs = this.#createLogObject(email, location, procType, log);
        logger.http(logs);
    }

}

module.exports = new LoggerClass();
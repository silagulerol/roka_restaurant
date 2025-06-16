const AuditLogsModel = require("../db/models/AuditLogs");
const Enum= require("../config/Enum");


class AuditLogs{
     constructor() {
        if (!AuditLogs.instance) {
            AuditLogs.instance = this;
        }

        return AuditLogs.instance;
    }


    info(email, location, proc_type, log){
        this.#saveToDb({
            level: Enum.LOG_LEVELS.INFO, 
            email, location, proc_type, log
        });
    }

    warn(email, location, proc_type, log){
        this.#saveToDb({
            level: Enum.LOG_LEVELS.WARN,
            email, location, proc_type, log
        });
    }

    error(email, location, proc_type, log){
        this.#saveToDb({
            level: Enum.LOG_LEVELS.ERROR,
            email, location, proc_type, log
        });
    }

    debug(email, location, proc_type, log){
        this.#saveToDb({
            level: Enum.LOG_LEVELS.DEBUG,
            email, location, proc_type, log
        });
    }

    verbose(email, location, proc_type, log){
        this.#saveToDb({
            level: Enum.LOG_LEVELS.VERBOSE,
            email, location, proc_type, log
        });
    }

    http(email, location, proc_type, log){
        this.#saveToDb({
            level: Enum.LOG_LEVELS.HTTP,
            email, location, proc_type, log
        });
    }

    
    #saveToDb({level, email, location, proc_type, log}) {
        AuditLogsModel.create({
            level,
            email,
            location,
            proc_type,
            log
        });

     }
}

module.exports= new AuditLogs();
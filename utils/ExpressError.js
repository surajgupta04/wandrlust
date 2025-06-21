// this express error will look up to new error if A route not found (404 error)

/*A problem with middleware
A bad request from the client
An internal server issue (500 error)
Issues connecting to a database or external service*/
class ExpressError extends Error {
    constructor(statuscode, message) {
        super();
        this.statuscode = statuscode;
        this.message = message;
    }
}
  

module.exports = ExpressError;
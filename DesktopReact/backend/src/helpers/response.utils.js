exports.responseHelper = function responseHelper(response) {

            if(typeof response !== 'object'){
                response = { result:'Ko', data:response};
                console.log("Response error: ", response);
            }
            return response;

        
}

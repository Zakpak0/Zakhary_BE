/**
    response.setHeader("Content-Type", "application/json")
    @abstract CTjson
    */
    const CTjson = response.setHeader("Content-Type", "application/json");


    /** 
    response.setHeader("Content-Type", "text/html", "charset=utf-8") 
    @abstract CThtml 
    */
    const CThtml = response.setHeader("Content-Type", "text/html", "charset=utf-8")


    /** 
    const AC = response.setHeader("Access-Control-Allow-Origin", "*")
    @abstract AC 
    */
    const AC = response.setHeader("Access-Control-Allow-Origin", "*")



    /**
    @function 
    const RC = (code) => response.statusCode = code;
    @description
    Sets a status code response
    @param code
    The status code to return
    */
    const RC = (code) => response.statusCode = code;


    /**
    @function
    const SendResponse = (Function, DataPoints = [], response) => {
      let responseData = [];
      let timeout = setTimeout(() => {
        response.write(JSON.stringify(responseData));
        response.end();
      }, 10000);
      let Args = DataPoints.map((point) => {
        return (pointVar) => {
          let Object = `${point}: ${pointVar}`
          responseData.push({ Object });
          if (responseData.length == DataPoints.length) {
            clearTimeout(timeout);
            response.write(JSON.stringify(responseData));
            response.end();
          }
        }
      })
      Function(...Args)
    }
    @description
    Calls a backend service that retrieves data from a 3rd party
    @param Function
    The backend service function to call
    @param DataPoints
    An array of Data Point arguments accepted by the back end services
    */
    const SendResponse = (Function, DataPoints = []) => {
      let responseData = [];
      let timeout = setTimeout(() => {
        response.write(JSON.stringify(responseData));
        response.end();
      }, 10000);
      let Args = DataPoints.map((point) => {
        return (pointVar) => {
          let data = Object.create({})
          data[`${point}`] = pointVar
          responseData.push(data);
          if (responseData.length == DataPoints.length) {
            clearTimeout(timeout);
            response.write(JSON.stringify(responseData));
            response.end();
          }
        }
      })
      Function(...Args)
    }

    export {CTjson, CThtml, AC, RC, SendResponse}
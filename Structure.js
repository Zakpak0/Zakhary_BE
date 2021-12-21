const SendResponse = (Function, DataPoints = [], response) => {
    let responseData = [];
    let timeout = setTimeout(() => {
        response.write(JSON.stringify(responseData));
        response.end();
    }, 10000);
    let Args = DataPoints.map((point) => {
        return (pointVar) => {
            responseData.push({ point = pointVar });
            if (responseData.length == DataPoints.length) {
                clearTimeout(timeout);
                response.write(JSON.stringify(responseData));
                response.end();
            }
        }
    })
    Function(...Args)

}
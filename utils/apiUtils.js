const sendSuccess = (res, status, message, data) => {
    const response = {
        success: true,
        message,
    };

     // Include data only if provided
    if (data !== undefined) {
        response.data = data;
    }

    res.status(status).json(response);
};


const sendError = (res, status, message) => {
    res.status(status).json({
      success: false,
      message: message,
    });
};

module.exports = { sendSuccess, sendError };
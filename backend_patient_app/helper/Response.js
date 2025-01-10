function responseError(res, error) {
  if (error.errors) {
    return res.status(500).json({
      code: 500,
      message: error.errors[0].message,
    });
  } else {
    return res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
}
function responseCreate(res) {
  res.status(201).json({
    code: 201,
    message: "Success Create Data",
  });
}
function responseGet(res, data) {
  res.status(200).json({
    code: 200,
    message: "Success Get Data",
    data: data,
  });
}
function responseGetPaginator(res, result) {
  const { data, totalPages, currentPages } = result;
  res.status(200).json({
    code: 200,
    message: "Success Get Data",
    data,
    totalPages,
    currentPages,
  });
}
function responseUpdate(res, data) {
  if (data == 1) {
    res.status(200).json({
      code: 200,
      message: "Success Update Data",
      data,
    });
  } else {
    res.status(200).json({
      code: 200,
      message: "Failed Update Data",
      data,
    });
  }
}
function responseDelete(res, status) {
  if (status == 1) {
    res.status(200).json({
      code: 200,
      message: "Success Delete Data",
      status,
    });
  } else {
    res.status(200).json({
      code: 200,
      message: "Failed Delete Data",
      status,
    });
  }
}

module.exports = {
  responseError,
  responseCreate,
  responseGet,
  responseUpdate,
  responseDelete,
  responseGetPaginator,
};

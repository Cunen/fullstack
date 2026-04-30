const redirectWithNotification = async (
  req,
  res,
  url,
  status,
  message,
  validationErrors,
  previousValues
) => {
  req.session.notification = { status, message };
  req.session.previousValues = previousValues || {};
  req.session.validationErrors = validationErrors || [];
  await req.session.save();
  return res.redirect(url);
};

export default redirectWithNotification;

const redirectWithNotification = async (req, res, url, status, message) => {
  req.session.notification = { status, message };
  await req.session.save();
  return res.redirect(url);
};

export default redirectWithNotification;

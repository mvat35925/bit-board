// require Guest
const Guest = require("../models/guest.model.js");

const getGuests = async (req, res) => {
  try {
    const guests = await Guest.find();

    res.send({
      statusCode: 200,
      statusMessage: 'Ok',
      message: 'Successfully retrieved all the guests.',
      data: guests,
    });
  } catch (err) {
    res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
  }
}

const addGuest = async (req, res, next) => {
  const guestID = req.session.uid;
  try {
    const guest = new Guest(guestID);
    await guest.save();
    next();
  } catch (err) {
    res.status(500).send({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: null,
      data: null,
    });
  }

}

module.exports = {
  getGuests,
  addGuest,
}
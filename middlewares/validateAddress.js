const locationData = require('./../utils/locationData');

const validateAddress = (req, res, next) => {
  const { country, state, emirate } = req.body.address;

  // Validate Country
  if (!locationData[country]) {
    return res.status(400).json({ error: 'Invalid country selected.' });
  }

  // Validate State for India
  if (country === 'India' && (!state || !locationData[country].includes(state))) {
    return res.status(400).json({ error: 'Invalid state for India.' });
  }

  // Validate Emirate for UAE
  if (country === 'United Arab Emirates' && (!emirate || !locationData[country].includes(emirate))) {
    return res.status(400).json({ error: 'Invalid emirate for UAE.' });
  }

  // If validation passes
  next();
};

module.exports = validateAddress;
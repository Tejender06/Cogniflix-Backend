const interactionService = require("../services/interactionService");

async function addInteraction(req, res) {
  try {
    const userId = req.user.id;

    const data = {
      ...req.body,
      user_id: userId,
    };

    const result = await interactionService.handleInteraction(data);

    res.status(201).json({
      message: "Interaction logged successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

module.exports = {
  addInteraction,
};
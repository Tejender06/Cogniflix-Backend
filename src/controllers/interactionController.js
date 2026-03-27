const interactionService = require("../services/interactionService");

async function addInteraction(req, res) {
  try {
    const result = await interactionService.handleInteraction(req.body);

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

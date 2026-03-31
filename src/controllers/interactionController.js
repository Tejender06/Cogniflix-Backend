const interactionService = require("../services/interactionService");

async function addInteraction(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { content_id, interaction_type } = req.body;

    const result = await interactionService.handleInteraction({
      user_id: req.user.id,
      content_id,
      interaction_type,
    });

    res.status(201).json({
      message: "Interaction logged successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { addInteraction };
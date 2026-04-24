const interactionService = require("../services/interactionService");

async function addInteraction(req, res) {
  try {
    const { content_id, interaction_type } = req.body;

    if (!content_id || !interaction_type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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

async function getHistory(req, res) {
  try {
    const history = await interactionService.getHistory(req.user.id);
    res.status(200).json({ data: history });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { addInteraction, getHistory };
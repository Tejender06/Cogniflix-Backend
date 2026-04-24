const interactionRepository = require("../repositories/interactionRepository");

async function handleInteraction({ user_id, content_id, interaction_type }) {
  if (!user_id || !content_id || !interaction_type) {
    throw new Error("Missing required fields");
  }

  const scoreMap = {
    watch: 1,
    like: 2,
    dislike: -1,
  };

  if (!(interaction_type in scoreMap)) {
    throw new Error("Invalid interaction type");
  }

  const score = scoreMap[interaction_type];

  // 🔥 FIX: map content_id → item_id
  return await interactionRepository.addInteraction({
    user_id,
    item_id: content_id,
    interaction_type,
    score,
  });
}

async function getHistory(user_id) {
  if (!user_id) throw new Error("Missing user_id");
  return await interactionRepository.getHistory(user_id);
}

module.exports = { handleInteraction, getHistory };
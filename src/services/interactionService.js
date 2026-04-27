/*
FILE: interactionService.js

PURPOSE:
Implements business logic for processing user interactions and updating preferences.

FLOW:
Controller -> Service -> Repository

USED BY:
interactionController.js

NEXT FLOW:
interactionRepository.js, userPreference.repository.js

*/
const interactionRepository = require("../repositories/interactionRepository");

async function handleInteraction({ user_id, content_id, interaction_type, score: passedScore }) {
  if (!user_id || !content_id || !interaction_type) {
    throw new Error("Missing required fields");
  }

  const scoreMap = {
    watch: 1,
    like: 2,
    dislike: -1,
    save: 3,
    rate: 0, // Rate score is passed dynamically
  };

  if (!(interaction_type in scoreMap)) {
    throw new Error("Invalid interaction type");
  }

  const score = interaction_type === 'rate' ? passedScore : scoreMap[interaction_type];

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

async function getSaved(user_id) {
  if (!user_id) throw new Error("Missing user_id");
  return await interactionRepository.getSaved(user_id);
}

async function removeSavedInteraction(user_id, item_id) {
  if (!user_id || !item_id) throw new Error("Missing user_id or item_id");
  return await interactionRepository.removeInteraction(user_id, item_id, 'save');
}

module.exports = { handleInteraction, getHistory, getSaved, removeSavedInteraction };
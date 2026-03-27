const interactionRepository = require("../repositories/interactionRepository");

const scoreMap = {
  watch: 1,
  like: 2,
  rate: 3,
};

async function handleInteraction(data) {
  const { user_id, item_id, interaction_type, rating, watch_time } = data;

if (!(interaction_type in scoreMap)) {
  throw new Error("Invalid interaction type");
}

  const interaction = await interactionRepository.createInteraction(
    user_id,
    item_id,
    interaction_type,
    rating,
    watch_time,
  );

  const score = scoreMap[interaction_type];
  await interactionRepository.updatePopularityScore(item_id, score);

  return interaction;
}

module.exports = {
  handleInteraction,
};

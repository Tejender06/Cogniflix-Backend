/*
FILE: recommendation.controller.js

PURPOSE:
Handles incoming recommendation requests and sends response.

FLOW:
Routes -> Controller -> Service

USED BY:
recommendation.routes.js

NEXT FLOW:
recommendation.service.js

*/
const recommendationService = require('../services/recommendation.service');

const getRecommendations = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.user_id;

    if (!userId) {
      return res.status(400).json({
        error: 'user_id is required'
      });
    }

    const results = await recommendationService.getRecommendations(userId);

    if (!Array.isArray(results)) {
      return res.status(200).json({
        user_id: userId,
        count: 0,
        data: []
      });
    }

    return res.status(200).json({
      user_id: userId,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Recommendation Controller Error:', error);

    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

module.exports = {
  getRecommendations
};
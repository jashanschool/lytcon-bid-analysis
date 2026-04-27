"use strict";

function attachBestKeywordMatch(question, reviewedSources = []) {
  const q = String(question.question || "").toLowerCase();
  let best = null;

  for (const row of reviewedSources) {
    let score = 0;
    for (const keyword of row.keywords || []) {
      if (q.includes(String(keyword).toLowerCase())) score += 0.4;
    }

    const candidate = { ...row, similarity_score: Math.min(score, 0.98) };
    if (!best || candidate.similarity_score > best.similarity_score) {
      best = candidate;
    }
  }

  return { ...question, retrieved_sow: best };
}

function classifyReviewedMatch(question, threshold = 0.75) {
  const match = question.retrieved_sow;
  const hasReviewedMatch = Boolean(match && match.similarity_score >= threshold);

  return {
    ...question,
    match_status: hasReviewedMatch ? "reviewed_match" : "needs_draft",
    reviewed_answer: hasReviewedMatch ? match.text : null,
  };
}

function buildReviewAnswerSets(questions = []) {
  const reviewed_answers = [];
  const draft_answers = [];

  for (const question of questions) {
    if (question.match_status === "reviewed_match") {
      reviewed_answers.push({
        question_id: question.question_id,
        answer: question.reviewed_answer,
        source_id: question.retrieved_sow.source_id,
        answer_status: "reviewed",
        confidence: question.retrieved_sow.similarity_score,
      });
    } else {
      draft_answers.push({
        question_id: question.question_id,
        answer: "Draft response required: no reviewed SOW evidence was strong enough. Human review should confirm the final answer.",
        answer_status: "draft",
        confidence: 0.45,
        review_required: true,
        available_context: question.retrieved_sow || null,
      });
    }
  }

  return {
    reviewed_answers,
    draft_answers,
    total_questions: reviewed_answers.length + draft_answers.length,
  };
}

module.exports = {
  attachBestKeywordMatch,
  buildReviewAnswerSets,
  classifyReviewedMatch,
};

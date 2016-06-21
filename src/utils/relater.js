import { intersection } from 'lodash';
import moment from 'moment';

const WORD_MATCH_ACCURACY = 0.35;
const HASHTAG_MATCH_ACCURACY = 0.95;
const TIME_DISTANCE_ACCURACY = 0.40;
const MAX_MINUTES_TO_BE_RELATED = 10;

/*
 * Rules
 * - Each rule takes 2 comparatees and returns a value between 0 and 1
 */

function getWordRuleValue(text, text2) {
  const words = text.split(' ').map((word) => word.toLowerCase());
  const words2 = text2.split(' ').map((word) => word.toLowerCase());

  return intersection(words, words2).length / words.length;
}

function getHashtagRuleValue(hashtags, hashtags2) {
  if(hashtags.length === 0) {
    return 0;
  }

  return intersection(hashtags, hashtags2).length / hashtags.length
}

function getTimeDifferenceRuleValue(time, time2) {
  const diffMinutes = Math.abs(moment(time).diff(time2, 'minutes', true));
  return 1 - Math.min(1, diffMinutes / MAX_MINUTES_TO_BE_RELATED);
}


/*
 * Sum values from rules together
 */
function getRelativityAmount(thought, thought2) {
  const wordRuleValue =
    getWordRuleValue(thought.text, thought2.text) * WORD_MATCH_ACCURACY;

  const hashtagRuleValue =
    getHashtagRuleValue(thought.hashtags, thought2.hashtags) * HASHTAG_MATCH_ACCURACY;

  const timeDifferenceRuleValue =
    getTimeDifferenceRuleValue(thought.createdAt, thought2.createdAt) * TIME_DISTANCE_ACCURACY;

  return wordRuleValue + hashtagRuleValue + timeDifferenceRuleValue;
}

export function sortByRelativity(thought, thoughts) {
  return thoughts.slice(0)
    .sort((a, b) => getRelativityAmount(thought, b) - getRelativityAmount(thought, a));
}

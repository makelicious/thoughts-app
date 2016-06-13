import { identity, sample } from 'lodash';

// TODO add more handlers
// currently only supports imgur
const handlers = [
  {
    test: ({domain}) => domain === 'imgur.com',
    parse(thread) {
      const [, id] = thread.url.match(/imgur.com\/(\w+)/);
      return `https://i.imgur.com/${id}.jpg`;
    }
  }
];

function getThreads(subreddit) {
  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then((res) => res.json())
    .then(({data}) => data.children.map(({data}) => data));
}

function parseImage(thread) {
  for(let handler of handlers) {
    if(handler.test(thread)) {
      return handler.parse(thread);
    }
  }
}

function getImage(threads) {

  const images = threads
    .map(parseImage)
    .filter(identity);

  const image = sample(images);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = image;
    img.onload = () => resolve(image);
  });

}


export function getDailyBackground(subreddit) {
  return getThreads(subreddit).then(getImage);
}

import React from 'react';
import classNames from 'classnames';
import { sample } from 'lodash';

const backgrounds = [
  'https://images.unsplash.com/photo-1463595373836-6e0b0a8ee322?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1280&q=80',
  'https://images.unsplash.com/photo-1460804198264-011ca89eaa43?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1338&q=80',
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1823&q=80',
  'https://images.unsplash.com/photo-1452473767141-7c6086eacf42?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1280&q=80',
  'https://images.unsplash.com/photo-1460378150801-e2c95cb65a50?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1080&q=80',
  'https://images.unsplash.com/photo-1447834353189-91c48abf20e1?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1280&q=80',
  'https://images.unsplash.com/photo-1443890484047-5eaa67d1d630?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1280&q=80',
  'https://images.unsplash.com/photo-1450849608880-6f787542c88a?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=994&q=80'
];

const randomBackground = sample(backgrounds);

export default function Background(props) {

  return (
    <div {...props} style={{backgroundImage: `url(${randomBackground})`}}>
      {props.children}
    </div>
  );
}

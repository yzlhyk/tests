import React from 'react';
// import { parseISO, formatDistanceToNow } from 'date-fns';

export const TimeAgo = ({timestamp} :{timestamp: string}) => {
  let timeAgo = '';
  if (timestamp) {

    timeAgo = `${timestamp} ago`;
  }
  return (
    <span title={timestamp}>
      &nsbp; <i>{timeAgo}</i>
    </span>
    )
}

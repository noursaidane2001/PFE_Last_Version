import React, { useEffect } from 'react';

function withScrollToTop(WrappedComponent) {
  return function WithScrollToTop(props) {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    return <WrappedComponent {...props} />;
  };
}

export default withScrollToTop;

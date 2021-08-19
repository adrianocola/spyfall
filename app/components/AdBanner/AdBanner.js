import React, { useLayoutEffect } from 'react';
import env from 'env';

export const AdBanner = () => {
  const haveAds = !!env.ADSENSE_CLIENT_ID && !!env.ADSENSE_BANNER_ID;

  useLayoutEffect(() => {
    if (!haveAds) return;

    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, [haveAds]);

  if (!haveAds) return null;

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', marginTop: 20 }}
      data-ad-client={env.ADSENSE_CLIENT_ID}
      data-ad-slot={env.ADSENSE_BANNER_ID}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default React.memo(AdBanner);

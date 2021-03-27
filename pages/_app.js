import { DefaultSeo } from 'next-seo';
import '../src/tailwind.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo
        title="COSI MP* Archive"
        description="An archive of my COSI MP* content"
        twitter={{
          handle: '@lannonbr',
          site: 'https://twitter.com/lannonbr',
        }}
      />
      <Component {...pageProps} />;
    </>
  );
}

import { promises as fs } from 'fs';
import path from 'path';
import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';
import matter from 'gray-matter';
import glob from 'fast-glob';

import Code from '@components/Code';

const components = {
  code: Code,
  h2: (props) => <h1 {...props} className="text-xl my-2" />,
  ul: (props) => <ul {...props} className="mb-4" />,
  li: (props) => <li {...props} className="list-disc pl-2 ml-8" />,
  a: (props) => <a {...props} className="text-blue-500 hover:underline" />,
  p: (props) => <p {...props} className="mb-2" />,
};

export default function Data({ mdxSource, frontMatter }) {
  const content = hydrate(mdxSource, { components });
  return (
    <div className="max-w-7xl mx-4">
      <h1 className="text-4xl font-bold">{frontMatter.title}</h1>
      {content}
    </div>
  );
}

// This glob is what will be used to generate static routes
const contentPath = 'src/data';
export const contentGlob = `${contentPath}/**/*.mdx`;
export const getFileSlug = (filePath) => {
  const filename = filePath.replace(`${contentPath}/`, '');
  const slug = filename.replace(new RegExp(path.extname(filePath) + '$'), '');
  return slug;
};

export async function getStaticPaths() {
  const files = glob.sync(contentGlob);

  const paths = files.map((file) => {
    return {
      params: {
        slug: getFileSlug(file).split('/'),
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const files = glob.sync(contentGlob);

  const pathRegex = new RegExp(`^${contentPath}/${path.join(...slug)}.mdx$`);
  const fullPath = files.find((file) => pathRegex.test(file));

  if (!fullPath) {
    console.warn('No MDX file found for slug');
  }

  const mdxSource = await fs.readFile(fullPath);
  const { content, data } = matter(mdxSource);

  const mdx = await renderToString(content, { components, scope: data });

  return {
    props: {
      mdxSource: mdx,
      frontMatter: data,
    },
  };
}

import ReactMarkdown from 'react-markdown';
import { colors } from '../theme';

const linkStyle: React.CSSProperties = {
  color: colors.trail,
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
};

const linkProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
  style: linkStyle,
};

// Inline — strips the wrapping <p> so it can live inside a Typography node
export function MdInline({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <ReactMarkdown
      disallowedElements={['p']}
      unwrapDisallowed
      components={{
        a: ({ href, children: c }) => <a href={href} {...linkProps}>{c}</a>,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

// Block — full markdown with paragraph spacing
export function MdBlock({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <ReactMarkdown
      components={{
        p: ({ children: c }) => <p style={{ margin: '0 0 0.75em 0' }}>{c}</p>,
        a: ({ href, children: c }) => <a href={href} {...linkProps}>{c}</a>,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

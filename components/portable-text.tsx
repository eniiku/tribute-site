import { PortableText, type PortableTextBlock } from '@portabletext/react';

interface PortableTextComponentProps {
  value: PortableTextBlock[] | string | null | undefined;
}

const PortableTextComponent = ({ value }: PortableTextComponentProps) => {
  // Handle different data types
  if (!value) {
    return null;
  }
  
  // If it's a string, render it as plain text (fallback)
  if (typeof value === 'string') {
    return <p className="text-sm text-muted-foreground leading-relaxed">{value}</p>;
  }
  
  // If it's an array but empty, return null
  if (Array.isArray(value) && value.length === 0) {
    return null;
  }
  
  // If it's an array in portable text format
  const components = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>,
      h1: ({ children }: { children: React.ReactNode }) => <h1 className="text-2xl font-bold my-4">{children}</h1>,
      h2: ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-semibold my-4">{children}</h2>,
      h3: ({ children }: { children: React.ReactNode }) => <h3 className="text-lg font-medium my-3">{children}</h3>,
      blockquote: ({ children }: { children: React.ReactNode }) => <blockquote className="border-l-4 border-accent pl-4 italic my-4">{children}</blockquote>,
    },
    list: {
      bullet: ({ children }: { children: React.ReactNode }) => <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>,
      number: ({ children }: { children: React.ReactNode }) => <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }: { children: React.ReactNode }) => <li className="text-sm text-muted-foreground">{children}</li>,
      number: ({ children }: { children: React.ReactNode }) => <li className="text-sm text-muted-foreground">{children}</li>,
    },
    marks: {
      strong: ({ children }: { children: React.ReactNode }) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }: { children: React.ReactNode }) => <em className="italic">{children}</em>,
      link: ({ children, value }: { children: React.ReactNode; value: any }) => (
        <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          {children}
        </a>
      ),
    },
  };

  return (
    <PortableText
      value={value as PortableTextBlock[]}
      components={components}
    />
  );
};

export default PortableTextComponent;
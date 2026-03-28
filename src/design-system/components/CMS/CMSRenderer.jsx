import React, { memo } from 'react';
import { Stack } from '../Layout/Stack';
import { Text } from '../Typography/Text';
import { Blockquote } from '../Typography/Blockquote';
import { List } from '../Typography/List';

const componentMap = {
  paragraph: (props) => <Text variant="paragraph" {...props} />,
  heading1: (props) => <Text variant="h1" {...props} />,
  heading2: (props) => <Text variant="h2" {...props} />,
  heading3: (props) => <Text variant="h3" {...props} />,
  blockquote: (props) => <Blockquote {...props} />,
  bulletList: (props) => <List ordered={false} {...props} />,
  orderedList: (props) => <List ordered={true} {...props} />,
};

export const CMSRenderer = memo(({ blocks, spacing = 'lg', isDayMode = true }) => {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <Stack spacing={spacing}>
      {blocks.map((block, index) => {
        const Component = componentMap[block.type];
        if (!Component) return null;
        
        return (
          <Component key={`${block.type}-${index}`} isDayMode={isDayMode} {...block.data}>
            {block.data.content}
          </Component>
        );
      })}
    </Stack>
  );
});

CMSRenderer.displayName = 'CMSRenderer';

import React from "react";
import useVirtualWindow from "../../hooks/useVirtualWindow";

const DEFAULT_ROW_HEIGHT = 88;

const VirtualMessageList = ({
  messages,
  estimatedRowHeight = DEFAULT_ROW_HEIGHT,
  renderMessage,
  className = "",
}) => {
  const containerRef = React.useRef(null);

  const { firstVisible, lastVisible, itemHeight, offsetY, totalHeight } = useVirtualWindow({
    itemCount: messages.length,
    itemHeight: estimatedRowHeight,
    containerRef,
  });

  const windowedMessages = messages.slice(firstVisible, lastVisible);

  return (
    <div ref={containerRef} className={`stable-scroll custom-scrollbar atom-fill ${className}`}>
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {windowedMessages.map((message, index) => {
            const absoluteIndex = firstVisible + index;
            return (
              <div key={message.id ?? absoluteIndex} style={{ minHeight: itemHeight }} className="content-visibility-auto">
                {renderMessage(message, absoluteIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VirtualMessageList;

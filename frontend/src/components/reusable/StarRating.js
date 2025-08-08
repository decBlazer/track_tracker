import React, { useState } from 'react';
import styled from 'styled-components';

const StarRating = ({ rating = 0, onRating }) => {
  const [hovered, setHovered] = useState(null);

  const handleClick = async (rate) => {
    if (onRating) {
      // Call the onRating function passed via props
      await onRating(rate);
    }
  };

  const handleMouseEnter = (rate) => {
    setHovered(rate);
  };

  const handleMouseLeave = () => {
    setHovered(null);
  };

  return (
    <RatingContainer>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          filled={star <= (hovered || rating)}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
        >
          ★
        </Star>
      ))}
    </RatingContainer>
  );
};

const RatingContainer = styled.div`
  display: flex;
  justify-content: center; /* Centers stars horizontally */
  align-items: center; /* Optional: Centers stars vertically if needed */
  cursor: pointer;
`;

const Star = styled.span`
  font-size: 24px;
  color: ${({ filled }) => (filled ? '#FFD700' : '#ccc')};
  transition: color 0.2s;
  margin: 0 2px; /* Adds spacing between stars */
`;

export default StarRating;

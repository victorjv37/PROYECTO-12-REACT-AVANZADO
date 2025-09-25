import React, { memo } from "react";
import { Star } from "lucide-react";
import "./StarRating.css";

const StarRating = memo(
  ({
    rating = 0,
    maxRating = 5,
    onRatingChange = null,
    size = "md",
    disabled = false,
    showValue = false,
  }) => {
    const handleStarClick = (newRating) => {
      if (!disabled && onRatingChange) {
        onRatingChange(newRating);
      }
    };

    const handleStarHover = (hoveredRating) => {
      if (!disabled) {
      }
    };

    return (
      <div className={`star-rating star-rating--${size}`}>
        <div className="star-rating__stars">
          {[...Array(maxRating)].map((_, index) => {
            const starRating = index + 1;
            const isFilled = starRating <= rating;

            return (
              <button
                key={index}
                type="button"
                className={`star-rating__star ${
                  isFilled
                    ? "star-rating__star--filled"
                    : "star-rating__star--empty"
                } ${disabled ? "star-rating__star--disabled" : ""}`}
                onClick={() => handleStarClick(starRating)}
                onMouseEnter={() => handleStarHover(starRating)}
                disabled={disabled}
                aria-label={`Calificar con ${starRating} ${
                  starRating === 1 ? "estrella" : "estrellas"
                }`}
              >
                <Star
                  className="star-rating__icon"
                  fill={isFilled ? "currentColor" : "none"}
                />
              </button>
            );
          })}
        </div>

        {showValue && (
          <span className="star-rating__value">
            {rating.toFixed(1)} / {maxRating}
          </span>
        )}
      </div>
    );
  }
);

StarRating.displayName = "StarRating";

export default StarRating;

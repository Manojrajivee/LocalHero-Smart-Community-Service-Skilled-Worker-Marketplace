import React, { useState } from 'react';

function ReviewForm({ onSubmit, isSubmitting }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide a short description of your experience.');
      return;
    }
    setError('');
    onSubmit({ rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="text-start animate-fade-in">
      {error && (
        <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-3 small p-2 mb-3">
          {error}
        </div>
      )}

      {/* Star Selector */}
      <div className="mb-4 text-center">
        <label className="form-label text-muted small d-block mb-2">Your Rating</label>
        <div className="star-rating-interactive">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => !isSubmitting && setRating(star)}
              onMouseEnter={() => !isSubmitting && setHoverRating(star)}
              onMouseLeave={() => !isSubmitting && setHoverRating(0)}
              style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              <i
                className={`bi ${
                  (hoverRating || rating) >= star
                    ? 'bi-star-fill text-warning'
                    : 'bi-star text-secondary'
                }`}
              ></i>
            </span>
          ))}
        </div>
        <div className="text-muted small mt-1">
          {rating === 5 && 'Excellent - Beyond expectations!'}
          {rating === 4 && 'Good - Satisfactory work.'}
          {rating === 3 && 'Average - Met basic needs.'}
          {rating === 2 && 'Poor - Some issues encountered.'}
          {rating === 1 && 'Terrible - Very unsatisfied.'}
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label text-white small">Review Comments</label>
        <textarea
          className="form-control form-control-custom"
          rows={4}
          placeholder="Share details about the quality of work, punctuality, and professionalism..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
          required
          minLength={10}
        ></textarea>
      </div>

      <button
        type="submit"
        className="btn btn-gradient-primary w-100 py-2.5"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Submitting Review...
          </>
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
}

export default ReviewForm;

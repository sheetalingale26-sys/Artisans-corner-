import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { Star, X, CheckCircle2 } from 'lucide-react';

interface WriteReviewModalProps {
  product: Product;
  onClose: () => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({ product, onClose }) => {
  const { addReview, currentUser } = useApp();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    addReview({
      productId: product.id,
      rating,
      title: title.trim() || 'Wonderful handmade piece',
      comment: comment.trim()
    });

    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative bg-[#FDFBF7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E4D9C4] z-10 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#F8F4EE] text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A86F47]">
            Artisan Provenance Review
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#2A2521] mt-1">
            Review "{product.title}"
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-[#6B7A52] mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Posting as verified buyer: <strong>{currentUser.name}</strong></span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Rating Picker */}
          <div>
            <label className="block text-xs font-semibold text-[#2A2521] uppercase tracking-wider mb-2">
              Overall Craftsmanship & Quality
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(rating)}
                  className="p-1 text-2xl transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= hoverRating
                        ? 'fill-[#A86F47] text-[#A86F47]'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm font-semibold text-[#2A2521]">
                {rating === 5
                  ? 'Masterpiece (5/5)'
                  : rating === 4
                  ? 'Very Fine (4/5)'
                  : rating === 3
                  ? 'Satisfactory (3/5)'
                  : 'Needs Improvement'}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-xs font-semibold text-[#2A2521] uppercase tracking-wider mb-1.5">
              Review Headline
            </label>
            <input
              type="text"
              placeholder="e.g. Stunning tactile texture and flawless glaze..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm focus:outline-hidden focus:border-[#A86F47] focus:bg-white transition-colors"
            />
          </div>

          {/* Detailed Experience */}
          <div>
            <label className="block text-xs font-semibold text-[#2A2521] uppercase tracking-wider mb-1.5">
              Your Review & Story with this piece *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Share details about the texture, weight, finish, packaging, and how this handcrafted item looks in your space..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm focus:outline-hidden focus:border-[#A86F47] focus:bg-white transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E4D9C4] text-xs font-semibold text-[#2A2521] hover:bg-[#F8F4EE] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] text-white text-xs font-semibold shadow-md disabled:opacity-50 transition-all"
            >
              Publish Artisan Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

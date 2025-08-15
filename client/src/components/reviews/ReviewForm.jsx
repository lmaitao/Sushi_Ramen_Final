import { useState } from 'react'; // Esta es la línea que faltaba
import { FaStar } from 'react-icons/fa';

const ReviewForm = ({ 
  onSubmit, 
  initialRating = 0, 
  initialComment = '', 
  isSubmitting,
  onCancel 
}) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [hover, setHover] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating < 1) {
      alert('Por favor selecciona una calificación');
      return;
    }
    onSubmit(rating, comment);
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h6>Escribe tu reseña</h6>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Calificación</label>
            <div className="d-flex">
              {[...Array(5)].map((_, i) => {
                const ratingValue = i + 1;
                return (
                  <label key={i} className="me-1">
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                      className="d-none"
                    />
                    <FaStar
                      size={24}
                      color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(null)}
                      style={{ cursor: 'pointer' }}
                    />
                  </label>
                );
              })}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">
              Comentario (opcional)
            </label>
            <textarea
              className="form-control"
              id="comment"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
            ></textarea>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
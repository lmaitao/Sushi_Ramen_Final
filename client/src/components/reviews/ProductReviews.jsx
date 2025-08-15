import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { FaStar, FaUserCircle } from 'react-icons/fa';
import ReviewForm from './ReviewForm';
import { toast } from 'react-hot-toast';

const ProductReviews = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // Obtener reseñas del producto (público)
        const { data: productReviews } = await API.get(`/reviews/${productId}`, {
          signal: controller.signal
        });
        
        if (isMounted) {
          setReviews(productReviews);
        }

        // Solo intentar obtener reseña del usuario si está autenticado
        if (user && isMounted) {
          try {
            const { data: userReviewData } = await API.get(`/reviews/user/${user.id}`, {
              params: { productId },
              signal: controller.signal
            });
            if (isMounted) {
              setUserReview(userReviewData || null);
            }
          } catch (error) {
            if (error.response?.status !== 404 && isMounted) {
              toast.error('Error al cargar tu reseña');
              console.error('Error fetching user review:', error);
            }
          }
        }
      } catch (error) {
        if (!API.isCancel(error) && isMounted) {
          toast.error('Error al cargar reseñas');
          console.error('Error fetching reviews:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [productId, user]);

  const handleReviewSubmit = async (rating, comment) => {
  if (!user) return;
  
  try {
    setIsSubmitting(true);
    const reviewData = { 
      productId: Number(productId), // Asegurar que es número
      rating: Number(rating),
      comment 
    };

    // Verificación adicional crítica
    if (userReview?.id) {
      const { data: updatedReview } = await API.put(
        `/reviews/${userReview.id}`, 
        reviewData
      );
      setUserReview(updatedReview);
      toast.success('Reseña actualizada correctamente');
    } else {
      const { data: newReview } = await API.post('/reviews', reviewData);
      setUserReview(newReview);
      toast.success('Reseña creada correctamente');
    }

    // Actualizar lista
    const { data: updatedReviews } = await API.get(`/reviews/${productId}`);
    setReviews(updatedReviews);
    setShowForm(false);
  } catch (error) {
    console.error('Error submitting review:', error);
    toast.error(error.response?.data?.error || error.message || 'Error al procesar la reseña');
  } finally {
    setIsSubmitting(false);
  }
};

  if (loading) return <div className="text-center my-4">Cargando reseñas...</div>;

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>Reseñas ({reviews.length})</h5>
        {user && !userReview && !showForm && (
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => setShowForm(true)}
            disabled={isSubmitting}
          >
            Escribir Reseña
          </button>
        )}
      </div>

      {showForm && (
        <ReviewForm 
          onSubmit={handleReviewSubmit} 
          initialRating={userReview?.rating} 
          initialComment={userReview?.comment}
          isSubmitting={isSubmitting}
          onCancel={() => setShowForm(false)}
        />
      )}

      {userReview && !showForm && (
        <div className="card mb-4 border-primary">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h6>Tu Reseña</h6>
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={() => setShowForm(true)}
                disabled={isSubmitting}
              >
                Editar
              </button>
            </div>
            <div className="d-flex mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={i < userReview.rating ? 'text-warning' : 'text-secondary'} 
                />
              ))}
            </div>
            <p className="mb-0">{userReview.comment}</p>
          </div>
        </div>
      )}

      {reviews
        .filter(review => !userReview || review.id !== userReview.id)
        .map(review => (
          <div key={review.id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <FaUserCircle className="me-2" size={24} />
                <strong>{review.user_name}</strong>
              </div>
              <div className="d-flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < review.rating ? 'text-warning' : 'text-secondary'} 
                  />
                ))}
              </div>
              <p className="mb-0">{review.comment}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProductReviews;
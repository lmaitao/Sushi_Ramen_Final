import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CartItem = ({ item, onUpdate, onRemove, disabled }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > 10 || disabled) return;
    
    setUpdating(true);
    try {
      await onUpdate(item.product_id, newQuantity);
      setQuantity(newQuantity);
    } catch (error) {
      toast.error('Error al actualizar cantidad');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="row g-0">
        <div className="col-md-2">
          <img
            src={item.image_url}
            alt={item.name}
            className="img-fluid rounded-start h-100"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h5 className="card-title">
                <Link to={`/products/${item.product_id}`} className="text-decoration-none">
                  {item.name}
                </Link>
              </h5>
              <button
                onClick={() => onRemove(item.product_id)}
                className="btn btn-sm btn-outline-danger"
                disabled={disabled}
              >
                Eliminar
              </button>
            </div>
            <p className="card-text text-muted">{item.category}</p>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || updating || disabled}
              >
                -
              </button>
              <span className="mx-3">{quantity}</span>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10 || updating || disabled}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-2 d-flex align-items-center justify-content-end">
          <h5 className="mb-0">${(item.price * quantity).toFixed(2)}</h5>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
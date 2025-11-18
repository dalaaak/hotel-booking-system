import React, { useState, useEffect } from 'react';
import './SpecialOffers.css';

const SpecialOffers = () => {
  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discount: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
    isActive: true
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock function to fetch offers - replace with actual API call
  useEffect(() => {
    // In a real application, you would fetch from your backend
    // For now, we'll use mock data
    const mockOffers = [
      {
        id: 1,
        title: 'Summer Special',
        description: 'Get 20% off on all rooms during summer season',
        discount: '20%',
        startDate: '2023-06-01',
        endDate: '2023-08-31',
        imageUrl: 'https://example.com/summer.jpg',
        isActive: true
      },
      {
        id: 2,
        title: 'Weekend Getaway',
        description: 'Book for 2 nights on weekends and get 1 night free',
        discount: '1 night free',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        imageUrl: 'https://example.com/weekend.jpg',
        isActive: true
      }
    ];
    
    setOffers(mockOffers);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewOffer({
      ...newOffer,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (editingId) {
      // Update existing offer
      const updatedOffers = offers.map(offer => 
        offer.id === editingId ? { ...newOffer, id: editingId } : offer
      );
      setOffers(updatedOffers);
      setEditingId(null);
    } else {
      // Add new offer
      const offerWithId = {
        ...newOffer,
        id: Date.now() // Simple ID generation for mock data
      };
      setOffers([...offers, offerWithId]);
    }
    
    // Reset form
    setNewOffer({
      title: '',
      description: '',
      discount: '',
      startDate: '',
      endDate: '',
      imageUrl: '',
      isActive: true
    });
    
    setIsLoading(false);
  };

  const handleEdit = (id) => {
    const offerToEdit = offers.find(offer => offer.id === id);
    if (offerToEdit) {
      setNewOffer(offerToEdit);
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      setOffers(offers.filter(offer => offer.id !== id));
    }
  };

  const handleCancel = () => {
    setNewOffer({
      title: '',
      description: '',
      discount: '',
      startDate: '',
      endDate: '',
      imageUrl: '',
      isActive: true
    });
    setEditingId(null);
  };

  return (
    <div className="special-offers-container">
      <h2>Special Offers Management</h2>
      
      <div className="offers-form-container">
        <h3>{editingId ? 'Edit Offer' : 'Add New Offer'}</h3>
        <form onSubmit={handleSubmit} className="offer-form">
          <div className="form-group">
            <label htmlFor="title">
              <span className="input-icon">🏷️</span> Offer Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newOffer.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">
              <span className="input-icon">📝</span> Offer Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={newOffer.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="discount">
              <span className="input-icon">💯</span> Discount:
            </label>
            <input
              type="text"
              id="discount"
              name="discount"
              value={newOffer.discount}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">
                <span className="input-icon">📅</span> Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={newOffer.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">
                <span className="input-icon">📅</span> End Date:
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={newOffer.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="imageUrl">
              <span className="input-icon">🖼️</span> Image URL:
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={newOffer.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label htmlFor="isActive">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={newOffer.isActive}
                onChange={handleInputChange}
              />
              <span className="checkbox-label">
                <span className="input-icon">✅</span> Active
              </span>
            </label>
          </div>
          
          <div className="form-buttons">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : editingId ? 'Update Offer' : 'Add Offer'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className="cancel-button">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="offers-list-container">
        <h3>Current Offers</h3>
        {error && <p className="error-message">{error}</p>}
        
        {offers.length === 0 ? (
          <p className="no-offers">No current offers available</p>
        ) : (
          <div className="offers-grid">
            {offers.map(offer => (
              <div key={offer.id} className={`offer-card ${!offer.isActive ? 'inactive' : ''}`}>
                {offer.imageUrl && (
                  <div className="offer-image">
                    <img src={offer.imageUrl} alt={offer.title} />
                  </div>
                )}
                <div className="offer-content">
                  <h4>{offer.title}</h4>
                  <p className="offer-description">{offer.description}</p>
                  <p className="offer-discount"><strong>Discount:</strong> {offer.discount}</p>
                  <p className="offer-dates">
                    <span><strong>From:</strong> {offer.startDate}</span>
                    <span><strong>To:</strong> {offer.endDate}</span>
                  </p>
                  <p className="offer-status">
                    <span className={`status-indicator ${offer.isActive ? 'active' : 'inactive'}`}></span>
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </p>
                  <div className="offer-actions">
                    <button onClick={() => handleEdit(offer.id)} className="edit-button">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(offer.id)} className="delete-button">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialOffers; 
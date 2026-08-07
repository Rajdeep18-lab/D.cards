import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function FavoritesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/cards', { replace: true });
  }, [navigate]);

  return null;
}

export default FavoritesPage;

import { useState } from 'react';

export const useShopTest = () => {
  const [test, setTest] = useState('test');
  
  return {
    test,
    setTest
  };
}; 
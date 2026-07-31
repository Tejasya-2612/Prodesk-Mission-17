import { useEffect, useState } from 'react';

function Toaster() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    function handleToast(event) {
      const id = Date.now();
      setItems((current) => [...current, { id, ...event.detail }]);
      window.setTimeout(() => {
        setItems((current) => current.filter((item) => item.id !== id));
      }, 2800);
    }

    window.addEventListener('app-toast', handleToast);
    return () => window.removeEventListener('app-toast', handleToast);
  }, []);

  return (
    <div className="toast-stack" aria-live="polite">
      {items.map((item) => (
        <div className={`toast ${item.type}`} key={item.id}>
          {item.message}
        </div>
      ))}
    </div>
  );
}

export default Toaster;

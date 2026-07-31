const toast = {
  success(message) {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, type: 'success' } }));
  },
  error(message) {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, type: 'error' } }));
  }
};

export default toast;

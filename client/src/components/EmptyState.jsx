import Icon from './Icon';

function EmptyState({ title, description, buttonText, buttonAction, icon = 'folder' }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon name={icon} size={22} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {buttonText && buttonAction && (
        <button className="primary-btn" type="button" onClick={buttonAction}>
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;

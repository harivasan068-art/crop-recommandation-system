import { Plus } from 'lucide-react';

const FloatingActionButton = ({ onClick, label = 'Create' }) => (
  <button className="fab" onClick={onClick} aria-label={label} title={label}>
    <Plus size={24} />
  </button>
);

export default FloatingActionButton;

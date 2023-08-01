import { useNavigate } from 'solid-start';
import BackIcon from './icons/BackIcon';

export default function BackComponent({ url }: { url?: string }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        url ? navigate(url) : history.back();
      }}
      class="ml-8 self-start"
    >
      <BackIcon />
    </button>
  );
}

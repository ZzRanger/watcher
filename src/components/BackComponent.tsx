import { A } from 'solid-start';
import BackIcon from './icons/BackIcon';

export default function BackComponent() {
  return (
    <button onClick={() => history.back()} class="ml-8 self-start">
      <BackIcon />
    </button>
  );
}

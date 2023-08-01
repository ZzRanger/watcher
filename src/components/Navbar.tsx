import { A, useNavigate } from 'solid-start';
import ReportIcon from '~/components/icons/ReportIcon';

import SettingsIcon from '~/components/icons/SettingsIcon';
import BackIcon from '~/components/icons/BackIcon';
import QRIcon from '~/components/icons/QRIcon';

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav class="box-border flex w-screen flex-row justify-between px-8">
      <button onClick={() => navigate('/')}>
        <BackIcon />
      </button>

      <div class="flex flex-row gap-x-4">
        <A href="report">
          <ReportIcon />
        </A>

        <A href="qrcode">
          <QRIcon />
        </A>

        <A href="settings">
          <SettingsIcon />
        </A>
      </div>
    </nav>
  );
}

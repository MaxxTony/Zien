declare module 'react-native-qrcode-svg' {
  import * as React from 'react';

  export interface QRCodeProps {
    value: string;
    size?: number;
    color?: string;
    backgroundColor?: string;
    logo?: unknown;
    ecl?: 'L' | 'M' | 'Q' | 'H';
  }

  const QRCode: React.FC<QRCodeProps>;
  export default QRCode;
}

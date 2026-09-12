import React from 'react';
import { VerificationPage } from '../components/VerificationPage.js';

interface PublicPassportVerificationProps {
  batchId: string;
  onBackToApp?: () => void;
}

export const PublicPassportVerification: React.FC<PublicPassportVerificationProps> = ({
  batchId,
  onBackToApp
}) => {
  return <VerificationPage batchId={batchId} onBackToApp={onBackToApp} />;
};

export default PublicPassportVerification;

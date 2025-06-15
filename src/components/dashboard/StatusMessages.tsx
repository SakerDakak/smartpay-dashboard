import React from 'react';
import StatusMessage from '../ui/StatusMessage';

interface StatusMessagesProps {
  error: string | null;
  successMessage: string | null;
  onClearError?: () => void;
  onClearSuccess?: () => void;
}

/**
 * مكون مشترك لعرض رسائل الخطأ والنجاح
 */
const StatusMessages: React.FC<StatusMessagesProps> = ({
  error,
  successMessage,
  onClearError,
  onClearSuccess
}) => {
  return (
    <>
      {successMessage && (
        <div className="mb-6">
          <StatusMessage
            type="success"
            message={successMessage}
            onClose={onClearSuccess}
          />
        </div>
      )}
      
      {error && (
        <div className="mb-6">
          <StatusMessage
            type="error"
            message={error}
            onClose={onClearError}
          />
        </div>
      )}
    </>
  );
};

export { StatusMessages}; 
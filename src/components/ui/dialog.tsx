import React, { createContext, useContext, useState, useCallback } from 'react';
import { Card } from './card';
import { Button } from './button';
import { X, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface DialogContextType {
  showAlert: (message: string, title?: string, type?: 'info' | 'warning' | 'error' | 'success') => Promise<void>;
  showConfirm: (message: string, title?: string, type?: 'warning' | 'danger') => Promise<boolean>;
  showPrompt: (message: string, title?: string, defaultValue?: string) => Promise<string | null>;
}

const DialogContext = createContext<DialogContextType | null>(null);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

interface DialogProviderProps {
  children: React.ReactNode;
}

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    message: string;
    title: string;
    type: 'info' | 'warning' | 'error' | 'success';
    resolve: () => void;
  } | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    message: string;
    title: string;
    type: 'warning' | 'danger';
    resolve: (value: boolean) => void;
  } | null>(null);

  const [promptDialog, setPromptDialog] = useState<{
    isOpen: boolean;
    message: string;
    title: string;
    defaultValue: string;
    resolve: (value: string | null) => void;
  } | null>(null);

  const showAlert = useCallback((message: string, title = 'Aviso', type: 'info' | 'warning' | 'error' | 'success' = 'info') => {
    return new Promise<void>((resolve) => {
      setAlertDialog({
        isOpen: true,
        message,
        title,
        type,
        resolve
      });
    });
  }, []);

  const showConfirm = useCallback((message: string, title = 'Confirmar', type: 'warning' | 'danger' = 'warning') => {
    return new Promise<boolean>((resolve) => {
      setConfirmDialog({
        isOpen: true,
        message,
        title,
        type,
        resolve
      });
    });
  }, []);

  const showPrompt = useCallback((message: string, title = 'Entrada', defaultValue = '') => {
    return new Promise<string | null>((resolve) => {
      setPromptDialog({
        isOpen: true,
        message,
        title,
        defaultValue,
        resolve
      });
    });
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getButtonColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'error':
        return 'bg-red-500 hover:bg-red-600';
      case 'success':
        return 'bg-green-500 hover:bg-green-600';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}

      {/* Alert Dialog */}
      {alertDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 p-6">
            <div className="flex items-start gap-4">
              {getIcon(alertDialog.type)}
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{alertDialog.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{alertDialog.message}</p>
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      setAlertDialog(null);
                      alertDialog.resolve();
                    }}
                    className={getButtonColor(alertDialog.type)}
                  >
                    OK
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 p-6">
            <div className="flex items-start gap-4">
              {getIcon(confirmDialog.type)}
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{confirmDialog.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{confirmDialog.message}</p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setConfirmDialog(null);
                      confirmDialog.resolve(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      setConfirmDialog(null);
                      confirmDialog.resolve(true);
                    }}
                    className={getButtonColor(confirmDialog.type)}
                  >
                    Confirmar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Prompt Dialog */}
      {promptDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 p-6">
            <div className="flex items-start gap-4">
              <Info className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{promptDialog.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{promptDialog.message}</p>
                <label htmlFor="prompt-input" className="sr-only">
                  {promptDialog.title}
                </label>
                <input
                  id="prompt-input"
                  type="text"
                  defaultValue={promptDialog.defaultValue}
                  className="w-full p-2 border border-gray-300 rounded mb-4 dark:bg-gray-800 dark:border-gray-600"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setPromptDialog(null);
                      promptDialog.resolve(e.currentTarget.value);
                    } else if (e.key === 'Escape') {
                      setPromptDialog(null);
                      promptDialog.resolve(null);
                    }
                  }}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPromptDialog(null);
                      promptDialog.resolve(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      const input = document.querySelector('input') as HTMLInputElement;
                      setPromptDialog(null);
                      promptDialog.resolve(input?.value || '');
                    }}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    OK
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </DialogContext.Provider>
  );
}; 
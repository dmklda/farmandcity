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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-300 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 relative overflow-hidden">
            {/* Decorative border pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-200/20 via-transparent to-amber-200/20"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
            
            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getIcon(alertDialog.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-3 text-slate-800 border-b border-amber-200 pb-2">
                    {alertDialog.title}
                  </h3>
                  <p className="text-slate-700 mb-6 leading-relaxed">{alertDialog.message}</p>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        setAlertDialog(null);
                        alertDialog.resolve();
                      }}
                      className={`${getButtonColor(alertDialog.type)} font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200`}
                    >
                      OK
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-300 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 relative overflow-hidden">
            {/* Decorative border pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-200/20 via-transparent to-amber-200/20"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
            
            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getIcon(confirmDialog.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-3 text-slate-800 border-b border-amber-200 pb-2">
                    {confirmDialog.title}
                  </h3>
                  <p className="text-slate-700 mb-6 leading-relaxed">{confirmDialog.message}</p>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setConfirmDialog(null);
                        confirmDialog.resolve(false);
                      }}
                      className="font-semibold px-6 py-2 rounded-lg border-amber-300 text-amber-700 hover:bg-amber-50 transition-all duration-200"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => {
                        setConfirmDialog(null);
                        confirmDialog.resolve(true);
                      }}
                      className={`${getButtonColor(confirmDialog.type)} font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200`}
                    >
                      Confirmar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Dialog */}
      {promptDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-300 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 relative overflow-hidden">
            {/* Decorative border pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-200/20 via-transparent to-amber-200/20"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
            
            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Info className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-3 text-slate-800 border-b border-amber-200 pb-2">
                    {promptDialog.title}
                  </h3>
                  <p className="text-slate-700 mb-4 leading-relaxed">{promptDialog.message}</p>
                  <label htmlFor="prompt-input" className="sr-only">
                    {promptDialog.title}
                  </label>
                  <input
                    id="prompt-input"
                    type="text"
                    defaultValue={promptDialog.defaultValue}
                    className="w-full p-3 border-2 border-amber-300 rounded-lg mb-6 bg-white/80 focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
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
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPromptDialog(null);
                        promptDialog.resolve(null);
                      }}
                      className="font-semibold px-6 py-2 rounded-lg border-amber-300 text-amber-700 hover:bg-amber-50 transition-all duration-200"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => {
                        const input = document.querySelector('input') as HTMLInputElement;
                        setPromptDialog(null);
                        promptDialog.resolve(input?.value || '');
                      }}
                      className="font-semibold px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      OK
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}; 

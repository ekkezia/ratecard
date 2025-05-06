import { useCustomerContext } from '@/context/customer-context';
import React, { useEffect, useRef, useState } from 'react';
import { handlePasswordSubmit } from './action-submit-password';

const SUBMIT_STATUS = {
  0: 'idle',
  1: 'loading',
  2: 'success',
  3: 'error',
}

type PassportInputProps = { 
  open: boolean;
  onClose: () => void;
}

const PasswordInput: React.FC<PassportInputProps> = ({ open, onClose }) => {
  const [password, setPassword] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [submitStatus, setSubmitStatus] = useState(SUBMIT_STATUS[0])
  const { setData, currency } = useCustomerContext();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleClose = () => {
    dialogRef.current?.close();
    onClose();
  }

  useEffect(() => {
    if (dialogRef.current) {
      if (open) {
        dialogRef.current.showModal();
      } else {
        dialogRef.current.close();
      }
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length <= 0 || !currency) return;
    
    try {
      const result = await handlePasswordSubmit(password, currency);
      if (result) {
        setData(result);
        setSubmitStatus(SUBMIT_STATUS[2]);
      }
      
    } catch {
      console.error('Error during authentication:');
      setSubmitStatus(SUBMIT_STATUS[3]);
    }
  };

  return (
    open && (
      <dialog 
        ref={dialogRef} 
        className="fixed flex items-center justify-center font-jacquard12 w-screen h-screen bg-transparent"
      >
        <form 
          className="p-4 border-dashed border text-2xl relative bg-white max-w-[420px]"
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
        >
          <label className="block" htmlFor="password">Password {submitStatus === SUBMIT_STATUS[3] && <span className="text-red-500">❌ Incorrect! Contact @ekezia if you have problems revealing the rate.</span>}</label>

          <div className="flex gap-1">
            <input
              className={`${submitStatus === SUBMIT_STATUS[3] ? 'border-red-600' : 'border-green-600'}w-full border border-dashed p-1`}
              type="password"
              id="password"
              placeholder="♥♥♥♥"
              value={password}
              onChange={handlePasswordChange}
            />
            <button type="submit" className="text-2xl hover:bg-green-600 hover:text-white border p-1 aspect-square border-dashed border-green-600 text-green-600 w-[48px] h-[48px] cursor-pointer" disabled={password.length <= 0}>↵</button>
          </div>
          <button
            className="absolute top-2 right-2 text-2x cursor-pointer border border-dashed hover:bg-black hover:text-white w-[30px] h-[30px] flex items-center justify-center"
            onClick={handleClose}
              >
            &times;
          </button>
        </form>

      </dialog>
    )
  );
};

export default PasswordInput;

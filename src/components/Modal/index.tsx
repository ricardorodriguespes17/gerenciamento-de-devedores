import "./styles.css";

interface ModalProps {
  message: string;
  close: () => void;
}

export default function Modal({ message, close }: ModalProps) {
  return (
    <div className="modal-component">
      <div className="content">
        <h2>{message}</h2>
        <button onClick={() => close()}>OK</button>
      </div>
    </div>
  );
}

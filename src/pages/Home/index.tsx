import { FormEvent, useState, useEffect } from "react";
import { BsArrowLeftShort } from "react-icons/bs";

import "./styles.css";

interface DebtType {
  id: string;
  clientId: string;
  reason: string;
  value: string;
}

interface ClientType {
  id: string;
  name: string;
}

export default function Home() {
  const [CLIENTS, SETCLIENTS] = useState([
    { id: "0", name: "Fulano" },
    { id: "1", name: "Ciclano" },
    { id: "2", name: "Beltrano" },
  ]);

  const [DEBTS, SETDEBTS] = useState([
    {
      id: "0",
      clientId: "0",
      reason: "Dívida do cartão de crédito",
      value: "R$ 1000,00",
    },
    {
      id: "1",
      clientId: "0",
      reason: "Dívida do cartão de crédito",
      value: "R$ 2500,00",
    },
    {
      id: "2",
      clientId: "1",
      reason: "Dívida do cartão de crédito",
      value: "R$ 340,00",
    },
    {
      id: "3",
      clientId: "2",
      reason: "Dívida do cartão de crédito",
      value: "R$ 400,00",
    },
  ]);

  const [listType, setListType] = useState<"client" | "debt">("client");

  const [clients, setClients] = useState<ClientType[]>(
    CLIENTS.filter(
      (client) => DEBTS.filter((debt) => debt.clientId === client.id).length > 0
    )
  );

  const [debts, setDebts] = useState<DebtType[]>([]);

  const [debtSelected, setDebtSelected] = useState<DebtType>();

  const [client, setClient] = useState("");
  const [reason, setReason] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    if (debtSelected) {
      setClient(debtSelected.clientId);
      setReason(debtSelected.reason);
      setValue(debtSelected.value);
    } else {
      setClient("");
      setReason("");
      setValue("");
    }
  }, [debtSelected]);

  function onSave(e: FormEvent) {
    e.preventDefault();

    SETDEBTS(
      DEBTS.map((item) => {
        if (item.id === debtSelected?.id) {
          return { ...item, clientId: client, reason, value };
        }

        return item;
      })
    );

    setClient("");
    setReason("");
    setValue("");

    backToClientList();
  }

  function onDelete(id: string) {
    backToClientList();

    SETDEBTS(DEBTS.filter((item) => item.id !== id));
  }

  function onCreate(e: FormEvent) {
    e.preventDefault();

    if (client === "") {
      alert("Selecione um cliente");
      return;
    }

    if (reason.trim() === "") {
      alert("Escreva o motivo da dívida");
      return;
    }

    if (value.trim() === "") {
      alert("Defina o valor da dívida");
      return;
    }

    SETDEBTS(
      DEBTS.concat({
        clientId: client,
        reason,
        value,
        id: Math.random().toString(),
      })
    );

    setClient("");
    setReason("");
    setValue("");

    backToClientList();
  }

  function selectClient(id: string) {
    setListType("debt");

    setDebts(DEBTS.filter((item) => item.clientId === id));
  }

  function backToClientList() {
    setListType("client");

    setDebtSelected(undefined);
  }

  function selectDebt(id: string) {
    const debt = debts.find((item) => item.id === id);

    setDebtSelected(debt);
  }

  return (
    <div className="home-page">
      <div className="side-bar">
        {listType === "client" ? (
          <>
            <h2>Devedores</h2>
            <div className="side-bar-list">
              {clients.map((item) => (
                <button
                  className="box-list"
                  onClick={() => selectClient(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2>Dívidas</h2>
            <div className="side-bar-list">
              <button className="go-back" onClick={() => backToClientList()}>
                <BsArrowLeftShort className="icon" />
                Voltar
              </button>

              {debts.map((item) => (
                <div
                  onClick={() => selectDebt(item.id)}
                  className={`${
                    debtSelected?.id === item.id
                      ? "box-list selected"
                      : "box-list"
                  }`}
                >
                  {item.reason}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <main>
        <form className="edit-data" onSubmit={debtSelected ? onSave : onCreate}>
          <label>Cliente</label>
          <select
            className="input"
            value={client}
            onChange={(event) => setClient(event.target.value)}
          >
            <option hidden value="">
              Usuários do JSONPlaceholder
            </option>

            {clients.map((item) => (
              <option value={item.id}>{item.name}</option>
            ))}
          </select>

          <label>Motivo</label>
          <input
            className="input"
            placeholder="Ex: dívida do cartão de crédito"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />

          <label>Valor</label>
          <input
            className="input value"
            placeholder="Ex: R$ 500,00"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />

          <div className="box-actions">
            {debtSelected && (
              <button type="button" onClick={() => onDelete(debtSelected.id)}>
                Excluir
              </button>
            )}
            <button type="submit">{debtSelected ? "Salvar" : "Criar"}</button>
          </div>
        </form>
      </main>
    </div>
  );
}

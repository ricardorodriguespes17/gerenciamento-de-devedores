import { FormEvent, useState, useEffect } from "react";
import { BsArrowLeftShort } from "react-icons/bs";

import { apiClients, api } from "../../services/api";

import "./styles.css";

const UUID = process.env.REACT_APP_UUID;

interface DebtType {
  _id: number;
  idUsuario: number;
  motivo: string;
  valor: number;
  criado: string;
}

interface ClientType {
  id: number;
  name: string;
}

export default function Home() {
  const [listType, setListType] = useState<"client" | "debt">("client");

  const [clients, setClients] = useState<ClientType[]>([]);
  const [debts, setDebts] = useState<DebtType[]>([]);
  const [clientDebts, setClientDebts] = useState<DebtType[]>([]);
  const [clientsWithDebts, setClientsWithDebts] = useState<ClientType[]>([]);

  const [debtSelected, setDebtSelected] = useState<DebtType>();

  const [userId, setUserId] = useState("");
  const [reason, setReason] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    apiClients.get("/users").then((res) => {
      setClients(res.data);
    });

    loadDebts();
  }, []);

  useEffect(() => {
    if (clients.length > 0) {
      setClientsWithDebts(
        clients.filter((client) =>
          debts.map((item) => item.idUsuario).includes(client.id)
        )
      );
    }
  }, [clients, debts]);

  useEffect(() => {
    if (debtSelected) {
      setUserId(debtSelected.idUsuario.toString());
      setReason(debtSelected.motivo);
      setValue(debtSelected.valor.toString());
    } else {
      clearForm();
    }

    // eslint-disable-next-line
  }, [debtSelected]);

  function loadDebts() {
    api.get(`/divida?uuid=${UUID}`).then((res) => {
      if (res.data.success) {
        const debts = res.data.result as DebtType[];
        setDebts(debts);
      }
    });
  }

  function onSave(e: FormEvent) {
    e.preventDefault();

    const valor = Number(value);
    const idUsuario = Number(userId);

    if (!idUsuario) {
      alert("Selecione um cliente");
      return;
    }

    if (reason.trim() === "") {
      alert("Escreva o motivo da dívida");
      return;
    }

    if (isNaN(valor)) {
      alert("Defina o valor da dívida");
      return;
    }

    api
      .put(`/divida/${debtSelected?._id}?uuid=${UUID}`, {
        idUsuario,
        motivo: reason,
        valor: valor,
      })
      .then(() => {
        loadDebts();
        clearForm();
      })
      .catch((err) => {
        console.log({ err });
      });

    clearForm();
  }

  function onDelete(id: number) {
    backToClientList();

    api
      .delete(`/divida/${id}?uuid=${UUID}`)
      .then(() => {
        loadDebts();
        clearForm();
      })
      .catch((err) => {
        console.log({ err });
      });
  }

  function onCreate(e: FormEvent) {
    e.preventDefault();

    const valor = Number(value);
    const idUsuario = Number(userId);

    if (!idUsuario) {
      alert("Selecione um cliente");
      return;
    }

    if (reason.trim() === "") {
      alert("Escreva o motivo da dívida");
      return;
    }

    if (isNaN(valor)) {
      alert("Defina o valor da dívida");
      return;
    }

    api
      .post(`/divida?uuid=${UUID}`, {
        idUsuario,
        motivo: reason,
        valor: valor,
      })
      .then(() => {
        loadDebts();
        clearForm();
      })
      .catch((err) => {
        console.log({ err });
      });
  }

  function selectClient(id: number) {
    setListType("debt");

    setClientDebts(debts.filter((item) => item.idUsuario === id));
  }

  function backToClientList() {
    setListType("client");

    setDebtSelected(undefined);
  }

  function selectDebt(id: number) {
    const debt = debts.find((item) => item._id === id);

    setDebtSelected(debt);
  }

  function clearForm() {
    setUserId("");
    setReason("");
    setValue("");

    backToClientList();
  }

  return (
    <div className="home-page">
      <div className="side-bar">
        {listType === "client" ? (
          <>
            <h2>Devedores</h2>
            <div className="side-bar-list">
              {clientsWithDebts.map((item) => (
                <button
                  className="box-list"
                  onClick={() => selectClient(Number(item.id))}
                  key={item.id}
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

              {clientDebts.map((item) => (
                <button
                  key={item._id}
                  onClick={() => selectDebt(item._id)}
                  className={`${
                    debtSelected?._id === item._id
                      ? "box-list selected"
                      : "box-list"
                  }`}
                >
                  {item.motivo}
                </button>
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
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
          >
            <option hidden value="">
              Usuários do JSONPlaceholder
            </option>

            {clients.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
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
              <button type="button" onClick={() => onDelete(debtSelected._id)}>
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

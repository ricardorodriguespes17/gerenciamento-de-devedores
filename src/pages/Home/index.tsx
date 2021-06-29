import { FormEvent, useState, useEffect } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { FaMoneyBillWave } from "react-icons/fa";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";

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
  const [createdAt, setCreatedAt] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [modal, setModal] = useState({ show: false, message: "" });

  const [userIdError, setUserIdError] = useState(false);
  const [reasonError, setReasonError] = useState(false);
  const [valueError, setValueError] = useState(false);

  useEffect(() => {
    apiClients.get("/users").then((res) => {
      setClients(res.data);
    });

    loadDebts();
  }, []);

  useEffect(() => {
    if (clients.length > 0) {
      setClientsWithDebts(
        clients
          .filter((client) =>
            debts.map((item) => item.idUsuario).includes(client.id)
          )
          .sort((a, b) => (a.name > b.name ? 1 : -1))
      );
    }
  }, [clients, debts]);

  useEffect(() => {
    if (debtSelected) {
      setUserId(debtSelected.idUsuario.toString());
      setReason(debtSelected.motivo);
      setValue(
        Intl.NumberFormat("pt-br", {
          currency: "BRL",
          style: "currency",
        }).format(debtSelected.valor)
      );
      setCreatedAt(
        Intl.DateTimeFormat("pt-br", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        }).format(new Date(debtSelected.criado))
      );
    } else {
      clearForm();
    }

    // eslint-disable-next-line
  }, [debtSelected]);

  function loadDebts() {
    setIsLoading(true);

    api
      .get(`/divida?uuid=${UUID}`)
      .then((res) => {
        if (res.data.success) {
          const debts = res.data.result as DebtType[];
          setDebts(debts);
        }
      })
      .catch((err) => {
        if (err.message && err.message === "Network Error") {
          setModal({ show: true, message: "Sem conexão" });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function onSave(e: FormEvent) {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    const values = checkInput();

    if (!values) {
      return;
    }

    const { idUsuario, valor, motivo } = values;

    setIsLoading(true);

    api
      .put(`/divida/${debtSelected?._id}?uuid=${UUID}`, {
        idUsuario,
        motivo,
        valor,
      })
      .then(() => {
        loadDebts();
        clearForm();

        setModal({ show: true, message: "Editada com sucesso" });
      })
      .catch((err) => {
        if (err.message && err.message === "Network Error") {
          setModal({ show: true, message: "Sem conexão" });
        } else {
          setModal({ show: true, message: "Erro ao editar dívida" });
        }
      });

    clearForm();
  }

  function onDelete(id: number) {
    backToClientList();

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    api
      .delete(`/divida/${id}?uuid=${UUID}`)
      .then(() => {
        loadDebts();
        clearForm();

        setModal({ show: true, message: "Excluída com sucesso" });
      })
      .catch((err) => {
        if (err.message && err.message === "Network Error") {
          setModal({ show: true, message: "Sem conexão" });
        } else {
          setModal({ show: true, message: "Erro ao excluir dívida" });
        }
      });
  }

  function onCreate(e: FormEvent) {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    const values = checkInput();

    if (!values) {
      return;
    }

    const { idUsuario, valor, motivo } = values;

    setIsLoading(true);

    api
      .post(`/divida?uuid=${UUID}`, {
        idUsuario,
        motivo,
        valor,
      })
      .then(() => {
        loadDebts();
        clearForm();

        setModal({ show: true, message: "Criada com sucesso" });
      })
      .catch((err) => {
        if (err.message && err.message === "Network Error") {
          setModal({ show: true, message: "Sem conexão" });
        } else {
          setModal({ show: true, message: "Erro ao criar dívida" });
        }
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

  function checkInput() {
    const numberValue = Number(
      value.replace("R$", "").replace(".", "").replace(",", ".")
    );
    const numberUserId = Number(userId);

    const reasonTrim = reason.trim();

    if (!numberUserId || isNaN(numberUserId)) {
      setUserIdError(true);
      setTimeout(() => {
        setUserIdError(false);
      }, 2000);
      return null;
    }

    if (reasonTrim === "") {
      setReasonError(true);
      setTimeout(() => {
        setReasonError(false);
      }, 2000);
      return null;
    }

    if (value.trim() === "" || isNaN(numberValue)) {
      setValueError(true);
      setTimeout(() => {
        setValueError(false);
      }, 2000);
      return null;
    }

    return { valor: numberValue, idUsuario: numberUserId, motivo: reasonTrim };
  }

  function clearForm() {
    setUserId("");
    setReason("");
    setValue("");
    setCreatedAt("");

    backToClientList();
  }

  return (
    <div className="home-page">
      {modal.show && (
        <Modal
          message={modal.message}
          close={() => setModal({ show: false, message: "" })}
        />
      )}

      <div className="side-bar">
        {listType === "client" ? (
          <>
            <h2 className="title">
              <FaMoneyBillWave /> Devedores
            </h2>

            {isLoading && <Loading />}

            {!isLoading && clientsWithDebts.length === 0 && (
              <p>Não há devedores</p>
            )}

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
            <h2 className="title">
              <FaMoneyBillWave /> Dívidas
            </h2>
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
          <div className="box-input">
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
            {userIdError && (
              <label className="input-error">Selecione um cliente</label>
            )}
          </div>

          <div className="box-input">
            <label>Motivo</label>
            <input
              className="input"
              placeholder="Ex: dívida do cartão de crédito"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
            {reasonError && (
              <label className="input-error">Escreva o motivo da dívida</label>
            )}
          </div>

          <div className="box-input">
            <label>Valor</label>
            <input
              className="input value"
              placeholder="Ex: R$ 500,00"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
            {valueError && (
              <label className="input-error">Defina um valor válido</label>
            )}
          </div>

          {createdAt !== "" && (
            <p className="created-at">Criado em: {createdAt}</p>
          )}

          <div className="box-actions">
            {debtSelected && (
              <button
                disabled={isLoading}
                type="button"
                onClick={() => onDelete(debtSelected._id)}
              >
                Excluir
              </button>
            )}
            <button disabled={isLoading} type="submit">
              {debtSelected ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

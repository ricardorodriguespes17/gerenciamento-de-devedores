import "./styles.css";

export default function Home() {
  return (
    <div className="home-page">
      <div className="side-bar">
        <div className="client-box">Fulano</div>

        <div className="client-box">Beltrano</div>

        <div className="client-box">Ciclano</div>
      </div>

      <main>
        <form className="edit-data">
          <label>Cliente</label>
          <select className="input">
            <option hidden value="">
              Usuários do JSONPlaceholder
            </option>
          </select>

          <label>Motivo</label>
          <input
            className="input"
            placeholder="Ex: dívida do cartão de crédito"
          />

          <label>Valor</label>
          <input className="input value" placeholder="Ex: R$ 500,00" />

          <div className="box-actions">
            <button type="reset">Excluir</button>
            <button type="submit">Salvar</button>
          </div>
        </form>

        <button className="submit" type="submit">
          NOVO
        </button>
      </main>
    </div>
  );
}

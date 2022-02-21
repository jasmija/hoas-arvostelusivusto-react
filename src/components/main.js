
const main = () => {

  const content = {
    display: "flex",
    flexWrap: "wrap",
  }
    return (
        <div>
          <ul style={content}>
              <figure>
                <img src="img/kimpitie.jpg" alt="kimpitie"/>
                <figcaption>
                  <h3 className="header"></h3>
                </figcaption>
                <button className="rate">Arvostele</button>

              </figure>
              <figure>
                <img src="img/siltakuja.jpg" alt="siltakuja"/>
                <figcaption>
                  <h3 className="header"></h3>
                </figcaption>
                <button className="rate">Arvostele</button>
              </figure>
          </ul>
        </div>
    );
}
export default main;
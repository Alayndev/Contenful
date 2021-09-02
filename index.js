function addWorkCard(params = {}) {
  const templateEl = document.querySelector("#template-portfolio-card");

  const containerCards = document.querySelector(".portfolio-content");

  const imgCard = templateEl.content.querySelector(".portfolio-card-img");
  imgCard.src = params.image;

  const titleCard = templateEl.content.querySelector(".portfolio-card-title");
  titleCard.textContent = params.title;

  templateEl.content.querySelector(".portfolio-card-description").textContent =
    params.description;

  templateEl.content.querySelector(".portfolio-card-link").href = params.url;

  const clone = document.importNode(templateEl.content, true);
  containerCards.appendChild(clone);
}

function getContentfulData() {
  return fetch(
    "https://cdn.contentful.com/spaces/2p5218z7chv8/environments/master/entries?access_token=w7zJJijTxt9t-eJ4Cii89eVEZUNPcyodJkiw5jjKT2o&content_type=work"
  )
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      const fieldsColl = json.items.map((item) => {
        return {
          title: item.fields.titulo,
          description: item.fields.descripcion,
          url: item.fields.url,
          imageID: item.fields.imagen.sys.id,
          includes: json.includes.Asset,
        };
      });

      fieldsColl.forEach((x) => {
        const id = searchAsset(x.imageID, x.includes);
        x.image = "https:" + id.fields.file.url;
      });

      return fieldsColl;
    });
}

function searchAsset(assetID, includes) {
  const found = includes.find((i) => {
    return i.sys.id == assetID;
  });

  return found;
}

function main() {
  getContentfulData().then(function (works) {
    for (const w of works) {
      addWorkCard(w);
    }
  });
}

main();

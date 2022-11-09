// const query = "hello";

const searchBoxElem = document.getElementById("query");
const resultsContainerElem = document.getElementById("results");

// when someone presses enter in the search box,
searchBoxElem.addEventListener("keydown", whenSomeKeyPressed);

function whenSomeKeyPressed(event) {

  if (event.key === "Enter") {
    event.preventDefault();
    searchForRhymes(
      searchBoxElem.value
    ).then(function (response) {
      return createRhymeElements(createRhymeElements(response))
    }
    ).then(function (results) {
      clearResultsElem();
      populateResultsElem(results);
    })
    //const rhymeElements = await createRhymeElements(rhymes);
    // clearResultsElem();
    // populateResultsElem(rhymes);
  }
}

function searchForRhymes(query) {
  const rhymeResults = fetch(
    //`https://rhymebrain.com/talk?function=getRhymes&word=${query}`
    "example-rhyme-results.json"
  ).then(function (response) {
    return response.json();
  }).then(function (results) {
    const truncatedTo10 = results.slice(0, 10);
    console.log(truncatedTo10);
    return truncatedTo10;
  })
  return rhymeResults;
}

function createRhymeElements(rhymeResultsJson) {
  const wordInfos = getWordsInfos(rhymeResultsJson).then(
    function (response) {
      return rhymeResultsJson.map((rhymeWord, i) => {
        let resultElem = document.createElement("div");
        resultElem.classList.add("result");
        resultElem.dataset.score = rhymeWord.score;
        resultElem.append(rhymeWord.word);
        resultElem.append(createWordInfoElements(response[i]));
        resultElem = styleRhymeResult(resultElem);
        return resultElem;
      });
    }
  );

  return wordInfos;
}

function getWordsInfos(rhymes) {
  const wordsInfos = Promise.all(
    rhymes.map(() => {
      const wordInfo = fetch(
        //`https://rhymebrain.com/talk?function=getWordInfo&word=${rhyme.word}`
        "example-rhyme-results.json"
      ).then(
        function (response) {
          return response.json;
        }
      )
      return wordInfo;
    })
  );
  return wordsInfos;
}

function createWordInfoElements(wordInfo) {
  const wordInfoElem = document.createElement("dl");
  for (const [key, value] of Object.entries(wordInfo)) {
    const dt = document.createElement("dt");
    dt.append(key);
    const dd = document.createElement("dd");
    dd.append(value);
    wordInfoElem.append(dt);
    wordInfoElem.append(dd);
  }
  return wordInfoElem;
}

function styleRhymeResult(resultElem) {
  const styledResult = resultElem;
  const resultScore = parseInt(resultElem.dataset.score, 10);
  styledResult.style.fontSize = `${0.5 + (3.5 * resultScore) / 300}rem`;
  return styledResult;
}

function clearResultsElem() {
  Array.from(resultsContainerElem.childNodes).forEach((child) => {
    child.remove();
  });
}

function populateResultsElem(rhymeResultsElems) {
  resultsContainerElem.append(...rhymeResultsElems);
}

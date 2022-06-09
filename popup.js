const popTitle = document.querySelector("#title");
const popUnit = document.querySelector("#unit");
const popShow = document.querySelector("#show");
const popEditor = document.querySelector("#editor");
const popEditor2 = document.querySelector("#editor2");
const popChange = document.querySelector("#change");
const popSave = document.querySelector("#save");
const popClear = document.querySelector("#clear");
const popGet = document.querySelector("#get");
const popClean = document.querySelector("#clean");
const popInjection = document.querySelector("#injection");
const checkEdit = document.querySelector("#checkEdit");
// const popInjectionBtn = document.querySelector("#injectionBtn");
const titleIncrement = document.querySelector("#titleIncrement");
const titleDecrement = document.querySelector("#titleDecrement");

function changeElement(datas) {
  const allElement = document.querySelectorAll(".form-group"); // 모든 엘리먼트
  const titleElement = allElement[0].querySelector(".input-sm"); //제목
  const unitElement = allElement[1].querySelector(".input-sm"); // 단원유형
  const showElement = allElement[2].querySelector(".input-sm"); //보기유형
  const editorElement = allElement[4].querySelector(".editor"); //문항&풀이
  const answerElement = allElement[5].querySelector(".input-sm"); //정답
  titleElement.value = datas.title;
  unitElement.value = datas.unit;
  showElement.value = datas.show.value;
  if (datas.injectData != undefined) {
    answerElement.value = datas.injectData.answer;
    editorElement.value = datas.injectData.text;
  } else if (datas.injectData == undefined) {
    if (datas.checkUseEdit2) {
      editorElement.value = datas.editor2;
    } else {
      editorElement.value = datas.editor;
    }
  }
}

popChange.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab[0].id },
      func: changeElement,
      args: [
        {
          title: popTitle.value,
          show: {
            text: popShow.options[popShow.selectedIndex].text,
            value: popShow.options[popShow.selectedIndex].value,
          },
          injectData: injection(),
          unit: popUnit.value,
          editor: popEditor.value,
          editor2: popEditor2.value,
          checkUseEdit2: checkEdit.checked,
        },
      ],
    });
    increment();
    popInjection.value = "";
  });
});

popSave.addEventListener("click", () => {
  chrome.storage.local.set(
    {
      title: popTitle.value,
      show: {
        text: popShow.options[popShow.selectedIndex].text,
        value: popShow.options[popShow.selectedIndex].value,
      },
      inject: popInjection.value,
      unit: popUnit.value,
      editor: popEditor.value,
      editor2: popEditor2.value,
    },
    () => {
      console.log(`save : ${popTitle.value}`);
      console.log(`save : ${popShow.value}`);
      console.log(`save : ${popInjection.value}`);
      console.log(`save : ${popUnit.value}`);
      console.log(`save : ${popEditor.value}`);
      console.log(`save : ${popEditor2.value}`);
    }
  );
});
popGet.addEventListener("click", () => {
  chrome.storage.local.get(
    ["title", "show", "inject", "unit", "editor", "editor2"],
    (res) => {
      var newTitle = res.title.split("_"); //다비수_빅토리_개념01권_01
      newTitle[newTitle.length - 1] = (
        parseInt(newTitle[newTitle.length - 1]) + 1
      )
        .toString()
        .padStart(2, "0");
      newTitle = newTitle.join("_");
      console.log(newTitle);
      popTitle.value = `${newTitle}`;
      popShow.value = `${res.show.value}`;
      popInjection.value = `${res.inject}`;
      popUnit.value = `${res.unit}`;
      popEditor.value = `${res.editor}`;
      popEditor2.value = `${res.editor2}`;
    }
  );
});
popClear.addEventListener("click", () => {
  chrome.storage.local.clear();
  console.log("clear data");
});

popClean.addEventListener("click", () => {
  popShow.value = "201";
  popInjection.value = "";
  popTitle.value = "";
  popUnit.value = "";
  popEditor.value = "";
  popEditor2.value = "";
});

titleIncrement.addEventListener("click", increment);
function increment() {
  var newTitle = popTitle.value.split("_");
  newTitle[newTitle.length - 1] = (parseInt(newTitle[newTitle.length - 1]) + 1)
    .toString()
    .padStart(2, "0");
  newTitle = newTitle.join("_");
  popTitle.value = `${newTitle}`;
}
titleDecrement.addEventListener("click", () => {
  var newTitle = popTitle.value.split("_");
  newTitle[newTitle.length - 1] = (parseInt(newTitle[newTitle.length - 1]) - 1)
    .toString()
    .padStart(2, "0");
  newTitle = newTitle.join("_");
  popTitle.value = `${newTitle}`;
});

// popInjectionBtn.addEventListener("click", () => {

// });
function injection() {
  if (popInjection.value != "") {
    if (checkEdit.checked == false) {
      const datas = popInjection.value.split("_").map((data) => {
        return data.split(",");
      });
      let string = popEditor.value;
      for (let i in datas[0]) {
        string = string.replace("{c}", `${datas[0][i]}`);
      }
      for (let i in datas[1]) {
        string = string.replace("{d}", `${datas[1][i]}`);
      }
      string = string.replace("{a}", `${datas[1].join(",")}`);
      // for (let i in datas[2]) {
      //   string = string.replace("{a}", `${datas[2][i]}`);
      // }
      return {
        text: string,
        answer: datas[1].join(","),
      };
    } else {
      console.log("check! used edit2");
      const datas = popInjection.value.split("_").map((data) => {
        return data.split(",");
      });
      let string = popEditor2.value;
      for (let i in datas[0]) {
        string = string.replace("{c}", `${datas[0][i]}`);
      }
      for (let i in datas[1]) {
        string = string.replace("{d}", `${datas[1][i]}`);
      }
      string = string.replace("{a}", `${datas[1].join(",")}`);
      return {
        text: string,
        answer: datas[1].join(","),
      };
    }
  }
  return undefined;
}
popInjection.addEventListener("keydown", (e) => {
  if (e.code == "Enter") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab[0].id },
        func: changeElement,
        args: [
          {
            title: popTitle.value,
            show: {
              text: popShow.options[popShow.selectedIndex].text,
              value: popShow.options[popShow.selectedIndex].value,
            },
            injectData: injection(),
            unit: popUnit.value,
            editor: popEditor.value,
            editor2: popEditor2.value,
            checkUseEdit2: checkEdit.checked,
          },
        ],
      });
      increment();
      popInjection.value = "";
    });
  }
});

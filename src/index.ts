import './style.css';

function getEelement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if(!element){
    throw new Error(`${selector}が見つかりません`);
  };
  return element;
}

const app = getEelement<HTMLDivElement>('#app')!;

app.innerHTML = `
  <header>
    <h1>メモ</h1>
  </header>
  <main>
    <input id='search' type='text' placeholder='検索...'>
    <button id='addmemo'>メモを追加</button>
    <ul id='list'></ul>

    <div id='titlememo' class='hide'>
      <button id='backbutton'>←</button>
      <input id='title'   type='text' placeholder='メモのタイトル'>
      <textarea id='text'  ></textarea>
    </div>
  </main>
`;

const search = getEelement<HTMLInputElement>('#search');
const addmemo = getEelement<HTMLButtonElement>('#addmemo');
const list = getEelement<HTMLUListElement>('#list');
const titlememo = getEelement<HTMLDivElement>('#titlememo');
const backButto = getEelement<HTMLButtonElement>('#backbutton');
const title = getEelement<HTMLInputElement>('#title');
const text = getEelement<HTMLTextAreaElement>('#text');

type Memo = {
  id: number,
  title: string,
  text: string,
}

const STORAGE_KEY = 'memos';
const SELECTED_STORAGE_KEY = 'SelectedMemoId';

const memos: Memo [] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');

let selectedId:number | null = Number(localStorage.getItem(SELECTED_STORAGE_KEY)) || null;

function saveMemos() {
  localStorage.setItem(STORAGE_KEY,JSON.stringify(memos));
};

function saveCurrentMemo() {
  if(selectedId === null)return;

  const memo = memos.find((item) => item.id === selectedId)
  if(!memo)return;

  memo.title = title.value;
  memo.text = text.value;

  saveMemos();
  rendermemo();
};

function showMemo(memo: Memo) {
  selectedId = memo.id;
  localStorage.setItem(SELECTED_STORAGE_KEY, String(memo.id));
  title.value = memo.title;
  text.value = memo.text;

  list.querySelectorAll('button').forEach((button) => {
    button.classList.remove('current-memo');
  });
  
  const selectedButton = list.querySelector<HTMLButtonElement>(`button[data-id='${memo.id}']`) ;
  selectedButton?.classList.add('current-memo');
};


function rendermemo() {
  list.innerHTML = '';

  memos.forEach((memo) => {
    const li = document.createElement('li');
    const selectememoButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    selectememoButton.type = 'button';
    selectememoButton.textContent = memo.title || '無名';
    selectememoButton.dataset.id = String(memo.id);

    selectememoButton.addEventListener('click', () => {
      titlememo.classList.remove('hide');

      saveCurrentMemo()
      showMemo(memo);
    });

    deleteButton.type = 'button';
    deleteButton.textContent = '削除';
    deleteButton.addEventListener('click', () => {
      if(!confirm('削除しますか？'))return;

      const index = memos.findIndex((item) => item.id === memo.id);
      if(index === -1)return;
      const wasSelected = selectedId === memo.id;

      memos.splice(index, 1);
      saveMemos();
      rendermemo();

      if(wasSelected){
        if(memos.length > 0) {
          showMemo(memos[0]);
        }else {
          selectedId = null;
          createMemo();
        }
      }

    });

    li.appendChild(selectememoButton);
    li.appendChild(deleteButton);
    list.appendChild(li);
    
    });
    const selectedButton = list.querySelector<HTMLButtonElement>(`button[data-id='${selectedId}']`);

    selectedButton?.classList.add('current-memo');
};

function createMemo() {
  const memo: Memo = {
    id: Date.now() + Math.random(),
    title: '',
    text: '',
    };
  

  memos.push(memo);
  saveMemos();
  rendermemo();
  showMemo(memo);
  title.focus();
};

addmemo.addEventListener('click', () => {
  titlememo.classList.remove('hide');
  createMemo();
});

title.addEventListener('input',saveCurrentMemo);

  text.addEventListener('input', saveCurrentMemo);


  backButto.addEventListener('click', () => {
    titlememo.classList.add('hide');
  });

  rendermemo();

  const savedMemo = memos.find((item) => item.id === selectedId);

  if(savedMemo){
    showMemo(savedMemo);
  }else if(memos.length > 0){
    showMemo(memos[0]);
  }else {
    createMemo();
    title.focus();
  };
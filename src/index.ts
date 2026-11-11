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

    <div>
      <div id='titlememo'></div>
    </div>
  </main>
`;

const search = getEelement<HTMLInputElement>('#search');
const addmemo = getEelement<HTMLButtonElement>('#addmemo');
const list = getEelement<HTMLUListElement>('#list');

type Memo = {
  id: number,
  title: string,
  text: string,
}

const STORAGE_KEY = 'memos';
const SELECTED_STORAGE_KEY = 'SelectedMemoId';

const memos: Memo[] = JSON.parse(localStorage.getItem(STORAGE_KEY)?? '[]');

let selectedId:number | null = Number(localStorage.getItem(SELECTED_STORAGE_KEY)) || null;

function saveMemos() {
  localStorage.setItem(STORAGE_KEY,JSON.stringify(memos));
};

function saveCurrentMemo() {

};


function rendermemo() {
  list.innerHTML = '';

  memos.forEach((memo) => {
    const li = document.createElement('li');
    const memoButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    memoButton.type = 'button';
    memoButton.textContent = memo.title || '無名';

    deleteButton.type = 'button';
    deleteButton.textContent = '削除';
    deleteButton.addEventListener('click', () => {
      if(!confirm('削除しますか？'))return;

      const index = memos.findIndex((item) => item.id === memo.id);
      if(index === -1)return;
      memos.splice(index, 1);


      localStorage.removeItem(STORAGE_KEY);
    });


    li.appendChild(memoButton);
    li.appendChild(deleteButton);
    list.appendChild(li);
    
  });
};

function showMemo(memo: Memo) {
  const titlememo = getEelement<HTMLDivElement>('#titlememo');

  titlememo.innerHTML = `
    <input id='title' type='text' placeholder='メモのタイトル'>
    <textarea id='text'></textarea>
  `;

  const title = getEelement<HTMLInputElement>('#title');
  const text = getEelement<HTMLTextAreaElement>('#text');

  title.addEventListener('input', () => {
    
  });

  text.addEventListener('input', () => {

  });
  selectedId = memo.id;
  localStorage.setItem(SELECTED_STORAGE_KEY, String(memo.id));
  title.value = memo.title;
  text.textContent = memo.text;

};

addmemo.addEventListener('click', () => {
  createMemo();
  rendermemo();
});

function createMemo() {
  const memo: Memo = {
    id: Date.now() + Math.random(),
    title: '',
    text: '',
    };
  
    selectedId = memo.id;

  memos.push(memo);

  saveMemos();
};
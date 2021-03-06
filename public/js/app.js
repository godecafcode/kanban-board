
const StorageCtrl = (function () {
  return {
    //? List Storage
    storeList: function (list) {
      let lists;
      if (localStorage.getItem('lists') === null) {
        lists = [];
        lists.push(list);
        localStorage.setItem('lists', JSON.stringify(lists));
      } else {
        lists = JSON.parse(localStorage.getItem('lists'));
        lists.push(list);
        localStorage.setItem('lists', JSON.stringify(lists));
      }
    },

    storeListTitle: function (newTitle, id) {
      let lists = JSON.parse(localStorage.getItem('lists'));
      const ID = parseInt(id);

      lists.forEach((list) => {
        if (list.id === ID) {
          list.name = newTitle;
        }
      });

      localStorage.setItem('lists', JSON.stringify(lists));
    },

    updateListTitle: function (newTitle, listID) {
      let lists = JSON.parse(localStorage.getItem('lists'));

      lists.forEach((list) => {
        if (list.id === listID) {
          list.name = newTitle;
        }
      });

      localStorage.setItem('lists', JSON.stringify(lists));
    },

    getListsFromStorage: function () {
      let lists;
      if (localStorage.getItem('lists') === null) {
        lists = [];
      } else {
        lists = JSON.parse(localStorage.getItem('lists'));
      }
      return lists;
    },

    deleteList: function (id) {
      const lists = JSON.parse(localStorage.getItem('lists'));
      const filteredLists = lists.filter((list) => list.id !== id);
      localStorage.setItem('lists', JSON.stringify(filteredLists));
    },

    //? Kanban Storage
    storeKanban: function (kanban) {
      let kanbans;
      if (localStorage.getItem('kanbans') === null) {
        kanbans = [];
        kanbans.push(kanban);
        localStorage.setItem('kanbans', JSON.stringify(kanbans));
      } else {
        kanbans = JSON.parse(localStorage.getItem('kanbans'));
        kanbans.push(kanban);
        localStorage.setItem('kanbans', JSON.stringify(kanbans));
      }
    },

    getKanbansFromStorage: function () {
      let kanbans;
      if (localStorage.getItem('kanbans') === null) {
        kanbans = [];
      } else {
        kanbans = JSON.parse(localStorage.getItem('kanbans'));
      }
      return kanbans;
    },

    updateKanban: function (updatedKanban) {
      let kanbans = JSON.parse(localStorage.getItem('kanbans'));

      kanbans.forEach((kanban, index) => {
        if (kanban.id === updatedKanban.id) {
          kanbans.splice(index, 1, updatedKanban);
        }
      });
      localStorage.setItem('kanbans', JSON.stringify(kanbans));
    },

    deleteKanbanFromStorage: function (deletedKanbanID) {
      let kanbans = JSON.parse(localStorage.getItem('kanbans'));

      kanbans.forEach((kanban, index) => {
        if (kanban.id === deletedKanbanID) {
          kanbans.splice(index, 1);
        }
      });

      localStorage.setItem('kanbans', JSON.stringify(kanbans));
    },

    deleteKanbanFromList: function (kanbans) {
      localStorage.setItem('kanbans', JSON.stringify(kanbans));
    },

    dragSwitch: function (positionUpdate) {
      localStorage.setItem('kanbans', JSON.stringify(positionUpdate));
    },

    removeDuplicate: function (kanbans) {
      localStorage.setItem('kanbans', JSON.stringify(kanbans));
    },

    SCclearAllKanbans: function (id) {
      const kanbans = JSON.parse(localStorage.getItem('kanbans'));
      if (kanbans !== null) {
        const filteredKanbans = kanbans.filter((kanban) => kanban.parent !== `list-body_${id}`);
        localStorage.setItem('kanbans', JSON.stringify(filteredKanbans));
      }
    },
  };
})();

// List Controller
const ListCtrl = (function () {
  const List = function (id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
  };

  const listData = {
    lists: StorageCtrl.getListsFromStorage(),
    selectedList: null,
  };

  return {
    getListData: function () {
      return listData;
    },

    getLists: function () {
      return listData.lists;
    },

    // Get corresponding list color to each kanban
    getListColor: function (parentListID) {
      let color = '';
      listData.lists.forEach((list) => {
        if (list.id === parentListID) {
          color = list.color;
        }
      });

      return color;
    },

    constructList: function (listColor) {
      let ID = listData.lists.length;
      listData.lists.forEach((list) => {
        if (list.id === ID) {
          ID++;
        }
      });
      const name = `list-${ID}`;
      const color = listColor;
      const list = new List(ID, name, color);
      listData.lists.push(list);
      return list;
    },

    addListTitle: function (title, id) {
      const lists = listData.lists;
      lists.forEach((list) => {
        if (list.id === id) {
          list.name = title;
        }
      });
    },

    updateListTitle: function (newTitle, listID) {
      const lists = listData.lists;

      lists.forEach((list) => {
        if (list.id === listID) {
          list.name = newTitle;
        }
      });
    },

    deleteList: function (id) {
      return listData.lists.filter((list) => list.id !== id);
    },
  };
})();

// Item Controller
const KanbanCtrl = (function () {
  const Kanban = function (id, parent, color, text) {
    this.id = id;
    this.parent = parent;
    this.color = color;
    this.text = text;
  };

  const kanbanData = {
    kanbans: StorageCtrl.getKanbansFromStorage(),
    selectedKanban: null,
    isKanbanInProgress: false,
  };

  return {
    getKanbanData: function () {
      return kanbanData;
    },

    getKanbans: function () {
      return kanbanData.kanbans;
    },

    getSelectedKanban: function () {
      return kanbanData.selectedKanban;
    },

    getKanbanInProgress: function () {
      return kanbanData.isKanbanInProgress;
    },

    constructKanban: function (kanbanText, listParentId, correspColor) {
      let ID = kanbanData.kanbans.length;
      kanbanData.kanbans.forEach((kanban) => {
        if (kanban.id === ID) {
          ID++;
        }
      });
      const color = correspColor;
      const newKanban = new Kanban(ID, listParentId, color, kanbanText);
      kanbanData.kanbans.push(newKanban);
      return newKanban;
    },

    setSelectedKanban: function (kanbanID) {
      kanbanData.kanbans.forEach((kanban) => {
        if (kanban.id === kanbanID) {
          kanbanData.selectedKanban = kanban;
        }
      });
      return kanbanData.selectedKanban;
    },

    setKanbanInProgress: function (bool) {
      kanbanData.isKanbanInProgress = bool;
    },

    removeSelectedKanban: function () {
      kanbanData.selectedKanban = null;
    },

    ICclearAllKanbans: function (id) {
      const kanbans = kanbanData.kanbans;
      const filteredKanbans = kanbans.filter((kanban) => kanban.parent !== `list-body_${id}`);
      kanbanData.kanbans = filteredKanbans;
    },

    updateKanban: function (newText, selectedKanban) {
      selectedKanban.text = newText;

      kanbanData.kanbans.forEach((kanban, index) => {
        if (kanban.id === selectedKanban.id) {
          kanbanData.kanbans.splice(index, 1, selectedKanban);
        }
      });
      return selectedKanban;
    },

    deleteKanban: function () {
      const kanbans = this.getKanbans();
      const selectedKanban = this.getSelectedKanban();
      kanbans.forEach((kanban, index) => {
        if (kanban.id === selectedKanban.id) {
          kanbans.splice(index, 1);
        }
      });
    },

    deleteKanbanFromList: function (id) {
      let kanbans = kanbanData.kanbans;

      const filtered = kanbans.filter((kanban) => kanban.parent !== `list-body_${id}`);
      return filtered;
    },

    getSwitchItems: function (draggableID, afterElementID) {
      let draggableObj = null;
      let afterElementObj = null;

      if (afterElementID === null) {
        kanbanData.kanbans.forEach((kanban) => {
          if (kanban.id === draggableID) {
            draggableObj = kanban;
          }
        });
      } else {
        kanbanData.kanbans.forEach((kanban) => {
          if (kanban.id === draggableID) {
            draggableObj = kanban;
          } else if (kanban.id === afterElementID) {
            afterElementObj = kanban;
          }
        });
      }

      return {
        draggableObj: draggableObj,
        afterElementObj: afterElementObj,
      };
    },

    dragSwitch: function (kanbanObj, list) {
      if (!kanbanObj.afterElementObj || kanbanObj.afterElementObj === null) {
        const draggableObj = kanbanObj.draggableObj;

        kanbanData.kanbans.forEach((kanban, index) => {
          if (kanban === draggableObj) {
            kanbanData.kanbans.splice(index, 1);
            kanbanData.kanbans.push(draggableObj);
            kanban.parent = list.id;
          }
        });
      } else {
        const draggableObj = kanbanObj.draggableObj;
        const afterElementObj = kanbanObj.afterElementObj;

        kanbanData.kanbans.forEach((kanban, index) => {
          if (kanban === draggableObj) {
            kanbanData.kanbans.splice(index, 1);
          }
        });

        kanbanData.kanbans.forEach((kanban, index) => {
          if (kanban === afterElementObj) {
            kanbanData.kanbans.splice(index, 0, draggableObj);
            draggableObj.parent = afterElementObj.parent;
          }
        });
      }

      return kanbanData.kanbans;
    },

    removeDuplicate: function () {
      const kanbans = kanbanData.kanbans;

      const filteredArr = kanbans.reduce((acc, current) => {
        const x = acc.find((item) => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      return filteredArr;
    },
  };
})();

// UI Controller

const UICtrl = (function () {
  const UISelectors = {
    board: '.board',
    add: '#add',
    toggleEdit: '#toggle-edit',
    toggleRemove: '#toggle-remove',
    form: 'form',
    kanbanText: '#text',
    addKanban: '.add-kanban',

    // use .contains
    addTask: 'add-task',
    edit: 'edit',
    clear: 'clear',
    clearList: 'clear-list',
    showMore: 'show-more',
    addTitle: 'add-title',
    done: 'done',
    delete: 'delete',
    updateTitle: 'update-title',
    listTitle: 'list-title',
    deleteList: 'delete-list',
    kanbanInputEmpty: 'kanban-input_empty',
  };

  return {
    getSelectors: function () {
      return UISelectors;
    },

    populateBoard: function (lists) {
      const kanbans = KanbanCtrl.getKanbans();
      let UIlists = '';

      lists.forEach((list) => {
        let items = '';
        kanbans.forEach((kanban) => {
          let parent = App.stringSplitID(kanban.parent);
          if (parent === list.id) {
            items += `
            <div id="kanban_${kanban.id}" class="item misc_spread-md" draggable="true">
            <div class="item-header">
            <span id="item-color" class="col" style="background: ${kanban.color};"></span>
            <div id="open-edit_container_${kanban.id}" class="open-edit_container" style="display: none;">
            <div class="open-edit">
              <i id="delete_${kanban.id}" class="material-icons col icon delete">delete</i>
              <i id="done_${kanban.id}" class="material-icons col icon done">done</i>
              <i id="clear_${kanban.id}" class="material-icons col icon clear">clear</i>  
            </div>
          </div>
          <i id="edit_${kanban.id}" class="material-icons col icon edit">edit</i>
          </div>
          <form id="edit-form_${kanban.id}" class="edit-form">
          <div class="edit-grid">
            <input type="text" name="" value="${kanban.text}" id="kanban-input_${kanban.id}" class="kanban-input">                     
          </div>
            <div class="char-limit_container">
             <p id="char-limit-p_${kanban.id}"><span id="char-limit_${kanban.id}">0</span>/55</p>
            </div>  
         </form>
          <div id="kanban-text_${kanban.id}" class="item-text">
            <p id="text" class="kanban-text">${kanban.text}</p>
          </div>
          </div>
            `;
          }
        });
        UIlists += `
        <div id="list_${list.id}" class="list">
        <div class="list-header misc_spread-sm" style="background: ${list.color}">
          <h1 id="list-title_${list.id}" class="list-title" contenteditable="true">${list.name}</h1>
          
          <i id="check_${list.id}" class="material-icons head-icon update-title" style="display: none;">check_circle_outline</i>
          <div class="open-head_container" style="display: none;">
          <div class="head-icons">
            <i id="delete-list_${list.id}" class="material-icons head-icon delete-list">delete</i>       
            <i id="clear-list_${list.id}" class="material-icons head-icon clear-list">clear_all</i>       
          </div>
        </div>
        <i class="material-icons show-more">more_horiz</i>
        </div>
        <div class="list-body misc_spread-sm">
          <div id="list-body_${list.id}" class="list-body_grid">
          ${items}
          </div>
        </div>
        <div class="add-knbn_container misc_spread-sm">
        <div class="add-knbn">
          <div class="icons">
            <i id="clear-list_${list.id}" class="material-icons head-icon add">add</i>
            <h1 id="add-task_${list.id}" class="add-task">add new task</h1>                    
          </div>
        </div>
      </div>
      </div>
        `;
      });

      document.querySelector(UISelectors.board).innerHTML += UIlists;
      App.makeDraggable();
    },

    UIconstructList: function (newList) {
      const list = document.createElement('div');
      list.id = `list_${newList.id}`;
      list.className = 'list';
      list.innerHTML = `
      <div id="list-header_${newList.id}" class="list-header misc_spread-sm" style="background: ${newList.color}">
      <input type="text" name="" id="add-title_${newList.id}" class="add-title" placeholder="Add title">
      
      <i id="check_${newList.id}" class="material-icons head-icon update-title" style="display: none;">check_circle_outline</i>
      
      <div class="open-head_container" style="display: none;">
      <div class="head-icons">
        <i id="delete-list_${newList.id}" class="material-icons head-icon delete-list">delete</i>       
        <i id="clear-list_${newList.id}" class="material-icons head-icon clear-list">clear_all</i>       
      </div>
    </div>
    <i class="material-icons show-more">more_horiz</i>
    </div>
    <div class="list-body misc_spread-sm">
      <div id="list-body_${newList.id}" class="list-body_grid">

      </div>
    </div>
    <div class="add-knbn_container misc_spread-sm">
    <div class="add-knbn">
      <div class="icons">
        <i id="clear-list_${newList.id}" class="material-icons head-icon add">add</i>
        <h1 id="add-task_${newList.id}" class="add-task">add new task</h1>                    
      </div>
    </div>
  </div>
      `;

      document.querySelector(UISelectors.board).insertAdjacentElement('beforeend', list);
    },

    UIaddListTitle: function (title, id) {
      const lists = document.querySelectorAll('.list');
      lists.forEach((list) => {
        if (App.stringSplitID(list) === id) {
          // change to split function
          list.firstElementChild.firstElementChild.remove();
          const h1 = document.createElement('h1');
          h1.id = `list-title_${id}`;
          h1.className = 'list-title';
          h1.textContent = title;

          const parentNode = document.querySelector(`#list-header_${id}`);
          const referenceNode = parentNode.firstElementChild;
          parentNode.insertBefore(h1, referenceNode);
        }
      });
    },

    updateListTitle: function (newTitle, listID) {
      const title = document.querySelector(`#list-title_${listID}`);
      title.textContent = newTitle;
    },

    UIconstructEmptyKanban: function (correspColor, id) {
      const kanban = document.createElement('div');
      kanban.id = `kanban_empty`;
      kanban.className = 'item misc_spread-md';
      kanban.innerHTML = `
      <div class="item-header">
        <span id="item-color" class="col"" style="background: ${correspColor}"></span>
      </div>
      <form class="form">
        <input type="text" name="" id="kanban-input_empty_${id}" class="kanban-input kanban-input_empty">
          <div class="char-limit_container">
           <p id="char-limit-p_empty_${id}"><span id="char-limit_empty_${id}">0</span>/55</p>
          </div> 
      </form>
      `;

      document.querySelector(`#list-body_${id}`).insertAdjacentElement('beforeend', kanban);
    },

    UIconstructKanban: function (demoParent, kanbanObj) {
      demoParent.remove();

      const kanban = document.createElement('div');
      kanban.id = `kanban_${kanbanObj.id}`;
      kanban.className = 'item misc_spread-md';
      kanban.setAttribute('draggable', 'true');
      kanban.innerHTML = `
      <div class="item-header">
        <span id="item-color" class="col" style="background: ${kanbanObj.color};"></span>
        <div id="open-edit_container_${kanbanObj.id}" class="open-edit_container" style="display: none;">
        <div class="open-edit">
          <i id="delete_${kanbanObj.id}" class="material-icons col icon delete">delete</i>
          <i id="done_${kanbanObj.id}" class="material-icons col icon done">done</i>
          <i id="clear_${kanbanObj.id}" class="material-icons col icon clear">clear</i>  
        </div>
      </div>
      <i id="edit_${kanbanObj.id}" class="material-icons col icon edit">edit</i>
      </div>
      <form id="edit-form_${kanbanObj.id}" class="edit-form">
      <div class="edit-grid">
        <input type="text" name="" value="${kanbanObj.text}" id="kanban-input_${kanbanObj.id}" class="kanban-input">                     
      </div>
        <div class="char-limit_container">
          <p id="char-limit-p_${kanbanObj.id}"><span id="char-limit_${kanbanObj.id}">0</span>/55</p>
        </div> 
     </form>
      <div id="kanban-text_${kanbanObj.id}" class="item-text">
        <p id="text" class="kanban-text">${kanbanObj.text}</p>
      </div>
      `;

      document.querySelector(`#${kanbanObj.parent}`).insertAdjacentElement('beforeend', kanban);
    },

    UIenterEditState: function (id) {
      // Show edit menu
      document.querySelector(`#open-edit_container_${id}`).style.display = 'block';

      // Hide pen when in edit state
      document.querySelector(`#edit_${id}`).style.display = 'none';
      document.querySelector(`#kanban-text_${id}`).style.display = 'none';
      document.querySelector(`#edit-form_${id}`).style.display = 'block';
    },

    UIleaveEditState: function (id) {
      // Hide edit menu
      document.querySelector(`#open-edit_container_${id}`).style.display = 'none';

      // Show pen when not in edit state
      document.querySelector(`#edit_${id}`).style.display = 'block';
      document.querySelector(`#kanban-text_${id}`).style.display = 'block';
      document.querySelector(`#edit-form_${id}`).style.display = 'none';
    },

    UIupdateKanban: function (kanban, newKanban) {
      kanban.innerHTML = `
      <div class="item-header">
      <span id="item-color" class="col" style="background: ${newKanban.color};"></span>
      <div id="open-edit_container_${newKanban.id}" class="open-edit_container" style="display: none;">
        <div class="open-edit">
          <i id="delete_${newKanban.id}" class="material-icons col icon delete">delete</i>
          <i id="done_${newKanban.id}" class="material-icons col icon done">done</i>
          <i id="clear_${newKanban.id}" class="material-icons col icon clear">clear</i>  
        </div>
      </div>
    <i id="edit_${newKanban.id}" class="material-icons col icon edit">edit</i>
    </div>
    <form id="edit-form_${newKanban.id}" class="edit-form">
    <div class="edit-grid">
      <input type="text" name="" value="${newKanban.text}" id="kanban-input_${newKanban.id}" class="kanban-input">                      
    </div>
      <div class="char-limit_container">
       <p id="char-limit-p_${newKanban.id}"><span id="char-limit_${newKanban.id}">0</span>/55</p>
      </div> 
   </form>
    <div id="kanban-text_${newKanban.id}" class="item-text">
      <p id="text" class="kanban-text">${newKanban.text}</p>
    </div>
      `;

      KanbanCtrl.removeSelectedKanban();
    },

    UIdeleteKanban: function (kanban) {
      kanban.remove();
    },

    UCclearAllKanbans: function (id) {
      const listGrid = document.querySelectorAll('.list-body_grid');

      listGrid.forEach(function (grid) {
        if (grid.id === `list-body_${id}`) {
          grid.innerHTML = '';
        }
      });
    },

    UIdeleteList: function (id) {
      document.querySelector(`#list_${id}`).remove();
    },
  };
})();

// App Controller

const App = (function (ListCtrl, KanbanCtrl, UICtrl, StorageCtrl) {
  // Get selectors
  const selectors = UICtrl.getSelectors();

  //? Event Listeners
  const loadEventListeners = function () {
    // Create List
    document.querySelector(selectors.add).addEventListener('click', createList);

    // Create Kanban
    const forms = document.querySelectorAll(selectors.form);
    forms.forEach((form) => {
      form.addEventListener('submit', createKanban);
    });

    document.querySelector(selectors.board).addEventListener('click', determine);
  };

  const determine = function (e) {
    const id = stringSplitID(e.target);
    const isKanbanInProgress = KanbanCtrl.getKanbanInProgress();
    const cls = e.target.classList;

    switch (true) {
      case cls.contains(selectors.addTask):
        if (isKanbanInProgress === false) {
          constructEmptyKanban(e, id);
        }
        break;
      case cls.contains(selectors.edit):
        enterEditState(e, id);
        getElForLimit(e, id);
        break;
      case cls.contains(selectors.clear):
        leaveEditState(id);
        break;
      case cls.contains(selectors.clearList):
        clearAllKanbans(id);
        break;
      case cls.contains(selectors.showMore):
        toggleListCtas(e);
        break;
      case cls.contains(selectors.addTitle):
        addListTitle(e, id);
        break;
      case cls.contains(selectors.done):
        updateKanban(e, id);
        break;
      case cls.contains(selectors.delete):
        deleteKanban(e, id);
        break;
      case cls.contains(selectors.updateTitle):
        updateListTitle(e, id);
        break;
      case cls.contains(selectors.listTitle):
        initListTitle(e, id);
        break;
      case cls.contains(selectors.deleteList):
        deleteList(id);
        break;
      case cls.contains(selectors.kanbanInputEmpty):
        getEmptyElForLimit(e, id);
        break;

      default:
        break;
    }

    e.preventDefault();
  };

  /* 
  Each dynamically added elements has an unique number added on to their id.
  By using regex, I could extract that number by splitting the string at '_', filter through it and check which item contains digits. 
  */
  const stringSplitID = function (target) {
    target = typeof target === 'string' ? target : target.id;
    const regex = /\d+/g;
    const ID = target
      .split('_')
      .filter((str) => str.match(regex))
      .join('');
    return parseInt(ID);
  };

  // Generate a light color for each list
  const constructListColor = function () {
    const symLet = [...'abcdef'];
    let color = `#`;
    for (let i = 0; i < 4; i++) {
      color += symLet[Math.floor(Math.random() * symLet.length)];
    }
    return color;
  };

  const createList = function () {
    const selectedKanban = KanbanCtrl.getSelectedKanban();
    const lists = StorageCtrl.getListsFromStorage();
    const listLimit = 4;

    if (lists.length === listLimit) {
      alert('list limit reached, please remove a list before creating a new one.')
    } else {
      if (selectedKanban !== null) {
        isInEditState();
      }
      const color = constructListColor();
      const newList = ListCtrl.constructList(color);

      StorageCtrl.storeList(newList);
      UICtrl.UIconstructList(newList);

      loadEventListeners();
    }
  };

  const addListTitle = function (e, id) {
    document.querySelector(`#${e.target.id}`).addEventListener('keypress', (e) => {
      if (e.keycode === 13 || e.which === 13) {
        const target = e.target;
        const value = toUpperCase(target.value);
        const title = value.length >= 1 ? value : `List-${id}`;

        ListCtrl.addListTitle(title, id);
        StorageCtrl.storeListTitle(title, id);
        UICtrl.UIaddListTitle(title, id);

        e.preventDefault();
      }
    });
  };

  const deleteList = function (id) {
    ListCtrl.deleteList(id);
    StorageCtrl.deleteList(id);
    UICtrl.UIdeleteList(id);

    // Remove attached kanbans
    clearAllKanbans(id);
  };

  const clearAllKanbans = function (id) {
    KanbanCtrl.ICclearAllKanbans(id);
    StorageCtrl.SCclearAllKanbans(id);
    UICtrl.UCclearAllKanbans(id);
  };

  const initListTitle = function (e, id) {
    const title = document.querySelector(`#list-title_${id}`);
    title.setAttribute('contenteditable', 'true');
    enterUpdateTitleState(e);

    title.addEventListener('keypress', (e) => {
      if (e.keycode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
  };

  const toggleListCtas = function (e) {
    const ctas = e.target.parentNode.children[2];

    if (ctas.style.display === 'none') {
      ctas.style.display = 'block';
    } else if (ctas.style.display === 'block') {
      ctas.style.display = 'none';
    }
  };

  const enterUpdateTitleState = function (e) {
    const done = e.target.parentNode.children[1];
    const add = e.target.parentNode.lastElementChild;

    add.style.display = 'none';
    done.style.display = 'block';
  };

  const leaveUpdateTitleState = function (e) {
    const done = e.target.parentNode.children[1];
    const add = e.target.parentNode.lastElementChild;

    add.style.display = 'block';
    done.style.display = 'none';
  };

  const updateListTitle = function (e, id) {
    const newValue = toUpperCase(e.target.parentNode.firstElementChild.textContent);
    const newTitle = newValue.length >= 1 ? newValue : `List-${id}`;

    ListCtrl.updateListTitle(newTitle, id);
    UICtrl.updateListTitle(newTitle, id);
    StorageCtrl.updateListTitle(newTitle, id);

    leaveUpdateTitleState(e);
  };

  const constructEmptyKanban = function (e, id) {
    // Declare that there's an empty kanban about to be constructed.
    KanbanCtrl.setKanbanInProgress(true);

    const listColor = ListCtrl.getListColor(id);
    UICtrl.UIconstructEmptyKanban(listColor, id);
    // re-assign event listeners to newly createn items.
    loadEventListeners();
  };

  const createKanban = function (e) {
    const kanbanText = e.target.firstElementChild.value;
    const listParent = e.target.parentNode;
    const listParentId = listParent.parentNode.id;
    const correspListID = stringSplitID(e.target.parentNode.parentNode);
    const correspColor = ListCtrl.getListColor(correspListID);
    // Construct Kanban object
    const kanban = KanbanCtrl.constructKanban(kanbanText, listParentId, correspColor);
    // Add kanban to LS
    StorageCtrl.storeKanban(kanban);
    // Construct UI Kanban
    UICtrl.UIconstructKanban(listParent, kanban);
    makeDraggable();

    // Declare that there's no longer an empty kanban about to be constructed.
    KanbanCtrl.setKanbanInProgress(false);
    e.preventDefault();
  };

  const getEmptyElForLimit = function (e, id) {
    const elements = {
      form: document.querySelector(`#kanban-input_empty_${id}`),
      limitP: document.querySelector(`#char-limit-p_empty_${id}`),
      limitSpan: document.querySelector(`#char-limit_empty_${id}`),
      value: document.querySelector(`#kanban-input_empty_${id}`).value,
    };

    addCharLimit(elements);
  };

  const getElForLimit = function (e, id) {
    const elements = {
      form: document.querySelector(`#kanban-input_${id}`),
      limitP: document.querySelector(`#char-limit-p_${id}`),
      limitSpan: document.querySelector(`#char-limit_${id}`),
      value: document.querySelector(`#kanban-input_${id}`).value,
    };

    addCharLimit(elements);
  };

  const addCharLimit = function (elements) {
    const form = elements.form;
    const limitP = elements.limitP;
    const limitSpan = elements.limitSpan;
    let value = elements.value;

    let color = value.length === 55 ? '#E59494' : value.length < 30 ? '#DBDBDB' : '#E5C994';
    limitP.style.color = color;

    limitSpan.textContent = value.length;

    form.addEventListener('keyup', (e) => {
      value = checkLimit(e.target.value);
      e.target.value = value;

      limitSpan.textContent = value.length;

      if (value.length === 55) {
        limitP.style.color = '#E59494';
      } else if (value.length <= 40) {
        limitP.style.color = '#DBDBDB';
      } else {
        limitP.style.color = '#E5C994';
      }
    });
  };

  const checkLimit = function (value) {
    if (value.length >= 55) {
      return value.slice(0, 55);
    } else {
      return value;
    }
  };

  const makeDraggable = function () {
    // global variables
    let vars = {};

    const draggables = document.querySelectorAll('.item');
    const lists = document.querySelectorAll('.list');

    draggables.forEach((draggable) => {
      draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging');
      });

      draggable.addEventListener('dragend', () => {
        const list = draggable.parentNode;
        draggable.classList.remove('dragging');
        const positionUpdate = KanbanCtrl.dragSwitch(vars.kanbanObj, list);
        StorageCtrl.dragSwitch(positionUpdate);

        // Make sure there's no duplicate kanbans
        const kanbans = KanbanCtrl.removeDuplicate();
        // Make sure there's no duplicate kanbans - LS
        StorageCtrl.removeDuplicate(kanbans);
        const kanbanData = KanbanCtrl.getKanbanData();
        kanbanData.kanbans = kanbans;
      });
    });

    lists.forEach((list) => {
      list.addEventListener('dragover', (e) => {
        e.preventDefault();
        vars.afterElement = getDragAfterElement(list, e.clientY);
        const draggable = document.querySelector('.dragging');
        let draggableID = null;
        let afterElementID = null;

        if (vars.afterElement === null || vars.afterElement === undefined) {
          draggableID = stringSplitID(draggable.id);
          afterElementID = null;

          vars.kanbanObj = KanbanCtrl.getSwitchItems(draggableID, afterElementID);
          list.children[1].firstElementChild.appendChild(draggable);
        } else {
          draggableID = stringSplitID(draggable.id);
          afterElementID = stringSplitID(vars.afterElement.id);

          vars.kanbanObj = KanbanCtrl.getSwitchItems(draggableID, afterElementID);
          list.children[1].firstElementChild.insertBefore(draggable, vars.afterElement);
        }
      });
    });

    function getDragAfterElement(list, y) {
      const draggableElements = [...list.querySelectorAll('.item:not(.dragging)')];

      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        { offset: Number.NEGATIVE_INFINITY }
      ).element;
    }
  };

  const enterEditState = function (e, id) {
    let selectedKanban = KanbanCtrl.getSelectedKanban();
    if (selectedKanban === null) {
      const form = e.target.parentNode.nextSibling.nextSibling;
      const kanban = form.parentNode;
      const selected = KanbanCtrl.setSelectedKanban(id);
      UICtrl.UIenterEditState(id);

      // Submit on enter (hacky fallback for done button)
      document.querySelector(`#${e.target.parentNode.parentNode.id}`).addEventListener('keypress', (e) => {
        if (e.keycode === 13 || e.which === 13) {
          const newText = form.firstElementChild.firstElementChild.value;
          const updatedKanban = KanbanCtrl.updateKanban(newText, selected);
          UICtrl.UIupdateKanban(kanban, updatedKanban);
          StorageCtrl.updateKanban(updatedKanban);

          e.preventDefault();
        }
      });
    }
  };

  const leaveEditState = function (id) {
    KanbanCtrl.removeSelectedKanban();
    if (id !== undefined) {
      UICtrl.UIleaveEditState(id);
    }
  };

  const updateKanban = function (e, id) {
    const form = e.target.parentNode.parentNode.parentNode.nextSibling.nextSibling;
    const newText = form.firstElementChild.firstElementChild.value;
    const kanban = form.parentNode;
    const selected = KanbanCtrl.setSelectedKanban(id);
    const updatedKanban = KanbanCtrl.updateKanban(newText, selected);
    UICtrl.UIupdateKanban(kanban, updatedKanban);
    StorageCtrl.updateKanban(updatedKanban);
    e.preventDefault();
  };

  const deleteKanban = function (e, id) {
    const kanban = e.target.parentNode.parentNode.parentNode.parentNode;
    UICtrl.UIdeleteKanban(kanban);
    StorageCtrl.deleteKanbanFromStorage(id);
    KanbanCtrl.deleteKanban(kanban);
    leaveEditState();
  };

  const isInEditState = function () {
    const editForms = document.querySelectorAll('.edit-form');
    editForms.forEach((form) => {
      if (form.style.display != 'none') {
        let id = stringSplitID(form);
        UICtrl.UIleaveEditState(id);
      }
    });
    KanbanCtrl.removeSelectedKanban();
  };

  const toUpperCase = function (string) {
    const char = string.charAt(0).toUpperCase();
    string = char + string.slice(1, string.length);

    return string;
  };

  return {
    init: function () {
      // Get all lists from ListCtrl.getLists
      const lists = ListCtrl.getLists();
      UICtrl.populateBoard(lists);

      loadEventListeners();
    },

    makeDraggable: function () {
      return makeDraggable();
    },

    stringSplitID: function (element) {
      return stringSplitID(element);
    },

    toUpperCase: function (string) {
      return toUpperCase(string);
    },
  };
})(ListCtrl, KanbanCtrl, UICtrl, StorageCtrl);

App.init();

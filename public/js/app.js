// Storage Controller

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

    updateListTitle: function (list, newTitle) {
      let lists = JSON.parse(localStorage.getItem('lists'));
      const listID = parseInt(list.id.charAt(list.id.length - 1));

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

    deleteList: function (list) {
      console.log(list);
      localStorage.setItem('lists', JSON.stringify(list));
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

      // Loop through and find identical IDs
      kanbans.forEach((kanban, index) => {
        if (kanban.id === updatedKanban.id) {
          kanbans.splice(index, 1, updatedKanban);
        }
      });
      localStorage.setItem('kanbans', JSON.stringify(kanbans));
    },

    deleteKanbanFromStorage: function (deletedKanban) {
      const deletedKanbanID = parseInt(deletedKanban.id.charAt(deletedKanban.id.length - 1));
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
    getListColor: function (parentList) {
      // Get the last character from parentList.id and parse the number > id
      parentList = parseInt(parentList.id.charAt(parentList.id.length - 1));
      let color = '';
      listData.lists.forEach((list) => {
        if (list.id === parentList) {
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
      console.log(listData.lists);
      return list;
    },

    addListTitle: function (title, id) {
      // console.log(target.value);
      const ID = parseInt(id);
      const lists = listData.lists;
      lists.forEach((list) => {
        if (list.id === ID) {
          list.name = title;
        }
      });
    },

    updateListTitle: function (list, newTitle) {
      const listID = parseInt(list.id.charAt(list.id.length - 1));
      const lists = listData.lists;

      lists.forEach((list) => {
        if (list.id === listID) {
          list.name = newTitle;
        }
      });
    },

    deleteList: function (id) {
      const lists = listData.lists;
      lists.forEach((list, index) => {
        if (list.id === id) {
          lists.splice(index, 1);
        }
      });
      return lists;
    },
  };
})();

// Item Controller
const ItemCtrl = (function () {
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

    getKanbanInProgress: function() {
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
      console.log(newKanban);
      return newKanban;
    },

    setSelectedKanban: function (kanban) {
      const kanbanID = parseInt(kanban.id.charAt(kanban.id.length - 1));
      kanbanData.kanbans.forEach((kanban) => {
        if (kanban.id === kanbanID) {
          kanbanData.selectedKanban = kanban;
        }
      });
      return kanbanData.selectedKanban;
    },

    setKanbanInProgress: function(bool) {
      kanbanData.isKanbanInProgress = bool;
    },

    removeSelectedKanban: function () {
      kanbanData.selectedKanban = null;
    },

    updateKanban: function (newText, selectedKanban) {
      // Update text at selectedKanban
      selectedKanban.text = newText;

      // go through kanbans and check for match with selectedKanban.id then slice index and replace with slected.
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

    getSwitchItems: function (draggable, afterElement) {
      if (!afterElement) {
        const draggableID = parseInt(draggable.id.charAt(draggable.id.length - 1));
        let draggableObj;

        kanbanData.kanbans.forEach((kanban) => {
          if (kanban.id === draggableID) {
            draggableObj = kanban;
          }
        });

        return {
          draggableObj: draggableObj,
        };
      } else {
        const draggableID = parseInt(draggable.id.charAt(draggable.id.length - 1));
        const afterElementID = parseInt(afterElement.id.charAt(afterElement.id.length - 1));
        let draggableObj = null;
        let afterElementObj = null;

        kanbanData.kanbans.forEach((kanban) => {
          if (kanban.id === draggableID) {
            draggableObj = kanban;
          } else if (kanban.id === afterElementID) {
            afterElementObj = kanban;
          }
        });

        return {
          draggableObj: draggableObj,
          afterElementObj: afterElementObj,
        };
      }
    },

    dragSwitch: function (kanbanObj, list) {
      if (!kanbanObj.afterElementObj || kanbanObj.afterElementObj === undefined) {
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
  };

  return {
    getSelectors: function () {
      return UISelectors;
    },

    populateBoard: function (lists) {
      const kanbans = ItemCtrl.getKanbans();
      let UIlists = '';

      lists.forEach((list) => {
        let items = '';
        kanbans.forEach((kanban) => {
          let parent = Number(kanban.parent.charAt(kanban.parent.length - 1));
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
          <form class="edit-form edit-form_${kanban.id}">
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
        <div id="list-${list.id}" class="list">
        <div class="list-header misc_spread-sm" style="background: ${list.color}">
          <h1 id="list-title_${list.id}" class="list-title" contenteditable="true">${list.name}</h1>
          <i class="material-icons add-kanban">add_circle_outline</i>
          <i id="check_${list.id}" class="material-icons head-icon update-title" style="display: none;">check_circle_outline</i>
          <div class="open-head_container" style="display: none;">
          <div class="head-icons">
            <i id="delete-list_${list.id}" class="material-icons head-icon delete-list">delete</i>       
            <i id="clear-list_${list.id}" class="material-icons head-icon clear-list">clear_all</i>       
          </div>
        </div>
        </div>
        <div class="list-body misc_spread-sm">
          <div id="list-body_${list.id}" class="list-body_grid">
          ${items}
          </div>
        </div>
      </div>
        `;
      });

      document.querySelector(UISelectors.board).innerHTML += UIlists;
      App.AppMakeDraggable();
    },

    UIconstructList: function (newList) {
      const list = document.createElement('div');
      list.id = `list-${newList.id}`;
      list.className = 'list';
      list.innerHTML = `
      <div id="list-header_${newList.id}" class="list-header misc_spread-sm" style="background: ${newList.color}">
      <input type="text" name="" id="add-title_${newList.id}" class="add-title" placeholder="Add title">
      <i class="material-icons add-kanban">add_circle_outline</i>
      <i id="check_${newList.id}" class="material-icons head-icon update-title" style="display: none;">check_circle_outline</i>
      
      <div class="open-head_container" style="display: none;">
      <div class="head-icons">
        <i id="delete-list_${newList.id}" class="material-icons head-icon delete-list">delete</i>       
        <i id="clear-list_${newList.id}" class="material-icons head-icon clear-list">clear_all</i>       
      </div>
    </div>
    </div>
    <div class="list-body misc_spread-sm">
      <div id="list-body_${newList.id}" class="list-body_grid">
      <!-- <h1>Assign a Kanban</h1> -->
      <!--  <div id="item-1" class="item misc_spread-md">
          <div class="item-header">
            <span id="item-color-demo" class="col" style="background: ${newList.color}"></span>
          </div>
          <form class="form">
            <input type="text" name="" id="kanban-input_empty_${newList.id}" class="kanban-input kanban-input_empty">
              <div class="char-limit_container">
                <p id="char-limit-p_empty_${newList.id}"><span id="char-limit_empty_${newList.id}">0</span>/55</p>
              </div> 
          </form>
        </div> -->
      </div>
    </div>
      `;

      document.querySelector(UISelectors.board).insertAdjacentElement('beforeend', list);
    },

    UIaddListTitle: function (title, id) {
      const lists = document.querySelectorAll('.list');
      lists.forEach((list) => {
        if (parseInt(list.id.charAt(list.id.length - 1)) === id) {
          list.firstElementChild.firstElementChild.remove();
          const h1 = document.createElement('h1');
          h1.id = `list-title_${id}`;
          h1.className = 'list-title';
          h1.textContent = title;

          const parentNode = document.querySelector(`#list-header_${id}`);
          const referenceNode = parentNode.firstElementChild;
          console.log(parentNode);
          console.log(referenceNode);
          parentNode.insertBefore(h1, referenceNode);
        }
      });
    },

    UIconstructEmptyKanban: function (target, correspColor, id) {
      console.log(correspColor);
      const kanban = document.createElement('div');
      kanban.id = `kanban-empty`;
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

      document.querySelector(`#${target}`).insertAdjacentElement('beforeend', kanban);
    },

    UIconstructKanban: function (demoParent, kanbanObj) {
      // console.log('OBJECT BELOW')
      // console.log(kanbanObj)
      demoParent.remove();
      // ItemCtrl.removeSelectedKanban();
      const kanban = document.createElement('div');
      kanban.id = `kanban-${kanbanObj.id}`;
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
      <form class="edit-form edit-form_${kanbanObj.id}">
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
      console.log(id);
      // Show edit menu
      document.querySelector(`#open-edit_container_${id}`).style.display = 'block';

      // Hide pen when in edit state
      document.querySelector(`#edit_${id}`).style.display = 'none';
      document.querySelector(`#kanban-text_${id}`).style.display = 'none';
      document.querySelector(`.edit-form_${id}`).style.display = 'block';
    },

    UIleaveEditState: function (id) {
      // Hide edit menu
      document.querySelector(`#open-edit_container_${id}`).style.display = 'none';

      // Show pen when not in edit state
      document.querySelector(`#edit_${id}`).style.display = 'block';
      document.querySelector(`#kanban-text_${id}`).style.display = 'block';
      document.querySelector(`.edit-form_${id}`).style.display = 'none';
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
    <form class="edit-form edit-form_${newKanban.id}">
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

      ItemCtrl.removeSelectedKanban();
    },

    UIdeleteKanban: function (kanban) {
      kanban.remove();
    },

    UIdeleteList: function (id) {
      document.querySelector(`#list-${id}`).remove();
    },
  };
})();

// App Controller

const App = (function (ListCtrl, ItemCtrl, UICtrl, StorageCtrl) {
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

    // purpose: prevent from reassigning every event listener when new elements is being created.
    document.querySelector(selectors.board).addEventListener('click', determine);
  };

  //? Add edit state buttons
  //? Add event listeners for those buttons, both finished and back button

  const determine = function (e) {
    const id = stringSplitID(e.target);
    const isKanbanInProgress = ItemCtrl.getKanbanInProgress();
    const cls = e.target.classList;

    switch (true) {
      case cls.contains('add-kanban'):
        if(isKanbanInProgress === false) {
          constructEmptyKanban(e);          
        }
        break;
      case cls.contains('edit'):
        enterEditState(e, id);
        getElForLimit(e, id);
        break;
      case cls.contains('clear'):
        leaveEditState(id);
        break;
      case cls.contains('add-title'):
        addListTitle(e, id);
        break;
      case cls.contains('done'):
        updateKanban(e);
        break;
      case cls.contains('delete'):
        deleteKanban(e);
        break;
      case cls.contains('update-title'):
        updateListTitle(e);
        break;
      case cls.contains('list-title'):
        initListTitle(e, id);
        break;
      case cls.contains('delete-list'):
        deleteList(e);
        break;
      case cls.contains('kanban-input_empty'):
        getEmptyElForLimit(e, id);
        break;

      default:
        console.log('default trigger');
        break;
    }

    e.preventDefault();
  };

  /* 
  Each dynamically added item and list has unique number added onto to their id.
  The function below extracts that number by splitting the str at '_' and use regex to find it and proceeds to turn it in to a string using .join method.
  */
  const stringSplitID = function (target) {
    const regex = /\D/g;
    const ID = target.id
      .split('_')
      .filter((str) => !regex.test(str))
      .join('');
    return parseInt(ID);
  };

  const constructListColor = function () {
    // Generate a light color for each list
    const symLet = [...'abcdef'];
    console.log(symLet);
    let color = `#`;
    for (let i = 0; i < 4; i++) {
      color += symLet[Math.floor(Math.random() * symLet.length)];
    }
    return color;
  };

  const createList = function () {
    // Declare that there's an empty kanban about to be constructed.
    // ItemCtrl.setKanbanInProgress(true);

    if (ItemCtrl.getSelectedKanban() !== null) {
      isInEditState();
    }
    const color = constructListColor();
    const newList = ListCtrl.constructList(color);
    // Add list to LS
    StorageCtrl.storeList(newList);
    UICtrl.UIconstructList(newList);
    // re-assign event listeners to newly createn items.
    loadEventListeners();
  };

  const addListTitle = function (e, id) {
    document.querySelector(`#${e.target.id}`).addEventListener('keypress', (e) => {
      if (e.keycode === 13 || e.which === 13) {
        const target = e.target;
        const value = toUpperCase(target.value);
        const title = (value.length >= 1) ? value : `List-${id}`;
        ListCtrl.addListTitle(title, id);
        // Add title to list - LS
        StorageCtrl.storeListTitle(title, id);
        UICtrl.UIaddListTitle(title, id);
        // initListTitle(id);
        e.preventDefault();
      }
    });
  };

  const deleteList = function (e) {
    const ID = stringSplitID(e.target);
    console.log(ID);
    const lists = ListCtrl.deleteList(ID);
    StorageCtrl.deleteList(lists);
    const kanbans = ItemCtrl.deleteKanbanFromList(ID);
    StorageCtrl.deleteKanbanFromList(kanbans);
    UICtrl.UIdeleteList(ID);
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

  const enterUpdateTitleState = function (e) {
    const done = e.target.parentNode.children[2];
    const add = e.target.parentNode.children[1];

    add.style.display = 'none';
    done.style.display = 'block';
  };

  const leaveUpdateTitleState = function (e) {
    const done = e.target.parentNode.children[2];
    const add = e.target.parentNode.children[1];

    add.style.display = 'block';
    done.style.display = 'none';
  };

  const updateListTitle = function (e) {
    const list = e.target.parentNode.parentNode;
    const newValue = toUpperCase(e.target.parentNode.firstElementChild.textContent);
    const newTitle = (newValue.length >= 1) ? newValue : `List-${stringSplitID(list)}`
    ListCtrl.updateListTitle(list, newTitle);
    // Update list title - LS
    StorageCtrl.updateListTitle(list, newTitle);
    leaveUpdateTitleState(e);
  };

  const constructEmptyKanban = function (e) {
    // Declare that there's an empty kanban about to be constructed.
    ItemCtrl.setKanbanInProgress(true);

    const target = e.target.parentNode.nextSibling.nextSibling.firstElementChild;
    console.log(target);
    const ID = stringSplitID(target);
    const listColor = ListCtrl.getListColor(e.target.parentNode.parentNode);
    UICtrl.UIconstructEmptyKanban(target.id, listColor, ID);
    // re-assign event listeners to newly createn items.
    loadEventListeners();
  };

  const createKanban = function (e) {
    const kanbanText = e.target.firstElementChild.value;
    const listParent = e.target.parentNode;
    const listParentId = listParent.parentNode.id;
    const correspList = e.target.parentNode.parentNode;
    const correspColor = ListCtrl.getListColor(correspList);
    // Construct Kanban object
    const kanban = ItemCtrl.constructKanban(kanbanText, listParentId, correspColor);
    // Add kanban to LS
    StorageCtrl.storeKanban(kanban);
    // Construct UI Kanban
    UICtrl.UIconstructKanban(listParent, kanban);
    makeDraggable();

    // Declare that there's no longer an empty kanban about to be constructed.
    ItemCtrl.setKanbanInProgress(false);
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

    // Check length of value to determine color
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
    // global variables hack
    let vars = {};

    const draggables = document.querySelectorAll('.item');
    const lists = document.querySelectorAll('.list');

    draggables.forEach((draggable) => {
      draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging');
      });

      draggable.addEventListener('dragend', () => {
        const list = document.querySelector('.dragging').parentNode;
        draggable.classList.remove('dragging');
        const positionUpdate = ItemCtrl.dragSwitch(vars.kanbanObj, list);
        // Update kanban position - LS
        StorageCtrl.dragSwitch(positionUpdate);

        // Make sure there's no duplicate kanbans
        const kanbans = ItemCtrl.removeDuplicate();
        // Make sure there's no duplicate kanbans - LS
        StorageCtrl.removeDuplicate(kanbans);
        const kanbanData = ItemCtrl.getKanbanData();
        kanbanData.kanbans = kanbans;
      });
    });

    lists.forEach((list) => {
      list.addEventListener('dragover', (e) => {
        e.preventDefault();
        vars.afterElement = getDragAfterElement(list, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (vars.afterElement === null || vars.afterElement === undefined) {
          list.lastElementChild.firstElementChild.appendChild(draggable);
          vars.kanbanObj = ItemCtrl.getSwitchItems(draggable, vars.afterElement);
        } else {
          list.lastElementChild.firstElementChild.insertBefore(draggable, vars.afterElement);

          vars.kanbanObj = ItemCtrl.getSwitchItems(draggable, vars.afterElement);
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
    let selectedKanban = ItemCtrl.getSelectedKanban();
    if (selectedKanban === null) {
      const form = e.target.parentNode.nextSibling.nextSibling;
      const kanban = form.parentNode;
      const selected = ItemCtrl.setSelectedKanban(kanban);
      UICtrl.UIenterEditState(id);

      // Submit on enter (hacky fallback for done button)
      document.querySelector(`#${e.target.parentNode.parentNode.id}`).addEventListener('keypress', (e) => {
        if (e.keycode === 13 || e.which === 13) {
          const newText = form.firstElementChild.firstElementChild.value;
          const updatedKanban = ItemCtrl.updateKanban(newText, selected);
          UICtrl.UIupdateKanban(kanban, updatedKanban);

          e.preventDefault();
        }
      });
    }
  };

  const leaveEditState = function (id) {
    
    ItemCtrl.removeSelectedKanban();
    if (id !== undefined) {
      console.log('test')
      UICtrl.UIleaveEditState(id);
    }
  };

  const updateKanban = function (e) {
    const form = e.target.parentNode.parentNode.parentNode.nextSibling.nextSibling;
    const newText = form.firstElementChild.firstElementChild.value;
    const kanban = form.parentNode;
    const selected = ItemCtrl.setSelectedKanban(kanban);
    const updatedKanban = ItemCtrl.updateKanban(newText, selected);
    // Update kanban - LS
    StorageCtrl.updateKanban(updatedKanban);
    UICtrl.UIupdateKanban(kanban, updatedKanban);

    e.preventDefault();
  };

  const deleteKanban = function (e) {
    const kanban = e.target.parentNode.parentNode.parentNode.parentNode;
    UICtrl.UIdeleteKanban(kanban);
    // Delete kanban - LS
    StorageCtrl.deleteKanbanFromStorage(kanban);
    ItemCtrl.deleteKanban(kanban);
    leaveEditState();
  };

  const isInEditState = function () {
    const editForms = document.querySelectorAll('.edit-form');
    editForms.forEach((form) => {
      if (form.style.display != 'none') {
        let id = form.classList[1].charAt(form.classList[1].length - 1);
        UICtrl.UIleaveEditState(id);
      }
    });
    ItemCtrl.removeSelectedKanban();
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

    AppMakeDraggable: function () {
      return makeDraggable();
    },

    AppStringSplitID: function () {
      return stringSplitID();
    },

    AppToUpperCase: function (string) {
      return toUpperCase(string);
    },
  };
})(ListCtrl, ItemCtrl, UICtrl, StorageCtrl);

App.init();

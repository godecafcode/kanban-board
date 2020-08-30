// Storage Controller

// List Controller
const ListCtrl = (function () {
  const List = function (id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
  };

  const listData = {
    lists: [
      // {
      //   id: 0,
      //   name: 'Work',
      //   color: '#94BCE5',
      // },
      // {
      //   id: 1,
      //   name: 'Studies',
      //   color: '#94BCE5',
      // },
    ],
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
      const ID = listData.lists.length;
      const name = `list-${ID}`;
      const color = listColor;
      const list = new List(ID, name, color);
      listData.lists.push(list);
      console.log(listData.lists);
      return list;
    },

    addListTitle: function(target, id) {
      console.log(target.value)
      const ID = parseInt(id);
      const lists = listData.lists;
      lists.forEach(list => {
        if(list.id === ID) {
          list.name = target.value;
        };
      });
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
    kanbans: [
      // { id: 0, parent: 'kanban-0', text: 'Work' },
      // { id: 1, parent: 'kanban-1', text: 'Study' },
    ],
    selectedKanban: null,
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

    constructKanban: function (kanbanText, listParentId, correspColor) {
      const ID = kanbanData.kanbans.length;
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
            <div id="kanban-demo" class="item misc_spread-md">
            <div class="item-header">
              <span id="item-color" class="col"></span>
              <i id="edit" class="material-icons col edit">edit</i>
            </div>
            <div class="item-text">
              <p id="text">${kanban.text}</p>
            </div>
          </div>
            `;
          }
        });
        UIlists += `
        <div id="list-${list.id}" class="list">
        <div class="list-header misc_spread-sm">
          <h1>${list.name}</h1>
          <i class="material-icons add-kanban">add_circle_outline</i>
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
    },

    UIconstructList: function (newList) {
      const list = document.createElement('div');
      list.id = `list-${newList.id}`;
      list.className = 'list';
      list.innerHTML = `
      <div id="list-header_${newList.id}" class="list-header misc_spread-sm">
      <input type="text" name="" id="add-title_${newList.id}" class="add-title" placeholder="Add title">
      <i class="material-icons add-kanban">add_circle_outline</i>
    </div>
    <div class="list-body misc_spread-sm">
      <div id="list-body_${newList.id}" class="list-body_grid">
        <div id="item-1" class="item misc_spread-md">
          <div class="item-header">
            <span id="item-color-demo" class="col" style="background: ${newList.color}"></span>
          </div>
          <form class="form">
            <input type="text" name="" id="kanban-input_${newList.id}" class="kanban-input">
           </form>
        </div>
      </div>
    </div>
      `;

      document.querySelector(UISelectors.board).insertAdjacentElement('beforeend', list);
    },

    UIaddListTitle: function(target, id) {
      const lists = document.querySelectorAll('.list');
      lists.forEach(list => {
        if(list.id.charAt(list.id.length - 1) === id) {
        list.firstElementChild.firstElementChild.remove();
          const h1 = document.createElement('h1');
          h1.id = `list-title_${id}`;
          h1.className = 'list-title';
          h1.textContent = this.toUpperCase(target.value);

          const parentNode = document.querySelector(`#list-header_${id}`);
          const referenceNode = parentNode.lastElementChild;

          parentNode.insertBefore(h1, referenceNode);
          
        }
      })
    },

    UIconstructEmptyKanban: function (target, correspColor) {
      console.log(correspColor);
      const kanban = document.createElement('div');
      kanban.id = `kanban-empty`;
      kanban.className = 'item misc_spread-md';
      kanban.innerHTML = `
      <div class="item-header">
        <span id="item-color" class="col"" style="background: ${correspColor}"></span>
      </div>
      <form class="form">
        <input type="text" name="" id="kanban-input" class="kanban-input">
      </form>
      `;

      document.querySelector(`#${target}`).insertAdjacentElement('beforeend', kanban);
    },

    UIconstructKanban: function (demoParent, kanbanObj) {
      demoParent.remove();
      // ItemCtrl.removeSelectedKanban();
      const kanban = document.createElement('div');
      kanban.id = `kanban-${kanbanObj.id}`;
      kanban.className = 'item misc_spread-md';
      kanban.setAttribute('draggable', 'true');
      kanban.innerHTML = `
      <div class="item-header">
        <span id="item-color" class="col" style="background: ${kanbanObj.color};"></span>
        <i id="edit_${kanbanObj.id}" class="material-icons col edit">edit</i>
      </div>
      <form class="edit-form edit-form_${kanbanObj.id}">
      <div class="edit-grid">
        <input type="text" name="" value="${kanbanObj.text}" id="kanban-input_${kanbanObj.id}" class="kanban-input">
        <button class="edit-button undo"><i id="exit-icon_${kanbanObj.id}" class="material-icons exit-icon">clear</i></button>                        
      </div>
     </form>
      <div id="kanban-text_${kanbanObj.id}" class="item-text">
        <p id="text" class="kanban-text">${kanbanObj.text}</p>
      </div>
      `;

      document.querySelector(`#${kanbanObj.parent}`).insertAdjacentElement('beforeend', kanban);
    },

    UIenterEditState: function (id) {
      document.querySelector(`#edit_${id}`).style.display = 'none';
      document.querySelector(`#kanban-text_${id}`).style.display = 'none';
      document.querySelector(`.edit-form_${id}`).style.display = 'block';
    },

    UIleaveEditState: function (id) {
      document.querySelector(`#edit_${id}`).style.display = 'block';
      document.querySelector(`#kanban-text_${id}`).style.display = 'block';
      document.querySelector(`.edit-form_${id}`).style.display = 'none';
    },

    UIupdateKanban: function (kanban, newKanban) {
      kanban.innerHTML = `
      <div class="item-header">
      <span id="item-color" class="col" style="background: ${newKanban.color};"></span>
      <i id="edit_${newKanban.id}" class="material-icons col edit">edit</i>
    </div>
    <form class="edit-form edit-form_${newKanban.id}">
    <div class="edit-grid">
      <input type="text" name="" value="${newKanban.text}" id="kanban-input_${newKanban.id}" class="kanban-input">
      <button class="edit-button undo"><i id="exit-icon_${newKanban.id}" class="material-icons exit-icon">clear</i></button>                        
    </div>
   </form>
    <div id="kanban-text_${newKanban.id}" class="item-text">
      <p id="text" class="kanban-text">${newKanban.text}</p>
    </div>
      `;

      ItemCtrl.removeSelectedKanban();
    },

    toUpperCase: function(string) {
      const char = string.charAt(0).toUpperCase();
      string = char + string.slice(1, string.length)
  
      return string
    },
  };
})();

// App Controller

const App = (function (ListCtrl, ItemCtrl, UICtrl) {
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
    const id = e.target.id.charAt(e.target.id.length - 1);

    if (e.target.classList.contains('add-kanban')) {
      constructEmptyKanban(e);
    } else if (e.target.classList.contains('edit')) {
      enterEditState(e, id);
    } else if (e.target.classList.contains('exit-icon')) {
      leaveEditState(id);
    } else if (e.target.classList.contains('exit-icon')) {
      leaveEditState(id);
    } else if(e.target.classList.contains('add-title')) {
      addListTitle(e, id);
    }

    e.preventDefault();
  };

  const constructListColor = function () {
    const symLet = ['a', 'b', 'c', 'd', 'e', 'f', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let color = `#94`; // always begin with #94 for a consistant color design.
    for (let i = 0; i < 4; i++) {
      color += symLet[Math.floor(Math.random() * symLet.length)];
    }
    return color;
  };

  const createList = function () {
    if(ItemCtrl.getSelectedKanban() !== null) {
      isInEditState();
    }
    const color = constructListColor();
    const newList = ListCtrl.constructList(color);
    UICtrl.UIconstructList(newList);
    // re-assign event listeners to newly createn items.
    loadEventListeners();      
  };

  const addListTitle = function(e, id) {
    document.querySelector(`#${e.target.id}`).addEventListener('keypress', (e) => {
      if (e.keycode === 13 || e.which === 13) {
        const target = e.target;
        ListCtrl.addListTitle(target, id);
        UICtrl.UIaddListTitle(target, id)

        e.preventDefault();
      }
    });
  };

  const constructEmptyKanban = function (e) {
    const target = e.target.parentNode.nextSibling.nextSibling.firstElementChild;
    const listColor = ListCtrl.getListColor(e.target.parentNode.parentNode);
    UICtrl.UIconstructEmptyKanban(target.id, listColor);
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
    // Construct UI Kanban
    UICtrl.UIconstructKanban(listParent, kanban);
    makeDraggable();
    e.preventDefault();
  };

  const makeDraggable = function() {
    const draggables = document.querySelectorAll('.item');
    const lists = document.querySelectorAll('.list');

    draggables.forEach(draggable => {
      draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging')
      }); 

      draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
      });
    });

    lists.forEach(list => {
      list.addEventListener('dragover', () => {
        console.log('drag over')
      })
    });
  };

  const enterEditState = function (e, id) {
    let selectedKanban = ItemCtrl.getSelectedKanban();
    if (selectedKanban === null) {
      const form = e.target.parentNode.nextSibling.nextSibling;
      const kanban = form.parentNode;
      const selected = ItemCtrl.setSelectedKanban(kanban);
      UICtrl.UIenterEditState(id);
      console.log(id)
      
      // Submit on enter
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
    UICtrl.UIleaveEditState(id);
  };

  const isInEditState = function() {
    const editForms = document.querySelectorAll('.edit-form');
    editForms.forEach(form => {
      if(form.style.display != 'none') {
        let id = form.classList[1].charAt(form.classList[1].length - 1);
        UICtrl.UIleaveEditState(id);        
      }
    });
    ItemCtrl.removeSelectedKanban();
  };

  return {
    init: function () {
      // Get all lists from ListCtrl.getLists
      const lists = ListCtrl.getLists();
      UICtrl.populateBoard(lists);

      loadEventListeners();
    },
  };
})(ListCtrl, ItemCtrl, UICtrl);

App.init();
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
      {
        id: 0,
        name: 'Work',
      },
      {
        id: 1,
        name: 'Studies',
      },
      
    ],
    selectedList: null,
  }

  return {
    getListData: function() {
      return listData;
    },

    getLists: function() {
      return listData.lists;
    },

    // Get corresponding list color to each kanban
    getListColor: function(parentList) {
      // Get the last character from parentList.id and parse the number > id
      parentList = parseInt(parentList.id.charAt(parentList.id.length - 1));
      let color = '';
      listData.lists.forEach(list => {
        if(list.id === parentList) {
          color = list.color;
        }
      });

      return color;
    },

    constructList: function (listColor) {
      const ID = listData.lists.length;
      const name = `list-${ID}`
      const color = listColor;
      const list = new List(ID, name, color);
      listData.lists.push(list);
      console.log(listData.lists)
      return list;
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
      {id: 0, parent: 'kanban-0', text: 'Work'},
      {id: 1, parent: 'kanban-1', text: 'Study'},
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

    constructKanban: function(kanbanText, listParentId, correspColor) {
      const ID = kanbanData.kanbans.length;
      const color = correspColor;
      const newKanban = new Kanban(ID, listParentId, color, kanbanText)
      kanbanData.kanbans.push(newKanban);
      console.log(newKanban)
      return newKanban;
    } 
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
    
    populateBoard: function(lists) {
      const kanbans = ItemCtrl.getKanbans();
      let UIlists = '';

      lists.forEach(list => {
        let items = '';
        kanbans.forEach(kanban => {
          let parent = Number(kanban.parent.charAt(kanban.parent.length - 1));
          if(parent === list.id) {
            items += `
            <div id="kanban-demo" class="item misc_spread-md">
            <div class="item-header">
              <span id="item-color" class="col"></span>
              <i id="reload" class="material-icons col">refresh</i>
            </div>
            <div class="item-text">
              <p id="text">${kanban.text}</p>
            </div>
          </div>
            `;
          }
        })
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
      })

      document.querySelector(UISelectors.board).innerHTML += UIlists;
    },

    UIconstructList: function(newList) {
      const list = document.createElement('div');
      list.id = `list-${newList.id}`;
      list.className = 'list';
      list.innerHTML = `
      <div class="list-header misc_spread-sm">
      <h1>List ${newList.id}</h1>
      <i class="material-icons add-kanban">add_circle_outline</i>
    </div>
    <div class="list-body misc_spread-sm">
      <div id="list-body_${newList.id}" class="list-body_grid">
        <div id="item-1" class="item misc_spread-md">
          <div class="item-header">
            <span id="item-color-demo" class="col" style="background: ${newList.color}"></span>
            <i id="reload" class="material-icons col">refresh</i>
          </div>
          <form class="form">
            <input type="text" name="" id="kanban-input">
           </form>
        </div>
      </div>
    </div>
      `;

      document.querySelector(UISelectors.board).insertAdjacentElement('beforeend', list);
    },

    UIconstructEmptyKanban: function(target, correspColor) {
      console.log(correspColor);
      const kanban = document.createElement('div');
      kanban.id = `kanban-empty`;
      kanban.className = 'item misc_spread-md';
      kanban.innerHTML = `
      <div class="item-header">
        <span id="item-color" class="col"" style="background: ${correspColor}"></span>
        <i id="reload" class="material-icons col">refresh</i>
      </div>
      <form class="form">
        <input type="text" name="" id="kanban-input">
      </form>
      `;


      document.querySelector(`#${target}`).insertAdjacentElement('beforeend', kanban);
    },

    UIconstructKanban: function(demoParent, kanbanObj) {
      demoParent.remove();
      const kanban = document.createElement('div');
      kanban.id = `kanban-${kanbanObj.id}`;
      kanban.className = 'item misc_spread-md';
      kanban.innerHTML = `
      <div class="item-header">
        <span id="item-color" class="col" style="background: ${kanbanObj.color};"></span>
        <i id="reload" class="material-icons col">refresh</i>
      </div>
      <div class="item-text">
        <p id="text" class="kanban-text">${kanbanObj.text}</p>
      </div>
      `;

     
      document.querySelector(`#${kanbanObj.parent}`).insertAdjacentElement('beforeend', kanban);
    }
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
    forms.forEach(form => {
      console.log(form)
      form.addEventListener('submit', createKanban);
    });

    // Add Kanban through header button
    const addKanbanButtons = document.querySelectorAll(selectors.addKanban);
    addKanbanButtons.forEach(button => {
      button.addEventListener('click', constructEmptyKanban);
    })

    // Double click to change kanban text
    const kanbanText = document.querySelectorAll(selectors.kanbanText);
    kanbanText.forEach(text => {
      text.addEventListener('dblclick', changeKanbanText);
    });

  };

  const constructListColor = function() {
    const symLet = ['a','b','c','d','e','f',0,1,2,3,4,5,6,7,8,9];
    let color = `#94`; // always begin with #94 for a consistant color design.
    for (let i = 0; i < 4; i++) {
      color += symLet[Math.floor(Math.random() * symLet.length)]
    }
    return color
  };

  const createList = function () {
    const color = constructListColor();
    const newList = ListCtrl.constructList(color);
    UICtrl.UIconstructList(newList);
    // re-assign event listeners to newly createn items.
    loadEventListeners();
  };

  const constructEmptyKanban = function(e) {
    const target = e.target.parentNode.nextSibling.nextSibling.firstElementChild;
    const listColor = ListCtrl.getListColor(e.target.parentNode.parentNode);
    console.log(`list color: ${listColor}`) // Check if color is returned properly
    UICtrl.UIconstructEmptyKanban(target.id, listColor);
    // re-assign event listeners to newly createn items.
    loadEventListeners();
  }

  const createKanban = function (e) {
    const kanbanText = e.target.firstElementChild.value;
    const listParent = e.target.parentNode;
    const listParentId = listParent.parentNode.id;
    const correspList = e.target.parentNode.parentNode;
    const correspColor = ListCtrl.getListColor(correspList);
    // Construct Kanban object
    const kanban = ItemCtrl.constructKanban(kanbanText, listParentId, correspColor);
    // Construct UI Kanban
    UICtrl.UIconstructKanban(listParent, kanban)
    e.preventDefault();
  };

  const changeKanbanText = function(e) {
    
  }

  return {
    init: function () {

      // Get all lists from ListCtrl.getLists
      const lists = ListCtrl.getLists();
      UICtrl.populateBoard(lists)






      loadEventListeners();
    },
  };
})(ListCtrl, ItemCtrl, UICtrl);

App.init();

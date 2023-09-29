// отрисовка формы для заполнения
let newClient = {};
let contList = [];
let dir = false;
let key = "id";

//работа с сервером
//функция получения клиентов, запрос на просмотр сервера еслть ли там данные
async function serverGetClient() {
  let response = await fetch("http://localhost:3000/api/clients", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  let data = await response.json();
  return data;
}
//в переменную помещаем результат функции получения клиентов с сервера
let serverList = await serverGetClient();
let clientsList = [];
//если сервер не пустой то помещаем его содержимое в переменноую clientsList
if (serverList !== null) {
  clientsList = serverList;
}
//функция добавления клиента на сервер
async function serverAddClient(newClients) {
  let response = await fetch("http://localhost:3000/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newClients),
  });
  //let data = await response.json();
  return response;
}

//функция ИЗМЕНЕНИЯ клиента на сервере
async function serverCorrectClient(correctClient, id) {
  let response = await fetch("http://localhost:3000/api/clients/" + id, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(correctClient),
  });
  //let data = await response.json();
  return response;
}

//функция удаления клиента с сервера
async function serverDeleteClient(id) {
  let response = await fetch("http://localhost:3000/api/clients/" + id, {
    method: "DELETE",
  });
  //let data = await response.json();
  return response;
}
//находим блок заднего фона при открытом модальном окне
//и прописываем функцию включения этого блока
const overlay = document.querySelector(".overlay");
function openModal() {
  overlay.style.display = "block";
}
//функция отключения фона при открытом модальном окне
function modalClose() {
  overlay.style.display = "none";
}
//функция СОЗДАЕТ клиента и формирует его в нужный объект и
//после при необходимости добавляем его в массив
const surname = document.querySelector("#inputSurname");
const name = document.querySelector("#inputName");
const lastName = document.querySelector("#inputLastName");
const boxSaveCont = document.querySelector("#boxSaveCont");
const boxChangeSaveCont = document.querySelector("#boxChangeSaveCont");
async function getClientsItem() {
  let done;
  let surNameValue = document.querySelector("#inputSurname").value;
  let nameValue = document.querySelector("#inputName").value;
  let lastNameValue = document.querySelector("#inputLastName").value;
  let contactsAll = boxSaveCont.querySelectorAll(".box-cont__item");
  let contact = [];
  let objCont;
  //создаем объект contacts, который будет вложет в каждый объект клиента
  //берем весь блок с контактами, проходимся по нему и создаем объекты на каждый контакт
  contactsAll.forEach(function (elem) {
    let buttonCont = elem.querySelector(".box-cont__btn");
    let inputCont = elem.querySelector(".box-cont__input");
    let buttonText = buttonCont.innerText;
    let inputValue = inputCont.value;
    objCont = { type: buttonText, value: inputValue };
    contact.push(objCont);
  });
  //создаем новый объект клиента
  newClient = {
    name: nameValue,
    surname: surNameValue,
    lastName: lastNameValue,
    contacts: contact,
  };
  //в переменную приравниваем результат функции добавления клиента на сервер
  let servDataObj = await serverAddClient(newClient);
  const elemError = document.querySelector("#formError");
  const elemErrorNot = document.querySelector("#formErrorNot")
  done = cathResponse(servDataObj, elemError, elemErrorNot);
  console.log(done);
  if (done === true) {
    boxCont.innerHTML = "";
    boxSave.innerHTML = "";
    //вызываем рендер, почему то не работает или рендер принимает объект со старыми данными??
    //а почему со старыми не понимаю
    let formNew = document.querySelector("#formNew");
    formNew.style.display = "none";
    document.body.classList.remove("stop-scroll");
    modalClose();
    renderAllClients(clientsList);//!!!!!!!!!!!РЕНДЕР ПОЧЕМУ ТО НЕ РАБОТАЕТ!!!!!
    //в клиентЛист добавляем сохраненного нового клиента
    clientsList.push(servDataObj);
    //очищаем инпуты с данными
    surname.value = "";
    name.value = "";
    lastName.value = "";
  }
}
//функция для ИЗМЕНЕНИЯ клиента и отправки изменений на сервак

async function correctClientsItem(id) {
  let closeModalOne;
  let surNameChangeValue = document.querySelector("#inputChangeSurname").value;
  let nameChangeValue = document.querySelector("#inputChangeName").value;
  let lastNameChangeValue = document.querySelector("#inputChangeLastName").value;
  let contactsAll = boxChangeSaveCont.querySelectorAll(".box-cont__item");
  let contact = [];
  let objCont;
  //создаем объект contacts, который будет вложет в каждый объект клиента
  //берем весь блок с контактами, проходимся по нему и создаем объекты на каждый контакт
  contactsAll.forEach(function (elem) {
    let buttonCont = elem.querySelector(".box-cont__btn");
    let inputCont = elem.querySelector(".box-cont__input");
    let buttonText = buttonCont.innerText;
    let inputValue = inputCont.value;
    objCont = { type: buttonText, value: inputValue };
    contact.push(objCont);
  });
  //создаем новый объект клиента
  let correctClient = {
    name: nameChangeValue,
    surname: surNameChangeValue,
    lastName: lastNameChangeValue,
    contacts: contact,
  };
  //в переменную приравниваем результат функции добавления клиента на сервер
  const response = await serverCorrectClient(correctClient, id);
  const elemError = document.querySelector("#formChangeError");
  const elemErrorNot = document.querySelector("#formChangeErrorNot")
  closeModalOne = cathResponse(response, elemError, elemErrorNot);
  //в клиентЛист добавляем сохраненного нового клиента
  //очищаем инпуты с данными
  surname.value = "";
  name.value = "";
  lastName.value = "";
  //
  if (closeModalOne === true) {
    formChange.style.display = "none";
    document.body.classList.remove("stop-scroll");
    modalClose();
    renderAllClients(clientsList); //!!!!!!!!!!!!!рендер почемуто снова не работает!!!!!!!!!
  };
}
//функция приводит дату в нужный вид
function correctionDate(objDate) {
  const date = `${("0" + objDate.getDate()).slice(-2)}.${(
    "0" +
    (objDate.getMonth() + 1)
  ).slice(-2)}.${objDate.getFullYear()}`;
  return date;
}
//функция приводит время в нужный вид
function correctionTime(objDate) {
  const time = `${("0" + objDate.getHours()).slice(-2)}:${(
    "0" + objDate.getMinutes()
  ).slice(-2)}`;
  return time;
}
//функция создания выпадающкго списка с элементами Тайп
let listItems = ["Доп. телефон", "Email", "Vk", "Facebook"];
let listItemElement = [];
function allType(ul) {
  //это все отрисовка кнопки с выподающим окном
  listItems.forEach(function (item) {
    //помещаем в выподающее окно все контакты
    let listItem = document.createElement("li");
    listItem.classList.add("dropdown__points");
    listItem.textContent = item;
    ul.appendChild(listItem); //добавляем каждый элемент в UL
    listItemElement.push(listItem); //добавляем каждый элемент в массив
    return ul, listItem;
  });
}
//функция отключает активный класс с выпадаючего окна если клик не по нему
function disablingActive() {
  document.addEventListener("click", function (event) {
    const targetElement = event.target;
    if (!targetElement.classList.contains("box-cont__btn")) {
      const elementToRemoveClass = document.querySelector(
        ".dropdown__list--active"
      );
      const elementToRemoveClassTwo = document.querySelector(
        ".box-cont__btn-active"
      );

      if (elementToRemoveClass) {
        elementToRemoveClass.classList.remove("dropdown__list--active");
        elementToRemoveClassTwo.classList.remove("box-cont__btn-active");
      }
    }
  });
}
//функция отрисовки клиента получает в аргумент ОБЪЕКТ с данными клиента
function getClientItem(clientObj) {
  const tr = document.createElement("tr");
  tbody.append(tr);
  //обозначаем как должен выглядеть объект с клиентом
  const {
    id,
    name,
    surname,
    lastName,
    createdAt,
    updatedAt,
    contacts = [],
  } = clientObj;
  //в первый столбец отрисовываем id
  const tdId = document.createElement("td");
  tdId.classList.add("tbody__td", "tbody__td--grey");
  tdId.textContent = id;
  tr.append(tdId);
  //во второй столбец вносим ФИО
  const fullName = `${surname} ${name} ${lastName}`;
  const tdFullName = document.createElement("td");
  tdFullName.classList.add("tbody__td", "tbody__td--black", "mw-240");
  tdFullName.textContent = fullName;
  tr.append(tdFullName);
  //в третий столбец вносим дату и время
  function createdDate(date) {
    const createdDate = new Date(date);
    const formattedCreatedDate = correctionDate(createdDate);
    const formattedCreatedTime = correctionTime(createdDate);
    const tdCreatedDate = document.createElement("td");
    const spanTime = document.createElement("span");
    spanTime.classList.add("tbody__td--grey");
    spanTime.textContent = ` ${formattedCreatedTime}`;
    tdCreatedDate.classList.add("tbody__td", "tbody__td--black");
    tdCreatedDate.textContent = `${formattedCreatedDate} `;
    tdCreatedDate.append(spanTime);
    tr.append(tdCreatedDate);
  }
  createdDate(createdAt);
  //в четверный столбец вносим дату и время
  createdDate(updatedAt);
  //функция определения значка контакта type
  let svgType;
  function styleType(type) {
    if (type === "Email") {
      svgType = `<svg id="mail" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="mail">
        <path id="Subtract" opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"></path>
        </g>
       </svg>`;
    } else if (type === "Vk") {
      svgType = `<svg id="vk" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="vk" opacity="0.7">
        <g id="vk_2">
        <path id="Vector" d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"></path>
        </g>
        </g>
       </svg>`;
    } else if (type === "Facebook") {
      svgType = `<svg id="fb" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="fb" opacity="0.7">
        <path id="fb_2" d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"></path>
        </g>
       </svg>`;
    } else if (type === "Телефон") {
      svgType = `<svg id="phone" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="phone" opacity="0.7">
        <circle id="Ellipse 34" cx="8" cy="8" r="8" fill="#9873FF"></circle>
        <path id="Vector" d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"></path>
        </g>
       </svg>`;
    } else {
      svgType = `<svg id="contacts" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="mail">
      <path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"></path>
      </g>
     </svg>`;
    }
    return svgType;
  }
  //создаем необходимые элементы и стилизуем их с помошью классов
  const modalDelClient = document.querySelector("#boxDelete");
  const tdContacts = document.createElement("td");
  tdContacts.classList.add("p-relative", "tbody__td", "tbody__td--black");
  const ulContacts = document.createElement("ul");
  ulContacts.classList.add("list-reset", "tbody__ul-contacts");
  const ulOneContacts = document.createElement("ul");
  ulOneContacts.classList.add("list-reset", "d-none");
  tdContacts.append(ulContacts);
  tdContacts.append(ulOneContacts);
  let hiddenList = [];
  let visibleList = [];
  let allLi = [];
  let btnContacts = document.createElement("button");
  //let previousContent = "";
  //проходимся функцией мап по всем контактам подбираем им нужную
  //картинку и устанавливаем тултип с контактами
  contacts.map(function (contact) {
    const liContact = document.createElement("li");
    liContact.classList.add("tbody__li-contacts");
    const btnTippy = document.createElement("button");
    btnTippy.classList.add("btn-reset", "tbody__btn-cotact");
    const spanTippy = document.createElement("span");
    spanTippy.classList.add("tbody__btn-span");
    const spanArrow = document.createElement("span");
    spanArrow.classList.add("tbody__btn-arrow");
    spanArrow.innerHTML = `<svg width="10" height="10">
    <polygon points="1,9 9,9 5,1" fill="#333"></polygon>
    </svg>`;
    spanTippy.innerHTML = contact.value;
    //копируем содержимре тултипа при клике на него
    spanTippy.addEventListener("click", function () {
      let text = spanTippy.innerText;
      navigator.clipboard.writeText(text);
      spanTippy.style.display = "none";
      spanArrow.style.display = "none";
    });
    btnTippy.innerHTML = styleType(contact.type);
    allLi.push(liContact);
    
    ulContacts.append(liContact);
    liContact.append(btnTippy);
    btnTippy.append(spanTippy);
    btnTippy.append(spanArrow);
  });
  //устанавливаем кнопку на контакты которые скрыты
  //если контактов больше 5 переносим их в новый скрытый список и на последний элемент ставим кнопку
  if (ulContacts.children.length > 5) {
    hiddenList = allLi.slice(4);
    visibleList = allLi.slice(0,4);
    ulContacts.innerHTML = "";
  } else {
    visibleList = allLi;
  };
  visibleList.map((elem) => {
    ulContacts.append(elem);
  });
  if (hiddenList.length !==0) {
    hiddenList.map((elem) => {
      ulOneContacts.append(elem);
    });
    let childCount = ulOneContacts.childElementCount;
    let liNew = document.createElement("li");
    liNew.classList.add("tbody__li-contacts");
    liNew.style.paddingBottom = "6px";
    btnContacts.classList.add("btn-reset", "tbody__btn-cont");
    btnContacts.innerHTML = `+${childCount}`;
    liNew.append(btnContacts);
    ulContacts.append(liNew);
    btnContacts.addEventListener("click", function () {
      ulOneContacts.classList.add("tbody__ul-contacts");
      ulContacts.style.marginBottom = "5px";
      liNew.remove();
      let ferstElem = ulOneContacts.querySelector("li");
      ulContacts.append(ferstElem);
    });
  };
  tr.append(tdContacts);
  //в шестую колонку помнщаем 2 кнопки, изменить и удалить
  const tdAction = document.createElement("td");
  const btnGrup = document.createElement("div");
  btnGrup.classList.add("btn-grup");
  tdAction.classList.add("tbody__td", "tbody__td--black");
  const btnChange = document.createElement("button");
  btnChange.classList.add("btn-grup__btn");
  btnChange.classList.add("btn-reset");
  const btnDel = document.createElement("button");
  btnDel.classList.add("btn-reset", "btn-grup__btn-red");
  const svgChange = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <g opacity="0.7" clip-path="url(#clip0_216_219)">
        <path d="M2 11.5002V14.0002H4.5L11.8733 6.62687L9.37333 4.12687L2 11.5002ZM13.8067 4.69354C14.0667 4.43354 14.0667 4.01354 13.8067 3.75354L12.2467 2.19354C11.9867 1.93354 11.5667 1.93354 11.3067 2.19354L10.0867 3.41354L12.5867 5.91354L13.8067 4.69354Z" fill="#9873FF"></path>
      </g>
      <defs>
        <clipPath id="clip0_216_219">
          <rect width="16" height="16" fill="white"></rect>
        </clipPath>
      </defs>
    </svg>`;
  const svgDel = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <g opacity="0.7" clip-path="url(#clip0_216_224)">
        <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#F06A4D"></path>
      </g>
      <defs>
        <clipPath id="clip0_216_224">
          <rect width="16" height="16" fill="white"></rect>
        </clipPath>
      </defs>
    </svg>`;
  btnChange.innerHTML = `${svgChange} Изменить`;
  btnDel.innerHTML = `${svgDel} Удалить`;
  btnGrup.append(btnChange, btnDel);
  tdAction.append(btnGrup);
  tr.append(tdAction);
  //ИЗМИНЕНИЕ клиента
  const formChange = document.querySelector("#formChange");
  const spanId = document.querySelector("#idClientChange");
  btnChange.addEventListener("click", function (event) {
    let row = event.target.parentNode.parentNode.parentNode; //это мы поместили всю строку в переменную
    let thisId = clientObj.id; //взяли id объекта который будем менять
    formChange.style.display = "block";
    document.body.classList.add("stop-scroll"); //заморажываем боди
    openModal(); //затемняем фон на боди
    spanId.innerHTML = ` ID:${id}`; //добавлемем ID в заголовок
    //вносим данные ФИО в форму
    const inputChangeSurname = document.querySelector("#inputChangeSurname");
    const inputChangeName = document.querySelector("#inputChangeName");
    const inputChangeLastName = document.querySelector("#inputChangeLastName");
    inputChangeSurname.value = surname;
    inputChangeSurname.placeholder = "";
    inputChangeName.value = name;
    inputChangeName.placeholder = "";
    inputChangeLastName.value = lastName;
    inputChangeLastName.placeholder = "";
    //вносим данные контактов в форму
    if (contacts === []) {
      return; //если контакты пусты, возвращаем без действий
    } else {
      //если нет, то создаем список
      let boxChangeSaveCont = document.querySelector("#boxChangeSaveCont");
      let ul = document.createElement("ul");
      ul.classList.add("list-reset")
      boxChangeSaveCont.append(ul);
      boxChangeSaveCont.style.padding = "25px 30px"; //даем стили боксу
      //////////////////думаю тут нужно создавать функцию добавления и использовать ееже и при
      ///////////////добавлении клиента, нет не подходящее место
      contacts.forEach(function (contact) {
        //берем массив и проходимся по каждому контакту
        let li = document.createElement("li"); //для каждого контакта создаем элемент списка
        li.classList.add("box-cont__item"); //стили элементу списка
        ul.append(li); //помещаем элементв списка в список
        let btn = document.createElement("button"); //создаем кнопку
        btn.classList.add("btn-reset", "box-cont__btn", "dropdown"); //даем стили кнопке
        btn.textContent = contact.type; //тексКонтент кнопке
        li.append(btn); //помещаем кнопку в элемент списка
        let input = document.createElement("input"); //создаем инпут контакта
        input.classList.add("box-cont__input"); //стилизуем инпут
        //input.setAttribute("type", contact.type);//задаем атрибут тайп
        input.value = contact.value; //помещаем содержание тайп
        let btnClose = document.createElement("button"); //создаем кнопку удаления контакта
        li.append(input, btnClose); //помещаем инпут и кнопку в елемент списка
        btnClose.classList.add("box-cont__btn-close", "btn-reset"); //стилизуем кнопку
        btnClose.addEventListener("click", function () {
          //вешаем слушатель на кнопку удаления
          li.remove(); //при клике удаляем строку
          if (ul.childElementCount > 0) {
            //если элементы списка остаются в списке ничего не делаем
            return;
          } else {
            //если список пуст убираем паддинги чтоб бокс захлопнулся
            boxSaveCont.style.padding = "0";
          }
        });
        let dropdownUl = document.createElement("ul"); //создаем список для выпадающего окна для выбора тайп
        dropdownUl.classList.add("dropdown__list", "list-reset"); //задаем стили выпадающему окну
        dropdownUl.style.top = "36px";
        dropdownUl.style.left = "0";
        //функция задает атрибут тайп элементу инпут
        function createdType(btn) {
          if (btn.textContent === "Доп. телефон") {
            input.setAttribute("type", "tel");
          } else if (btn.textContent === "Email") {
            input.setAttribute("type", "email");
          } else if (btn.textContent === "Телефон") {
            input.setAttribute("type", "tel");
          } else {
            input.setAttribute("type", "text");
          }
        }
        //вешаем слушатель на кнопку ТАЙП с выподающим списком!!
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          if (dropdownUl.childNodes.length > 0) {
            //если элементы в выпадающем списке уже созданы
            dropdownUl.innerHTML = ""; //то зачищаем его
            listItemElement = [];
          }
          allType(dropdownUl); //создаем выпадающий список
          btn.append(dropdownUl); //в кнопку помещаем выпадающий список
          dropdownUl.classList.toggle("dropdown__list--active"); //включаем/выключаем активный класс выпадающего списка
          btn.classList.toggle("box-cont__btn-active"); //включаем/выключаем активный класс кнопки
          let dropdownUlItem = dropdownUl.querySelectorAll(".dropdown__points"); //находим все элементв созданные в выпадающем окне
          dropdownUlItem.forEach(function (item) {
            //проходимся по всем элементам окна
            item.classList.add("dropdown__points-change");
            item.addEventListener("click", function () {
              //и вешаем на них событие при клике
              let textContent = item.textContent; //текстКонтент кликаеваемого элемента
              btn.textContent = textContent; //перемещается в текстКонтент кнопки
              createdType(btn);
            });
          });
          //функция отключения выпадающего окна
          disablingActive();
        });
        //нужно задать атрибутТейп на все инпуты блока
        let liAll = ul.querySelectorAll("li");
        liAll.forEach(function (item) {
          let type = item.querySelector(".box-cont__btn");
          createdType(type);
        });
      });
    }
    //настройка кнопки ДОБАВИТЬ КОНТАКТ
    const boxChangeSave = document.querySelector("#boxChangeSaveCont");
    const boxChangeCont = document.querySelector(".formChange__box-cont");
    const addContChange = document.querySelector("#addContChange");
    const ulChangeCont = boxChangeSave.querySelector("ul");
    ulChangeCont.classList.add(".list-reset");
    addContChange.addEventListener("click", function (e) {
      e.preventDefault();
      actionsAddCont (boxChangeCont, boxChangeSave, ulChangeCont);
    });
    //настройка кнопки СОХРАНИТЬ (скрываю старую кнопку в форме и на ее место ставлю
    //вновь созданную)
    let btnChangeSave = document.querySelector("#saveClientChange");
    btnChangeSave.addEventListener("click", function (e) {
      e.preventDefault();
      correctClientsItem(thisId);
      /*const elemError = document.querySelector("#formChangeError");
      const elemErrorNot = document.querySelector("#formChangeErrorNot")
      cathResponse(response, elemError, elemErrorNot);*/
      /*if (closeModalOne === true) {
        formChange.style.display = "none";
        document.body.classList.remove("stop-scroll");
        modalClose();
        renderAllClients(clientsList); //рендер почемуто снова не работает!!!!!!!!!
      }*/
    });
    //настнойка кнопки УДАЛИТЬ КЛИЕНТА
    const btnDelClient = document.querySelector("#cancellationClientChange")
    btnDelClient.addEventListener("click", async function () {
      await serverDeleteClient(thisId); //удаляем клиента из сервера
      formAddClient.style.display = "none"; //скрываем модальное окно
      document.body.classList.remove("stop-scroll"); //отключаем стоп на скролл
      row.remove(); //удаляем строку из таблицы
      modalClose(); //закрываем модальное окно
    });
    //при закрытии формы изменения возвращаем форму в обратный вид
    const formChangeClose = document.querySelector("#formChangeNewClose");
    formChangeClose.addEventListener("click", function (e) {
      e.preventDefault();
      closeFormChange();
      thisId = "";
    });
  });
  //переходим к УДВЛЕНИЮ клиента
  // открываем окно с подтверждением удаления клиента,
  let thisId = "";
  let row;
  btnDel.addEventListener("click", function (event) {
    modalDelClient.style.display = "block";
    openModal();
    document.body.classList.add("stop-scroll");
    row = event.target.parentNode.parentNode.parentNode; //это мы поместили всю строку в переменную
    thisId = clientObj.id; //взяли id для удаления с сервера
  });
  //функция скрытия модального окна
  function closeModal(btn, modal) {
    btn.addEventListener("click", function () {
      const elemErrorDel = document.querySelector("#formDeleteErrorNot");
      elemErrorDel.classList.remove("form__error--active");
      thisId = "";
      row = "";
      modal.style.display = "none";
      document.body.classList.remove("stop-scroll");
      modalClose();
    });
  }
  //скрываем модальное окно при клике на крестик
  const deleteClose = modalDelClient.querySelector(".delete__close");
  closeModal(deleteClose, modalDelClient);
  //скрываем модал при клике на отмену
  const deleteCancellation = modalDelClient.querySelector(
    ".delete__btn-cancellation"
  );
  closeModal(deleteCancellation, modalDelClient);
  //удаляем клиента
  const btnDeleteClient = modalDelClient.querySelector(".delete__btn-delete");
  btnDeleteClient.addEventListener("click", async function (e) {
    e.preventDefault();
    const response = await serverDeleteClient(thisId); //удаляем клиента из сервера
    const elemErrorDel = document.querySelector("#formDeleteErrorNot");
    cathResponse(response, elemErrorDel, elemErrorDel);
    if (!elemErrorDel.classList.contains(".form__error--active")) {
      return
    };
    modalDelClient.style.display = "none"; //скрываем модальное окно
    document.body.classList.remove("stop-scroll"); //отключаем стоп на скролл
    row.remove(); //удаляем строку из таблицы
    modalClose(); //закрываем модальное окно
  });
  return tr;
} //клнец функции отрисовки клиента
//функция вывода ОШИБКИ при ошибке работы с сервером
function cathResponse(response, elemError, elemErrorNot) {
  const status = response.status
  if (status >= 0 && status <= 399) {
    return true
  };
  if (status >= 400 && status <= 499) {
    elemError.classList.add("form__error--active");
    return false
  };
  if (status >=500 && status <=599) {
    elemError.classList.add("form__error--active");
    return false
  };
  if(typeof status !== 'number') {
    elemErrorNot.classList.add("form__error--active");
    return false
  };
  if(typeof errorText === 0) {
    elemErrorNot.classList.add("form__error--active");
    return false
  };

  /*if(errorText.textContent !== 0) return true
  else return false*/
}
//функция закрывает модальное окно ИЗМЕНЕНИЙ
function closeFormChange() {
  const boxChangeCont = document.querySelector(".formChange__box-cont");
  const formChangeError = document.querySelector("#formChangeError");
  const formChangeErrorNot = document.querySelector("#formChangeErrorNot");
  const formDeleteErrorNot = document.querySelector("#formDeleteErrorNot");
  formChangeError.classList.remove("form__error--active");
  formChangeErrorNot.classList.remove("form__error--active");
  formDeleteErrorNot.classList.remove("form__error--active");
  boxChangeCont.innerHTML = "";
  boxChangeCont.style.padding = 0;
  formChange.style.display = "none";
  document.body.classList.remove("stop-scroll"); //разморажываем боди
  modalClose(); //отключаем фон на боди
  boxChangeSaveCont.innerHTML = "";
  row = "";
};
// функция вывода всех клиентов в таблицу
const tbody = document.querySelector("#tbody");
//функция рендер принимает в аргумент клиентЛист отрисовывает всех клиентов в таблице
function renderAllClients(clientsList) {
  //создаем копию листа клиентов
  let copyList = [...clientsList];
  //перед тем как производить работу очищаем тиБади
  tbody.innerHTML = "";
  //создадим еще один ключь в объекте для фильтрации
  //где будут собраны в одну строку id fio
  for (const item of copyList) {
    item.filter = `${item.id} ${item.surname} ${item.name} ${
      item.lastName
    } ${correctionDate(new Date(item.createdAt))}`;
  }
  //это функция для сортировки
  let headerTr = document.querySelector(".table__tr");
  let headerTh = headerTr.querySelectorAll("th");
  //проходимся по всем столбцам заголовков и вещаем на них слушатель КЛИК
  headerTh.forEach(function (item) {
    item.addEventListener("click", function (event) {
      let clickedElement = event.target; //в переменную помещаем элемент по которому был клик
      if (clickedElement === headerTh[0]) {
        //и прописываем условия если для того чтоб менять переменную key
        key = "id";
      } else if (clickedElement === headerTh[1]) {
        key = "surname";
      } else if (clickedElement === headerTh[2]) {
        key = "createdAt";
      } else if (clickedElement === headerTh[3]) {
        key = "updatedAt";
      }
    });
  });
  //в переменной копиЛист сразу сортируем весь список
  copyList = sortUsers(copyList, key, dir);
  //выполним фильтрацию
  let inputSearch = document.querySelector("#inputSearch").value;
  if (inputSearch !== "") {
    copyList = filter(copyList, "filter", inputSearch);
  }
  //и добавляем каждого клиента в таблицу с помощью функции отрисовки одного клинта
  copyList.forEach((client) => {
    tbody.append(getClientItem(client));
  });
}
//вызываем функцию рендер
renderAllClients(clientsList);
//находим кнопку добавить клиента
const btnAdd = document.querySelector("#addClient");
const formAddClient = document.querySelector("#formNew");
const formAddClose = document.querySelector("#formNewClose");
const saveClient = document.createElement("button");
const cancellationClient = document.createElement("button");
//обработчики на кнопку "добавить клиента" открываем модальное окно с добалением клиента
btnAdd.addEventListener("click", function () {
  formAddClient.style.display = "block";
  document.body.classList.add("stop-scroll");
  openModal();
  let btnBox = document.querySelector(".form__box-bottom");
  if (btnBox.children.length > 0) {
    return;
  } else {
    boxSaveCont.style.padding = 0;
    saveClient.classList.add("form__save-btn", "btn-reset");
    saveClient.id = "saveClient";
    saveClient.textContent = "Сохранить";
    btnBox.append(saveClient);
    cancellationClient.classList.add("form__cancellation-btn", "btn-reset");
    cancellationClient.id = "cancellationClient";
    cancellationClient.textContent = "Отменить";
    btnBox.append(cancellationClient);
  }
});
//закрываем окно "новый клиент" слушатель на кнопку закрыть окно
function closeForm() {
  formAddClient.style.display = "none";
  document.querySelector("#boxDelete").style.display = "none";
  document.body.classList.remove("stop-scroll");
  modalClose();
  saveClient.remove();
  cancellationClient.remove();
  boxCont.innerHTML = "";
  boxCont.style.padding = "0";
  const elemError = document.querySelector("#formError");
  const elemErrorNot = document.querySelector("#formErrorNot");
  elemError.classList.remove("form__error--active");
  elemErrorNot.classList.remove("form__error--active");
};
formAddClose.addEventListener("click", function (e) {
  e.preventDefault();
  closeForm();
  clearing();
});
const divOverlay = document.querySelector(".overlay")
divOverlay.addEventListener("click", function(event) {
  if (event.target !== formAddClient) {
    closeForm();
    clearing();
    closeFormChange();
  }
});
//закрытие модальных окон на ESC
document.addEventListener('keyup', function(event) {
  if (event.key === "Escape") {
    closeForm();
    clearing();
    closeFormChange();
  }
});
//обработчик на кнопку "добавить контакт" и отрисовка инпутов под добавление контактов
const addCont = document.querySelector("#addCont");
const boxCont = document.querySelector(".form__box-cont");
const boxSave = document.querySelector(".form__save-cont");
//функция действий кнопки ДОБАВИТЬ КОНТАКТ
function actionsAddCont (boxCont, boxSave, ulCont) {
  if (boxCont.childElementCount > 0) {
    let boxContInput = boxCont.querySelector("input");
    //если инпут заполнен, то при новом клике на добавление контакта
    //все поле отправляется в новый блок boxSave
    let liCont = boxContInput.closest(".box-cont__item");
    if (boxContInput.value !== "") {
      boxSave.style.padding = "25px 30px";
      let btnClose = document.createElement("button");
      btnClose.classList.add("box-cont__btn-close", "btn-reset");
      btnClose.addEventListener("click", function () {
        liCont.remove();
        if (ulCont.childElementCount > 0) {
          return;
        } else {
          boxSave.style.padding = "0";
        }
      });
      liCont.append(btnClose);
      ulCont.append(liCont);
      boxSave.append(ulCont);
      boxCont.style.padding = "0";
    } else if (boxContInput.value === "") {
      boxCont.style.padding = "25px 30px";
      return;
    }
    const boxSaveBtn = boxSave.querySelectorAll(".box-cont__btn");
    boxSaveBtn.forEach(function (btn) {
      btn.disabled = true;
    });
    //если из блока добавления li ушел в блок сохранения, то выполняем
    //создание нового li, чтоб запонить его еще какими либо контактами
  } else {
    boxCont.style.padding = "25px 30px";
    let cont = "Телефон";
    let contType = "tel";
    let btn = document.createElement("button");
    btn.classList.add("btn-reset", "box-cont__btn", "dropdown");
    let ul = document.createElement("ul");
    ul.classList.add("dropdown__list", "list-reset");
    let input = document.createElement("input");
    //функция добавления контакта
    function addContact(cont, contType) {
      let li = document.createElement("li");
      li.classList.add("box-cont__item");
      btn.textContent = cont;
      allType(ul); //вызов функции создания выпадающего окна у стопки со списком ТАЙП
      //отрисовка инпута и прописание type инпуту
      input.classList.add("box-cont__input");
      input.setAttribute("type", contType);
      li.append(btn, ul, input);
      boxCont.append(li);
    }
    //функция задает тайп инпуту в зависимости от выбора контакта
    function contact() {
      listItemElement.forEach(function (item) {
        item.addEventListener("click", function () {
          boxCont.innerHTML = "";
          ul.innerHTML = "";
          listItemElement = [];
          //задаем тайп инпуту который исходит от того какой контакт выбран
          let textContent = item.textContent;
          if (textContent === "Доп. телефон") {
            addContact(textContent, (contType = "tel"));
          } else if (textContent === "Email") {
            addContact(textContent, (contType = "email"));
          } else {
            addContact(textContent, (contType = "text"));
          }
          ul.classList.remove("dropdown__list--active");
          btn.classList.remove("box-cont__btn-active");
        });
      });
    }
    //вызываем фундкцию добавления контакта
    addContact(cont, contType);
    //открываем окно выбора контакта
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      ul.classList.toggle("dropdown__list--active");
      btn.classList.toggle("box-cont__btn-active");
      contact();
      disablingActive();
    });

    //если в блоке boxSave набирается 10 контактов у кнопки Добавить Контакт включается атрибут disabled
    if (boxSave.querySelector("ul").children.length === 10) {
      addCont.disabled = true;
    }
  }
}
///
let ulCont = document.createElement("ul");
ulCont.classList.add("list-reset");
addCont.addEventListener("click", function (e) {
  e.preventDefault();
  //если в блоке добавления есть дочерние элементы по выполняем добавтение их
  //блок сохранения
  actionsAddCont (boxCont, boxSave, ulCont);
});
// вешаем слушатель на кнопку СОХРАНИТЬ в форме добавления клиента
const saveClientBtn = document.querySelector("#saveClient");
saveClientBtn.addEventListener("click", function (e) {
  e.preventDefault();
  //вызываем функцию отправки введенных данных на сервер
  getClientsItem();
  //очищаем блоки с контактами
  /*boxCont.innerHTML = "";
  boxSave.innerHTML = "";
  //вызываем рендер, почему то не работает или рендер принимает объект со старыми данными??
  //а почему со старыми не понимаю
  renderAllClients(clientsList);*/
});
//обработчик событий на отмену, стираем все заполненные поля
function clearing() {
  surname.value = "";
  name.value = "";
  lastName.value = "";
  boxCont.innerHTML = "";
  boxSave.innerHTML = "";
  boxSaveCont.innerHTML = "";
  boxSaveCont.style.padding = "0";
}
const cancellationCliretBtn = document.querySelector("#cancellationClient");
cancellationCliretBtn.addEventListener("click", function (e) {
  e.preventDefault();
  clearing();
});
//функция сортировки
function sortUsers(arr, prop, dir = false) {
  let result = arr.sort(function (a, b) {
    let dirIf = a[prop] < b[prop];
    if (dir == true) dirIf = a[prop] > b[prop];
    if (dirIf == true) return -1;
  });
  return result;
}
//находим элементы для сортировки
const thId = document.querySelector(".th-id");
const thFio = document.querySelector(".th-fio");
const thDate = document.querySelector(".th-date");
const thChanges = document.querySelector(".th-changes");
//функция кликов сортировки в которой по клику на нужный заголовок столбца
//принимаются нужные данные для сортировки
function clickSort(cap) {
  cap.addEventListener("click", function () {
    dir = !dir;
    cap.classList.toggle("table__th--active");
    //эти условия относятся ко второму столбцу меняется текс от А-Я или Я-А
    if ((cap === thFio) & (dir === true)) {
      document.querySelector(".th-fio__spanAY").style.display = "none";
      document.querySelector(".th-fio__spanYA").style.display = "inline-block";
    } else if ((cap === thFio) & (dir === false)) {
      document.querySelector(".th-fio__spanAY").style.display = "inline-block";
      document.querySelector(".th-fio__spanYA").style.display = "none";
    }
    //вызываем рендер
    renderAllClients(clientsList);
  });
}
//вызывам клики сортировки
clickSort(thId);
clickSort(thFio);
clickSort(thChanges);
clickSort(thDate);
//функция фильтрации, принимаем в аргументы
//(массив в котором выполняется фильтрация, ключь объекта, запрос)
function filter(arr, prop, value) {
  let newList = [];
  let copy = [...arr];
  for (const item of copy) {
    if (String(item[prop]).trim().includes(value.trim()) == true) {
      newList.push(item);
    }
  }
  return newList;
}
//вешаем слушатель на инпут фильтра
document.querySelector("#inputSearch").addEventListener("input", function () {
  renderAllClients(clientsList);
});

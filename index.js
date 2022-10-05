// for nice alerts npm module sweetalerts is installed
// import swal from 'sweetalert';


function category_clicked(fetchedId) {
  // ******which contact category is selected (button color changes to black)********
  document.getElementById("c_c_All").className = "c_c_notSelected";
  document.getElementById("c_c_favourite").className = "c_c_notSelected";
  document.getElementById("c_c_family").className = "c_c_notSelected";
  document.getElementById("c_c_friends").className = "c_c_notSelected";
  document.getElementById(fetchedId).className = "c_c_selected";
  // console.log(document.getElementById(id).id);
  
  
  // ******Category clicked (to hide content of all other categories which are not selected)*********
  // ids of "category buttons" are are different from category cards so we need to covert id and target selected category and hide rest
  switch (fetchedId) {
    case "c_c_All":
      idConverted = "all_contacts";
      break;

    case "c_c_favourite":
      idConverted = "fav_contacts";
      break;

    case "c_c_family":
      idConverted = "fam_contacts";
      break;

    case "c_c_friends":
      idConverted = "fri_contacts";
      break;
  }

  document.getElementById("all_contacts").className = "hide_cards";
  document.getElementById("fav_contacts").className = "hide_cards";
  document.getElementById("fam_contacts").className = "hide_cards";
  document.getElementById("fri_contacts").className = "hide_cards";
  document.getElementById(idConverted).className = "show_cards";
}

// -------------------adding contact---------------------------------------------
let contactStorage = [];

const addContactCard = () => {
  // closing modal 1st
  document.getElementById("close_btn").click;

  const newContactDetails = {
    id: `${Date.now()}`,
    Cname: document.getElementById("c_name").value,
    Cphone: document.getElementById("c_phone").value,
    Cemail: document.getElementById("c_email").value,
    Ccategory: document.getElementById("c_category").value,
  };

  addCards(newContactDetails);

  contactStorage.push(newContactDetails);
  saveToLocalStorage();
};

//-----------adding contacts to categories------
const all_contacts = document.getElementById("all_contacts");
function addCards(contactDetails) {
  let { Ccategory } = contactDetails;

  switch (Ccategory) {
    case "Favourite":
      document.getElementById("fav_contacts").insertAdjacentHTML("beforeend", showCardInCategory(contactDetails));
      break;
    case "Family":
      document.getElementById("fam_contacts").insertAdjacentHTML("beforeend", showCardInCategory(contactDetails));
      break;
    case "Friends":
      document.getElementById("fri_contacts").insertAdjacentHTML("beforeend", showCardInCategory(contactDetails));
      break;
  }

  all_contacts.insertAdjacentHTML("beforeend", showContactCard(contactDetails));
}

// ---------------------adding card in html------------
// ProLem: changes (like changing edit icon , converting elements into contentEditable) on card are showing in "All" category cards only.  
// why ??  bcz each category(All,favourite etc) is adding same card with **same id/class card**  so now we have 2 cards with same id/class
// so when we target 1 id/class (ie getElementById) only 1st id/class that html will encounter will be targeted and it will be from "all" category as its card is created 1st
// remaining card from diff category will not be targeted so any changes will be displayed on "all"'s category cards only
// changing "id" attribute to "class" attribute will not help
// Solution: dont create same card for each category: so we will call showCardInCategory for individual category, instead of single function showContactCard
// so we can give unique id to cards accn to category and target only that card and not other  
// **In previous version** we only used single function (ie showContactCard()) to create same card for all category now we are using 2 
const showContactCard = ({ id, Cname, Cphone, Cemail, Ccategory }) => {
  return `     <div class="contact_card scale-in-top" id="${id}">
  <div class="contact_at">
    <div class="contact_title" ><strong id="${id}c_title">${Cname}</strong></div>
    <div class="emailNphone"><span class="material-icons-outlined"> email </span><a href="mailto: ${Cemail}" id="${id}c_email">${Cemail}</a></div>
    <div class="emailNphone"><span class="material-icons-outlined"> phone </span><a href="tel: ${Cphone}" id="${id}c_phone">${Cphone}</a></div>
  </div>

  <div class="contact_UorD">
  <div id="${id}edit_save">
    <span type="button" class="material-icons-outlined" style="color: #00e0ca" name="${id}" onclick="editContact(this)"> drive_file_rename_outline </span>
  </div> 
    <span type="button" class="material-icons-outlined" style="color: #e02401" name="${id}" onclick="deleteContact(this)"> person_remove </span>
  </div>
</div>
    `;
// we will add text(email & phone) in different divs or here we have converted them to "a tag" with ids so that we can do contenntEditable=true :: direct contentEditable on text is not possible
};

const showCardInCategory = ({ id, Cname, Cphone, Cemail, Ccategory }) => {
  return `     <div class="contact_card scale-in-top" id="${id}C${Ccategory}">
  <div class="contact_at">
    <div class="contact_title" ><strong id="${id}C${Ccategory}c_title">${Cname}</strong></div>
    <div class="emailNphone"><span class="material-icons-outlined"> email </span><a href="mailto: ${Cemail}" id="${id}C${Ccategory}c_email">${Cemail}</a></div>
    <div class="emailNphone"><span class="material-icons-outlined"> phone </span><a href="tel: ${Cphone}" id="${id}C${Ccategory}c_phone">${Cphone}</a></div>
  </div>

  <div class="contact_UorD">
  <div id="${id}C${Ccategory}edit_save">
    <span type="button" class="material-icons-outlined" style="color: #00e0ca" name="${id}C${Ccategory}" onclick="editContact(this)"> drive_file_rename_outline </span>
  </div> 
    <span type="button" class="material-icons-outlined" style="color: #e02401" name="${id}C${Ccategory}" onclick="deleteContact(this)"> person_remove </span>
  </div>
</div>
    `;
    // giving C in b/w of name="${id}C${Ccategory} so that we can substring it in future to get just id part and removing rest from "C" to end
};


// ----------------Storing in local Storage-------
const saveToLocalStorage = () => {
  localStorage.setItem("phbookApp", JSON.stringify({ sid: contactStorage }));
};

// -------------loading data again-----------
function reloadContactCards() {
  const localStorageCopy = JSON.parse(localStorage.getItem("phbookApp"));
  // console.log(localStorageCopy);
  if (localStorageCopy) {
    retrieveData = localStorageCopy["sid"];
  }
  // console.log(retrieveData);
  // addCards(retrieveData);
  retrieveData.forEach((oneContact) => {
    addCards(oneContact);
  });
  contactStorage = retrieveData; // so that on every refresh page by default contact storage is set to [] empty array
  // (initiallized in above code) so we populate it again by storing localstorage data into it
}

// ----------------------------------Editing Contact-----------
const editContact = (e) => {
  const targetId = e.getAttribute("name");

  document.getElementById(targetId + "c_title").contentEditable = "true";
  document.getElementById(targetId + "c_email").contentEditable = "true";
  document.getElementById(targetId + "c_phone").contentEditable = "true";
  document.getElementById(
    targetId + "edit_save"
    ).innerHTML = `<span type="button" class="material-icons-outlined" style="color: #00e0ca" name="${targetId}" onclick="saveEdit(this)"> task_alt </span>`;
  };
  // text is end child and contentEditable will not work on text so we will add extra divs and inside we will right our text
  // **** NOTE we are changing edit icon using innerHTML ( we set id using contact id + edit_save)
// if do document.getElementById(targetId + "c_title").contentEditable = "true"; direct, then while clearing data icon will also be lost as it is aslo editable.

// ----------------saving edited contact in local storage----------------------
const saveEdit = (e) => {
  let targetId = e.getAttribute("name");
  console.log(targetId);
  let editedName = document.getElementById(targetId + "c_title").innerHTML;
  let editedEmail = document.getElementById(targetId + "c_email").innerHTML;
  let editedPhone = document.getElementById(targetId + "c_phone").innerHTML;
  console.log(editedName);
  console.log(editedEmail);
  console.log(editedPhone);
  // checking if string from targetId contains "C" if yes this function is called from diff category and not from "All" and we need to get substring(i.e only id and not id+category)
  // if Called from All we dont need to get substring
  if(targetId.includes("C")){
    targetId = targetId.substring(0, targetId.indexOf("C"));
  } 
  contactStorage = contactStorage.filter((contact) => {
    if(contact.id === targetId){
      contact.Cname = editedName;
      contact.Cemail = editedEmail;
      contact.Cphone = editedPhone;
      return contact; // when we return "contact" it will go to "variable contact" we declared after filter and that "contact" will be updated in contactStrorage
    }
    else{
      return contact;
    }
  })
  saveToLocalStorage();
  window.location.reload();
};

// ----------------------deleteing Contact-----------------------
const deleteContact = (e) => {
  let targetId = e.getAttribute("name");
  document.getElementById(targetId).classList.add("del_animation");
  const person = document.getElementById(targetId + "c_title").innerHTML;
  swal({
    title: "Are you sure buddy?",
    text: `Once deleted, you will not be able to contact ${person}`,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      // let targetContact = e.getAttribute("name");
      if(targetId.includes("C")){
        targetId = targetId.substring(0, targetId.indexOf("C"));
      }
      contactStorage = contactStorage.filter((contact) => contact.id !== targetId);
      saveToLocalStorage();

      // ------------------ confirmed delete-----------------
      swal("Sad but Contact has been deleted! now enjoy 😏", {
        icon: "success",
      }).then((okay) => {
        if (okay) {
          window.location.reload(); // if clicked "ok" on last prompt it will reload immediately or else if not clicked it will reload automaticaly after 3sec
        } else {
          window.location.reload(); // why same as "if" ? bcz if not clicked on "ok" and clicked outside it will goto else part and there also we want to reload
        }
      });
    } else {
      document.getElementById(e.getAttribute("name")).classList.remove("del_animation");
      swal("Contact is not deleted!");
    }
  });

  // ****NOTE: in swal the "then" code is imp as it will take what state u have clicked
  // u clicked "okay :value= true" or "cancel :value= false" or "outside alert :value= false".
};

import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  "O'zbek": {
    translation: {
      home:'Asosiy',
      profil:'Profilim',
      settings: "Sozlamalar",
      stadiums_loaded: "Stadionlar yuklandi",
      name: "Ism",
      surname: "Familiya",
      email: "Email",
      phone: "Tel",
      password: "Parol",
      status: "Holatingiz",
      Profil:"Profil Malumotlari",
      Bronlarim:"Mening Bronlarim",
      Yordam:"Yordam",
      Profil1:"Profil",
      Maxfiylik:"Maxfiylik siyosati",
      Sozlamalar:"Sozlamalar",
      Chiqish:"Chiqish",
      Holatni:"Holatni o'zgartrish",
      Tungi:"Tungi rejim",
      tahrirlash:"Malumotlarni tahrirlash",
      Parol:"Parolni O'zgartrish",
      Boshqaruv:"Boshqaruv"
    },
  },
  "Русский": {
    translation: {
      home:'Основной',
      profil:'Профиль',
      settings: "Настройки",
      stadiums_loaded: "Стадионы загружены",
      name: "Имя",
      surname: "Фамилия",
      email: "Электронная почта",
      phone: "Телефон",
      password: "Пароль",
      status: "Статус",
      Profil:"Информация профиля",
      Bronlarim:"Mои брони",
      Yordam:"Помощь",
      Profil1:"Профиль",
      Maxfiylik:"Конфиденциальность",
      Sozlamalar:"Настройки",
      Chiqish:"Выход",
      Holatni:"Изменить статус",
      Tungi:"Ночной режим",
      tahrirlash:"Редактирование данных",
      Parol:"Изменить пароль",
      Boshqaruv:"Управление"
    },
  },
  English: {
    translation: {
      home:'Home',
      profil:'My profile',
      settings: "Settings",
      stadiums_loaded: "Stadiums loaded",
      name: "Name",
      surname: "Surname",
      email: "Email",
      phone: "Phone",
      password: "Password",
      status: "Status",
      Profil:"Profile Information",
      Bronlarim:"My Brons",
      Yordam:"Help",
      Profil1:"Profile",
      Maxfiylik:"Privacy Policy",
      Sozlamalar:"Settings",
      Chiqish:"Exit",
      Holatni:"Change status",
      Tungi:"Night mode",
      tahrirlash:"Edit User Information",
      Parol:"Change Password",
      Boshqaruv:"Management"
    },
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: "O'zbek", // Default til
  interpolation: { escapeValue: false },
});

export default i18next;
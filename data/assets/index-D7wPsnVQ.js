(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function t(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=t(o);fetch(o.href,n)}})();const r={"nixie-clock":{en:"Nixie Clock",uk:"Nixie Clock"},clock:{en:"Clock",uk:"Годинник"},wifi:{en:"Wi-Fi",uk:"Wi-Fi"},"clock-settings":{en:"Nixie Clock Settings",uk:"Налаштування Nixie Годинника"},"wifi-settings":{en:"Wi-Fi Settings",uk:"Налаштування Wi-Fi"},"advanced-mode":{en:"Advanced Mode",uk:"Розширений режим"},"advanced-mode-desc":{en:"Enable advanced features and settings for power users",uk:"Увімкнути розширені функції та налаштування для досвідчених користувачів"},"gps-enabled":{en:"GPS Enabled",uk:"GPS увімкнено"},"gps-enabled-desc":{en:"Use GPS for accurate location and time synchronization",uk:"Використовувати GPS для точного визначення місцезнаходження та синхронізації часу"},"limit-file-upload":{en:"Limit File Upload on Pre-Connect Screen",uk:"Обмежити завантаження файлів на екрані попереднього підключення"},"limit-file-upload-desc":{en:"Restrict file uploads until device is properly connected",uk:"Обмежити завантаження файлів до правильного підключення пристрою"},"night-mode":{en:"Night Mode",uk:"Нічний режим"},"night-mode-desc":{en:"Automatically reduce brightness during night hours",uk:"Автоматично зменшувати яскравість у нічні години"},"start-time":{en:"Start Time",uk:"Час початку"},"end-time":{en:"End Time",uk:"Час завершення"},"time-mode":{en:"Time Mode",uk:"Формат часу"},"time-mode-desc":{en:"Choose between 24-hour or 12-hour time format",uk:"Виберіть між 24-годинним або 12-годинним форматом часу"},timezone:{en:"Timezone",uk:"Часовий пояс"},"timezone-desc":{en:"Select your local timezone for accurate time display",uk:"Виберіть свій місцевий часовий пояс для точного відображення часу"},brightness:{en:"Brightness",uk:"Яскравість"},"brightness-desc":{en:"Adjust the display brightness level",uk:"Налаштуйте рівень яскравості дисплея"},"upload-file":{en:"Upload File",uk:"Завантажити файл"},"upload-file-desc":{en:"Upload configuration or firmware files",uk:"Завантажити файли конфігурації або прошивки"},automatic:{en:"Automatic",uk:"Автоматично"},manual:{en:"Manual",uk:"Вручну"},"timezone-auto-info":{en:"Timezone will be detected automatically based on your IP address or browser settings.",uk:"Часовий пояс буде визначено автоматично на основі вашої IP-адреси або налаштувань браузера."},"current-timezone":{en:"Current timezone",uk:"Поточний часовий пояс"},"select-timezone":{en:"Select Timezone",uk:"Виберіть часовий пояс"},"select-timezone-placeholder":{en:"Select timezone...",uk:"Виберіть часовий пояс..."},"search-timezone":{en:"Search timezone...",uk:"Шукати часовий пояс..."},"no-timezones-found":{en:"No timezones found",uk:"Часові пояси не знайдено"},loading:{en:"Loading...",uk:"Завантаження..."},"watch-brightness":{en:"Watch Brightness",uk:"Яскравість годинника"},"file-upload":{en:"File Upload",uk:"Завантаження файлу"},"file-upload-desc":{en:"Upload configuration files or firmware updates for your Nixie clock",uk:"Завантажте файли конфігурації або оновлення прошивки для вашого Nixie годинника"},"drag-drop-file":{en:"Drag and drop file here or click to select",uk:"Перетягніть файл сюди або клацніть для вибору"},"supported-formats":{en:"Supported formats",uk:"Підтримувані формати"},"max-file-size":{en:"Max file size",uk:"Максимальний розмір"},"upload-file-button":{en:"Upload File",uk:"Завантажити файл"},uploading:{en:"Uploading...",uk:"Завантаження..."},"error-unsupported-format":{en:"Unsupported file format. Please select a file with .bin, .hex or .json extension",uk:"Непідтримуваний формат файлу. Будь ласка, виберіть файл з розширенням .bin, .hex або .json"},"error-file-too-large":{en:"File is too large. Maximum allowed size is",uk:"Файл занадто великий. Максимально допустимий розмір"},"file-uploaded-success":{en:"File uploaded successfully!",uk:"Файл успішно завантажено!"},"upload-error":{en:"Upload error. Please try again.",uk:"Помилка завантаження. Будь ласка, спробуйте ще раз."},"error-title":{en:"Error",uk:"Помилка"},"success-title":{en:"Success",uk:"Успіх"},"warning-title":{en:"Warning",uk:"Попередження"},"wifi-network":{en:"Wi-Fi Network",uk:"Wi-Fi мережа"},"wifi-network-desc":{en:"Select a Wi-Fi network or enter manually",uk:"Виберіть Wi-Fi мережу або введіть вручну"},"wifi-password":{en:"Wi-Fi Password",uk:"Пароль Wi-Fi"},"wifi-password-desc":{en:"Enter the password for the selected network",uk:"Введіть пароль для обраної мережі"},"select-network":{en:"Select Network",uk:"Виберіть мережу"},"select-network-placeholder":{en:"Select a network...",uk:"Виберіть мережу..."},"manual-entry":{en:"Manual Entry",uk:"Ручне введення"},"network-name":{en:"Network Name (SSID)",uk:"Назва мережі (SSID)"},"network-name-placeholder":{en:"Enter network name...",uk:"Введіть назву мережі..."},password:{en:"Password",uk:"Пароль"},"password-placeholder":{en:"Enter password...",uk:"Введіть пароль..."},"show-password":{en:"Show password",uk:"Показати пароль"},"hide-password":{en:"Hide password",uk:"Приховати пароль"},connect:{en:"Connect",uk:"Підключитися"},connecting:{en:"Connecting...",uk:"Підключення..."},connected:{en:"Connected",uk:"Підключено"},save:{en:"Save",uk:"Зберегти"},saving:{en:"Saving...",uk:"Збереження..."},saved:{en:"Saved",uk:"Збережено"},"wifi-saved-success":{en:"WiFi settings saved successfully",uk:"Налаштування WiFi успішно збережено"},"connection-info":{en:"Connection Info",uk:"Інформація про підключення"},network:{en:"Network",uk:"Мережа"},"no-network-selected":{en:"No network selected",uk:"Мережу не вибрано"},"password-required":{en:"Password is required",uk:"Пароль обов'язковий"},"password-min-length":{en:"Password must be at least 8 characters",uk:"Пароль повинен містити принаймні 8 символів"},"network-required":{en:"Network name is required",uk:"Назва мережі обов'язкова"},"wifi-connected-success":{en:"Successfully connected to Wi-Fi",uk:"Успішно підключено до Wi-Fi"},"wifi-connection-error":{en:"Failed to connect to Wi-Fi",uk:"Не вдалося підключитися до Wi-Fi"},"scanning-networks":{en:"Scanning for networks...",uk:"Пошук мереж..."},"no-networks-found":{en:"No networks found",uk:"Мережі не знайдено"},"refresh-networks":{en:"Refresh Networks",uk:"Оновити мережі"}},b=()=>localStorage.getItem("language")||"en";let S=b(),C=!1,y=null,I=null;const te=()=>{C=!C,C?se():M()},se=()=>{C=!0,y?.classList.add("dropdown__button--active"),I?.classList.add("dropdown__menu--open")},M=()=>{C=!1,y?.classList.remove("dropdown__button--active"),I?.classList.remove("dropdown__menu--open")},oe=()=>{if(!y)return;const e=y.querySelector(".dropdown__text-short"),s=y.querySelector(".dropdown__text-full");e&&(e.textContent=S==="en"?"🇬🇧":"🇺🇦"),s&&(s.textContent=S==="en"?"English":"Українська")},ie=()=>{document.querySelectorAll(".language-switcher__item").forEach(s=>{s.dataset.language===S?s.classList.add("dropdown__item--active"):s.classList.remove("dropdown__item--active")})},ne=()=>{const e=document.querySelector(".header__title");e&&(e.textContent=r["nixie-clock"][S]),document.querySelectorAll(".nav-tab").forEach(o=>{const n=o.dataset.page,c=o.querySelector(".nav-tab__text");n&&c&&r[n]&&(c.textContent=r[n][S])}),document.querySelectorAll(".page__title").forEach(o=>{const n=o.closest(".page");if(n){const c=n.dataset.page,a=`${c}-settings`;c&&r[a]&&(o.textContent=r[a][S])}}),document.querySelectorAll("[data-i18n]").forEach(o=>{const n=o.getAttribute("data-i18n");if(n&&r[n]){const c=r[n][S];if(o.tagName==="INPUT"&&o.hasAttribute("placeholder"))o.placeholder=c;else if(o.classList.contains("settings-section__title")){const a=o.querySelector("img"),u=a?a.outerHTML:"";o.innerHTML=`${u}${c}`}else o.textContent=c}})},A=e=>{S=e,document.documentElement.setAttribute("lang",e),localStorage.setItem("language",e),oe(),ie(),ne(),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:e}}))},ae=()=>{y=document.querySelector(".language-switcher__button"),I=document.querySelector(".language-switcher__menu"),A(S),y&&y.addEventListener("click",s=>{s.stopPropagation(),te()}),document.querySelectorAll(".language-switcher__item").forEach(s=>{s.addEventListener("click",()=>{const t=s.dataset.language;t&&(A(t),M())})}),document.addEventListener("click",()=>{M()})};let E,j;const Y=e=>{E.forEach(i=>{i.classList.remove("nav-tab--active")}),j.forEach(i=>{i.classList.remove("page--active")});const s=document.querySelector(`.nav-tab[data-page="${e}"]`);s&&s.classList.add("nav-tab--active");const t=document.querySelector(`.page[data-page="${e}"]`);t&&t.classList.add("page--active")},le=e=>{const s=e.dataset.page;if(!s)return;const t=new URLSearchParams(window.location.search);t.set("page",s),window.history.pushState({},"",`?${t.toString()}`),Y(s)},B=()=>{const s=new URLSearchParams(window.location.search).get("page")||"clock";Y(s)},re=()=>{E=document.querySelectorAll(".nav-tab"),j=document.querySelectorAll(".page"),B(),E.forEach(e=>{e.addEventListener("click",()=>le(e))}),window.addEventListener("popstate",()=>{B()})};document.addEventListener("DOMContentLoaded",()=>{re(),ae()});const ce=(e,s)=>{localStorage.setItem(e,String(s)),console.log(`${e} saved:`,s)},de=(e,s,t,i)=>{const o=b(),n=r[t]?.[o]||t,c=r[i]?.[o]||i;e.innerHTML=`
    <div class="settings-section">
      <div class="settings-section__header flex items-start justify-between gap-16">
        <div class="flex-1 min-w-0">
          <h3 class="settings-section__title flex items-center gap-8" data-i18n="${t}">
            <img src="${s}" alt="${n}" class="settings-section__icon" width="20" height="20">
            ${n}
          </h3>
          <p class="settings-section__description" data-i18n="${i}">
            ${c}
          </p>
        </div>
        <label class="toggle-switch flex-shrink-0">
          <input type="checkbox" class="toggle-switch__checkbox">
          <span class="toggle-switch__toggle"></span>
        </label>
      </div>
    </div>
  `},D=(e,s,t,i,o,n=!1,c)=>{let a=n;if(o){const g=localStorage.getItem(o);a=g!==null?g==="true":n}de(e,s,t,i);const u=e.querySelector(".toggle-switch__toggle"),p=e.querySelector(".toggle-switch__checkbox"),l=()=>{u&&p&&(a?(u.classList.add("toggle-switch__toggle--active"),p.checked=!0):(u.classList.remove("toggle-switch__toggle--active"),p.checked=!1))},d=()=>{a=!a,l(),o&&ce(o,a),c&&c(a)};u&&u.addEventListener("click",g=>{g.preventDefault(),d()}),p&&p.addEventListener("change",g=>{g.stopPropagation(),d()}),l()},ue="data:image/svg+xml,%3csvg%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M21%2015v4a2%202%200%200%201-2%202H5a2%202%200%200%201-2-2v-4'%3e%3c/path%3e%3cpolyline%20points='17%208%2012%203%207%208'%3e%3c/polyline%3e%3cline%20x1='12'%20y1='3'%20x2='12'%20y2='15'%3e%3c/line%3e%3c/svg%3e",W="data:image/svg+xml,%3csvg%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M13%202H6a2%202%200%200%200-2%202v16a2%202%200%200%200%202%202h12a2%202%200%200%200%202-2V9z'%3e%3c/path%3e%3cpolyline%20points='13%202%2013%209%2020%209'%3e%3c/polyline%3e%3c/svg%3e",ge="data:image/svg+xml,%3csvg%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20xmlns='http://www.w3.org/2000/svg'%3e%3cline%20x1='18'%20y1='6'%20x2='6'%20y2='18'%3e%3c/line%3e%3cline%20x1='6'%20y1='6'%20x2='18'%20y2='18'%3e%3c/line%3e%3c/svg%3e",G=e=>{const{type:s,title:t,message:i,duration:o=5e3}=e,n=document.querySelector(".toast");n?(n.classList.add("toast--hiding"),setTimeout(()=>{n.remove(),c()},300)):c();function c(){const a=document.createElement("div");a.className=`toast flex items-start gap-12 toast--${s}`;const u={error:"✕",success:"✓",warning:"⚠"};a.innerHTML=`
      <div class="toast__icon flex-shrink-0 flex items-center justify-center">${u[s]}</div>
      <div class="toast__content flex-1">
        <h4 class="toast__title">${t}</h4>
        <p class="toast__message">${i}</p>
      </div>
      <button class="toast__close flex-shrink-0 flex items-center justify-center" type="button">×</button>
    `,document.body.appendChild(a);const p=a.querySelector(".toast__close"),l=()=>{a.classList.add("toast--hiding"),setTimeout(()=>{a.remove()},300)};p&&p.addEventListener("click",l),o>0&&setTimeout(l,o)}},$=(e,s)=>{G({type:"error",title:e,message:s})},pe=(e,s)=>{G({type:"success",title:e,message:s})};var k=(e=>(e.TWELVE_HOUR="12h",e.TWENTY_FOUR_HOUR="24h",e))(k||{});const q=1031*1024,F=e=>{if(e===0)return"0 Bytes";const s=1024,t=["Bytes","KB","MB"],i=Math.floor(Math.log(e)/Math.log(s));return`${Math.round(e/Math.pow(s,i)*100)/100} ${t[i]}`},O=e=>{const s=b(),t=r["file-upload"]?.[s]||"File Upload",i=r["file-upload-desc"]?.[s]||"Upload configuration files or firmware updates for your Nixie clock",o=r["drag-drop-file"]?.[s]||"Drag and drop file here or click to select",n=r["supported-formats"]?.[s]||"Supported formats",c=r["max-file-size"]?.[s]||"Max file size",a=r["upload-file-button"]?.[s]||"Upload File";e.innerHTML=`
    <div class="settings-section">
      <h3 class="settings-section__title flex items-center gap-8" data-i18n="file-upload">
        <img src="${ue}" alt="${t}" class="settings-section__icon" width="20" height="20">
        ${t}
      </h3>
      <p class="settings-section__description" data-i18n="file-upload-desc">
        ${i}
      </p>

      <div class="file-upload">
        <div class="file-upload__area" id="dropArea">
          <img src="${W}" alt="File" class="file-upload__icon" width="48" height="48">
          <p class="file-upload__text" data-i18n="drag-drop-file">${o}</p>
          <p class="file-upload__hint">
            <span data-i18n="supported-formats">${n}</span>: .zip <br>
            <span data-i18n="max-file-size">${c}</span>: ${F(q)}
          </p>
          <input type="file" class="file-upload__input" id="fileInput" accept=".zip">
        </div>

        <div class="file-upload__selected flex items-center gap-12 justify-between" id="selectedFile" style="display: none;">
          <div class="file-upload__file-info flex items-center gap-12 flex-1">
            <img src="${W}" alt="File" class="file-upload__file-icon flex-shrink-0" width="24" height="24">
            <span class="file-upload__file-name" id="fileName"></span>
          </div>
          <span class="file-upload__file-size flex-shrink-0" id="fileSize"></span>
          <button class="file-upload__remove flex items-center justify-center flex-shrink-0" id="removeFile" type="button">
            <img src="${ge}" alt="Remove" width="20" height="20">
          </button>
        </div>

        <button class="file-upload__button" id="uploadButton" disabled data-i18n="upload-file-button">
          ${a}
        </button>
      </div>
    </div>
  `},fe=e=>{let s=null,t=null;O(e);const i=d=>{const g=e.querySelector("#selectedFile"),f=e.querySelector("#fileName"),m=e.querySelector("#fileSize"),h=e.querySelector("#uploadButton");g&&f&&m&&h&&(g.style.display="flex",f.textContent=d.name,m.textContent=F(d.size),h.disabled=!1)},o=()=>{t=null;const d=e.querySelector("#selectedFile"),g=e.querySelector("#uploadButton");d&&g&&(d.style.display="none",g.disabled=!0),s&&(s.value="")},n=d=>{const g=[".zip"],f="."+d.name.split(".").pop()?.toLowerCase(),m=b();if(!g.includes(f)){const h=r["error-title"]?.[m]||"Error",w=r["error-unsupported-format"]?.[m]||"Unsupported file format. Please select a file with .zip extension";$(h,w),s&&(s.value="");return}if(d.size>q){const h=r["error-title"]?.[m]||"Error",w=r["error-file-too-large"]?.[m]||"File is too large. Maximum allowed size is";$(h,`${w} ${F(q)}`),s&&(s.value="");return}t=d,i(d)},c=async()=>{if(!t)return;const d=b(),g=e.querySelector("#uploadButton"),f=r.uploading?.[d]||"Uploading...",m=r["upload-file-button"]?.[d]||"Upload File";g&&(g.textContent=f,g.disabled=!0);try{await new Promise(_=>setTimeout(_,1500)),console.log("File uploaded:",t.name);const h=r["success-title"]?.[d]||"Success",w=r["file-uploaded-success"]?.[d]||"File uploaded successfully!";pe(h,`${w}
"${t.name}"`),o()}catch(h){console.error("Upload error:",h);const w=r["error-title"]?.[d]||"Error",_=r["upload-error"]?.[d]||"Upload error. Please try again.";$(w,_)}finally{g&&(g.textContent=m)}},a=e.querySelector("#dropArea"),u=e.querySelector("#fileInput"),p=e.querySelector("#uploadButton"),l=e.querySelector("#removeFile");s=u,a&&u&&(a.addEventListener("click",()=>u.click()),a.addEventListener("dragover",d=>{d.preventDefault(),a.classList.add("file-upload__area--dragover")}),a.addEventListener("dragleave",()=>{a.classList.remove("file-upload__area--dragover")}),a.addEventListener("drop",d=>{d.preventDefault(),a.classList.remove("file-upload__area--dragover");const g=d.dataTransfer?.files;g&&g.length>0&&n(g[0])}),u.addEventListener("change",d=>{const g=d.target;g.files&&g.files.length>0&&n(g.files[0])})),p&&p.addEventListener("click",()=>c()),l&&l.addEventListener("click",()=>o()),window.addEventListener("languageChanged",()=>{const d=t!==null,g=t;O(e),s=e.querySelector("#fileInput"),d&&g&&i(g);const f=e.querySelector("#dropArea"),m=e.querySelector("#fileInput"),h=e.querySelector("#uploadButton"),w=e.querySelector("#removeFile");f&&m&&(f.addEventListener("click",()=>m.click()),f.addEventListener("dragover",_=>{_.preventDefault(),f.classList.add("file-upload__area--dragover")}),f.addEventListener("dragleave",()=>{f.classList.remove("file-upload__area--dragover")}),f.addEventListener("drop",_=>{_.preventDefault(),f.classList.remove("file-upload__area--dragover");const v=_.dataTransfer?.files;v&&v.length>0&&n(v[0])}),m.addEventListener("change",_=>{const v=_.target;v.files&&v.files.length>0&&n(v.files[0])})),h&&h.addEventListener("click",()=>c()),w&&w.addEventListener("click",()=>o())})},Z="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3ccircle%20cx='12'%20cy='12'%20r='10'%20stroke='currentColor'%20stroke-width='2'/%3e%3cpolyline%20points='12%206%2012%2012%2016%2014'%20stroke='currentColor'%20stroke-width='2'/%3e%3c/svg%3e",L="data:image/svg+xml,%3csvg%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20xmlns='http://www.w3.org/2000/svg'%3e%3ccircle%20cx='12'%20cy='12'%20r='10'%3e%3c/circle%3e%3cpath%20d='M12%2016v-4'%3e%3c/path%3e%3cpath%20d='M12%208h.01'%3e%3c/path%3e%3c/svg%3e",me="data:image/svg+xml,%3csvg%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpolyline%20points='6%209%2012%2015%2018%209'%3e%3c/polyline%3e%3c/svg%3e",J=[{value:"UTC-12:00",label:"(UTC-12:00) International Date Line West",offset:"-12:00"},{value:"UTC-11:00",label:"(UTC-11:00) Coordinated Universal Time-11",offset:"-11:00"},{value:"UTC-10:00",label:"(UTC-10:00) Hawaii",offset:"-10:00"},{value:"UTC-09:00",label:"(UTC-09:00) Alaska",offset:"-09:00"},{value:"UTC-08:00",label:"(UTC-08:00) Pacific Time (US & Canada)",offset:"-08:00"},{value:"UTC-07:00",label:"(UTC-07:00) Mountain Time (US & Canada)",offset:"-07:00"},{value:"UTC-06:00",label:"(UTC-06:00) Central Time (US & Canada)",offset:"-06:00"},{value:"UTC-05:00",label:"(UTC-05:00) Eastern Time (US & Canada)",offset:"-05:00"},{value:"UTC-04:00",label:"(UTC-04:00) Atlantic Time (Canada)",offset:"-04:00"},{value:"UTC-03:30",label:"(UTC-03:30) Newfoundland",offset:"-03:30"},{value:"UTC-03:00",label:"(UTC-03:00) Brasilia",offset:"-03:00"},{value:"UTC-02:00",label:"(UTC-02:00) Mid-Atlantic",offset:"-02:00"},{value:"UTC-01:00",label:"(UTC-01:00) Azores",offset:"-01:00"},{value:"UTC+00:00",label:"(UTC+00:00) London, Dublin, Lisbon",offset:"+00:00"},{value:"UTC+01:00",label:"(UTC+01:00) Paris, Berlin, Rome",offset:"+01:00"},{value:"UTC+02:00",label:"(UTC+02:00) Kyiv, Athens, Istanbul",offset:"+02:00"},{value:"UTC+03:00",label:"(UTC+03:00) Moscow, Baghdad, Nairobi",offset:"+03:00"},{value:"UTC+03:30",label:"(UTC+03:30) Tehran",offset:"+03:30"},{value:"UTC+04:00",label:"(UTC+04:00) Abu Dhabi, Baku",offset:"+04:00"},{value:"UTC+04:30",label:"(UTC+04:30) Kabul",offset:"+04:30"},{value:"UTC+05:00",label:"(UTC+05:00) Islamabad, Karachi",offset:"+05:00"},{value:"UTC+05:30",label:"(UTC+05:30) Mumbai, New Delhi",offset:"+05:30"},{value:"UTC+05:45",label:"(UTC+05:45) Kathmandu",offset:"+05:45"},{value:"UTC+06:00",label:"(UTC+06:00) Dhaka, Almaty",offset:"+06:00"},{value:"UTC+06:30",label:"(UTC+06:30) Yangon (Rangoon)",offset:"+06:30"},{value:"UTC+07:00",label:"(UTC+07:00) Bangkok, Jakarta",offset:"+07:00"},{value:"UTC+08:00",label:"(UTC+08:00) Beijing, Singapore, Perth",offset:"+08:00"},{value:"UTC+09:00",label:"(UTC+09:00) Tokyo, Seoul",offset:"+09:00"},{value:"UTC+09:30",label:"(UTC+09:30) Adelaide, Darwin",offset:"+09:30"},{value:"UTC+10:00",label:"(UTC+10:00) Sydney, Melbourne",offset:"+10:00"},{value:"UTC+11:00",label:"(UTC+11:00) Solomon Islands",offset:"+11:00"},{value:"UTC+12:00",label:"(UTC+12:00) Auckland, Fiji",offset:"+12:00"},{value:"UTC+13:00",label:"(UTC+13:00) Nuku'alofa",offset:"+13:00"},{value:"UTC+14:00",label:"(UTC+14:00) Kiritimati",offset:"+14:00"}],x={brightness:80,timeMode:k.TWENTY_FOUR_HOUR,timezoneMode:"auto",selectedTimezone:"UTC+00:00",nightMode:{enabled:!1,startTime:"22:00",endTime:"07:00"}},he=()=>({...x}),ve=e=>{Object.assign(x,e)},H=e=>{const s=e.querySelector("#currentTimezone");if(s)try{const t=Intl.DateTimeFormat().resolvedOptions().timeZone,i=new Date().getTimezoneOffset(),o=Math.abs(Math.floor(i/60)),n=Math.abs(i%60),a=`UTC${i<=0?"+":"-"}${String(o).padStart(2,"0")}:${String(n).padStart(2,"0")}`;s.textContent=`${t} (${a})`}catch(t){console.error("Error getting timezone:",t);const i=b();s.textContent=i==="uk"?"Не вдалося визначити":"Unable to detect"}},K=(e,s)=>{const t=e.querySelectorAll(".timezone-selector__option"),i=s.toLowerCase();let o=0;t.forEach(a=>{(a.textContent?.toLowerCase()||"").includes(i)?(a.classList.remove("timezone-selector__option--hidden"),o++):a.classList.add("timezone-selector__option--hidden")});const n=e.querySelector("#timezoneOptions"),c=n?.querySelector(".timezone-selector__no-results");if(o===0&&!c&&n){const a=b(),u=document.createElement("div");u.className="timezone-selector__no-results",u.textContent=r["no-timezones-found"]?.[a]||"No timezones found",n.appendChild(u)}else o>0&&c&&c.remove()},N=e=>{const s=e.querySelector("#timezoneDropdown"),t=e.querySelector("#selectTrigger"),i=t?.querySelector(".timezone-selector__select-arrow"),o=e.querySelector("#timezoneSearch");s&&t&&i&&(s.classList.remove("timezone-selector__dropdown--active"),s.classList.remove("timezone-selector__dropdown--upward"),t.classList.remove("timezone-selector__select-trigger--active"),i.classList.remove("timezone-selector__select-arrow--rotated"),o&&(o.value="",K(e,"")))},we=(e,s,t,i)=>{const o=e.querySelector("#selectText"),n=e.querySelectorAll(".timezone-selector__option");o&&(o.textContent=t),n.forEach(c=>{c.getAttribute("data-value")===s?c.classList.add("timezone-selector__option--selected"):c.classList.remove("timezone-selector__option--selected")}),i(s),N(e)},_e=(e,s)=>{const t=s.getBoundingClientRect(),i=300,o=window.innerHeight-t.bottom,n=t.top;e.classList.remove("timezone-selector__dropdown--upward"),o<i&&n>o&&e.classList.add("timezone-selector__dropdown--upward")},be=e=>{const s=e.querySelector("#timezoneDropdown"),t=e.querySelector("#selectTrigger"),i=t?.querySelector(".timezone-selector__select-arrow"),o=e.querySelector("#timezoneSearch");s&&t&&i&&(s.classList.add("timezone-selector__dropdown--active"),t.classList.add("timezone-selector__select-trigger--active"),i.classList.add("timezone-selector__select-arrow--rotated"),_e(s,t),setTimeout(()=>{o?.focus()},100))},R=(e,s)=>{const t=e.querySelector("#selectTrigger"),i=e.querySelector("#timezoneDropdown"),o=e.querySelector("#timezoneSearch"),n=e.querySelector("#selectText");if(!t||!i||!o||!n)return;t.addEventListener("click",a=>{a.stopPropagation(),i.classList.contains("timezone-selector__dropdown--active")?N(e):be(e)}),o.addEventListener("input",a=>{const u=a.target;K(e,u.value)}),o.addEventListener("click",a=>{a.stopPropagation()}),i.querySelectorAll(".timezone-selector__option").forEach(a=>{a.addEventListener("click",u=>{const p=u.target,l=p.getAttribute("data-value"),d=p.textContent?.trim();l&&d&&we(e,l,d,s)})}),document.addEventListener("click",a=>{const u=a.target;!t.contains(u)&&!i.contains(u)&&N(e)})},z=(e,s,t)=>{e.querySelectorAll(".timezone-selector__toggle-btn").forEach(c=>{c.getAttribute("data-mode")===s?c.classList.add("timezone-selector__toggle-btn--active"):c.classList.remove("timezone-selector__toggle-btn--active")});const o=e.querySelector(".timezone-selector__auto"),n=e.querySelector(".timezone-selector__manual");o&&n&&(s==="auto"?(o.classList.add("timezone-selector__auto--active"),n.classList.remove("timezone-selector__manual--active")):(o.classList.remove("timezone-selector__auto--active"),n.classList.add("timezone-selector__manual--active"))),t(s)},V=e=>{const s=b(),t=r.timezone?.[s]||"Timezone",i=r["timezone-desc"]?.[s]||"Select your local timezone for accurate time display",o=r.automatic?.[s]||"Automatic",n=r.manual?.[s]||"Manual",c=r["timezone-auto-info"]?.[s]||"Timezone will be detected automatically based on your IP address or browser settings.",a=r["current-timezone"]?.[s]||"Current timezone",u=r["select-timezone"]?.[s]||"Select Timezone",p=r["select-timezone-placeholder"]?.[s]||"Select timezone...",l=r["search-timezone"]?.[s]||"Search timezone...",d=r.loading?.[s]||"Loading...";e.innerHTML=`
    <div class="settings-section">
      <h3 class="settings-section__title flex items-center gap-8" data-i18n="timezone">
        <img src="${Z}" alt="${t}" class="settings-section__icon" width="20" height="20">
        ${t}
      </h3>
      <p class="settings-section__description" data-i18n="timezone-desc">
        ${i}
      </p>

      <div class="timezone-selector">
        <div class="timezone-selector__toggle flex gap-8">
          <button class="timezone-selector__toggle-btn timezone-selector__toggle-btn--active flex-1" data-mode="auto" data-i18n="automatic">
            ${o}
          </button>
          <button class="timezone-selector__toggle-btn flex-1" data-mode="manual" data-i18n="manual">
            ${n}
          </button>
        </div>

        <div class="timezone-selector__auto timezone-selector__auto--active">
          <div class="timezone-selector__auto-info flex items-start gap-12">
            <img src="${L}" alt="Info" class="timezone-selector__auto-icon flex-shrink-0" width="20" height="20">
            <div class="timezone-selector__auto-text flex-1">
              <p data-i18n="timezone-auto-info">${c}</p>
              <p><span data-i18n="current-timezone">${a}</span>: <strong id="currentTimezone">${d}</strong></p>
            </div>
          </div>
        </div>

        <div class="timezone-selector__manual">
          <label class="timezone-selector__label" data-i18n="select-timezone">
            ${u}
          </label>
          <div class="timezone-selector__custom-select">
            <div class="timezone-selector__select-trigger flex items-center gap-12 justify-between" id="selectTrigger">
              <span class="timezone-selector__select-text flex-1" id="selectText">${p}</span>
              <img
                src="${me}"
                alt="Expand"
                class="timezone-selector__select-arrow flex-shrink-0"
                width="16"
                height="16"
                >
            </div>
            <div class="timezone-selector__dropdown" id="timezoneDropdown">
              <input
                type="text"
                class="timezone-selector__search-input"
                id="timezoneSearch"
                placeholder="${l}"
                autocomplete="off"
                autocapitalize="off"
                spellcheck="false"
              >
              <div id="timezoneOptions">
                ${J.map(g=>`
                  <div class="timezone-selector__option" data-value="${g.value}">
                    ${g.label}
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `},ke=e=>{let s=x.timezoneMode,t=x.selectedTimezone;const i=localStorage.getItem("timezoneMode");(i==="auto"||i==="manual")&&(s=i);const o=localStorage.getItem("selectedTimezone");o&&(t=o),V(e);const n=l=>{s=l,localStorage.setItem("timezoneMode",l),console.log("Timezone mode saved:",l)},c=l=>{t=l,localStorage.setItem("selectedTimezone",l),console.log("Timezone saved:",l)};e.querySelectorAll(".timezone-selector__toggle-btn").forEach(l=>{l.addEventListener("click",d=>{const f=d.target.getAttribute("data-mode");z(e,f,n)})}),R(e,c),H(e),s==="manual"&&z(e,"manual",n);const u=()=>{if(t&&t!==x.selectedTimezone){const l=J.find(d=>d.value===t);if(l){const d=e.querySelector("#selectText");d&&(d.textContent=l.label),e.querySelectorAll(".timezone-selector__option").forEach(f=>{f.getAttribute("data-value")===t&&f.classList.add("timezone-selector__option--selected")})}}},p=()=>{e.querySelectorAll(".timezone-selector__toggle-btn").forEach(d=>{d.addEventListener("click",g=>{const m=g.target.getAttribute("data-mode");z(e,m,n)})}),R(e,c),H(e),s==="manual"&&z(e,"manual",n),u()};p(),window.addEventListener("languageChanged",()=>{V(e),p()})},Te=e=>{const s=b(),t=r["time-mode"]?.[s]||"Time Mode",i=r["time-mode-desc"]?.[s]||"Choose between 24-hour or 12-hour time format";e.innerHTML=`
    <div class="settings-section">
      <h3 class="settings-section__title flex items-center gap-8" data-i18n="time-mode">
        <img src="${Z}" alt="${t}" class="settings-section__icon" width="20" height="20">
        ${t}
      </h3>
      <p class="settings-section__description" data-i18n="time-mode-desc">
        ${i}
      </p>

      <div class="time-mode-switcher">
        <div class="time-mode-switcher__toggle inline-flex gap-4">
          <button class="time-mode-switcher__toggle-btn time-mode-switcher__toggle-btn--active" data-mode="${k.TWENTY_FOUR_HOUR}">
            ${k.TWENTY_FOUR_HOUR}
          </button>
          <button class="time-mode-switcher__toggle-btn" data-mode="${k.TWELVE_HOUR}">
            ${k.TWELVE_HOUR}
          </button>
        </div>
      </div>
    </div>
  `},Se=e=>{let s=x.timeMode;const t=localStorage.getItem("timeMode");(t===k.TWELVE_HOUR||t===k.TWENTY_FOUR_HOUR)&&(s=t),Te(e);const i=()=>{localStorage.setItem("timeMode",s),console.log("Time mode saved:",s)},o=c=>{s=c,e.querySelectorAll(".time-mode-switcher__toggle-btn").forEach(u=>{u.getAttribute("data-mode")===c?u.classList.add("time-mode-switcher__toggle-btn--active"):u.classList.remove("time-mode-switcher__toggle-btn--active")}),i()};e.querySelectorAll(".time-mode-switcher__toggle-btn").forEach(c=>{c.addEventListener("click",a=>{const p=a.target.getAttribute("data-mode");o(p)})}),s===k.TWELVE_HOUR&&o(k.TWELVE_HOUR)},ye=(e,s)=>{const t=b(),i=r["watch-brightness"]?.[t]||"Watch Brightness",o=r["brightness-desc"]?.[t]||"Adjust the display brightness level",n=r.brightness?.[t]||"Brightness";e.innerHTML=`
    <div class="settings-section">
      <h3 class="settings-section__title flex items-center gap-8" data-i18n="watch-brightness">
        <img src="${L}" alt="${i}" class="settings-section__icon" width="20" height="20">
        ${i}
      </h3>
      <p class="settings-section__description" data-i18n="brightness-desc">
        ${o}
      </p>

      <div class="brightness-slider">
        <div class="brightness-slider__header flex items-center justify-between">
          <span class="brightness-slider__label" data-i18n="brightness">${n}</span>
          <span class="brightness-slider__value">${s}%</span>
        </div>
        <div class="brightness-slider__container flex items-center">
          <div class="brightness-slider__track">
            <div class="brightness-slider__fill" style="width: ${s}%"></div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value="${s}"
            class="brightness-slider__input"
          >
        </div>
      </div>
    </div>
  `},xe=e=>{let s=x.brightness,t;const i=localStorage.getItem("brightness");i&&(s=Number(i)),ye(e,s);const o=()=>{localStorage.setItem("brightness",String(s)),console.log("Brightness saved:",s)},n=()=>{t!==void 0&&clearTimeout(t),t=window.setTimeout(()=>{o()},300)},c=()=>{const p=e.querySelector(".brightness-slider__value"),l=e.querySelector(".brightness-slider__input"),d=e.querySelector(".brightness-slider__fill");p&&(p.textContent=`${s}%`),l&&(l.value=String(s)),d&&(d.style.width=`${s}%`)},a=p=>{s=p,c(),n()},u=e.querySelector(".brightness-slider__input");u&&u.addEventListener("input",p=>{const l=p.target;a(Number(l.value))})},Ce=(e,s,t)=>{const i=b(),o=r["night-mode"]?.[i]||"Night Mode",n=r["night-mode-desc"]?.[i]||"Automatically reduce brightness during night hours",c=r["start-time"]?.[i]||"Start Time",a=r["end-time"]?.[i]||"End Time";e.innerHTML=`
    <div class="settings-section">
      <div class="settings-section__header flex items-start justify-between gap-16">
        <div class="flex-1 min-w-0">
          <h3 class="settings-section__title flex items-center gap-8" data-i18n="night-mode">
            <img src="${L}" alt="${o}" class="settings-section__icon" width="20" height="20">
            ${o}
          </h3>
          <p class="settings-section__description" data-i18n="night-mode-desc">
            ${n}
          </p>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" class="toggle-switch__checkbox">
          <span class="toggle-switch__toggle"></span>
        </label>
      </div>

      <div class="night-mode__time-range flex items-end gap-16">
        <div class="night-mode__time-group flex-col gap-8 flex-1">
          <label class="night-mode__time-label" data-i18n="start-time">${c}</label>
          <input
            type="time"
            class="night-mode__time-input"
            data-type="start"
            value="${s}"
            disabled
          >
        </div>
        <div class="night-mode__time-separator flex-shrink-0">—</div>
        <div class="night-mode__time-group flex-col gap-8 flex-1">
          <label class="night-mode__time-label" data-i18n="end-time">${a}</label>
          <input
            type="time"
            class="night-mode__time-input"
            data-type="end"
            value="${t}"
            disabled
          >
        </div>
      </div>
    </div>
  `},ze=e=>{const s=he();let t=s.nightMode.enabled,i=s.nightMode.startTime,o=s.nightMode.endTime;const n=localStorage.getItem("nightModeEnabled"),c=localStorage.getItem("nightModeStart"),a=localStorage.getItem("nightModeEnd");n!==null&&(t=n==="true"),c&&(i=c),a&&(o=a),Ce(e,i,o);const u=e.querySelector(".toggle-switch__toggle"),p=e.querySelector(".toggle-switch__checkbox"),l=e.querySelector(".night-mode__time-range"),d=e.querySelector('.night-mode__time-input[data-type="start"]'),g=e.querySelector('.night-mode__time-input[data-type="end"]'),f=()=>{localStorage.setItem("nightModeEnabled",String(t)),localStorage.setItem("nightModeStart",i),localStorage.setItem("nightModeEnd",o),ve({nightMode:{enabled:t,startTime:i,endTime:o}})},m=()=>{u&&p&&(t?(u.classList.add("toggle-switch__toggle--active"),p.checked=!0):(u.classList.remove("toggle-switch__toggle--active"),p.checked=!1))},h=()=>{l&&(t?l.classList.add("night-mode__time-range--active"):l.classList.remove("night-mode__time-range--active")),d&&(d.disabled=!t),g&&(g.disabled=!t)},w=()=>{t=!t,m(),h(),f()},_=(v,T)=>{v==="start"?i=T:o=T,f()};u&&u.addEventListener("click",v=>{v.preventDefault(),w()}),p&&p.addEventListener("change",v=>{v.stopPropagation(),w()}),d&&d.addEventListener("change",v=>{const T=v.target;_("start",T.value)}),g&&g.addEventListener("change",v=>{const T=v.target;_("end",T.value)}),m(),h()},X="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M5%2012.55a11%2011%200%200%201%2014.08%200'%20stroke='currentColor'%20stroke-width='2'/%3e%3cpath%20d='M1.42%209a16%2016%200%200%201%2021.16%200'%20stroke='currentColor'%20stroke-width='2'/%3e%3cpath%20d='M8.53%2016.11a6%206%200%200%201%206.95%200'%20stroke='currentColor'%20stroke-width='2'/%3e%3cline%20x1='12'%20y1='20'%20x2='12.01'%20y2='20'%20stroke='currentColor'%20stroke-width='2'/%3e%3c/svg%3e",Le=()=>{const e=document.querySelector('[data-page="clock"] .settings-content');if(!e)return;const s=document.createElement("div"),t=document.createElement("div"),i=document.createElement("div"),o=document.createElement("div"),n=document.createElement("div");e.appendChild(s),e.appendChild(t),e.appendChild(i),e.appendChild(o),e.appendChild(n);const c=localStorage.getItem("advancedMode")==="true";D(n,L,"advanced-mode","advanced-mode-desc","advancedMode",!1,u=>{const p=n.querySelector(".settings-nested");p&&(u?p.classList.remove("settings-nested--hidden"):p.classList.add("settings-nested--hidden"))});const a=n.querySelector(".settings-section");if(a){const u=document.createElement("div");u.className=c?"settings-nested flex flex-col gap-16":"settings-nested settings-nested--hidden flex flex-col gap-16";const p=document.createElement("div"),l=document.createElement("div");u.appendChild(p),u.appendChild(l),a.appendChild(u),D(p,X,"gps-enabled","gps-enabled-desc","gpsEnabled",!1),fe(l)}Se(s),ke(t),xe(i),ze(o)};Le();const Ue="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='20'%20height='20'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3e%3cpath%20d='M1%2012s4-8%2011-8%2011%208%2011%208-4%208-11%208-11-8-11-8z'/%3e%3ccircle%20cx='12'%20cy='12'%20r='3'/%3e%3c/svg%3e",$e="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='20'%20height='20'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3e%3cpath%20d='M17.94%2017.94A10.07%2010.07%200%200%201%2012%2020c-7%200-11-8-11-8a18.45%2018.45%200%200%201%205.06-5.94M9.9%204.24A9.12%209.12%200%200%201%2012%204c7%200%2011%208%2011%208a18.5%2018.5%200%200%201-2.16%203.19m-6.72-1.07a3%203%200%201%201-4.24-4.24'/%3e%3cline%20x1='1'%20y1='1'%20x2='23'%20y2='23'/%3e%3c/svg%3e",Me=e=>{const s=b();return e?e.length<8?{isValid:!1,error:r["password-min-length"]?.[s]||"Password must be at least 8 characters"}:{isValid:!0}:{isValid:!1,error:r["password-required"]?.[s]||"Password is required"}},Ee=()=>{const e=document.querySelector('[data-page="wifi"] .settings-content');if(!e)return;const s=localStorage.getItem("wifiNetwork"),t={selectedNetwork:s||null,isManualEntry:!!s,password:"",isPasswordValid:!1,isConnecting:!1,isConnected:!1,error:null,isPasswordVisible:!1,isPasswordTouched:!1,validationError:null},i=document.createElement("div");i.className="wifi-settings__unified-section";const o=document.createElement("div");o.className="wifi-settings__connect-section",e.appendChild(i),e.appendChild(o);const n=()=>{const l=b(),d=r["wifi-network"]?.[l]||"Wi-Fi Network",g=r["wifi-network-desc"]?.[l]||"Enter your Wi-Fi network name and password",f=r["network-name-placeholder"]?.[l]||"Enter network name...",m=r["password-placeholder"]?.[l]||"Enter password...",h=r["show-password"]?.[l]||"Show password",w=r["hide-password"]?.[l]||"Hide password",_=t.isPasswordVisible?"text":"password",v=t.isPasswordVisible?Ue:$e,T=t.isPasswordVisible?w:h;let U="wifi-password__input";t.isPasswordTouched&&(t.isPasswordValid&&t.password?U+=" wifi-password__input--success":t.validationError&&(U+=" wifi-password__input--error"));let P="";t.isPasswordTouched&&t.validationError&&(P=`
        <div class="wifi-password__error">
          <span class="wifi-password__error-icon">⚠️</span>
          <span>${t.validationError}</span>
        </div>
      `);const Q=r["network-name"]?.[l]||"Network Name",ee=r.password?.[l]||"Password";i.innerHTML=`
      <div class="settings-section">
        <div class="settings-section__header">
          <h3 class="settings-section__title flex items-center gap-8" data-i18n="wifi-network">
            <img src="${X}" alt="${d}" class="settings-section__icon" width="20" height="20">
            ${d}
          </h3>
          <p class="settings-section__description" data-i18n="wifi-network-desc">
            ${g}
          </p>
        </div>
        <div class="wifi-settings__inputs flex flex-col gap-16">
          <div class="wifi-selector__input-group">
            <label class="wifi-settings__label" for="network-input" data-i18n="network-name">
              ${Q}
            </label>
            <input
              id="network-input"
              type="text"
              class="wifi-selector__input"
              placeholder="${f}"
              data-i18n-placeholder="network-name-placeholder"
              value="${t.selectedNetwork||""}"
              data-network-input
              autocomplete="off"
            />
          </div>
          <div class="wifi-password__input-group">
            <label class="wifi-settings__label" for="password-input" data-i18n="password">
              ${ee}
            </label>
            <div class="wifi-password__input-wrapper">
              <input
                id="password-input"
                type="${_}"
                class="${U}"
                placeholder="${m}"
                data-i18n-placeholder="password-placeholder"
                value="${t.password}"
                data-password-input
                autocomplete="off"
              />
              <button
                class="wifi-password__toggle"
                type="button"
                title="${T}"
                data-toggle-password
              >
                <img src="${v}" alt="${T}" width="20" height="20">
              </button>
            </div>
            ${P}
          </div>
        </div>
      </div>
    `,c()},c=()=>{const l=i.querySelector("[data-network-input]"),d=i.querySelector("[data-password-input]"),g=i.querySelector("[data-toggle-password]");l&&l.addEventListener("input",f=>{const m=f.target.value;t.selectedNetwork=m,t.isManualEntry=!0,t.isConnected=!1,t.error=null,a()}),d&&(d.addEventListener("input",f=>{const m=f.target.value;t.password=m;const h=Me(m);t.isPasswordValid=h.isValid,t.validationError=h.error||null,t.isConnected=!1,t.error=null,a()}),d.addEventListener("blur",()=>{t.isPasswordTouched=!0,n()})),g&&g.addEventListener("click",f=>{f.preventDefault(),t.isPasswordVisible=!t.isPasswordVisible,n()})},a=()=>{const l=b(),d=r.save?.[l]||"Save",g=r.saving?.[l]||"Saving...",f=r.saved?.[l]||"Saved";let m=d,h="wifi-settings__connect-button",w=!t.selectedNetwork||!t.isPasswordValid;t.isConnecting?(m=g,h+=" wifi-settings__connect-button--connecting",w=!0):t.isConnected&&(m=f,h+=" wifi-settings__connect-button--connected",w=!0);let _="";t.isConnected?_=`
        <div class="wifi-settings__status wifi-settings__status--success">
          <span class="wifi-settings__status-icon">✓</span>
          <span>${r["wifi-saved-success"]?.[l]||"WiFi settings saved successfully"}</span>
        </div>
      `:t.error&&(_=`
        <div class="wifi-settings__status wifi-settings__status--error">
          <span class="wifi-settings__status-icon">⚠️</span>
          <span>${t.error}</span>
        </div>
      `),o.innerHTML=`
      <button
        class="${h}"
        ${w?"disabled":""}
        data-connect-button
      >
        <span>${m}</span>
      </button>
      ${_}
      <div class="wifi-settings__info">
        <div class="wifi-settings__info-title">
          <span class="wifi-settings__info-icon">ℹ️</span>
          <span data-i18n="connection-info">${r["connection-info"]?.[l]||"Connection Info"}</span>
        </div>
        <p class="wifi-settings__info-text">
          ${t.selectedNetwork?`${r.network?.[l]||"Network"}: ${t.selectedNetwork}`:r["no-network-selected"]?.[l]||"No network selected"}
          ${t.isManualEntry?` (${r["manual-entry"]?.[l]||"Manual Entry"})`:""}
        </p>
      </div>
    `,p()},u=()=>{const l=b();if(!t.selectedNetwork||!t.password){t.error=r["network-required"]?.[l]||"Network and password are required",a();return}t.isConnecting=!0,t.error=null,a(),setTimeout(()=>{localStorage.setItem("wifiNetwork",t.selectedNetwork||""),console.log("WiFi settings saved to localStorage:",{network:t.selectedNetwork,password:t.password}),t.isConnecting=!1,t.isConnected=!0,a()},500)},p=()=>{const l=o.querySelector("[data-connect-button]");l&&!l.dataset.listenerAttached&&(l.dataset.listenerAttached="true",l.addEventListener("click",()=>{!t.isConnecting&&!t.isConnected&&u()}))};n(),a(),window.addEventListener("languageChanged",()=>{n(),a()})};Ee();

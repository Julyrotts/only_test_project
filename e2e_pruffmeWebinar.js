// e2e сценарий для сайта https://pruffme.com: авториация, создание и редактирование вебинара, выход в эфир
// Сценарий разработан с целью продемонстрировать навыки использования puppeteer:
// поиск элементов по атрибутам,
// переходы по ссылкам,
// нажатия кнопок,
// эмуляция ввода текста с клавиатуры и нажатия отдельных клавиш на клавиатуре,
// сравнение фактического и ожидаемого результата,
// вывод логов в отдельный файл и создание скриншотов.

//node e2e_pruffmeWebinar.js  > e2e_pruffmeWebinar.log   // вывод сообщений консоли в файл
// учетка автора
const loginAuthor = 'qatestasap111@pruffme.com';
const passAuthor = '12345';

const webId = 't' + Math.random(); // генератор случайноно имени ссылки
const rnd_string = function generateRandomString(length) {
    return Math.random().toString(36).substring(2, length + 2);
} // генератор случайной строки

const puppeteer = require('puppeteer');
var fs = require('fs'); // библиотека для формирования файла
let date = new Date().toJSON().slice(0,10); // формат даты для имени файла

const URL_TEST = 'https://pruffme.com/';

async function e2e_pruffmeWebinar() {
    console.log('Запуск браузера');
    const browser = await puppeteer.launch({
		headless: false, 
		slowMo: 100,
		ignoreDefaultArgs: ["--disable-extensions"],       
        args: [
			"--use-fake-ui-for-media-stream"
		]

	});

    console.log('Создание новой вкладки в браузере');
    const page = await browser.newPage();

    console.log('Переход по ссылке');
    await page.goto(URL_TEST, {timeout: 5000, waitUntil: 'domcontentloaded'});
	
	await page.screenshot({path: 'testPruffmeHome.png'});
	
	console.log('Авторизация');
    const loginButton = await page.$('#pruffme_landing_login_button');
	await loginButton.click();
	console.log('Ожидание элемента - форма авторизации');
	await page.waitForSelector('.pruffme_modal_content');
	
	console.log('Шаг 1: ввод логина');
    const mailInput = await page.$('#signin_login_popup');
    await mailInput.type(loginAuthor);
	console.log('Шаг 2: ввод password');
    const passInput = await page.$('#signin_password_popup');
    await passInput.type(passAuthor);
	const submitLoginButton = await page.$('.auth_modal_submit_button');
    await submitLoginButton.click();
	
	await page.waitForTimeout(500);
	console.log('Меню');
    await page.waitForSelector('.cabinet-add-hamburder-menu-button');
	const actionMenu = await page.$('.cabinet-add-hamburder-menu-button');
	await actionMenu.click();
		
	await page.waitForTimeout(50);
	console.log('выбор вебинаров из списка');
    await page.waitForSelector('.menu_webinars');
	const actionMenuWeb = await page.$('.menu_webinars');
	await actionMenuWeb.click();
	
	await page.waitForTimeout(500);
	console.log('Создать вебинар');
    await page.waitForSelector('.cabinet-v2_icon_header_plus');
	const actionWebinar = await page.$('.cabinet-v2_icon_header_plus');
	await actionWebinar.click();
	await page.waitForSelector('.show_button_all');
	const actionNewWebinar = await page.$('.show_button_all');
	await actionNewWebinar.click();

	await page.bringToFront(); // сделать вкладку активной 
	
  const w_url = await page.url();
  console.log(w_url);  // Выведет адрес текущей вкладки
  
  await page.waitForSelector('.cabinet-v2_webinar_link_btn');
  const intoNewWebinar = await page.$('.cabinet-v2_webinar_link_btn');
  const attributeValue_href_intoNewWebinar = await page.$eval(
  '.cabinet-v2_webinar_link_btn',
  (element) => element.getAttribute('href'));
  console.log('ссылка на созданный вебинар', attributeValue_href_intoNewWebinar);  // получение ссылки на лендинг созданного вебинара
   
 await page.goto(attributeValue_href_intoNewWebinar, {waitUntil: 'domcontentloaded'});
    
 const editNewWebinar = await page.$('.header_action_edit_webinar', {waitUntil: 'domcontentloaded'});
 await editNewWebinar.click();  // переход к редактированию
 	
	await page.waitForTimeout(5000);
	
console.log('Вписать название вебинара');	
 await page.waitForSelector('#entity-name');
 const WebinarName = await page.$('#entity-name', { clickCount: 3 });
 console.log(rnd_string);
 await WebinarName.type('test webinar');

	const newWebLinkStart = await page.$eval('#entity-link-constant', element => element.textContent); // неизменная часть ссылки
	
	const newWebLinkEnd = await page.$('#entity-link');
	await page.click('#entity-link', { clickCount: 3 }); // установить курсор в поле ввода новой ссылки
	await page.keyboard.press('Backspace');
	await newWebLinkEnd.type(webId); // впиисать случайное имя вебинара для ссылки
	 	
	//const WebLink = newWebLinkStart + newWebLinkEnd;
	const WebLink = newWebLinkStart + webId;
   	
	console.log('кнопка получить ссылку на вебинар');
	const GetLink = await page.$('.prop_copy_landing_link_btn');
	await page.waitForTimeout(5000);
	await GetLink.click();
	
	// 
	console.log('вставить ссылку на вебинар из буфера в описание для создания переменной для ссылки');
	const newWebAnons = await page.$('.note-editing-area');
	await page.waitForTimeout(5000);
	await newWebAnons.click();
	await page.keyboard.down('Control');
    await page.keyboard.press('V');
	const WebLinkButton = await page.$eval('.note-editing-area', element => element.textContent);
	console.log(WebLinkButton);
	
	console.log('Сохранить');
    const saveNewWeb = await page.$('#entity-save');
    await saveNewWeb.click();
		 
	 await page.waitForTimeout(5000, {waitUntil: 'domcontentloaded'});  // необходимо ожидание, чтобы полностью прописаись все изменения
	// await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });  // обновить страницу, чтобы прогрузилось описание вебинара
	
	 console.log('Переход на главную страницу');
	 await page.goto(URL_TEST);
	 await page.waitForTimeout(5000);
	 console.log('Переход по новой ссылке');
     await page.goto(WebLink);
	 
	console.log('Войти в вебинарную комнату');
    await page.waitForSelector('#webinar_open');
	const landingWebinar = await page.$('#webinar_open');
	await landingWebinar.click();
			
	console.log('Проверка входа в комнату по ссылке');
	await page.waitForTimeout(5000);
   await page.waitForSelector('.videobox-container-header-tab');
    const Videobox = await page.$eval('.videobox-container-header-tab', element => element.textContent);
	
if (Videobox.startsWith('Видео')) {
        console.log('Успех. Обнаружено окно спикера по критерию названия ' + Videobox);
    } else {
          console.log('Ошибка. Не найдено окно спикера по критерию названия Видео');
		  fs.writeFile('errСсылкаНаВебинар'+date+'.txt', "Ошибка. Не найдено окно спикера по критерию названия Видео. Вход в вебинарную комнату не осуществлен", (err) => {
			if(err) throw err;});
    }
    	
	await page.waitForTimeout(5000);
	await page.waitForSelector('.action-video');
	const videoOn = await page.$('.action-video');
	await videoOn.click();	// включить видео и микрофон
	await page.waitForTimeout(5000);
    await page.screenshot({path: 'e2e_pruffmeWebinar.png'});  // скрин для визуалного контроля включеня камеры

const attributeValue_video = await page.$eval(
  'video',
  (element) => element.getAttribute('class'));    // srtc_video_element

if (attributeValue_video.startsWith('srtc_video_element')) {
        console.log('Успех. Видео вклчено ');
    } else {
          console.log('Ошибка. Не включилось Видео');
		  fs.writeFile('errСсылкаНаВебинар'+date+'.txt', "Ошибка. Не включилось Видео.", (err) => {
			if(err) throw err;});
    }

await page.waitForSelector('.action-stop');
	const videoOff = await page.$('.action-stop');
	await videoOff.click();	 // остановить видео
	await page.waitForSelector('.header_exit_box');
	const WebinarExit = await page.$('.header_exit_box');
	await WebinarExit.click();	// выйти из вебинарной комнаты
	   
	await page.waitForTimeout(500);
	console.log('Закрытие браузера');
    await browser.close();
}

e2e_pruffmeWebinar(); 
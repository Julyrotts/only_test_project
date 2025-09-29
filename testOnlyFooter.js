//node testOnlyFooter.js  > testOnlyFooter.log   // вывод сообщений консоли в файл
// Поиск элементов в футере по названию
// 
// 
const puppeteer = require('puppeteer');
var fs = require('fs'); // библиотека для формирования файла
let date = new Date().toJSON().slice(0,10); // формат даты для имени файла

const URL_TEST = 'https://only.digital/';

async function testOnlyFooter() {
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
    await page.goto(URL_TEST);
	await page.waitForTimeout(5000);
	//await page.screenshot({path: 'Only.png'});
	
	console.log('Ожидание элемента - footer');
	await page.waitForSelector('.Footer_root___6Q28');  // class="Footer_root___6Q28"
	const Onlyfooter = await page.$eval('.Footer_root___6Q28', element => element.textContent);
	// console.log(Onlyfooter); // содержимое футера
			
	if (Onlyfooter.includes('Политика конфиденциальности')) {
        console.log('Элемент - footer Политика конфиденциальности найден');
    } else {
          console.log('Ошибка. Не найден элемент: Политика конфиденциальности');
		  fs.writeFile('erronly'+date+'.txt', "Ошибка. На странице не найден footer Политика конфиденциальности", (err) => {
			if(err) throw err;})
    }
			
	if (Onlyfooter.includes('Telegram')) {
        console.log('Элемент - footer Telegram найден');
    } else {
          console.log('Ошибка. Не найден элемент: Telegram');
		  fs.writeFile('erronly'+date+'.txt', "Ошибка. На странице не найден footer  Telegram", (err) => {
			if(err) throw err;})
    }
	
	if (Onlyfooter.includes('+7 (495) 740 99 79')) {
        console.log('Элемент - footer +7 (495) 740 99 79 найден');
    } else {
          console.log('Ошибка. Не найден элемент: +7 (495) 740 99 79');
		  fs.writeFile('erronly'+date+'.txt', "Ошибка. На странице не найден footer  +7 (495) 740 99 79", (err) => {
			if(err) throw err;})
    }
	
	if (Onlyfooter.includes('Начать проект')) {
        console.log('Элемент - footer Начать проект найден');
    } else {
          console.log('Ошибка. Не найден элемент: Начать проект');
		  fs.writeFile('erronly'+date+'.txt', "Ошибка. На странице не найден footer Начать проект", (err) => {
			if(err) throw err;})
    }

	
await page.waitForTimeout(5000);
	//await page.screenshot({path: 'testOnlyFooter.png'}); // скрин, чтобы понять сколько успело загрузться
    console.log('Закрытие браузера');
    await browser.close();
}
testOnlyFooter(); 
"use strict";

let dim_elements = []; //Массив селектора объектов выбора продукта. 
let coin_obgect = 
[
    {
        coin_nominal: 10,
        coin_pic: "img/10rub.png",
        coins_quantity: 0,
        element_falag: false
    },
    {
        coin_nominal: 5,
        coin_pic: "img/5rub.png",
        coins_quantity: 0,
        element_falag: false
    },
    {
        coin_nominal: 2,
        coin_pic: "img/2rub.png",
        coins_quantity: 0,
        element_falag: false
    },
    {
        coin_nominal: 1,
        coin_pic: "img/1rub.png",
        coins_quantity: 0,
        element_falag: false
    }
];

/*
    Находит минимум и проверяем, чтобы было больше 1.
*/
function getMinRecord(dim)
{
    let min = dim[0];
    for (let i = 0; i < dim.length; i++) 
    { 
        if((min.coins_quantity < 1)|| (min.element_falag))
        {
            min = dim[i];
            continue; 
        }else
        {
            if(min.coins_quantity > dim[i].coins_quantity) min = dim[i];
        }
    }
    return min;
}        

/*
    Парсим сумму.
*/
function coinParser(parser_obg, summ)
{
    for(let e of parser_obg)
    {
        //Проверяем на наличие флага. Если флаг установлен, пропускаем.
        if(e.element_falag) continue;
        e.coins_quantity = (summ / e.coin_nominal);
    }

    //Возвращаем минимальную величину.
    let e_max  = getMinRecord(parser_obg);
    
    //Дальше мы ставим на него флаг и округляем сумму до целого.
    e_max.element_falag = true;
    e_max.coins_quantity = Math.floor(e_max.coins_quantity);
    let tmp_sum = summ - (e_max.coins_quantity * e_max.coin_nominal);

    if( tmp_sum <= 0) return;
    coinParser(parser_obg, tmp_sum);
}

/*
    Эмитируем выдачу сдачи в диспесер выдачи.
*/
function imitatingDeliveryChange(m_summ = 99, m_dim = coin_obgect)
{
    coinParser(m_dim, m_summ);
    let el_coin_dispencer = document.querySelector("div .coffee-change");
    const containerCoords = el_coin_dispencer.getBoundingClientRect();

    for(let i = 0; i < m_dim.length; i++)
    {
        if(m_dim[i].element_falag)
        {
            for(let j = 0; j < m_dim[i].coins_quantity; j++) 
            {
                //console.log(m_dim[i].coin_pic);
                let coin_img = document.createElement("img");
                coin_img.className = 'coin-class';
                coin_img.setAttribute('src', `${m_dim[i].coin_pic}`);
                
                coin_img.style.top = Math.floor(Math.random() * (containerCoords.height - 52)) + "px";
                coin_img.style.left = Math.floor(Math.random() * (containerCoords.width - 52)) + "px";

                el_coin_dispencer.append(coin_img);
            }
        }
    }
}


/*
    Виртуальный процесс приготовления кофе.

    default_msg - Сообщение на дисплее (по)умолчанию. 
    coffe_img - Графический образ продукта.
    cook_switch - Переключатель, true - готовится, false - не готовится (начальное состояние).
    name - Имя приготовляемого виртуального продукта.
    time_cook - Время приготовления виртуального кофе.
*/
function setCoffeCook(default_msg = "", cook_switch = false, coffe_img = "#", name = "", time_interval = 5000)
{
    let time_tic = time_interval/22;
    let i = 0;
    
    let div_progress = document.querySelector('div .progress');  //div прогресс.
    let progress_bar = document.querySelector('div .progress-bar'); //Прогресс.
    let coffee_img = document.querySelector('.coffee-cup img'); //Продукт диспенсер.
    let display = document.querySelector(".display-text"); //Дисплей сообщений.
    display.innerHTML = default_msg;
    if(cook_switch)
    {        
        coffee_img.setAttribute('src', coffe_img); //Присваиваем картинку.
        div_progress.classList.remove("d-none"); //Снимаем блокировки с прогреса.
        coffee_img.classList.remove("d-none");   //Снимаем блокировки с картинки.

        progress_bar.setAttribute("style", 'width: 0%'); //Устанавливаем прогресс в 0
        coffee_img.setAttribute("style", 'opacity: 0%'); //Устанавливаем картинку невидимой.
        //Блокируем выбор нового кофе в меню.
        ElementsEvent(false);
        
        //Устанавливаем интервалы срабатывания time_tic
        let timerId = setInterval(function()
        {
            //Имитируем движение прогресса и процесса готовки кофе.
            i = i + 5;
            progress_bar.setAttribute("style", `width: ${i}%`);
            coffee_img.setAttribute("style", `opacity: ${i}%`);
        }, time_tic);

        setTimeout(function()
        { 
            //Отрабатывет интевал и работает функция!
            clearInterval(timerId);  //Останавливаем интервальный таймаут.
            //Отрабатываем вывод сообщения: Ваш название_кофе готов!
            display.innerHTML = `Ваш "${name}" готов!`;
            //Навешиваем на картинку событие, срабатывающее единожды.
            coffee_img.addEventListener("click", function(event)
            {
                //При нажатии:
                coffee_img.classList.add("d-none");    //Прячем картинку
                div_progress.classList.add("d-none");  //Прячем прогресс.
        
                //console.log("Событие обработано");
                //Снимаем блокировку выбора кофе.
                ElementsEvent();
                display.innerHTML = 'Выберите кофе';
            }, {once: true}); 
        }, time_interval);
    } else
    {
        //Восстанавливаем образ.
        coffee_img.classList.add("d-none");    //Прячем картинку.
        div_progress.classList.add("d-none");  //Прячем прогресс.                
    }
}

/*
    Возвращаем заполненный элемент.
*/
function setAtribut(product_name = "", price = 0, counter = 0, coffe_img = "", e_id)
{
    let element = 
    {
        product_name: product_name, //Название кофе.
        price: price,               //Цена кофе.
        counter: counter,           //Порядковый номер.
        coffee_img: coffe_img,      //Графический образ продукта.
        element_id: e_id            //Объект.
    };
    return(element);
}

/*
    Возвращаем элемент именуемый name.
*/    
function retElement(d_element, name)
{
    for(let i = 0; i < d_element.length; i++)
    {
        if(d_element[i].product_name == name) 
        {
            return(d_element[i]);
        }
    }
}

/*
    Списывает debit_summ из суммы введенной клиентом.
    Если debit_summ > суммы баланса - возвращает false,
    в противном случае - true 
*/   
function retTotalSum(debit_summ)
{
    let element = document.getElementById("cash");
    //Получаем summ по id = "cash"
    let summ = +element.value;
    //Если summ больше debit_summ списываем и отображаем. 
    if (summ >= debit_summ)
    {
        if(element.hasAttribute("style")) element.removeAttribute("style");
        element.value = (summ - debit_summ);
        return(true);        
    } else
    {
        if(!element.hasAttribute("style")) element.setAttribute("style", "background-color: red;");
        return (false);
    }
}

/*
    Функция эмитирует вывод сдачи и списывает сумму из окошечка.
    Возвращает true, если сумма положительная. false - 0<=
*/
function initDeliveryChangeSum()
{
    let element = document.getElementById("cash");
    let cofe_change = document.getElementsByClassName('coffee-change'); //Массив элементов с таким классом.
    
    //Получаем summ по id = "cash"
    let summ = +element.value;
    if(summ > 0)
    {
        imitatingDeliveryChange(summ); //Осуществляем выдачу сдачи.
        element.value = "0"; //Обнуляем введенную сумму.
        //Установим событие.
        cofe_change[0].onclick = function ()
        {
            //Ищем все монеты, которые установили.
            let coin_pics = document.querySelectorAll('div .coin-class');
            //Уничтожим их межленно и печально. 
            for(let e of coin_pics)
            {
                e.remove();
            }
            cofe_change[0].onclick = null;
            //Почистим объект с монетами coin_obgect 
        /*               
            for(let i = 0; i < coin_obgect.length; i++)
            {
                coin_obgect[i].coins_quantity = 0;
                coin_obgect[i].element_falag = false;
            }
        */   
            coin_obgect.cls();
        }        
        return(true);
    }else
    {
        return(false);
    }
}


/*
    Обработчик события onclick селектора выбора продукта. 
*/
function worker()
{
    let tmp_element = retElement(dim_elements, this.getAttribute("alt"));
    //Сравнение сумм и обработка.
    if (retTotalSum(tmp_element.price))
    {
        //Эмитируем процесс готовки.
        setCoffeCook(`Ваш кофе "${tmp_element.product_name}" готовится...`, true, tmp_element.coffee_img, tmp_element.product_name);
        
    } else
    {
        setCoffeCook("На Вашем счете недостаточно средств!");
    }
}

/*
    Обработчик события нажатия кнопки сдачи.
*/
function button_worker()
{
    //В начале потрем все что было в coin_obgect.
/*    
    for(let e of coin_obgect)
    {
        e.coins_quantity = 0;
        e.element_falag = false;
    }
*/ 
    coin_obgect.cls();
    initDeliveryChangeSum();
}

/*
    Устанавливаем или снимаем событие с кнопки выдачи сдачи.
*/
function buttonEvent(setUnsetFlag = true)
{
    let coin_button = document.querySelector("button");

    if(setUnsetFlag)
    {
        coin_button.addEventListener("click", button_worker); 
    } else
    {
        coin_button.removeEventListener("click", button_worker); 
    }
}

/*
    Устанавливаем, если setUnsetFlag = true  событию "click" обработчик worker,
    false - снимаем.
*/
function ElementsEvent(setUnsetFlag = true) 
{
    if(setUnsetFlag)
    {
        for(let i = 0; i < dim_elements.length; i++)
        {
            dim_elements[i].element_id.addEventListener("click", worker); 
        }
    } else
    {
        for(let i = 0; i < dim_elements.length; i++)
        {
            dim_elements[i].element_id.removeEventListener("click", worker); 
        }
    }
}

//Находим все активные элементы.
let get_items = document.querySelectorAll(".coffee-item");

//Заполняем element и записываем в dim_elements.
let i = 0;
for(let e of get_items)
{
    dim_elements.push(setAtribut(e.getAttribute("name"), 
                                +e.getAttribute("cost"),
                                i, e.childNodes[1].getAttribute("src"),
                                e.childNodes[1]));
    
    ElementsEvent();
    i++;
}
//-------------------- Другое видение объектов --------------------------------
//coin_obgect.debugTest();
//coin_obgect.cls();
//Дополняем объект функционалом.
coin_obgect.cls = function()
{
    for(let i = 0; i < this.length; i++)
    {
        this[i].coins_quantity = 0;
        this[i].element_falag = false; 
    }
    console.log(`Количество элементов:  ${this.length}`);
}
/*
    Ищим минимум.
*/
coin_obgect.getMinRecord = function()
{
    let min = this[0];
    for(let e of this) 
    { 
        if((min.coins_quantity < 1)|| (min.element_falag))
        {
            min = this[i];
            continue; 
        }else
        {
            if(min.coins_quantity > this[i].coins_quantity) min = this[i];
        }
    }
    return min;
}

coin_obgect.debugTest = function () 
{
    let i = 0;
    for(let e of this)
    {
        console.log('Элемент №' + i);
        i++; 
    }    
}

coin_obgect.coinParser = function (summ)
{
    for(let e of this)
    {
        //Проверяем на наличие флага. Если флаг установлен, пропускаем.
        if(e.element_falag) continue;
        e.coins_quantity = (summ / e.coin_nominal);
    }

    //Возвращаем минимальную величину.
    let e_max  = this.getMinRecord();
    
    //Дальше мы ставим на него флаг и округляем сумму до целого.
    e_max.element_falag = true;
    e_max.coins_quantity = Math.floor(e_max.coins_quantity);
    let tmp_sum = summ - (e_max.coins_quantity * e_max.coin_nominal);

    if( tmp_sum <= 0) return;
    this.coinParser(tmp_sum);
    //this.
}
//coin_obgect.cls();
coin_obgect.debugTest();
buttonEvent();

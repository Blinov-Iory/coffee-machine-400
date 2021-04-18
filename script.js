"use strict";

let dim_elements = []; //Массив селектора объектов выбора продукта. 

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
        
                console.log("Событие обработано");
                //Снимаем блокировку выбора кофе.
                ElementsEvent();
                display.innerHTML = 'Выберите кофе';
            }, {once: true}); 
        }, time_interval);
    } else
    {
        //Восстанавливаем образ.
        coffee_img.classList.add("d-none");    //Прячем картинку
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
        coffee_img: coffe_img,       //Графический образ продукта.
        element_id: e_id
    };
    return(element);
}

/*Возвращаем элемент именуемый name.*/    
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

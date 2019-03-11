    //json mocado
    let ditoJson = {"events":[{"event":"comprou-produto","timestamp":"2016-09-22T13:57:32.2311892-03:00","custom_data":[{"key":"product_name","value":"Camisa Azul"},{"key":"transaction_id","value":"3029384"},{"key":"product_price","value":100}]},{"event":"comprou","timestamp":"2016-09-22T13:57:31.2311892-03:00","revenue":250,"custom_data":[{"key":"store_name","value":"Patio Savassi"},{"key":"transaction_id","value":"3029384"}]},{"event":"comprou-produto","timestamp":"2016-09-22T13:57:33.2311892-03:00","custom_data":[{"key":"product_price","value":150},{"key":"transaction_id","value":"3029384"},{"key":"product_name","value":"Calça Rosa"}]},{"event":"comprou-produto","timestamp":"2016-10-02T11:37:35.2300892-03:00","custom_data":[{"key":"transaction_id","value":"3409340"},{"key":"product_name","value":"Tenis Preto"},{"key":"product_price","value":120}]},{"event":"comprou","timestamp":"2016-10-02T11:37:31.2300892-03:00","revenue":120,"custom_data":[{"key":"transaction_id","value":"3409340"},{"key":"store_name","value":"BH Shopping"}]}]};

    //Banco dos produtos cadastrados
    let productDB = [
        {
            id: 0,
            product: "Óculos",
            price: 400.00 
        },
        {
            id: 1,
            product: "Camisa",
            price: 100.00
        },
        {
            id: 2,
            product: "Calça",
            price: 120.00
        },
        {
            id: 3,
            product: "Meias",
            price: 30.00
        },
        {
            id: 4,
            product: "Tênis",
            price: 180.00
        }

    ];

    //Banco dos eventos cadastrados    
    let dataEventBase = [];
    
    //Cria evento e registra no banco
    function newEvent(id, str) {
        productDB.forEach((element) => {
            if(element.id == id) {
                dataEventBase.push({
                    event: str,
                    timestamp: new Date().toISOString(),
                    product: element.product,
                    price: element.price
                });
            }
        });
    }

    //Renderiza eventos registrados no banco
    function renderDataEventBase(){
        let html = "<br/>";

        dataEventBase.forEach((element) => {
            html += "<p>";
            let keys = Object.keys(element);

            keys.forEach((value) => {
                html += "<strong>" + value + "</strong>: " + element[value] + "<br/>";
            })

            html += "</p>";
            
        })
        
        document.getElementById('eventsDiv').innerHTML = html;
    }

    //Verifica mudanças no input, busca eventos no banco e os renderiza
    document.addEventListener('DOMContentLoaded', function(){
        const searchElement = document.getElementById('search');
        let inputData = "";
        let html = "<br/>";

        searchElement.addEventListener('input', ({data}) => {
            inputData = data ? inputData += data : inputData.slice(0, -1);
            
            if(inputData.length >= 2) {
                var flag = false;
                dataEventBase.forEach((element) => {
                    if(inputData == element.event.slice(0, inputData.length)){
                        flag = true;
                        if(!html.includes(element.timestamp)){ //renderiza apenas se o elemento ainda não tiver sido renderizado
                            html += "<p>";

                            let keys = Object.keys(element);
                            keys.forEach((value) => {
                                html += "<strong>" + value + "</strong>: " + element[value] + "<br/>";
                            });

                            html += "</p>";

                            document.getElementById('resultsDiv').innerHTML = html;
                        }
                    }

                })
            }
            
            //apaga os resultados 
            if(inputData.length === 0 || !flag) {
                html = "<br/>";
                document.getElementById('resultsDiv').innerHTML = html;
            }
        });
    });

    //cria objetos em formato específico pra timeline, um por transaction_id diferente
    function groupTimelineById() {
        let timeline = [];
        let flag = false;
        
        ditoJson.events.forEach((element) => {
            if(timeline.length === 0){
                element.custom_data.forEach((key) => {
                    if(key.key == 'transaction_id') {
                        timeline.push({
                            timestamp: element.timestamp,
                            revenue: 0,
                            transaction_id: key.value,
                            store_name: '',
                            products: [],
                        });
                    }
                });
            }

            else {
                element.custom_data.forEach((key) => {
                    flag = false;

                    //verifica se já existe um objeto na timeline com o mesmo transaction_id
                    for(let i = 0; i < timeline.length; i++) {
                        if(key.key == 'transaction_id' && key.value === timeline[i].transaction_id) {
                            flag = true;
                            break;
                        }
                    }

                    if(key.key == 'transaction_id' && !flag) {
                        timeline.push({
                            timestamp: element.timestamp,
                            revenue: 0,
                            transaction_id: key.value,
                            store_name: '',
                            products: [],
                        });
                    }

                });
            }    
        });

        return timeline;
    }

    //preenche objetos da timeline
    function fillTimeline(){
         let timeline = groupTimelineById();
         
         ditoJson.events.forEach((element) => {
            let transId;
            
            element.custom_data.forEach((key) => {
                if(key.key === 'transaction_id') {
                    transId = key.value;
                }
            });

            timeline.forEach((timelineElement) => {
                if(timelineElement.transaction_id === transId) {
                    if(element.event === 'comprou') {
                        timelineElement.revenue = element.revenue;
                        
                        element.custom_data.forEach((key) => {
                            if(key.key === 'store_name') {
                                timelineElement.store_name = key.value;
                            }
                        });
                    }
                
                    if(element.event === 'comprou-produto') {
                        let obj = { name: '', price: '' };

                        element.custom_data.forEach((key) => {
                            if(key.key === 'product_name') obj.name = key.value;
                            if(key.key === 'product_price') obj.price = key.value;
                        });

                        timelineElement.products.push(obj);
                    }
                }
            });
        });

        sortTimeline(timeline);

        return timeline;
    }

    //ordena timeline em ordem decrescente
    function sortTimeline(timeline){
        timeline.sort((a, b) => (a.timestamp.localeCompare(b.timestamp)) * -1);
    }

    //renderiza timeline
    function renderTimeline(){
        let timeline = fillTimeline();
        let html = "<br/>";

        timeline.forEach((element) => {
            html += "<p>";

            let keys = Object.keys(element);
            keys.forEach((value) => {
                if(value === 'products'){
                    html += "<strong>" + value + "</strong>: <br/>";
                    
                    element.products.forEach((prod) => {
                        let prodKeys = Object.keys(prod);
                        prodKeys.forEach((prodValue) => {
                            if(prodValue === 'name'){
                                html += "&nbsp;&nbsp;<strong>" + prodValue + "</strong>: " + prod.name + "<br/>";
                            }

                            if(prodValue === 'price'){
                                html += "&nbsp;&nbsp;<strong>" + prodValue + "</strong>: " + prod.price + "<br/>";
                            }
                        });
                    });
                }
                else{
                    html += "<strong>" + value + "</strong>: " + element[value] + "<br/>";
                }
            });
        });

        document.getElementById('timelineDiv').innerHTML = html;
    }
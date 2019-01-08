'use strict';
function eventIndexById(indexId){
  var resultat=0;
  for(var i=0;i<events.length;i++){
    if(events[i].id===indexId){
      resultat=i;
    }
  }
  return resultat;
}

function calculPrice(unBarId,unTime,unPersons){
  var prix = 0;
  bar = bars.find(bar => bar.id=unBarId);
  prix = (bar.pricePerHour*unTime)+(bar.pricePerPerson*unPersons);
  /*for( var i=0;i<bars.length;i++){
    if(bars[i].id===unBarId){
      prix+=(bars[i].pricePerHour*unTime)+(bars[i].pricePerPerson*unPersons)
    }
  }*/

  return prix;
}
function discountPrice(unPersons){
  var discount =1;
  if(unPersons>=60){
    discount=0.5;
  }
  else{
    if(unPersons>=20){
      discount=0.7;
    }
    else{
      if(unPersons>=10){
        discount=0.9;
      }
    }
  }
  return discount;
}
function calculCommission(indexEvent){
  events[indexEvent].commission.insurance=0.15 *  events[indexEvent].price;
  events[indexEvent].commission.treasury=events[indexEvent].persons;
  events[indexEvent].commission.privateaser=(0.30*events[indexEvent].price)-(events[indexEvent].commission.treasury+  events[indexEvent].commission.insurance)
}
//lis
function updatePrices(){
  for(var i=0;i<events.length;i++){
    events[i].price=calculPrice(events[i].barId,events[i].time,events[i].persons);
    events[i].price=events[i].price*discountPrice(events[i].persons);
  }
}
function updateCommission(){
  for(var i=0;i<events.length;i++){
    calculCommission(i);
  }
}
function updateDeductible(){
  for(var i=0;i<events.length;i++){
    if(events[i].options.deductibleReduction==true){
      events[i].price=  events[i].price+events[i].persons;
      events[i].commission.privateaser=events[i].commission.privateaser+events[i].persons;
    }
  }
}
function updateActors(){

  var eventIndex=0;
  for(var i=0;i<actors.length;i++){

    eventIndex=eventIndexById(actors[i].eventId);
    for(var j=0;j<actors[i].payment.length;j++){

      switch (actors[i].payment[j].who) {
        case 'booker':

        actors[i].payment[j].amount=events[eventIndex].price;
          break;
        case 'bar':

        actors[i].payment[j].amount=events[eventIndex].price-(events[eventIndex].commission.insurance+events[eventIndex].commission.treasury+events[eventIndex].commission.privateaser);
          break;
        case 'insurance':

        actors[i].payment[j].amount=events[eventIndex].commission.insurance;
          break;
        case 'treasury':
        actors[i].payment[j].amount=events[eventIndex].commission.treasury;
          break;
        case 'privateaser':
        actors[i].payment[j].amount=events[eventIndex].commission.privateaser;
          break;
        default:
         alert("no amount found");
        break;
      }
    }
  }
}
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];
//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'time': 5,
  'persons': 80,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}];
function update(){
  updatePrices();
  updateCommission();
  updateDeductible();
  updateActors();
}
update();
console.log(bars);
console.log(events);
console.log(actors);
